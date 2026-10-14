'use strict';
(()=>{
 const q=new URLSearchParams(location.search),qa=q.get('qa')==='1';
 const allowed=['developwhale_home','intro','guide_idempotency','guide_async'];
 let source=allowed.includes(q.get('utm_source'))?q.get('utm_source'):'direct';
 if(source==='direct'&&document.referrer){try{const host=new URL(document.referrer).hostname;source=host==='www.developwhale.com'||host==='developwhale.com'?'developwhale':/(^|\.)(google\.[a-z.]+|bing.com|duckduckgo.com)$/.test(host)?'search':'other';}catch{source='other';}}
 const audience=qa?'qa':'external',key='retry_lab_stats_'+audience;
 let enabled=false,visited=false,sent=0;
 const status=document.getElementById('statsStatus');
 const restricted=navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true;
 try{enabled=!restricted&&sessionStorage.getItem(key)==='yes';visited=sessionStorage.getItem(key+'_visit')==='yes';}catch{}
 function state(){status.textContent=restricted?'Statistics off: browser privacy preference.':enabled?'Anonymous statistics enabled'+(qa?' · QA traffic':'')+'.':'Statistics off. The simulator still works.';}
 async function send(event){if(!enabled||sent++>=100)return;try{const response=await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,source,audience}),keepalive:true});if(!response.ok)status.textContent='Statistics unavailable. The simulator still works.';}catch{status.textContent='Statistics unavailable. The simulator still works.';}}
 function visit(){if(!visited&&enabled){visited=true;try{sessionStorage.setItem(key+'_visit','yes');}catch{}send('visit');}}
 document.getElementById('allowStats').addEventListener('click',()=>{enabled=!restricted;try{sessionStorage.setItem(key,enabled?'yes':'no');}catch{}state();visit();});
 document.getElementById('declineStats').addEventListener('click',()=>{enabled=false;try{sessionStorage.setItem(key,'no');}catch{}state();});
 window.LabMetrics={send};state();visit();
 window.addEventListener('error',()=>send('error'));window.addEventListener('unhandledrejection',()=>send('error'));
 for(const a of document.querySelectorAll('.reading a'))a.addEventListener('click',()=>send('guide_click'));
})();
