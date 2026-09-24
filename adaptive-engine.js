(function (root) {
  'use strict';

  const SESSION_LENGTH = 6;
  const challenges = [
    { id: 'build-3-4', type: 'build', skill: 'equalGroups', total: 12, rows: 3, columns: 4, difficulty: 1 },
    { id: 'build-5-3', type: 'build', skill: 'equalGroups', total: 15, rows: 5, columns: 3, difficulty: 2 },
    { id: 'split-6-7', type: 'split', skill: 'decomposition', rows: 6, columns: 7, anchor: 5, difficulty: 3 },
    { id: 'split-7-6', type: 'split', skill: 'decomposition', rows: 7, columns: 6, anchor: 5, difficulty: 4 },
    { id: 'inverse-24-4', type: 'inverse', skill: 'inverseRelationship', rows: 4, columns: 6, total: 24, difficulty: 3 },
    { id: 'mixed-8-6', type: 'mixed', skill: 'decomposition', rows: 8, columns: 6, anchor: 5, difficulty: 5 },
  ];

  const challengeFamilies = {
    equalGroups:{skill:'equalGroups',difficultyRange:[1,2],allowedFactors:[[3,4],[5,3]],anchors:[],representation:'token-sharing',scaffoldOptions:['equal-row-count'],transferEligible:false},
    inverse:{skill:'inverseRelationship',difficultyRange:[3,3],allowedFactors:[[4,6]],anchors:[],representation:'equal-distribution',scaffoldOptions:['one-per-group'],transferEligible:false},
    decompositionUsing5:{skill:'decomposition',difficultyRange:[3,5],allowedFactors:[[6,7],[7,6],[8,6],[7,8]],anchors:[5],representation:'split-array',scaffoldOptions:['skip_count'],transferEligible:true},
    decompositionUsing10:{skill:'decomposition',difficultyRange:[6,6],allowedFactors:[[12,4]],anchors:[10],representation:'split-array',scaffoldOptions:['skip_count'],transferEligible:true},
    mixedTransfer:{skill:'nearTransfer',difficultyRange:[5,6],allowedFactors:[[8,7],[9,6]],anchors:[5],representation:'partitioned-area',scaffoldOptions:['area-relation'],transferEligible:true}
  };
  challenges.forEach(c=>Object.assign(c,{family:c.type==='build'?'equalGroups':c.type==='inverse'?'inverse':'decompositionUsing5',representation:c.type==='build'?'token-sharing':c.type==='inverse'?'equal-distribution':'split-array',transferEligible:['split','mixed'].includes(c.type)}));
  const verifiedPool = [...challenges,
    {id:'build-4-5',type:'build',skill:'equalGroups',rows:4,columns:5,total:20,difficulty:2,family:'equalGroups',representation:'token-sharing',transferEligible:false},
    {id:'build-2-4',type:'build',skill:'equalGroups',rows:2,columns:4,total:8,difficulty:1,family:'equalGroups',representation:'token-sharing',transferEligible:false},
    {id:'inverse-20-4',type:'inverse',skill:'inverseRelationship',rows:4,columns:5,total:20,difficulty:2,family:'inverse',representation:'equal-distribution',transferEligible:false},
    {id:'inverse-28-4',type:'inverse',skill:'inverseRelationship',rows:4,columns:7,total:28,difficulty:4,family:'inverse',representation:'equal-distribution',transferEligible:false},
    {id:'split-6-4',type:'split',skill:'decomposition',rows:6,columns:4,anchor:5,difficulty:2,family:'decompositionUsing5',representation:'split-array',transferEligible:true},
    {id:'split-9-4',type:'split',skill:'decomposition',rows:9,columns:4,anchor:5,difficulty:4,family:'decompositionUsing5',representation:'split-array',transferEligible:true},
    {id:'split-7-8',type:'split',skill:'decomposition',rows:7,columns:8,anchor:5,difficulty:5,family:'decompositionUsing5',representation:'split-array',transferEligible:true},
    {id:'split-12-4',type:'split',skill:'decomposition',rows:12,columns:4,anchor:10,difficulty:6,family:'decompositionUsing10',representation:'split-array',transferEligible:true}
  ];
  verifiedPool.forEach(c=>{const f=challengeFamilies[c.family];if(!f.allowedFactors.some(([r,k])=>r===c.rows&&k===c.columns))f.allowedFactors.push([c.rows,c.columns]);f.difficultyRange=[Math.min(f.difficultyRange[0],c.difficulty),Math.max(f.difficultyRange[1],c.difficulty)];});
  challengeFamilies.mixedTransfer.allowedFactors=[[8,7],[9,6],[9,7],[8,8]];
  function selectTransfer(history) {
    const [rows,columns]=[[8,7],[9,6],[9,7],[8,8]].find(([r,c])=>!history.some(h=>h.factors?.[0]===r&&h.factors?.[1]===c||h.factors?.[0]===c&&h.factors?.[1]===r))||[9,7];
    return {id:`transfer-${rows}-${columns}`,rows,columns,choices:[
      {id:'rows',valid:true,label:`5 × ${columns} + ${rows-5} × ${columns}`,parts:[5,rows-5],facts:[`5 × ${columns}`,`${rows-5} × ${columns}`],products:[5*columns,(rows-5)*columns]},
      {id:'columns',valid:true,label:`${rows} × 5 + ${rows} × ${columns-5}`,parts:[5,columns-5],facts:[`${rows} × 5`,`${rows} × ${columns-5}`],products:[rows*5,rows*(columns-5)]},
      {id:'addition',valid:false,label:`${rows} + ${columns}`}
    ]};
  }
  function recordTransfer(state,result) {
    return {...createLearnerState(state),transferObserved:true,nearTransfer:result.transferIndependent?1:result.nearTransferSuccess?.4:0};
  }
  function createLearnerState(previous = {}) {
    return { productRecall: 0, equalGroups: 0, arrayConstruction: 0, decomposition: 0, inverseRelationship: 0, attempts: 0, hintUsage: 0, decompositionUsing5:0, decompositionUsing10:0, supportDependence:0, selfCorrection:0, nearTransfer:0, transferObserved:false, completedChallenges:0, ...previous };
  }

  // This boundary can later be replaced by a recommendation service.
  // Time is deliberately absent from this policy and all mastery updates.
  function selectNextChallenge(learnerState, history) {
    if(history.length>=SESSION_LENGTH)return null;
    if(!history.length&&learnerState.transferObserved){
      const variant=learnerState.nearTransfer<1?verifiedPool.find(c=>c.id==='split-7-8'):learnerState.decompositionUsing5>=2?verifiedPool.find(c=>c.id==='split-12-4'):null;
      if(variant)return {...variant,support:learnerState.nearTransfer<1,policy:learnerState.nearTransfer<1?'alternate-after-transfer':'extend-anchor-to-ten',reason:learnerState.nearTransfer<1?'Transfer needs another representation; connect a new array to its parts':'Independent five-anchor evidence; explore a ten-anchor'};
    }
    const remaining = challenges.filter(c => !history.some(h => h.challengeId === c.id));
    if (!remaining.length) return null;
    if (!history.length) return { ...remaining[0], support: false, policy: 'start-with-equal-groups' };
    const last = history[history.length - 1];
    const sameSkillHistory = history.filter(h => h.skill === last.skill).slice(-2);
    const needsAnchor = last.highestScaffoldLevel >= 2 ||
      (sameSkillHistory.length === 2 && sameSkillHistory.every(h => !h.independentSuccess));
    const lastDifficulty = verifiedPool.find(c=>c.id===last.challengeId)?.difficulty||1;
    const recovery=verifiedPool.filter(c=>c.skill===last.skill&&!history.some(h=>h.challengeId===c.id)&&c.difficulty<=lastDifficulty).sort((a,b)=>b.difficulty-a.difficulty);
    if((last.highestScaffoldLevel>=2||last.selfCorrected||last.finalSuccess===false)&&recovery.length){return {...recovery[0],support:true,policy:last.highestScaffoldLevel>=2?'scaffold-same-skill-transfer':'consolidate-after-correction',reason:'Previous response needed correction or scaffold; consolidate without increasing difficulty'};}
    if(last.hintCount>0&&recovery.length)return {...recovery[0],support:true,policy:'practice-same-skill',reason:'Hint-supported success; change the numbers at the same or lower difficulty'};
    const similar = remaining.filter(c => c.skill === last.skill);
    if ((last.hintCount > 0 || needsAnchor) && similar.length) {
      return { ...similar[0], support:true, policy:needsAnchor ? 'scaffold-same-skill-transfer' : 'practice-same-skill' };
    }
    const inverse = remaining.find(c => c.type === 'inverse');
    if (learnerState.equalGroups >= 2 && learnerState.inverseRelationship === 0 && inverse) {
      return { ...inverse, support:false, policy:'connect-multiplication-to-division' };
    }
    if(learnerState.productRecall>=2&&learnerState.decomposition<1){const strategy=remaining.find(c=>c.skill==='decomposition');if(strategy)return {...strategy,support:true,policy:'prioritize-decomposition-process'};}
    const fluent = history.length >= 2 && history.slice(-2).every(h => h.independentSuccess && h.hintCount === 0 && h.highestScaffoldLevel === 0);
    if(fluent&&last.skill==='decomposition'&&learnerState.decompositionUsing5>=2&&!history.some(h=>h.challengeId==='split-12-4'))return {...verifiedPool.find(c=>c.id==='split-12-4'),support:false,policy:'extend-anchor-to-ten',reason:'Independent five-anchor success; test a different known fact'};
    if(last.skill==='inverseRelationship'&&last.independentSuccess&&!last.hintCount&&!last.highestScaffoldLevel&&!fluent&&!history.some(h=>h.challengeId==='inverse-28-4'))return {...verifiedPool.find(c=>c.id==='inverse-28-4'),support:false,policy:'vary-independent-inverse',reason:'Independent equal sharing; apply the connection to a new quotient'};
    const next = fluent ? remaining.find(c => c.difficulty > lastDifficulty && c.difficulty <= lastDifficulty + 1) : null;
    return { ...(next || remaining[0]), support: needsAnchor, policy: next ? 'increase-complexity' : needsAnchor ? 'offer-anchor' : 'steady-practice' };
  }

  function recordCompletion(learnerState, result) {
    const next = createLearnerState(learnerState);
    const independent = result.independentSuccess && result.hintCount === 0 && result.highestScaffoldLevel === 0;
    const gain = independent ? 1 : result.highestScaffoldLevel >= 2 ? 0.2 : 0.5;
    if (result.finalSuccess) {
      next[result.skill] = (next[result.skill] || 0) + gain;
      if (result.skill === 'equalGroups') next.arrayConstruction += gain;
      if (result.skill === 'inverseRelationship') next.equalGroups += gain;
      // Only submitted subfacts give product-recall evidence. An auto-generated
      // final product is never credited as independently recalled multiplication.
      if (result.subfactAccuracy !== null && result.subfactAccuracy !== undefined) {
        next.productRecall += result.subfactAccuracy * (independent ? 1 : 0.25);
      }
    }
    if(result.finalSuccess&&result.skill==='decomposition') {
      const anchor=result.selectedSplitStrategy?.includes(10)?'decompositionUsing10':result.selectedSplitStrategy?.includes(5)?'decompositionUsing5':null;
      if(anchor)next[anchor]+=gain;
    }
    next.supportDependence = (next.supportDependence * (next.completedChallenges||0) + Number(Boolean(result.hintCount||result.supportUsed||result.highestScaffoldLevel))) / ((next.completedChallenges||0)+1);
    next.completedChallenges++;
    if(result.selfCorrected)next.selfCorrection+=1;
    next.attempts += result.attemptCount;
    next.hintUsage += result.hintCount;
    return next;
  }

  const api = { SESSION_LENGTH, challengeFamilies, verifiedPool, selectTransfer, recordTransfer, challenges, createLearnerState, selectNextChallenge, recordCompletion, evidenceStatus: 'pending' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ArrayArchitectsEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
