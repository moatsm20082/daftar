/* ===== attachments: invoices, receipts, photos and files on any money record =====
   Files live in a PRIVATE Supabase Storage bucket ("files"), under the company's own folder:
   files/<company id>/<yyyy-mm>/<random id>.<ext>. The database only lets a company read and
   write inside its own folder (see storage policies in schema.sql), and every view uses a
   short-lived signed link — nothing is ever public. Photos are shrunk on the phone first. */
const BUCKET = "files";
const FILE_MAX = 6, IMG_MAX_IN = 25*1024*1024, IMG_MAX_OUT = 4*1024*1024, DOC_MAX = 10*1024*1024;
const DOC_TYPES = {"application/pdf":"pdf","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xlsx","application/vnd.ms-excel":"xls",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":"docx","application/msword":"doc","text/csv":"csv"};
const IMG_TYPES = ["image/jpeg","image/png","image/webp","image/heic","image/heif"];
const extOf = n => (String(n||"").toLowerCase().match(/\.([a-z0-9]{2,5})$/)||[])[1] || "";
const EXT_TYPE = {pdf:"application/pdf",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",xls:"application/vnd.ms-excel",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",doc:"application/msword",csv:"text/csv",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp",heic:"image/heic",heif:"image/heif"};
const cleanName = n => String(n||"file").replace(/[\u0000-\u001f<>:"/\\|?*]+/g,"").replace(/\s+/g," ").trim().slice(0,80) || "file";
const kb = n => n>=1048576 ? `${(n/1048576).toFixed(1)} MB` : `${Math.max(1,Math.round(n/1024))} KB`;

/* read the first bytes: the real type of a file, whatever its name says */
async function sniff(file){
  const b = new Uint8Array(await file.slice(0,12).arrayBuffer());
  const hex = [...b].map(x=>x.toString(16).padStart(2,"0")).join("");
  if(hex.startsWith("ffd8ff")) return "image/jpeg";
  if(hex.startsWith("89504e47")) return "image/png";
  if(hex.startsWith("52494646") && hex.slice(16,24)==="57454250") return "image/webp";
  if(hex.slice(8,16)==="66747970") return "image/heic";                       // ....ftyp (HEIC/HEIF from iPhones)
  if(hex.startsWith("25504446")) return "application/pdf";                    // %PDF
  if(hex.startsWith("504b0304")) return null;                                 // zip → trust the extension (xlsx/docx)
  if(hex.startsWith("d0cf11e0")) return null;                                 // old office → trust the extension
  return "unknown";
}
async function shrinkImage(file){
  let bmp; try{ bmp = await createImageBitmap(file); }catch(e){
    try{ bmp = await new Promise((res,rej)=>{ const i = new Image(); const u = URL.createObjectURL(file); i.onload = ()=>{ URL.revokeObjectURL(u); res(i); }; i.onerror = e=>{ URL.revokeObjectURL(u); rej(e); }; i.src = u; }); }
    catch(_){ return null; } }
  const W = bmp.width, H = bmp.height, k = Math.min(1, 1800/Math.max(W,H));
  const c = document.createElement("canvas"); c.width = Math.round(W*k); c.height = Math.round(H*k);
  const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0,0,c.width,c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
  for(const q of [0.82, 0.7, 0.55]){ const blob = await new Promise(r=>c.toBlob(r, "image/jpeg", q)); if(blob && blob.size<=IMG_MAX_OUT) return blob; }
  return null;
}
async function signedUrl(path){
  if(window.DEMO_FILES) return window.DEMO_FILES.url(path);
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(path, 600);
  return error ? null : data.signedUrl;
}

const FILES = {
  keep: [], add: [], drop: [], thumbs: {}, busy: false,
  begin(existing){ this.keep = Array.isArray(existing) ? existing.filter(f=>f && typeof f.path==="string").slice(0,FILE_MAX) : []; this.add.forEach(a=>a.url && URL.revokeObjectURL(a.url)); this.add = []; this.drop = []; },
  field(){ return `<div class="field att"><span class="flabel">${icon("clip")}${t("attTitle")}</span><div class="att-list" id="attList">${this.listHtml()}</div>
    <div class="att-btns"><label class="btn sm">${icon("camera")}${t("attCamera")}<input type="file" id="attCam" accept="image/*" capture="environment" hidden></label>
    <label class="btn sm">${icon("file")}${t("attFile")}<input type="file" id="attPick" accept="image/*,.pdf,.xlsx,.xls,.docx,.doc,.csv" multiple hidden></label></div>
    <span class="hint">${t("attHint")}</span></div>`; },
  listHtml(){
    const one = (f,i,isNew) => { const img = /^image\//.test(f.type), th = isNew ? f.url : this.thumbs[f.path];
      return `<div class="att-i">${img ? `<button type="button" class="att-th" data-act="${isNew?"attNewView":"attView"}" data-id="${i}" aria-label="${esc(f.name)}">${th?`<img src="${esc(th)}" alt="">`:icon("camera")}</button>`
        : `<button type="button" class="att-th doc" data-act="${isNew?"":"attView"}" data-id="${i}">${icon("file")}<span>${esc(extOf(f.name).toUpperCase()||"FILE")}</span></button>`}
        <span class="att-n">${esc(f.name)}</span><button type="button" class="att-x" data-act="${isNew?"attDropNew":"attDrop"}" data-id="${i}" aria-label="${t("del")}">${icon("x")}</button></div>`; };
    return [...this.keep.map((f,i)=>one(f,i,false)), ...this.add.map((f,i)=>one(f,i,true))].join("");
  },
  refresh(){ const el = document.getElementById("attList"); if(el) el.innerHTML = this.listHtml(); this.loadThumbs(); },
  async loadThumbs(){
    const need = this.keep.filter(f=>/^image\//.test(f.type) && !this.thumbs[f.path]); if(!need.length || !sb) return;
    for(const f of need){ const u = await signedUrl(f.path); if(u) this.thumbs[f.path] = u; }
    const el = document.getElementById("attList"); if(el) el.innerHTML = this.listHtml();
  },
  async pick(list){
    for(const file of [...list]){
      if(this.keep.length + this.add.length >= FILE_MAX){ toast(t("attMax",{n:FILE_MAX})); break; }
      const real = await sniff(file), ext = extOf(file.name), claimed = file.type || EXT_TYPE[ext] || "";
      let type = real && real!=="unknown" ? real : (real===null ? (EXT_TYPE[ext] && DOC_TYPES[EXT_TYPE[ext]] ? EXT_TYPE[ext] : "") : (ext==="csv" ? "text/csv" : ""));
      if(!type || (!IMG_TYPES.includes(type) && !DOC_TYPES[type])){ toast(t("attType")); continue; }
      if(IMG_TYPES.includes(type)){
        if(file.size>IMG_MAX_IN){ toast(t("attBig")); continue; }
        const blob = await shrinkImage(file); if(!blob){ toast(t("attImgFail")); continue; }
        this.add.push({blob, type:"image/jpeg", name:cleanName(file.name.replace(/\.[^.]+$/,"")+".jpg"), size:blob.size, url:URL.createObjectURL(blob)});
      } else {
        if(file.size>DOC_MAX){ toast(t("attBig")); continue; }
        this.add.push({blob:file, type, name:cleanName(file.name), size:file.size});
      }
    }
    this.refresh();
  },
  /* upload what's new; returns the final list for the record, or null if an upload failed */
  async commit(){
    if(this.busy) return null; this.busy = true;
    try{
      const out = this.keep.slice(), month = today().slice(0,7);
      for(const a of this.add){
        const id = newId(), ext = a.type==="image/jpeg" ? "jpg" : (DOC_TYPES[a.type]||"bin"), path = `${CID}/${month}/${id}.${ext}`;
        let error = null;
        if(window.DEMO_FILES) ({ error } = await window.DEMO_FILES.put(path, a.blob, a.type));
        else ({ error } = await sb.storage.from(BUCKET).upload(path, a.blob, {contentType:a.type, upsert:false, cacheControl:"3600"}));
        if(error){ toast(/exceed|size|quota|limit/i.test(error.message||"") ? t("attQuota") : t("attUpFail")); return null; }
        out.push({id, path, name:a.name, type:a.type, size:a.size, at:Date.now()});
      }
      return out;
    } finally { this.busy = false; }
  },
  /* after the record is saved: remove files the user took off it */
  done(){ if(this.drop.length) this.purge(this.drop); this.add.forEach(a=>a.url && URL.revokeObjectURL(a.url)); this.add = []; this.drop = []; },
  async purge(list){
    const paths = (list||[]).map(f=>f && f.path).filter(p=>typeof p==="string" && p.startsWith(CID+"/")); if(!paths.length) return;
    if(window.DEMO_FILES) return window.DEMO_FILES.remove(paths);
    try{ await sb.storage.from(BUCKET).remove(paths); }catch(e){}
  },
  async view(f){
    if(!f) return; const url = /^blob:/.test(f.url||"") ? f.url : await signedUrl(f.path);
    if(!url){ toast(t("attOpenFail")); return; }
    if(/^image\//.test(f.type)) return lightbox(url, f.name);
    const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove();
  }
};
function lightbox(url, name){
  let lb = document.getElementById("lightbox");
  if(!lb){ lb = document.createElement("div"); lb.id = "lightbox"; lb.className = "lightbox"; document.body.appendChild(lb); }
  lb.innerHTML = `<button class="lb-x" data-act="lbClose" aria-label="${t("close")}">${icon("x")}</button><img alt="${esc(name||"")}"><a class="btn sm lb-open" target="_blank" rel="noopener noreferrer">${t("attOpen")}</a>`;
  lb.querySelector("img").src = url; lb.querySelector("a").href = url; lb.hidden = false;
}
document.addEventListener("change", e=>{ if(e.target.id==="attCam" || e.target.id==="attPick"){ const f = e.target.files; if(f && f.length) FILES.pick(f).then(()=>{ e.target.value = ""; }); } });
/* every file the company has, for "delete my account" */
async function purgeAllFiles(){
  const all = [...S.expenses, ...S.income, ...S.payments].flatMap(x=>Array.isArray(x.files)?x.files:[]);
  for(let i=0;i<all.length;i+=100) await FILES.purge(all.slice(i,i+100));
}
