/* ===== sheet ===== */
let onSubmit = null, onDelete = null;
function field(f){
  const id = "f_"+f.name, v = f.value ?? "";
  if(f.type==="chips"||f.type==="multichips"){
    const multi = f.type==="multichips", vs = multi ? (Array.isArray(v)?v.map(String):[]) : [String(v)];
    return `<div class="field" role="${multi?"group":"radiogroup"}" aria-label="${esc(f.label)}"><span class="flabel">${esc(f.label)}</span><div class="chips ${f.cls||""}">${f.options.map(([val,lab])=>`<label><input type="${multi?"checkbox":"radio"}" name="${f.name}" value="${esc(val)}" ${vs.includes(String(val))?"checked":""}><span>${lab}</span></label>`).join("")}</div>${f.hint?`<span class="hint">${f.hint}</span>`:""}</div>`;
  }
  let input;
  if(f.type==="select") input = `<select id="${id}" name="${f.name}">${f.options.map(([val,lab])=>`<option value="${esc(val)}" ${String(val)===String(v)?"selected":""}>${esc(lab)}</option>`).join("")}</select>`;
  else if(f.type==="money") input = `<input id="${id}" name="${f.name}" inputmode="decimal" autocomplete="off" value="${esc(v)}" placeholder="0">`;
  else input = `<input id="${id}" name="${f.name}" type="${f.type||"text"}" value="${esc(v)}" ${f.ph?`placeholder="${esc(f.ph)}"`:""} ${f.max?`maxlength="${f.max}"`:""} ${f.min!=null?`min="${f.min}"`:""} ${f.maxv!=null?`max="${f.maxv}"`:""}>`;
  return `<div class="field ${f.big?"bigamt":""}"><label for="${id}">${esc(f.label)}</label>${input}${f.hint!=null?`<span class="hint" id="${id}_hint">${f.hint}</span>`:""}</div>`;
}
function openSheet({title, fields=[], more=[], html="", submit, del, saveLabel, noSave}){
  document.getElementById("sheetTitle").textContent = title;
  document.getElementById("sheetBody").innerHTML = fields.map(field).join("") + html + (more.length?`<details><summary>${t("more")}</summary><div class="morebox">${more.map(field).join("")}</div></details>`:"");
  const sv = document.getElementById("sheetSave"); sv.textContent = saveLabel || t("save"); sv.hidden = !!noSave;
  document.getElementById("sheetExtra").innerHTML = del ? `<button type="button" class="btn danger" data-act="sheetDel">${esc(del.label||t("del"))}</button>` : "";
  onSubmit = submit; onDelete = del || null;
  document.getElementById("sheet").hidden = false;
  if(document.getElementById("attList")) FILES.loadThumbs();
  setTimeout(()=>{ const b = document.querySelector("#sheetBody .bigamt input"); if(b && !b.value) b.focus(); }, 80);
}
function closeSheet(){ document.getElementById("sheet").hidden = true; onSubmit = onDelete = null; }
function vals(){ const o = {}; document.querySelectorAll("#sheetBody [name]").forEach(el=>{
  if(el.type==="checkbox"){ o[el.name] = o[el.name] || []; if(el.checked) o[el.name].push(el.value); return; }
  if(el.type==="radio" && !el.checked) return; o[el.name] = el.value.trim(); }); return o; }
document.getElementById("sheetForm").addEventListener("submit", async e=>{
  e.preventDefault(); if(!onSubmit) return;
  const b = document.getElementById("sheetSave"); b.disabled = true;
  try{ const ok = await onSubmit(vals()); if(ok!==false) closeSheet(); } finally { b.disabled = false; }
});
const unitOptions = (cur) => S.units.filter(u=>u.status!=="closed"||u.id===cur).map(u=>[u.id,u.name]);

