const events=new Set(['visit','run','complete','download','error','guide_click']);
const sources=new Set(['direct','search','developwhale','developwhale_home','intro','guide_idempotency','guide_async','other']);
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{...headers,'Content-Type':'application/json'}});
export default {async fetch(request,env){
 const u=new URL(request.url);
 try{
 if(u.pathname==='/api/events'){
  if(request.method!=='POST')return json({error:'method'},405);
  if(request.headers.get('Origin')!==u.origin)return json({error:'origin'},403);
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json({error:'type'},415);
  const declared=Number(request.headers.get('Content-Length'));if(declared>256)return json({error:'size'},413);
  const reader=request.body?.getReader();if(!reader)return json({error:'body'},400);
  const chunks=[];let length=0;while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>256){await reader.cancel();return json({error:'size'},413);}chunks.push(value);}
  const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return json({error:'json'},400);}
  if(!body||Object.keys(body).some(k=>!['event','source','audience'].includes(k))||!events.has(body.event)||!sources.has(body.source)||!['qa','external'].includes(body.audience))return json({error:'schema'},400);
  if(!env.DB)return json({error:'measurement_unavailable'},503);
  await env.DB.prepare('INSERT INTO metrics_daily(day,audience,source,event,count) VALUES(?,?,?,?,1) ON CONFLICT(day,audience,source,event) DO UPDATE SET count=count+1').bind(new Date().toISOString().slice(0,10),body.audience,body.source,body.event).run();
  return json({recorded:true});
 }
 if(u.pathname==='/api/metrics'){
  if(request.method!=='GET')return json({error:'method'},405);
  if(!env.DB)return json({error:'measurement_unavailable'},503);
  const since=new Date(Date.now()-13*86400000).toISOString().slice(0,10);
  const result=await env.DB.prepare('SELECT day,audience,source,event,count FROM metrics_daily WHERE day>=? ORDER BY day,audience,source,event').bind(since).all();
  return json({since,timezone:'UTC',metric:'Opt-in anonymous sessions and event counts; not unique people. download = request, not confirmed file delivery.',revenue:0,revenue_note:'No revenue integration in this experiment.',rows:result.results});
 }
 if(!['GET','HEAD'].includes(request.method))return json({error:'method'},405);
 const file=u.pathname==='/'?'index.html':u.pathname.slice(1);const asset=assets[file];
 if(!asset)return new Response('Not found',{status:404,headers});
 return new Response(request.method==='HEAD'?null:asset.body,{headers:{...headers,'Content-Type':asset.type,'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}});
 }catch{return json({error:'service_unavailable'},503);}
}};
