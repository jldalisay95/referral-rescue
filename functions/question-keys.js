// Test copy of the authoritative answer keys. The deployed copy stays in the
// Supabase Edge Function and is never sent to participants before reveal.
const explanations={
 'ana-capture':'Verify the right record while context is available, then make a traceable correction.',
 'ana-check':'A concise, purposeful referral gives the next team enough context to act.',
 'ana-protect':'Use an accountable route with access limited to people responsible for the handoff.',
 'ana-exchange':'Sending is different from receiving and acting; acknowledgment gives the origin a known state.',
 'ana-return':'The originating team needs the outcome and next responsibility to continue the journey.',
 'ana-use':'Turn routine aggregate data into a specific workflow improvement and a measure.',
 'redirect-capture':'Agree on meaning before routing so the next team can understand the request.',
 'redirect-check':'Send the relevant minimum needed for the receiving team to act.',
 'redirect-protect':'A documented backup role supports continuity with controlled access.',
 'redirect-exchange':'A redirect is useful when the new route and responsibility remain visible.',
 'redirect-return':'The originating team needs enough status to coordinate the next step.',
 'redirect-use':'Use aggregate patterns to form a testable operational question before assigning blame.',
 'manager-capture':'Locate the capture gap before choosing which source to trust.',
 'manager-check':'Comparable definitions and denominators are needed before interpreting a difference.',
 'manager-protect':'Investigate gaps with the least identifiable detail and the right access.',
 'manager-exchange':'A useful management handoff makes the measure, period, responsibility, and action visible.',
 'manager-return':'Feedback should give staff a repair process, owner, and way to see whether it worked.',
 'manager-use':'A repeated measure with a denominator shows whether capture improves and where exceptions remain.',
 'synthesis-identity':'Reliable identity comes before purposeful, minimum-necessary exchange.',
 'synthesis-minimum':'Use the relevant minimum that lets the next team act and respond.',
 'synthesis-governed':'Accountability connects protection with a known recipient and a visible next action.',
 'synthesis-ack':'Acknowledgment confirms a handoff state; it does not by itself mean the journey is complete.',
 'synthesis-return':'The loop returns useful action, not merely a copy or an aggregate headline.',
 'synthesis-use':'Management use connects a trustworthy measure to an owner, action, and review.'
};
const ids=Object.keys(explanations);
const correctIndexes={
 'ana-check':2,'ana-protect':1,'ana-exchange':1,'ana-return':1,'ana-use':1,
 'redirect-check':2,'redirect-protect':1,'redirect-exchange':1,'redirect-use':1,
 'manager-protect':1,'manager-exchange':1,'manager-use':1,
 'synthesis-governed':1,'synthesis-return':1,'synthesis-use':1
};
module.exports=Object.fromEntries(ids.map(id=>[id,{correctIndex:correctIndexes[id]??0,explanation:explanations[id]}]));
