import {readFile,writeFile} from 'node:fs/promises';
const types={ 'index.html':'text/html; charset=utf-8','style.css':'text/css; charset=utf-8','core.js':'text/javascript; charset=utf-8','app.js':'text/javascript; charset=utf-8','telemetry.js':'text/javascript; charset=utf-8','robots.txt':'text/plain; charset=utf-8','sitemap.xml':'application/xml; charset=utf-8'};
const assets={};for(const [file,type] of Object.entries(types))assets[file]={body:await readFile('web/'+file,'utf8'),type};
const runtime=await readFile('worker/runtime.js','utf8');await writeFile('worker/index.js','const assets='+JSON.stringify(assets)+';\n'+runtime);
