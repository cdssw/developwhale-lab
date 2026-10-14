(function(root){
  'use strict';
  function simulate(input){
    const strategies=['none','seen','ledger'];
    const failures=['none','before-effect','after-effect'];
    if(!input || !strategies.includes(input.strategy) || !failures.includes(input.failure)) throw new Error('Invalid scenario');
    const attempts=Number(input.attempts);
    if(!Number.isInteger(attempts)||attempts<1||attempts>8) throw new Error('Attempts must be 1–8');
    let seen=false,done=false,applied=false,effects=0,reuses=0;
    const timeline=[];
    for(let i=1;i<=attempts;i++){
      const row={attempt:i,steps:[],status:'',effects:0};
      if(input.strategy==='seen'&&seen){row.steps.push('A seen flag exists. Skip this delivery.');row.status='skipped';timeline.push(row);continue;}
      if(input.strategy==='ledger'&&done){row.steps.push('The event is completed. Return the stored result.');row.status='replayed';timeline.push(row);continue;}
      if(input.strategy==='seen'){seen=true;row.steps.push('Write the seen flag before doing the work.');}
      if(input.strategy==='ledger')row.steps.push(i===1?'Claim event evt_demo_001 as processing.':'Reclaim the expired processing lease (simulated).');
      if(i===1&&input.failure==='before-effect'){row.steps.push('Worker crashes before the external action.');row.status='crashed';timeline.push(row);continue;}
      if(input.downstreamSafe&&applied){reuses++;row.steps.push('Destination recognizes the stable event key. Return its existing result.');}
      else{effects++;row.effects=1;applied=true;row.steps.push('Destination performs one business action.');}
      if(i===1&&input.failure==='after-effect'){row.steps.push('Worker crashes after the destination acts, before completion is recorded or the response is sent.');row.status='crashed';timeline.push(row);continue;}
      if(input.strategy==='ledger'){done=true;row.steps.push('Record the successful result as completed.');}
      row.steps.push('Acknowledge the delivery.');row.status='acknowledged';timeline.push(row);
    }
    const outcome=effects===0?'lost':effects>1?'duplicate':'one-action';
    return {event:'evt_demo_001',scenario:{strategy:input.strategy,failure:input.failure,attempts,downstreamSafe:!!input.downstreamSafe},effects,duplicates:Math.max(0,effects-1),reuses,outcome,timeline};
  }
  root.RetryLab={simulate};
  if(typeof module!=='undefined')module.exports={simulate};
})(typeof globalThis!=='undefined'?globalThis:this);
