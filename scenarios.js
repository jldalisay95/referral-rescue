/* Fictional, educational scenarios. Sources map to docs/EVIDENCE.md. */
export const cases = [
  {
    id:'ana', title:'Ana’s referral', eyebrow:'Rural health unit → receiving facility', role:'Referral team', duration:'3–5 min',
    intro:'One person, several systems. Keep the story intact from first capture to follow-up.',
    record:[['Person','Ana · fictional'],['Origin','Riverbend RHU · fictional'],['Request','Assessment at Hillview Hospital · fictional'],['Problem','The receiving team sees only “Please assess Ana.”']],
    steps:[
      {stage:'Capture',tag:'Guided start',prompt:'Two records say “Ana,” but their local identifiers differ. What should the team do first?',context:'The encounter is still at the point of service, where the team can verify the record with the person.',hint:'An identifier must point to the right person before anything travels.',options:[
        {text:'Verify identity against the local source record and resolve the mismatch with an auditable correction.',good:true,feedback:'The team confirms the right record while context is available. A traceable correction keeps later handoffs trustworthy.',delta:[1,2,0,0]},
        {text:'Choose the record with the most recent visit and send immediately.',feedback:'Recency alone cannot establish identity. The referral could attach to someone else’s record.',delta:[-1,-2,0,0]},
        {text:'Create a third record to avoid delaying the referral.',feedback:'A new duplicate makes matching harder. Verify and correct the existing records.',delta:[-1,-2,0,0]}
      ],sources:['WHO-DQA','OHIE']},
      {stage:'Check',prompt:'The referral says only “Please assess Ana.” What repair most helps the receiving team?',context:'The receiving doctor needs enough relevant context to triage the request, without an entire unrelated chart.',hint:'Purpose, urgency, reason, relevant summary, and a way to respond.',options:[
        {text:'Add the reason, urgency, relevant clinical summary, requested service, and contact or response route.',good:true,feedback:'A concise, purposeful referral supports a decision and a response. The exact clinical content depends on the case and local protocol.',delta:[2,2,0,0]},
        {text:'Attach every record the RHU holds, including unrelated notes.',feedback:'More information is not automatically more useful. Excess unrelated data can obscure the request and increase exposure.',delta:[0,-1,-2,0]},
        {text:'Send the short message as it is; the receiving team can ask later.',feedback:'The handoff lacks enough context to act promptly. Complete the relevant minimum before sending.',delta:[-2,-1,0,0]}
      ],sources:['WHO-DQA','NPC']},
      {stage:'Protect',prompt:'A colleague suggests posting the referral in an open group chat so somebody will see it. What do you choose?',context:'The receiving facility has a designated referral channel in this fictional workflow.',hint:'A known recipient, appropriate access, and an accountable route.',options:[
        {text:'Use the designated referral channel with access limited to the responsible receiving team.',good:true,feedback:'The information reaches the people who need it through an accountable channel. Local authorization and procedure still govern real sharing.',delta:[1,0,2,0]},
        {text:'Post the full record to a broad chat and delete it after acknowledgment.',feedback:'Deleting later does not undo exposure. Use the designated channel and limit access.',delta:[0,0,-2,0]},
        {text:'Do not send any information, even through the designated channel.',feedback:'Privacy includes appropriate protection while enabling authorized care coordination. Follow the governing workflow.',delta:[-2,0,0,0]}
      ],sources:['NPC']},
      {stage:'Exchange',prompt:'The referral left the RHU. What indicates that the handoff actually reached the intended service?',context:'This is a simulated information flow; no live systems are connected.',hint:'Sending is different from receiving and acting.',options:[
        {text:'An acknowledgment with a status and a route for follow-up.',good:true,feedback:'An acknowledgment gives the origin a known state. It can then act if the request is accepted, redirected, or declined.',delta:[2,0,0,1]},
        {text:'A “sent” icon on the RHU screen.',feedback:'A sent icon confirms a local action, not the receiving service’s acknowledgment.',delta:[-1,0,0,0]},
        {text:'A copy in a spreadsheet with no receiving status.',feedback:'A local copy can support a log, but it cannot establish that the recipient received or acted on the referral.',delta:[-1,0,0,0]}
      ],sources:['OHIE']},
      {stage:'Return',prompt:'Hillview accepts the referral and later completes the encounter. What closes the information loop?',context:'The RHU must know the outcome and any follow-up it owns.',hint:'What should come back to the point of care?',options:[
        {text:'Return the referral status, relevant outcome, and follow-up responsibility to the RHU.',good:true,feedback:'The originating team can continue care and confirm who will do the next action.',delta:[2,1,0,1]},
        {text:'Keep the outcome only at Hillview; the referral is already complete.',feedback:'Care can remain fragmented if the originating team never receives the outcome.',delta:[-2,0,0,-1]},
        {text:'Wait for Ana to repeat the full story at the next RHU visit.',feedback:'The person should not have to be the sole messenger between services.',delta:[-2,0,0,0]}
      ],sources:['OHIE','TALK']},
      {stage:'Use',prompt:'Several referrals lack receiving status this month. What is the most useful management response?',context:'A supervisor reviews aggregate counts, not identifiable case details on a public dashboard.',hint:'Find the handoff that needs an owner and a measure.',options:[
        {text:'Compare sent and acknowledged counts, assign a follow-up owner, and review the gap next month.',good:true,feedback:'The team turns routine data into a specific workflow improvement and a measure of whether it worked.',delta:[0,1,0,2]},
        {text:'Publish the names of patients with missing status to encourage action.',feedback:'A public identifiable list creates unnecessary disclosure. Use authorized worklists and aggregate management views.',delta:[0,0,-2,-1]},
        {text:'Report only the total sent and ignore missing responses.',feedback:'The total sent hides whether care coordination reached a conclusion.',delta:[-1,0,0,-2]}
      ],sources:['WHO-USE','NPC','TALK']}
    ],debrief:'The referral became useful when identity, relevant context, a governed route, acknowledgment, and a returned outcome stayed connected.'
  },
  {
    id:'redirect',title:'The redirected request',eyebrow:'Clinic → network service',role:'Network coordinator',duration:'3–5 min',
    intro:'A request reaches a facility that cannot provide the service today. Keep the patient journey visible.',
    record:[['Person','Patient B · fictional'],['Origin','Eastfield Clinic · fictional'],['Request','Specialist assessment'],['Problem','The first receiving facility redirects the request.']],
    steps:[
      {stage:'Capture',prompt:'Two clinic entries use different service labels for the same requested assessment. Where should the team start?',context:'The request is still being prepared.',hint:'Agree on meaning before routing.',options:[
        {text:'Check the requested service against the shared local definition and correct the ambiguous label.',good:true,feedback:'A consistent definition helps the next team understand and route the request.',delta:[1,2,0,0]},
        {text:'Keep both labels and hope the receiver interprets them.',feedback:'Ambiguity can send the request to the wrong service. Clarify the meaning at source.',delta:[-1,-2,0,0]},
        {text:'Delete the service field altogether.',feedback:'The receiving team then has less information to route the request.',delta:[-1,-1,0,0]}
      ],sources:['WHO-DQA','OHIE']},
      {stage:'Check',prompt:'What should accompany the request?',context:'The coordinator needs to route it without revealing unrelated records.',hint:'Only relevant information needed for this purpose.',options:[
        {text:'Verified identity reference, reason, urgency, requested service, relevant summary, and response route.',good:true,feedback:'The packet is compact but actionable for the receiving team.',delta:[1,2,1,0]},
        {text:'The entire clinic archive, just in case.',feedback:'Unrelated records add exposure and noise. Choose relevant context.',delta:[0,-1,-2,0]},
        {text:'Only a first name and “please advise.”',feedback:'That is too little to resolve the request safely.',delta:[-2,-1,0,0]}
      ],sources:['NPC','WHO-DQA']},
      {stage:'Protect',prompt:'The coordinator is away. Who should see the request?',context:'The network has a documented backup role in this fictional workflow.',hint:'A role with responsibility, not an open audience.',options:[
        {text:'The authorized backup coordinator through the approved queue.',good:true,feedback:'A documented backup allows continuity with controlled access.',delta:[1,0,2,0]},
        {text:'Everyone in the regional staff mailing list.',feedback:'A broad list exceeds the purpose of this handoff.',delta:[0,0,-2,0]},
        {text:'Nobody until the first coordinator returns next week.',feedback:'A documented backup exists for continuity; use the authorized route.',delta:[-2,0,0,0]}
      ],sources:['NPC']},
      {stage:'Exchange',prompt:'The first facility cannot accept the request. What status must the origin receive?',context:'A redirect can be useful only when the next destination and responsibility are clear.',hint:'A redirect is a status, not a silent disappearance.',options:[
        {text:'Redirected, with the reason, new destination, and named team responsible for the next handoff.',good:true,feedback:'The origin can see where the request goes and who owns the next step.',delta:[2,0,0,1]},
        {text:'Mark “sent” again without a destination or owner.',feedback:'The request can vanish between facilities. Record the new route and responsibility.',delta:[-2,0,0,0]},
        {text:'Delete the first request and start over without history.',feedback:'Removing the earlier state loses the trace of the handoff.',delta:[-1,-1,0,0]}
      ],sources:['OHIE','TALK']},
      {stage:'Return',prompt:'The second service accepts the request. What should the clinic see?',context:'The clinic still has a duty to coordinate the person’s next steps.',hint:'Status, next action, and owner.',options:[
        {text:'Acceptance and next-step details in the authorized clinic workflow.',good:true,feedback:'The clinic can inform the patient and confirm that the request has a destination.',delta:[2,0,1,1]},
        {text:'Only the first facility’s redirect notice.',feedback:'The clinic still does not know if the second service accepted.',delta:[-2,0,0,0]},
        {text:'Nothing until a quarterly report arrives.',feedback:'A delayed aggregate report cannot guide this individual handoff.',delta:[-2,0,0,0]}
      ],sources:['TALK']},
      {stage:'Use',prompt:'Redirects rise across the network. Which question should managers investigate first?',context:'The dashboard contains aggregate counts by service and destination.',hint:'Ask whether definitions, capacity, or routing have changed.',options:[
        {text:'Compare redirect reasons and destinations, then review service definitions and capacity with owners.',good:true,feedback:'The aggregate pattern becomes a testable operational question.',delta:[0,1,0,2]},
        {text:'Call every redirect a staff error.',feedback:'The pattern may reflect capacity or unclear routing. Investigate before assigning cause.',delta:[0,0,0,-2]},
        {text:'Hide redirects from the monthly report.',feedback:'That removes useful evidence of a network bottleneck.',delta:[0,-1,0,-2]}
      ],sources:['WHO-USE']}
    ],debrief:'A redirect is part of a continuous journey only when status, destination, responsibility, and acceptance are visible to the originating team.'
  },
  {
    id:'manager',title:'The missing denominator',eyebrow:'Facility records → local decision',role:'Program manager',duration:'3–5 min',
    intro:'A dashboard shows activity, but is the count complete enough to guide action?',
    record:[['Setting','Three fictional local facilities'],['Consultations recorded','300 in EMR'],['Consultations on facility log','600'],['Problem','A headline claims “300 consultations delivered.”']],
    steps:[
      {stage:'Capture',prompt:'The log has 600 consultations while the EMR has 300. What is the first honest interpretation?',context:'The figures are illustrative and are not an official assessment calculation.',hint:'Ask which consultations are in the denominator.',options:[
        {text:'Only half of logged consultations appear in the EMR; investigate the recording gap.',good:true,feedback:'300 ÷ 600 = 50% in this fictional example. The gap needs a workflow check before interpreting service trends.',delta:[0,2,0,2]},
        {text:'The EMR proves the facility delivered only 300 consultations.',feedback:'The facility log shows more activity. A digital count alone is not the whole service picture.',delta:[0,-2,0,-2]},
        {text:'Add both figures and report 900 consultations.',feedback:'That likely double counts visits appearing in both sources.',delta:[0,-2,0,-2]}
      ],sources:['WHO-DQA','TALK']},
      {stage:'Check',prompt:'What check best locates the gap?',context:'Staff can compare source totals by week without circulating patient names.',hint:'Start with the smallest safe comparison that reveals a pattern.',options:[
        {text:'Reconcile weekly aggregate totals and investigate where the counts diverge.',good:true,feedback:'The team can locate the period and workflow before reviewing any authorized case level detail.',delta:[0,2,1,1]},
        {text:'Publish the whole named patient list to all managers.',feedback:'A broad named list is unnecessary for the initial aggregate check.',delta:[0,0,-2,0]},
        {text:'Change the dashboard number to match the paper log without checking.',feedback:'An unexplained overwrite hides the cause and weakens trust.',delta:[0,-2,0,0]}
      ],sources:['WHO-DQA','NPC']},
      {stage:'Protect',prompt:'A public meeting needs a progress chart. Which view is appropriate?',context:'The meeting discusses facility level service capture, not individual care.',hint:'Use only the detail required for the management purpose.',options:[
        {text:'Show aggregated facility trends and explain the known data quality limitation.',good:true,feedback:'The chart supports discussion without exposing identifiable records or overstating certainty.',delta:[0,1,2,2]},
        {text:'Show full names and encounter notes to prove the count.',feedback:'Identifiable details are not needed for this public management discussion.',delta:[0,0,-2,0]},
        {text:'Show the chart as complete without mentioning the gap.',feedback:'The audience may treat an incomplete count as the whole picture.',delta:[0,-1,0,-2]}
      ],sources:['NPC','WHO-USE']},
      {stage:'Exchange',prompt:'A second facility uses “visit” while the first uses “consultation.” What must happen before combining their totals?',context:'The two labels may represent different units of counting.',hint:'Same meaning before same chart.',options:[
        {text:'Agree on definitions and counting rules, then map or separate the figures transparently.',good:true,feedback:'Comparable definitions are needed before combining counts.',delta:[0,2,0,2]},
        {text:'Combine them because the numbers are both monthly.',feedback:'Matching dates do not make different measures equivalent.',delta:[0,-2,0,-2]},
        {text:'Drop the second facility without documenting why.',feedback:'That creates a hidden coverage gap. Document definitions and exclusions.',delta:[0,-1,0,-1]}
      ],sources:['WHO-DQA']},
      {stage:'Return',prompt:'The team finds that the EMR queue stalls when connectivity fails. What should return to frontline staff?',context:'A useful feedback loop helps the people who enter and use the information.',hint:'A repair step, owner, and feedback about whether it worked.',options:[
        {text:'A documented downtime and reconciliation process, with an owner and a weekly gap review.',good:true,feedback:'The team can recover missing entries and see whether the fix reduces the gap.',delta:[1,1,0,2]},
        {text:'A warning that low counts are the staff’s fault.',feedback:'Blame does not repair the queue or the workflow.',delta:[0,0,0,-2]},
        {text:'No feedback; the dashboard belongs only to managers.',feedback:'Frontline feedback is part of making routine data useful and reliable.',delta:[0,-1,0,-2]}
      ],sources:['WHO-USE','TALK']},
      {stage:'Use',prompt:'What is a useful 30-day measure for this fix?',context:'The baseline was 300 of 600 logged consultations encoded in the EMR.',hint:'Track both numerator and denominator over time.',options:[
        {text:'Weekly EMR encoded consultations divided by logged consultations, with exceptions reviewed.',good:true,feedback:'A repeated, defined measure lets the team see whether capture improves and where exceptions remain.',delta:[0,1,0,2]},
        {text:'Number of computers purchased.',feedback:'Equipment may help, but it does not show whether consultations are actually captured.',delta:[0,0,0,-1]},
        {text:'A single photo of the dashboard.',feedback:'A snapshot cannot show the change over time or the denominator.',delta:[0,0,0,-1]}
      ],sources:['WHO-USE','TALK']}
    ],debrief:'Useful management data needs clear definitions, a known denominator, a privacy appropriate view, and feedback that helps the frontline improve the workflow.'
  }
];
