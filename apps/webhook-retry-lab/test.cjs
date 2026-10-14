const assert=require('node:assert/strict');
const {simulate}=require('./web/core.js');
let checks=0;
for(const strategy of ['none','seen','ledger'])for(const failure of ['none','before-effect','after-effect'])for(const attempts of [1,2,3,8])for(const downstreamSafe of [false,true]){
 const r=simulate({strategy,failure,attempts,downstreamSafe});
 assert.equal(r.timeline.length,attempts);assert.equal(r.effects,r.timeline.reduce((n,t)=>n+t.effects,0));
 assert.equal(r.duplicates,Math.max(0,r.effects-1));
 if(downstreamSafe)assert.ok(r.effects<=1);
 if(strategy==='seen'&&failure==='before-effect')assert.equal(r.effects,0);
 if(strategy==='ledger'&&failure==='none')assert.equal(r.effects,1);
 checks++;
}
const scenario=(strategy,failure,downstreamSafe,attempts=3)=>simulate({strategy,failure,downstreamSafe,attempts});
assert.equal(scenario('none','after-effect',false).effects,3);
assert.equal(scenario('seen','before-effect',false).outcome,'lost');
assert.equal(scenario('ledger','after-effect',false).effects,2);
assert.equal(scenario('ledger','after-effect',true).effects,1);
assert.equal(scenario('ledger','before-effect',false).effects,1);
for(const attempts of [0,9,NaN,1.5])assert.throws(()=>scenario('none','none',false,attempts));
assert.throws(()=>scenario('bad','none',false));
console.log(JSON.stringify({scenarioChecks:checks,regressionCases:5,invalidInputsRejected:5,status:'PASS'}));
