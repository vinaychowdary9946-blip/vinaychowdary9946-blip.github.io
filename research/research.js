(() => {
'use strict';
const $ = id => document.getElementById(id);
const professor = $('professor-button'), hiring = $('hiring-button');
function audience(prof) {
  professor.setAttribute('aria-pressed', String(prof)); hiring.setAttribute('aria-pressed', String(!prof));
  $('professor-view').hidden = !prof; $('hiring-view').hidden = prof;
}
professor.addEventListener('click', () => audience(true)); hiring.addEventListener('click', () => audience(false));
if (new URLSearchParams(location.search).get('view') === 'hiring') audience(false);
const names = {naive:'Naive replay',local_receipt:'Local receipt',keyed:'Destination key',guarded:'Guarded retry'};
const interpretations = {
 expired_after_effect:'After expiry, the three replaying policies create a second effect. Guarded retry preserves one effect and explicitly quarantines the uncertain outcome; it does not confirm success.',
 expiry_before_send:'No original request reached the destination. The guarded policy still quarantines because its local evidence cannot distinguish this history from a completed external action. The requested effect remains missing.',
 after_effect:'Within the retention horizon, the destination key prevents repetition. A local-only receipt cannot close the external commit gap.',
 before_receipt_commit:'The local transaction rolls back when the worker exits. The remote effect survives in its separate store; destination keys suppress repetition within the horizon.',
 after_receipt:'A completed local result allows local-receipt and guarded policies to replay their result. The naive policy sends again; the keyed policy relies on the destination receipt.',
 changed_retry:'The retry changes the payload under an existing identity. The local-receipt baseline falsely confirms an old effect. Destination binding rejects the conflict; the guard detects it before dispatch. Naive replay creates a wrong-payload excess effect.',
 before_send:'The initial worker exits before HTTP dispatch. Recovery within the horizon produces one effect for every policy.',
 clean:'No crash is injected, but a duplicate invocation still follows. This is a replay control. Naive replay repeats the effect; the other policies suppress it.'
};
let data;
function render() {
 if (!data) return;
 const scenario=$('scenario').value, workload=$('workload').value;
 const rows=data.trials.filter(r=>r.scenario===scenario&&(workload==='all'||r.workload===workload));
 $('outcomes').replaceChildren();
 for(const policy of Object.keys(names)) {
   const set=rows.filter(r=>r.policy===policy), tr=document.createElement('tr');
   const values=[names[policy],set.length,...['duplicates','missing','false_confirmation'].map(k=>set.reduce((n,r)=>n+r[k],0)),set.filter(r=>r.recovery.status==='quarantined').length,set.filter(r=>r.recovery.status==='conflict').length];
   values.forEach((v,i)=>{const td=document.createElement(i===0?'th':'td'); if(i===0)td.scope='row';td.textContent=String(v);if(i>1&&Number(v)>0)td.className='nonzero';tr.append(td);});
   $('outcomes').append(tr);
 }
 $('data-status').textContent=rows.length+' recorded trials in this selection. Source fingerprint and complete evidence available in JSON.';
 $('interpretation').textContent=interpretations[scenario];
 const trial=rows.find(r=>r.policy===$('trial-policy').value);
 $('trial-record').textContent=trial?JSON.stringify(trial,null,2):'No matching trial.';
}
for(const id of ['scenario','workload','trial-policy'])$(id).addEventListener('change',render);
fetch('results.json').then(r=>{if(!r.ok)throw new Error('Evidence unavailable');return r.json();}).then(value=>{
 if(value.schema!==1||!Array.isArray(value.trials)||value.trials.length!==1152)throw new Error('Unexpected evidence format');
 data=value;$('trial-count').textContent=data.trials.length.toLocaleString('en-US');render();
}).catch(()=>{$('data-status').textContent='The interactive evidence could not load. Use the PDF or download the raw evidence links below.';});
})();
