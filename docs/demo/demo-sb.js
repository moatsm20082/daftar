/* Daftar try-it demo: a stand-in backend that keeps everything in this browser only. Nothing reaches our servers. */
(function(){
window.DEMO_MODE = true;
const K="daftar_try_v1";
function load(){ try{ return JSON.parse(localStorage.getItem(K))||null; }catch(e){ return null; } }
let D = load();
if(!D || !D.session){ const ar = !/^en/.test((()=>{ try{ return localStorage.getItem("lang")||""; }catch(e){ return ""; } })());
  const user = {id:"demo-user", email:"demo@daftarapp.co", user_metadata:{}};
  D = {users:{"demo@daftarapp.co":{password:"", user}}, session:{user}, members:{"demo-user":{company_id:"demo-co", role:"owner"}},
    companies:{"demo-co":{id:"demo-co", name: ar ? "مؤسسة البناء الحديث" : "Modern Build Co.", phone:null, settings:{lang: ar ? "ar" : "en", onboarded:false}, created_at:new Date().toISOString()}}, records:[], tickets:[]}; }
D.tickets = D.tickets || [];
function persist(){ try{ localStorage.setItem(K, JSON.stringify(D)); }catch(e){} }
const listeners=[]; const emit=(ev)=>listeners.forEach(f=>{ try{ f(ev, D.session); }catch(e){} });
const uid=()=>D.session && D.session.user.id;
function q(table){
  const st={filters:[],op:"select",payload:null};
  const api={ select(){return api}, eq(k,v){st.filters.push([k,v]);return api}, range(){return api}, maybeSingle(){st.single=true;return api}, order(){return api}, limit(){return api},
    upsert(r){st.op="upsert";st.payload=r;return api}, update(r){st.op="update";st.payload=r;return api}, delete(){st.op="delete";return api},
    then(res,rej){ return Promise.resolve(run()).then(res,rej); } };
  function run(){
    const me = uid(); const mem = me && D.members[me];
    if(table==="members") return {data: mem||null, error:null};
    if(table==="support_tickets") return {data: D.tickets.filter(x=>x.user_id===me).sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at))), error:null};
    if(table==="companies"){
      if(!mem) return {data:null,error:null};
      if(st.op==="update"){ Object.assign(D.companies[mem.company_id], st.payload); persist(); return {error:null}; }
      return {data: {...D.companies[mem.company_id]}, error:null};
    }
    if(!mem) return {data:[], error:{message:"permission denied"}};
    if(st.op==="upsert"){ for(const p0 of (Array.isArray(st.payload)?st.payload:[st.payload])){ const r={...p0, company_id:mem.company_id}; if(window.__COLS_OK && !window.__COLS_OK.includes(r.col)) return {error:{message:"violates check constraint records_col_check"}}; const i=D.records.findIndex(x=>x.company_id===r.company_id&&x.col===r.col&&x.id===r.id);
      if(i>=0) D.records[i]=r; else D.records.push(r); } persist(); return {error:null}; }
    let rows = D.records.filter(r=>r.company_id===mem.company_id && st.filters.every(([k,v])=>r[k]===v));
    if(st.op==="delete"){ D.records = D.records.filter(r=>!rows.includes(r)); persist(); return {error:null}; }
    return {data: rows.map(r=>({col:r.col,id:r.id,data:r.data})), error:null};
  }
  return api;
}
window.supabase = { createClient(){ return {
  auth:{
    onAuthStateChange(cb){ listeners.push(cb); return {data:{subscription:{unsubscribe(){}}}}; },
    async getSession(){ return {data:{session:D.session}}; },
    async getUser(){ return {data:{user:D.session?D.session.user:null}}; },
    async signInWithPassword({email,password}){
      const u = D.users[String(email).toLowerCase()];
      if(!u || u.password!==password) return {error:{message:"Invalid login credentials"}};
      D.session={user:u.user}; persist(); emit("SIGNED_IN"); return {error:null}; },
    async signUp({email,password,options}){
      const e=String(email).toLowerCase(); if(D.users[e]) return {error:{message:"User already registered"}};
      const user={id:"u"+Date.now(), email:e, user_metadata:(options&&options.data)||{}};
      D.users[e]={password,user}; D.session={user}; persist(); emit("SIGNED_IN"); return {data:{session:D.session},error:null}; },
    async resetPasswordForEmail(){ return {error:null}; },
    async updateUser({password}){ const u=Object.values(D.users).find(x=>x.user.id===uid()); if(u&&password) u.password=password; persist(); return {error:null}; },
    async signOut(){ D.session=null; persist(); emit("SIGNED_OUT"); }
  },
  async rpc(name,args){
    if(name==="is_platform_admin") return {data:false,error:null};
    D.invites = D.invites || {};
    if(name==="create_invite"){ const me=uid(), m=D.members[me]; if(!m||m.role!=="owner") return {error:{message:"only owner"}};
      const code=Array.from({length:8},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join(""); D.invites[code]={company_id:m.company_id,uses:0}; persist(); return {data:{code},error:null}; }
    if(name==="join_company"){ const me=uid(); if(!me) return {error:{message:"not signed in"}}; if(D.members[me]) return {error:{message:"already in a company"}};
      const c=String(args.p_code||"").toUpperCase().replace(/[^A-Z0-9]/g,""), inv=D.invites[c]; if(!inv||inv.uses>=5) return {error:{message:"invalid invite"}};
      D.members[me]={company_id:inv.company_id,role:"member"}; inv.uses++; persist(); return {data:inv.company_id,error:null}; }
    if(name==="company_members"){ const me=uid(), m=D.members[me]; if(!m||m.role!=="owner") return {error:{message:"only owner"}};
      return {data:Object.entries(D.members).filter(([u,x])=>x.company_id===m.company_id).map(([u,x])=>({user_id:u, role:x.role, email:(Object.values(D.users).find(y=>y.user.id===u)||{user:{}}).user.email})),error:null}; }
    if(name==="remove_member"){ const me=uid(), m=D.members[me]; const x=D.members[args.p_user]; if(!m||m.role!=="owner"||!x||x.role!=="member"||x.company_id!==m.company_id) return {data:false,error:null}; delete D.members[args.p_user]; persist(); return {data:true,error:null}; }
    D.invites = D.invites || {};
    if(name==="create_invite"){ const me=uid(), m=D.members[me]; if(!m||m.role!=="owner") return {error:{message:"only owner"}};
      const abc="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let c=""; for(let i=0;i<8;i++) c+=abc[Math.floor(Math.random()*32)]; D.invites[c]={cid:m.company_id,uses:0}; persist(); return {data:{code:c,max_uses:5},error:null}; }
    if(name==="join_company"){ const me=uid(); if(!me) return {error:{message:"not signed in"}}; if(D.members[me]) return {error:{message:"already in a company"}};
      const v=String(args.p_code||"").toUpperCase().replace(/[^A-Z0-9]/g,""), inv=D.invites[v]; if(!inv||inv.uses>=5) return {error:{message:"invalid invite"}};
      D.members[me]={company_id:inv.cid, role:"member"}; inv.uses++; persist(); return {data:inv.cid,error:null}; }
    if(name==="company_members"){ const me=uid(), m=D.members[me]; if(!m||m.role!=="owner") return {error:{message:"only owner"}};
      return {data:Object.entries(D.members).filter(([u,x])=>x.company_id===m.company_id).map(([u,x])=>({user_id:u, role:x.role||"owner", email:(Object.values(D.users).find(y=>y.user.id===u)||{user:{}}).user.email})),error:null}; }
    if(name==="remove_member"){ const me=uid(), m=D.members[me]; if(!m||m.role!=="owner") return {error:{message:"only owner"}}; const x=D.members[args.p_user]; if(x&&x.role==="member"&&x.company_id===m.company_id){ delete D.members[args.p_user]; persist(); return {data:true,error:null}; } return {data:false,error:null}; }
    if(name==="create_company"){ const me=uid(); if(!me) return {error:{message:"not signed in"}};
      if(D.members[me]) return {data:D.members[me].company_id,error:null};
      const id="c"+Date.now(); D.companies[id]={id,name:args.p_name,phone:args.p_phone,settings:args.p_settings||{},created_at:new Date().toISOString()};
      D.members[me]={company_id:id,role:"owner"}; persist(); return {data:id,error:null}; }
    if(name==="admin_stats"){
      const cs=Object.values(D.companies), now=Date.now(), age=c=>(now-new Date(c.created_at).getTime())/864e5;
      const owner=cid=>{ const m=Object.entries(D.members).find(([u,m])=>m.company_id===cid); const u=m&&Object.values(D.users).find(x=>x.user.id===m[0]); return u?u.user.email:""; };
      const cnt=(cid,col)=>D.records.filter(r=>(!cid||r.company_id===cid)&&r.col===col).length;
      const types={}; cs.forEach(c=>{ const t=(c.settings||{}).type||"other"; types[t]=(types[t]||0)+1; });
      const months={}; cs.forEach(c=>{ const m=c.created_at.slice(0,7); months[m]=(months[m]||0)+1; });
      return {data:{companies:cs.length,new_7d:cs.filter(c=>age(c)<7).length,new_30d:cs.filter(c=>age(c)<30).length,active_7d:cs.length,
        units:cnt(null,"units"),staff:cnt(null,"staff"),by_type:Object.entries(types).map(([type,count])=>({type,count})),
        by_month:Object.entries(months).sort().map(([month,count])=>({month,count})),
        list:cs.map(c=>({id:c.id,name:c.name,phone:c.phone,created_at:c.created_at,email:owner(c.id),type:(c.settings||{}).type||"other",units:cnt(c.id,"units"),staff:cnt(c.id,"staff"),last_activity:new Date().toISOString()}))},error:null}; }
    const now = new Date().toISOString(), msg = (role,text)=>({role, text:String(text||"").slice(0,4000), at:now});
    if(name==="open_ticket"){ const me=uid(); const id="t"+Date.now(); D.tickets.push({id, user_id:me, company_id:(D.members[me]||{}).company_id, contact:(D.session.user.email), subject:args.p_subject, status:"open",
        messages:(args.p_messages||[]).filter(m=>m.role==="user"||m.role==="ai").map(m=>msg(m.role,m.text)), created_at:now, updated_at:now}); persist();
      setTimeout(()=>{ const tk=D.tickets.find(x=>x.id===id); if(tk){ tk.messages.push(msg("support","أهلاً، وصلتنا رسالتك ورح نتابعها معك. (هاد رد تجريبي من فريق الدعم)")); tk.status="answered"; tk.updated_at=new Date().toISOString(); persist(); } }, 4000);
      return {data:id,error:null}; }
    if(name==="ticket_reply"){ const tk=D.tickets.find(x=>x.id===args.p_id && x.user_id===uid()); if(!tk) return {data:false,error:null}; tk.messages.push(msg("user",args.p_text)); tk.status="open"; tk.updated_at=now; persist(); return {data:true,error:null}; }
    if(name==="open_public_ticket"){ D.tickets.push({id:"t"+Date.now(), user_id:null, name:args.p_name, contact:args.p_contact, subject:String(args.p_message).slice(0,160), status:"open", messages:[msg("user",args.p_message)], created_at:now, updated_at:now}); persist(); return {data:true,error:null}; }
    if(name==="admin_tickets"){ return {data:D.tickets.filter(x=>!args.p_status||x.status===args.p_status).map(x=>({...x, company:(D.companies[x.company_id]||{}).name||null})).sort((a,b)=>String(b.updated_at).localeCompare(String(a.updated_at))), error:null}; }
    if(name==="admin_reply"){ const tk=D.tickets.find(x=>x.id===args.p_id); if(!tk) return {data:false,error:null}; if(args.p_text) tk.messages.push(msg("support",args.p_text)); tk.status=args.p_close?"closed":"answered"; tk.updated_at=now; persist(); return {data:true,error:null}; }
    return {error:{message:"unknown"}};
  },
  storage:{ from(bucket){ window.__FILES = window.__FILES || {}; const F = window.__FILES; return {
      async upload(path, blob, opt){ const me = uid(), mem = me && D.members[me]; if(!mem || !path.startsWith(mem.company_id+"/")) return {error:{message:"new row violates row-level security policy"}};
        if(F[path]) return {error:{message:"The resource already exists"}}; F[path] = {blob, type:opt&&opt.contentType}; return {data:{path}, error:null}; },
      async remove(paths){ paths.forEach(p=>delete F[p]); window.__REMOVED = (window.__REMOVED||[]).concat(paths); return {data:paths, error:null}; },
      async createSignedUrl(path){ const me = uid(), mem = me && D.members[me]; if(!F[path] || !mem || !path.startsWith(mem.company_id+"/")) return {error:{message:"Object not found"}}; return {data:{signedUrl:URL.createObjectURL(F[path].blob)}, error:null}; }
    }; } },
  functions:{ async invoke(name, opts){ if(name==="price-search" && window.__PRICE_RES) return {data:window.__PRICE_RES(opts.body), error:null}; return {data:null, error:{context:{json:async()=>({error:"ai_not_configured"})}}}; } }, from:q, channel(){ const c={on(){return c}, subscribe(){return c}}; return c; }, removeChannel(){}
}; } };
})();