/* ===== forms ===== */
function unitForm(u, draft){
  S.unitFormId = u ? u.id : null;
  const d = draft || {}, kind = P[d.kind] ? d.kind : unitKind(u), p = P[kind], val = k => d[k]!==undefined ? d[k] : u?.[k];
  const more = [];
  if(p.client) more.push({name:"clientPhone",label:t("phoneOpt"),type:"tel",value:val("clientPhone"),max:30});
  more.push({name:"location",label:t("where"),value:val("location"),max:80});
  const fields = [{name:"name",label:tv("unitName"),value:val("name"),max:80},
    {name:"ukind",label:t("unitKind"),type:"chips",cls:"types",options:typeOptions(),value:kind,hint:t("unitKindHint")}];
  if(p.client) fields.push({name:"client",label:p.client[LI()],value:val("client"),max:80});
  if(p.budget) fields.push({name:"budget",label:p.budget[LI()],type:"money",value:val("budget")||""});
  if(p.recur){ fields.push({name:"recurAmount",label:`${p.recur.label[LI()]} · ${t("recurAmount")}`,type:"money",value:val("recurAmount")||""});
    fields.push({name:"recurDay",label:t("recurDay"),type:"number",value:val("recurDay")||1,min:1,maxv:28}); }
  if(p.driver) (p.platforms||[]).forEach(pl=>more.push({name:"comm_"+pl[0],label:t("commFor",{x:cat(pl)}),type:"money",value:(d.comm||u?.comm||{})[pl[0]]||"",hint:pl===p.platforms[0]?t("commHint"):null}));
  const cats = u ? `<button type="button" class="btn sm" data-act="unitCats" data-id="exp">${icon("tag")}${t("manageCats")}</button>` : "";
  openSheet({title: u ? t("edit")+" · "+u.name : tv("newUnit").replace(/^\+\s*/,""), saveLabel: u?t("save"):t("openFolderBtn"), fields, more, html:cats,
    del: u ? {label:tv("delUnit"), run:async()=>{ const ok = await remove("units",u.id); if(ok){ S.view="units"; render(); } return ok; }} : null,
    submit: async v=>{
      if(!v.name){ toast(t("eUnitName")); return false; }
      const k = P[v.ukind] ? v.ukind : ST().type, comm = {};
      (P[k].platforms||[]).forEach(pl=>{ const x = num(v["comm_"+pl[0]]); if(x>0) comm[pl[0]] = Math.min(60, x); });
      const keepCats = u && unitKind(u)===k;   // a new kind of work starts from that kind's own categories
      const data = {...(u?strip(u):{status:"active",createdAt:Date.now(),startDate:today()}), name:v.name.slice(0,80), kind:k, location:(v.location||"").slice(0,80),
        client:(v.client||"").slice(0,80), clientPhone:(v.clientPhone||"").slice(0,30), budget:num(v.budget), recurAmount:num(v.recurAmount), recurDay:Math.min(28,Math.max(1,parseInt(v.recurDay)||1)), comm};
      if(!keepCats){ delete data.expCats; delete data.incCats; }
      if(u) return save("units",u.id,data);
      const id = await createDoc("units",data); if(!id) return false;
      S.uid = id; S.view = "unit"; S.tab = "today"; render(); toast(tv("folderOpened")); return true;
    }});
}
/* the folder's own list of expense / income categories: rename by removing and adding, reorder by re-adding */
function unitCatsSheet(u, kind){
  if(!u) return;
  const list = unitCats(u, kind).map(p=>p[0]);
  const rows = list.map((k,i)=>`<div class="catrow"><span>${esc(catLabel(k))}</span><button type="button" class="iconbtn sm" data-act="catDel" data-id="${i}" aria-label="${t("del")}">${icon("x")}</button></div>`).join("");
  openSheet({title:t("catsOf",{x:u.name}), saveLabel:t("addCat"),
    html:`<div class="seg two-seg" role="group"><button type="button" data-act="unitCats" data-id="exp" aria-pressed="${kind==="exp"}">${t("expenses")}</button><button type="button" data-act="unitCats" data-id="inc" aria-pressed="${kind==="inc"}">${t("income")}</button></div>
      <div class="catlist">${rows}</div><span class="hint">${t("catsHint")}</span>
      <button type="button" class="linkbtn" data-act="catReset" data-id="${kind}">${t("catReset")}</button>`,
    fields:[{name:"newcat",label:t("newCat"),value:"",max:40,ph:kind==="exp"?t("newCatPhExp"):t("newCatPhInc")}],
    submit: async v=>{
      const k = catKey(v.newcat); if(!k){ toast(t("eCatName")); return false; }
      const cur = unitCats(u, kind).map(p=>p[0]); if(cur.some(x=>catLabel(x)===k || x===k)){ toast(t("eCatDup")); return false; }
      const other = cur.filter(x=>x!=="أخرى"), next = [...other, k, ...(cur.includes("أخرى")?["أخرى"]:[])].slice(0,40);
      if(await save("units", u.id, {...strip(u), [kind==="exp"?"expCats":"incCats"]: next}, true)){ toast(t("catAdded",{x:k})); unitCatsSheet(unitById(u.id), kind); }
      return false;
    }});
  S.catKind = kind;
}
function rateHint(){
  const el = document.getElementById("f_rate_hint"); if(!el) return;
  const tp = (document.querySelector('#sheetBody [name="rateType"]:checked')||{}).value, r = num((document.getElementById("f_rate")||{}).value);
  el.innerHTML = !r ? t("typeAmount") : tp==="day" ? t("rateHintDay",{x:moneyTxt(r)}) : tp==="month" ? t("rateHintMonth",{x:moneyTxt(r/workDaysMonth(today()))}) : t("rateHintWeek",{x:moneyTxt(r/workDaysWeek()),d:workDaysWeek()});
}
function staffForm(s){
  const others = !s ? S.staff.filter(x=>x.active!==false && x.unitId!==S.uid) : [];
  const defType = ST().payPeriod || PRE().pay;
  openSheet({title: s ? t("edit")+" · "+s.name : tv("addStaff").replace(/^\+\s*/,""), saveLabel: s?t("save"):t("addStaffBtn"),
    fields:[{name:"name",label:t("staffName"),value:s?.name,max:80},
      {name:"rateType",label:t("payType"),type:"chips",options:[["day",t("daily")],["week",t("weekly")],["month",t("monthly")]],value:s?.rateType||defType},
      {name:"rate",label:t("howMuch")+" ("+curName()+")",type:"money",big:true,value:s?.rate||"",hint:""}],
    html: others.length ? `<div class="field"><span class="flabel">${t("moveHere")}</span><div class="chips">${others.map(x=>`<button type="button" class="btn sm" data-act="moveHere" data-id="${esc(x.id)}">${esc(x.name)}</button>`).join("")}</div></div>` : "",
    more:[{name:"role",label:t("role"),value:s?.role,max:60},{name:"phone",label:t("staffPhone"),type:"tel",value:s?.phone,max:30},{name:"otRate",label:t("otRate"),type:"money",value:s?.otRate||"",hint:t("otHint",{h:fmt(shiftHours())})},
      ...(s?[{name:"unitId",label:t("worksAt"),type:"select",options:unitOptions(s.unitId),value:s.unitId}]:[])],
    del: s ? {label:t("removeStaff"), run:()=>save("staff",s.id,{...strip(s),active:false})} : null,
    submit: async v=>{
      if(!v.name){ toast(t("eStaffName")); return false; }
      if(num(v.rate)<=0){ toast(t("eRate")); return false; }
      const data = {...(s?strip(s):{createdAt:Date.now(),active:true,startDate:today()}), name:v.name.slice(0,80), role:(v.role||"").slice(0,60), phone:(v.phone||"").slice(0,30), rateType:v.rateType||defType, rate:num(v.rate), otRate:num(v.otRate), unitId:v.unitId || s?.unitId || S.uid};
      const ok = await save("staff", s?.id, data); if(ok && !s) toast(t("added",{x:v.name})); return ok;
    }});
  rateHint();
}
let timesStaff = null;
function timesForm(sid){
  const s = staffById(sid), a = attOf(sid,S.date); if(!s) return; timesStaff = sid;
  const si = ST().shiftIn, so = ST().shiftOut, tin = a?.in || si, tout = a?.out || so;
  const plus = (x,h) => { const m = ((mins(x)+h*60)%1440+1440)%1440; return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0"); };
  const lab = x => t12(x).replace(/<[^>]+>/g,"");
  const ins = [[si,lab(si)+" · "+t("onTime")],[plus(si,0.5),lab(plus(si,0.5))],[plus(si,1),lab(plus(si,1))],[plus(si,2),lab(plus(si,2))],[plus(si,3),lab(plus(si,3))],[plus(si,4),lab(plus(si,4))]];
  const outs = [[so,lab(so)+" · "+t("onTime")],[plus(so,1),lab(plus(so,1))+" (+1)"],[plus(so,2),lab(plus(so,2))+" (+2)"],[plus(so,3),lab(plus(so,3))+" (+3)"],[plus(so,-2),lab(plus(so,-2))],[plus(so,-4),lab(plus(so,-4))]];
  openSheet({title:t("hoursOf",{x:s.name,d:dayName(S.date)}),
    fields:[{name:"qin",label:t("arrived"),type:"chips",options:ins,value:tin},{name:"qout",label:t("left"),type:"chips",options:outs,value:tout}],
    html:`<div class="preview" id="tprev"></div>`,
    more:[{name:"in",label:t("exactIn"),type:"time",value:tin},{name:"out",label:t("exactOut"),type:"time",value:tout}],
    submit: v=>attSave(sid,S.date,"present",v.in||si,v.out||so,S.uid)});
  tprev();
}
function tprev(){
  const fi = document.getElementById("f_in"), fo = document.getElementById("f_out"), el = document.getElementById("tprev"); if(!fi||!fo||!el) return;
  const s = staffById(timesStaff), x = timeCalc(fi.value, fo.value), dr = dayRate(s,S.date), ot = x.ot*otRate(s,S.date);
  el.innerHTML = `${t("earns",{x:money(dr+ot)})}${x.ot?` · ${t("ot",{x:hrsTxt(x.ot)})}`:""}${x.late?` · ${t("late",{x:hrsTxt(x.late)})}`:""}${x.early?` · ${t("early",{x:hrsTxt(x.early)})}`:""}`;
}
function payForm(x, preset={}){
  const sid = x?.staffId || preset.staffId, s = staffById(sid); if(!s) return;
  const kind = (x?.kind || preset.kind)==="salary" ? "salary" : "advance";
  FILES.begin(x?.files);
  openSheet({title: x ? t("editPayment",{x:s.name}) : kind==="salary" ? t("paidTo",{x:s.name}) : t("advFor",{x:s.name}), saveLabel: x?t("save"):t("record"),
    fields:[{name:"amount",label:t("howMuchTook"),type:"money",big:true,value:x?.amount ?? (preset.amount!=null?String(Math.round(preset.amount*100)/100):"")},
      {name:"kind",label:t("whatIsIt"),type:"chips",options:[["advance",t("advance")],["salary",t("fromSalary")]],value:kind}],
    html: FILES.field(),
    more:[{name:"date",label:t("date"),type:"date",value:x?.date||preset.date||S.date||today()},{name:"time",label:t("time"),type:"time",value:x?.time||""},
      {name:"payBy",label:t("payBy"),type:"chips",options:[["cash",t("cash")],["transfer",t("transfer")],["cheque",t("cheque")]],value:x?.payBy||"cash"},{name:"note",label:t("note"),value:x?.note,max:200}],
    del: x ? {label:t("del"), run:async()=>{ const ok = await remove("payments",x.id); if(ok) FILES.purge(x.files); return ok; }} : null,
    submit: async v=>{
      const amount = num(v.amount); if(amount<=0){ toast(t("eAmount")); return false; }
      const files = await FILES.commit(); if(files===null) return false;
      const ok = await save("payments", x?.id, {...(x?strip(x):{createdAt:Date.now()}), staffId:sid, unitId:x?.unitId||s.unitId||S.uid, kind:v.kind==="salary"?"salary":"advance", amount, date:validDate(v.date)?v.date:today(),
        time:mins(v.time)!=null?v.time:"", payBy:["cash","transfer","cheque"].includes(v.payBy)?v.payBy:"cash", note:(v.note||"").slice(0,200), files});
      if(ok) FILES.done();
      if(ok && !x) toast(t("savedPay",{x:s.name,k:v.kind==="salary"?t("fromSalary"):t("advance"),a:moneyTxt(amount)})); return ok;
    }});
}
function unitPickField(x, cur){
  if(S.view==="unit" && !x && cur===S.uid) return [];
  const opts = unitOptions(x?.unitId); if(!opts.length) return [];
  return [{name:"unitId",label:tv("forUnit"),type:"select",options:[["",""] ,...opts],value:cur||x?.unitId||(S.view==="unit"?S.uid:(opts.length===1?opts[0][0]:""))}];
}
function moneyForm(kind, x, preset={}){
  const isExp = kind==="exp";
  if(!x && !S.units.some(u=>u.status!=="closed")){ toast(tv("noUnitsSub")); return; }
  const uid0 = preset.unitId || x?.unitId || (S.view==="unit" ? S.uid : (activeUnits().length===1 ? activeUnits()[0].id : ""));
  const u0 = unitById(uid0), list = unitCats(u0, kind);
  const lastKey = "lastCat_"+unitKind(u0)+"_"+kind, last = lsGet(lastKey, list[0][0]);
  const curCat = preset.category || x?.category || (list.some(p=>p[0]===last) ? last : list[0][0]);
  const opts = list.map(p=>[p[0],esc(cat(p))]); if(curCat && !opts.some(o=>o[0]===curCat)) opts.unshift([curCat, esc(catLabel(curCat))]);
  FILES.begin(x?.files); S.mkind = kind;
  openSheet({title: x ? (isExp?t("editExp"):t("editInc")) : (isExp?t("newExp"):t("newInc")), saveLabel: x?t("save"):t("record"),
    fields:[{name:"amount",label:isExp?t("howMuchPaid"):t("howMuchGot"),type:"money",big:true,value:x?.amount ?? preset.amount},
      ...unitPickField(x, uid0),
      {name:"category",label:isExp?t("onWhat"):t("fromWhat"),type:"chips",options:opts,value:curCat},
      {name:isExp?"item":"note",label:isExp?t("desc"):t("note"),value:(isExp?x?.item:x?.note) ?? preset.note,max:160}],
    html: `${u0?`<button type="button" class="linkbtn addcat" data-act="quickCat" data-id="${kind}">${icon("plus")}${t("addCatHere")}</button>`:""}${FILES.field()}`,
    more:[{name:"date",label:t("date"),type:"date",value:x?.date||preset.date||(S.view==="unit"?S.date:today())}, {name:"time",label:t("time"),type:"time",value:x?.time||preset.time||""},
      ...(isExp?[{name:"supplier",label:t("shop"),value:x?.supplier ?? preset.supplier,max:80},{name:"payBy",label:t("payBy"),type:"chips",options:[["cash",t("cash")],["card",t("card")],["transfer",t("transfer")],["cheque",t("cheque")]],value:x?.payBy||preset.payBy||"cash"},{name:"invNo",label:t("invNo"),value:x?.invNo,max:40}]:[{name:"payBy",label:t("gotBy"),type:"chips",options:[["cash",t("cash")],["card",t("card")],["transfer",t("transfer")],["cheque",t("cheque")]],value:x?.payBy||preset.payBy||"cash"}])],
    del: x ? {label:t("del"), run:async()=>{ const ok = await remove(isExp?"expenses":"income",x.id); if(ok) FILES.purge(x.files); return ok; }} : null,
    submit: async v=>{
      const amount = num(v.amount); if(amount<=0){ toast(t("eAmount")); return false; }
      const unitId = v.unitId || x?.unitId || (S.view==="unit"?S.uid:""); if(!unitById(unitId)){ toast(tv("eUnitPick")); return false; }
      const u = unitById(unitId), ok_cats = unitCats(u, kind);
      const category = v.category && (ok_cats.some(p=>p[0]===v.category) || v.category===x?.category || v.category===preset.category) ? v.category : ok_cats[ok_cats.length-1][0];
      lsSet("lastCat_"+unitKind(u)+"_"+kind, category);
      const files = await FILES.commit(); if(files===null) return false;
      const base = {...(x?strip(x):{createdAt:Date.now()}), unitId, category, amount, date:validDate(v.date)?v.date:today(), time:mins(v.time)!=null?v.time:"", payBy:["cash","card","transfer","cheque"].includes(v.payBy)?v.payBy:"cash", files};
      const data = isExp ? {...base, item:(v.item||"").slice(0,160), supplier:(v.supplier||"").slice(0,80), invNo:(v.invNo||"").slice(0,40)} : {...base, note:(v.note||"").slice(0,160)};
      const id = x?.id || newId();
      const ok = await save(isExp?"expenses":"income", id, data);
      if(ok) FILES.done();
      if(ok && !x) toast(isExp ? t("savedExp",{c:catLabel(category),a:moneyTxt(amount)}) : t("savedInc",{a:moneyTxt(amount)})); return ok;
    }});
}
/* switching the folder inside the money form swaps its category chips */
function refreshCatChips(kind){
  const sel = document.querySelector('#sheetBody [name="unitId"]'), box = document.querySelector('#sheetBody [name="category"]'); if(!box) return;
  const u = unitById(sel ? sel.value : S.uid), list = unitCats(u, kind), cur = (document.querySelector('#sheetBody [name="category"]:checked')||{}).value;
  const wrap = box.closest(".chips"); if(!wrap) return;
  const pick = list.some(p=>p[0]===cur) ? cur : list[0][0];
  wrap.innerHTML = list.map(p=>`<label><input type="radio" name="category" value="${esc(p[0])}" ${p[0]===pick?"checked":""}><span>${esc(cat(p))}</span></label>`).join("");
}
async function attSave(sid, date, status, tin, tout, unitId){
  const s = staffById(sid); if(!s || !validDate(date)) return false;
  const a = attOf(sid,date);
  return save("attendance", date+"_"+sid, {staffId:sid, date, unitId:unitId||a?.unitId||s.unitId, status: status==="absent"?"absent":"present",
    in: status!=="absent" ? (tin||a?.in||ST().shiftIn) : "", out: status!=="absent" ? (tout||a?.out||ST().shiftOut) : "",
    dayRate:dayRate(s,date), otRate:otRate(s,date), updatedAt:Date.now()});
}
/* the + button: the 4-5 things people do every day, big and obvious */
const quickItems = () => { const drv = activeUnits().some(u=>KP(u).driver), staff = S.staff.some(x=>x.active!==false);
  return [...(drv?[["trip","route",t("newTrip"),t("qTripSub")]]:[]), ...(staff?[["att","users",t("qAtt"),t("qAttSub")]]:[]),
    ["exp","minus",t("expense"),t("qExpSub")], ["inc","plus",t("incomeOne"),t("qIncSub")], ...(staff?[["adv","wallet",t("addAdvance").replace(/^\+\s*/,""),t("qAdvSub")]]:[])]; };
const quickTiles = () => quickItems().map(([k,ic,l,sub])=>`<button type="button" class="qtile q-${k}" data-act="q" data-id="${k}">${icon(ic)}<b>${esc(l)}</b><span>${esc(sub)}</span></button>`).join("");
function quickSheet(){ openSheet({title:t("whatAdd"), noSave:true, html:`<div class="qgrid">${quickTiles()}</div>`}); }
/* pick a folder / a person when the action needs one */
function pickUnit(what){
  const us = activeUnits().filter(u=>unitStaff(u.id).length); if(!us.length){ toast(tv("noStaff")); return; }
  if(us.length===1){ A.openUnit(us[0].id); return; }
  openSheet({title:t("qWhichUnit"), noSave:true, html:`<div class="list">${us.map(u=>`<button type="button" class="row" data-act="openUnitClose" data-id="${esc(u.id)}"><span class="tx-ic">${icon(KP(u).icon)}</span><div class="m"><b>${esc(u.name)}</b><span class="sub">${t("cameOf",{a:`<span class="num">${unitStaff(u.id).filter(x=>came(attOf(x.id,today()))).length}</span>`,b:`<span class="num">${unitStaff(u.id).length}</span>`})}</span></div>${icon(LANG==="en"?"chevS":"chevE")}</button>`).join("")}</div>`});
}
function pickStaff(){
  const ss = S.staff.filter(x=>x.active!==false).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  if(ss.length===1){ payForm(null,{staffId:ss[0].id, kind:"advance"}); return; }
  openSheet({title:t("qWho"), noSave:true, html:`<input type="search" id="whoq" class="whoq" placeholder="${esc(t("qSearchName"))}" autocomplete="off"><div class="list" id="wholist">${ss.map(x=>`<button type="button" class="row" data-act="advFor" data-id="${esc(x.id)}" data-n="${esc(String(x.name).toLowerCase())}"><span class="avatar">${esc(initials(x.name))}</span><div class="m"><b>${esc(x.name)}</b><span class="sub">${esc((unitById(x.unitId)||{}).name||"")}</span></div></button>`).join("")}</div>`});
}
const typeOptions = () => TYPES.map(k=>[k, `${icon(P[k].icon)}${esc(P[k].name[LI()])}`]);
const curOptions = () => Object.keys(CUR).map(k=>[k, `${k} · ${CUR[k][0]}`]);
function settingsSheet(){
  if(ROLE!=="owner"){ toast(t("onlyOwner")); return; }
  const s = ST();
  openSheet({title:t("settings"),
    fields:[{name:"name",label:t("companyName"),value:COMPANY.name,max:80},
      {name:"type",label:t("bizType"),type:"chips",cls:"types",options:typeOptions(),value:s.type},
      {name:"currency",label:t("currency"),type:"select",options:curOptions(),value:s.currency},
      {name:"lang",label:t("language"),type:"chips",options:[["ar","العربية"],["en","English"]],value:LANG},
      {name:"weekend",label:t("weekend"),type:"multichips",options:DAYS_SHORT[LANG].map((d,i)=>[String(i),d]),value:s.weekend.map(String)}],
    more:[{name:"shiftIn",label:t("shiftIn"),type:"time",value:s.shiftIn},{name:"shiftOut",label:t("shiftOut"),type:"time",value:s.shiftOut},
      {name:"payPeriod",label:t("payPeriod"),type:"chips",options:[["week",t("weekly")],["month",t("monthly")]],value:s.payPeriod||PRE().pay},
      {name:"otMult",label:t("otMult"),type:"chips",options:[["1","100%"],["1.25",t("ot125")],["1.5","150%"]],value:String(s.otMult),hint:t("otMultHint")},
      {name:"phone",label:t("phoneCo"),type:"tel",value:COMPANY.phone||"",max:30}],
    submit: async v=>{
      if(!v.name || v.name.length<2){ toast(t("eName")); return false; }
      const settings = {...(COMPANY.settings||{}), type:P[v.type]?v.type:"other", currency:CUR[v.currency]?v.currency:"JOD", lang:v.lang==="en"?"en":"ar",
        weekend:(v.weekend||[]).map(Number).filter(n=>n>=0&&n<=6), shiftIn:mins(v.shiftIn)!=null?v.shiftIn:"08:00", shiftOut:mins(v.shiftOut)!=null?v.shiftOut:"17:00", payPeriod:v.payPeriod==="month"?"month":"week", otMult:[1,1.25,1.5].includes(Number(v.otMult))?Number(v.otMult):1};
      return applySettings({name:v.name.slice(0,80), phone:(v.phone||"").slice(0,30)||null, settings});
    }});
}
async function applySettings(patch){
  const { error } = await sb.from("companies").update(patch).eq("id",CID);
  if(error){ toast(errMsg(error)); return false; }
  COMPANY = {...COMPANY, ...patch};
  S.period = ST().payPeriod || PRE().pay; S.pstart = periodStartFor(S.date||today());
  if(patch.settings && patch.settings.lang && patch.settings.lang!==LANG) setLang(patch.settings.lang); else render();
  toast(t("settingsSaved")); return true;
}
