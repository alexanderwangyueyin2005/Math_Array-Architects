(function(root) {
  'use strict';
  const motion = Object.freeze({MOTION_FAST:200,MOTION_NORMAL:340,MOTION_MATH:800,STAGGER_SHORT:300,JOIN_HOLD:600,EQUATION_HOLD:400,IDLE_CUE:2500,CUE_DURATION:900,MATH_REVEAL:420,RESULT_HOLD:550,EQUATION_REVEAL:550,TOKEN_LIFT:120,TOKEN_TRAVEL:620,TOKEN_SETTLE:180,MOTION_EASE:'cubic-bezier(.22,.61,.36,1)'});
  const baseLearner = () => ({attempts:0,hintUsage:0,supportDependence:0,selfCorrection:0,nearTransfer:0});
  let visualId=0;
  const glyph = (state='neutral') => {
    state=['neutral','notice','attention','hint','complete'].includes(state)?state:'neutral';
    const id=`lg-${++visualId}`;
    return `<span class="guide-mark core-glyph ribbon-glyph" data-glyph="${state}" aria-hidden="true"><svg viewBox="0 0 100 116" focusable="false"><defs><linearGradient id="${id}-forest" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6E8975"/><stop offset=".4" stop-color="#355448"/><stop offset="1" stop-color="#233D34"/></linearGradient><linearGradient id="${id}-sage" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#C4CBB5"/><stop offset=".55" stop-color="#9CA98C"/><stop offset="1" stop-color="#78866F"/></linearGradient><linearGradient id="${id}-face" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#DCD9C8"/><stop offset=".4" stop-color="#FAF8EF"/><stop offset="1" stop-color="#E6E2D3"/></linearGradient></defs><ellipse class="glyph-shadow" cx="49" cy="108" rx="24" ry="3" fill="#2F4A3B" opacity=".12"/><g class="glyph-body"><path d="M19 47C18 69 43 77 69 92L79 70 60 51Z" fill="url(#${id}-forest)"/><path d="M18 45C19 24 39 23 63 39L87 39C77 56 65 65 44 65 25 65 18 57 18 45Z" fill="url(#${id}-face)"/><path d="M18 48C6 30 17 7 33 6 52 4 67 33 94 30 83 43 67 45 49 36 29 26 17 31 18 48Z" fill="url(#${id}-forest)"/><path d="M18 48C15 29 29 27 49 36" fill="none" stroke="#B7AA7F" stroke-width=".9"/><path d="M64 60C82 63 89 78 84 86 78 97 49 101 43 109 33 96 48 82 58 70 63 64 63 62 64 60Z" fill="url(#${id}-sage)"/><path d="M64 60C65 75 32 95 43 109" fill="none" stroke="#BEAE7F" stroke-width="1"/><g class="glyph-eyes" fill="#263F35"><ellipse cx="34" cy="48" rx="2" ry="3.6"/><ellipse cx="48" cy="49" rx="2" ry="3.6"/></g><g class="glyph-smile" fill="none" stroke="#263F35" stroke-width="2" stroke-linecap="round"><path d="M31 49q3-6 6 0M45 49q3-6 6 0"/></g></g><g class="glyph-marks" stroke="#B89B64" stroke-width="2" stroke-linecap="round"><path d="M79 14l3-7M87 20l7-4"/></g><path class="glyph-spark" d="M86 43q0-7 5-8-5-1-5-8-1 7-6 8 5 1 6 8Z" fill="#B89B64"/></svg></span>`;
  };
  const icon = (name='hint') => `<svg class="ui-icon" viewBox="0 0 20 20" aria-hidden="true">${name==='hint'?'<path d="M7 13c0-2-2-2.5-2-5a5 5 0 0 1 10 0c0 2.5-2 3-2 5M7 14h6M8 17h4"/>':'<path d="m4 10 4 4 8-8"/>'}</svg>`;
  const nodeShapes=['M13 4H35Q44 4 44 14V34Q44 44 34 44H13Q4 44 4 34V14Q4 4 13 4Z','M24 3C52 3 52 45 24 45S-4 3 24 3Z','M15 4H33Q45 4 45 17V32Q45 44 33 44H15Q3 44 3 32V17Q3 4 15 4Z','M18 7Q24-2 30 7L44 34Q48 44 36 44H12Q0 44 4 34Z','M13 4H35Q44 4 44 14V34Q44 44 34 44H13Q4 44 4 34V14Q4 4 13 4Z','M15 4H33L45 24 33 44H15L3 24Z'];
  const progressRail = (count,total=6) => { const id=`journey-${++visualId}`; return `<div class="track material-journey" aria-hidden="true"><svg class="journey-path" viewBox="0 0 600 48" preserveAspectRatio="none"><path d="M20 25C90 25 90 13 150 18S230 33 300 24 390 15 450 24 530 31 580 24"/><path class="journey-flow" d="M20 25C90 25 90 13 150 18S230 33 300 24 390 15 450 24 530 31 580 24"/></svg>${Array.from({length:total},(_,i)=>`<i class="${i<count?'done':i===count?'current':''}" data-node="${i}"><svg class="node-shape" viewBox="0 0 48 48"><defs><linearGradient id="${id}-${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFFFFF" stop-opacity=".3"/><stop offset=".4" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#172D24" stop-opacity=".24"/></linearGradient></defs><path d="${nodeShapes[i%nodeShapes.length]}"/><path class="node-light" d="${nodeShapes[i%nodeShapes.length]}" fill="url(#${id}-${i})"/>${i===4?'<path class="node-seam" d="M24 5V43"/>':''}</svg><span class="node-status"></span></i>`).join('')}</div>`; };
  const styles = `    /* Logifera Intervention UI: shared presentation, scoped inside the game. */
    :host {
      --li-page:#F7FAFA; --li-surface:#FFFFFF; --li-blue:#356C92;
      --li-teal:#4D9692; --li-mint:#E5F3EF; --li-soft:#F0F6F8;
      --li-text:#243746; --li-muted:#5F7480; --li-border:#DDE8ED;
      --li-radius:14px; --li-space:16px;
      --aa-ink:var(--li-text); --aa-muted:var(--li-muted); --aa-accent:var(--li-blue);
      --aa-mint:var(--li-mint); --aa-line:var(--li-border);
      font-size:14px; line-height:1.5;
    }
    .card {border-color:var(--li-border);box-shadow:0 8px 28px #24374609;border-radius:20px}
    .top {height:68px;padding:12px 28px;border-color:var(--li-border)}
    .identity {gap:12px}.top h1 {font-size:17px;font-weight:650;letter-spacing:-.3px}
    .top .sub {font-size:12px;letter-spacing:.1px}.brand-logo {width:36px;height:36px}
    .header-context {display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.2px;text-transform:none;color:var(--li-blue);background:var(--li-soft);padding:6px 12px;border-radius:20px}
    .ui-icon {width:18px;height:18px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .progress {padding:12px 28px 10px;gap:8px;font-size:12px;border-bottom:1px solid var(--li-border)}
    .progress-label {font-weight:600;color:var(--li-blue)}
    .track {gap:5px}.track i {height:5px;border-radius:4px;background:#E7EEF2;transition:background 340ms ease}
    .track i.done {background:var(--li-teal)}.track i.current {background:#A8CDCA;box-shadow:inset 0 0 0 1px #4D969230}
    .content {padding:20px 28px 86px;gap:0}
    .content>.eyebrow,.eyebrow {font-size:11px;line-height:20px;letter-spacing:1.1px;font-weight:600;color:var(--li-blue)}
    .content>h2,h2 {font-size:26px;line-height:1.3;letter-spacing:-.5px;font-weight:600}
    .content>.lead,.intro-copy,.lead {font-size:14px;line-height:1.5;color:var(--li-muted)}
    .content>.lead {margin-bottom:12px}.intro-copy {max-width:640px!important;padding:0!important;align-self:center}
    .playground,.intro .playground {margin-top:8px;padding:32px 16px 12px;border-radius:var(--li-radius);border-color:var(--li-border);background:#FCFEFE;box-shadow:none}
    .playground-label {top:12px;left:18px;font-size:10px;letter-spacing:.8px;color:var(--li-muted)}
    .field-scroll {padding-top:12px}.array-caption {font-size:12px;line-height:22px}
    .pool-bed {background:var(--li-soft);border:1px solid var(--li-border);border-radius:14px;box-shadow:none}
    .lane-bed {border-bottom:1px dashed #BDCFD8;border-radius:0;background:transparent}
    .lane-label {color:var(--li-blue);font-weight:600}.pool-label,.field-label {font-size:10px;letter-spacing:.9px}
    .bead {background:linear-gradient(145deg,#82B9B4,#69A6A1);box-shadow:inset 0 1px 1px #ffffff22,inset 0 -1px 1px #24374612}
    .dot.second .bead {background:linear-gradient(145deg,#789FC1,#648BAD)}
    .dot.pooled .bead {background:linear-gradient(145deg,#ABC6D9,#92B4CC)}
    .dot:before {opacity:.32}.bead:before {opacity:.28}
    .lane-add {border:1.5px dashed #76ABA8;background:var(--li-mint);color:var(--li-blue);box-shadow:none}
    .cut,.cut.recommended {border-color:var(--li-teal)}.cut:before,.cut.recommended:before {background:var(--li-mint);border-color:#A8CDCA;color:var(--li-teal)}
    .cut span,.cut.recommended span {background:var(--li-mint);border-color:#A8CDCA;color:var(--li-blue);border-radius:6px;font-size:11px}
    .reasoning {flex:none;min-height:0}.reasoning>.relation {padding:10px 12px;min-height:46px}
    .relation strong,.join-equation {font-size:28px;font-weight:600;letter-spacing:-.5px}
    .relation .part {background:var(--li-mint);color:#315F58;border:1px solid #D2E7E0;border-radius:10px;padding:7px 12px;font-size:17px;box-shadow:none}
    .relation .part.blue {background:#EAF1F8;color:var(--li-blue);border-color:#D7E3ED}
    [data-work] {max-height:none;overflow:visible}.quiet {font-size:13px;line-height:1.5}
    .subfacts {width:100%;max-width:780px;gap:12px;margin:6px auto 0}
    .subfact,.subfact.blue {padding:12px;border:1px solid #D2E7E0;border-top:3px solid var(--li-teal);border-radius:12px;background:#F5FAF8}
    .subfact.blue {background:#F4F8FC;border-color:#D7E3ED;border-top-color:#648BAD}
    .subfact label {font-size:18px;gap:8px}.subfact input,input {background:white;border:1px solid #AAC1CF;border-radius:9px;height:40px;font-size:22px;box-shadow:none;color:var(--li-text)}
    input:disabled {background:#FFFFFFAA;border-color:var(--li-border);color:var(--li-text)}
    .support-link {font-size:12px;color:var(--li-blue);border:0;text-decoration:underline;text-underline-offset:4px;margin-top:4px;padding:6px 0;min-height:32px}
    .support-live:empty {margin:0;padding:0}.support-live {border-radius:8px;background:var(--li-soft);color:var(--li-blue);line-height:1.5}
    .field-feedback,.feedback,.transfer-note {border:1px solid transparent;border-radius:10px;padding:10px 12px;font-size:13px;line-height:1.5;margin:8px 0 0;text-align:left}
    .feedback,.positive,.transfer-note.transfer-success {background:var(--li-mint);color:#315F58;border-color:#D2E7E0}
    .feedback:before {width:24px;height:24px;border-radius:50%;background:var(--li-teal);color:white;font-size:14px;margin-right:10px}
    .warning,.transfer-note:not(.transfer-success) {background:#FFF6ED;color:#805C34;border-color:#F0E2D2}
    .actions,.intro .actions {height:72px;min-height:72px;padding:12px 28px;background:white;border-top:1px solid var(--li-border)}
    .primary,.secondary,.text-button,.choice {min-height:44px;font-size:14px;font-weight:600;padding:10px 20px;border-radius:10px;text-decoration:none;box-shadow:none}
    .primary {background:var(--li-blue);border-color:var(--li-blue);min-width:148px}.primary:hover:not(:disabled) {background:#2F5D7C}
    .secondary,.text-button {background:white;border:1px solid #CADCE5;color:var(--li-blue)}
    .secondary:hover:not(:disabled),.text-button:hover:not(:disabled) {background:var(--li-soft)}
    .text-button {display:inline-flex;gap:9px;align-items:center}.text-button:before {content:none}.text-button .core-glyph {margin:0;width:22px;height:22px}
    .primary:active:not(:disabled),.secondary:active:not(:disabled),.text-button:active:not(:disabled) {translate:0 1px;box-shadow:none}
    .primary:disabled,.secondary:disabled,.text-button:disabled {opacity:1;color:var(--li-muted);background:#EDF2F4;border-color:var(--li-border);box-shadow:none}
    .stage-tool,[data-action="deal"],.control {background:var(--li-soft);color:var(--li-blue);border:1px solid #CADCE5;border-radius:10px;box-shadow:none}
    .stage-tool:active:not(:disabled) {translate:0 1px;box-shadow:none}.tool-teeth {border-color:var(--li-border)}.tool-teeth i {background:var(--li-teal)}
    .stepper button {color:var(--li-blue);background:white;border:1px solid var(--li-border);border-radius:8px}
    .count-chip {background:var(--li-soft)!important;color:var(--li-blue);border:1px solid var(--li-border);border-radius:6px}
    .part-tag strong {font-size:20px;line-height:1.1;padding-top:2px}
    .part-tag {color:#315F58;border-color:var(--li-teal)}.part-tag.blue {color:var(--li-blue);border-color:#648BAD}
    .strategy-choice {border:1px solid #CADCE5;border-radius:12px;background:white;color:var(--li-text);min-height:64px;box-shadow:none;font-size:17px}
    .strategy-choice[aria-pressed="true"] {background:var(--li-mint);border:2px solid var(--li-teal);padding:11px;box-shadow:none}
    .strategy-choice:disabled:not([aria-pressed="true"]) {opacity:1;color:var(--li-muted);background:#F7FAFB;border-color:var(--li-border)}
    .transfer-stage,.summary {max-width:800px}.transfer-fact {font-size:40px;font-weight:600;color:var(--li-blue)}
    .area-model>div {background:var(--li-mint);border-color:#D2E7E0}.area-model>div+div {background:#EAF1F8;border-color:#D7E3ED;color:var(--li-blue)}
    .summary h2,.transfer-stage h2 {font-size:28px}.check-list {border:1px solid var(--li-border);border-radius:14px;padding:4px 20px;background:#FCFEFE}
    .check-list li {font-size:14px;padding:12px 0}.check-list li:last-child {border-bottom:0}.check-list li:before {color:var(--li-teal)}
    .summary-mark {background:var(--li-mint);border-radius:18px;box-shadow:none}
    .resolved .playground {box-shadow:inset 0 0 0 1px #A8CDCA;transition:box-shadow 340ms ease}
    button:focus-visible,input:focus-visible {outline:3px solid var(--li-blue);outline-offset:3px}
    @media(min-width:1000px) and (min-height:650px) {
      .content[data-layout="split"] {display:grid;grid-template-columns:minmax(0,1.3fr) minmax(340px,.9fr);grid-template-rows:auto auto auto minmax(0,1fr);column-gap:24px}
      .content[data-layout="split"]>.eyebrow,.content[data-layout="split"]>h2,.content[data-layout="split"]>.lead {grid-column:1/-1}
      .content[data-layout="split"]>.playground {grid-column:1;grid-row:4;height:100%;margin:0}
      .content[data-layout="split"]>.reasoning {grid-column:2;grid-row:4;display:flex;flex-direction:column;justify-content:center;min-height:0;overflow:auto;border:1px solid var(--li-border);border-radius:14px;padding:20px;background:#FAFCFD;scrollbar-width:thin}
      .content[data-layout="split"].joining>.reasoning {overflow:visible}
      .content[data-layout="split"] .subfacts {grid-template-columns:1fr 1fr;gap:10px}
      .content[data-layout="split"] .subfact label {flex-wrap:wrap}.content[data-layout="split"] .subfact input {width:100%;max-width:100px;margin:4px auto 0}
      .content[data-layout="split"] .relation {gap:8px;padding:12px 0}.content[data-layout="split"] .relation .quiet {font-size:15px}
      .content[data-layout="split"] .reasoning>.relation {margin-bottom:12px}
    }
    @media(max-height:780px) {
      .top {height:60px}.progress {padding-top:8px;padding-bottom:8px}
      .content {padding-top:12px}.content>h2 {font-size:23px}.content>.lead {font-size:13px;margin-bottom:8px}
      .content>.eyebrow {margin-bottom:3px}.subfact {padding:8px}.field-feedback,.feedback {padding:7px 10px}
      .reasoning>.relation {min-height:36px;padding:6px 10px}.relation strong,.join-equation {font-size:25px}
    }
    @media(max-width:999px) {
      .reasoning {max-height:44%;overflow:auto;scrollbar-width:thin}.reasoning:has(.subfacts) {padding-bottom:3px}
      .content {padding-left:20px;padding-right:20px}.actions,.intro .actions {padding-left:20px;padding-right:20px}
    }
    @media(max-width:700px) {
      .header-context {font-size:11px;padding:5px 8px}.top {padding:10px 16px}.top h1 {font-size:15px}.header-context .ui-icon {width:15px;height:15px}
      .progress {padding-left:16px;padding-right:16px}.content {padding-left:16px;padding-right:16px}.primary {min-width:120px}
      .primary,.secondary,.text-button {padding:10px 14px}.actions .quiet {max-width:45%;font-size:11px}.content>h2 {font-size:22px}
      .strategy-choices {gap:8px}.strategy-choice {min-height:48px;font-size:15px}.transfer-fact {font-size:32px}
    }

.core-glyph[data-glyph="attention"]{rotate:6deg}.core-glyph[data-glyph="hint"]{border-radius:44% 48% 28% 46%;background:#EEF6F5}.core-glyph[data-glyph="complete"]{rotate:-5deg;background:#DCEEE8}.core-glyph[data-glyph="complete"]:after{height:2px;transform:rotate(-8deg)}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}`;
  const productStyles = `
    /* Visible presentation redesign: product shell > task workspace > reasoning. */
    :host {--li-blue:#38688C;--li-teal:#388D88;--li-mint:#E4F4EF;--li-text:#20364E;--li-border:#DFE9EF}
    .product-shell {display:flex;flex-direction:column;background:white;border-radius:24px;box-shadow:0 12px 42px #317A7510}
    .product-header.top {height:76px;flex:none;padding:16px 30px;gap:28px;border-bottom:1px solid var(--li-border)}
    .product-header .identity {width:172px;flex:none;gap:12px}.product-header h1 {font-size:23px;letter-spacing:-.6px;margin:0;color:#1F3653}
    .product-header .brand-logo {width:42px;height:42px;object-fit:contain;border-radius:0}
    .product-breadcrumb {font-size:14px;color:var(--li-muted);display:flex;align-items:center;gap:14px;flex:1}.product-breadcrumb strong {font-weight:550;color:var(--li-text)}
    .product-breadcrumb>span {color:#AFBFC9}.product-header .header-context {font-size:12px;color:var(--li-muted);background:none;padding:0;letter-spacing:0}
    .product-body {display:grid;grid-template-columns:180px minmax(0,1fr);min-height:0;flex:1}
    .session-rail {display:flex;flex-direction:column;align-items:flex-start;padding:28px 18px 22px;background:#F8FBFC;border-right:1px solid var(--li-border);min-height:0}
    .subject-mark {display:grid;grid-template-columns:repeat(2,8px);gap:4px;padding:14px;background:#DFF1EB;border-radius:14px;margin:0 0 10px 8px}
    .subject-mark i {width:8px;height:8px;background:var(--li-teal);border-radius:3px}.subject-name {font-size:18px;font-weight:650;margin-left:8px}.module-name {font-size:11px;color:var(--li-muted);margin:3px 0 22px 8px}
    .rail-label {font-size:9px;letter-spacing:1.5px;color:#6A8295;margin:8px 8px 12px;font-weight:650}
    .session-rail ol {list-style:none;margin:0;padding:0;width:100%;display:grid;gap:7px}
    .session-rail li {display:flex;align-items:center;gap:9px;padding:10px 8px;border-radius:10px;font-size:12px;color:#637C8F;line-height:1.3}
    .session-rail li.active {background:#DEF0EA;color:#246F69;font-weight:650}.journey-dot {display:grid;place-items:center;flex:none;width:23px;height:23px;font-size:11px;border:1px solid #CCDCE3;border-radius:50%;background:#FFF}
    .active .journey-dot {background:var(--li-teal);border-color:var(--li-teal);color:white}.complete .journey-dot {background:#E9F3EF;color:#438B7C;border-color:transparent}
    .rail-footer {margin-top:auto;padding:20px 8px 0;color:#6A8295;font-size:12px}.rail-footer p {line-height:1.65;margin:8px 0 0}.rail-flower .core-glyph {width:28px;height:30px;margin:0;background:#DFF1EB}
    .product-main {min-width:0;min-height:0;display:grid;grid-template-rows:72px minmax(0,1fr) 84px;position:relative;padding:0 28px;background:#FFFFFF}
    .session-progress {display:flex;align-items:center;gap:30px;min-width:0}
    .module-caption {font-size:15px;font-weight:600;color:var(--li-text);white-space:nowrap}.module-caption span {display:block;font-size:11px;font-weight:400;color:var(--li-muted);margin-top:2px}
    .session-progress .progress {display:grid;grid-template-columns:auto minmax(100px,1fr);align-items:center;gap:14px;flex:1;padding:0;border:0;background:none;font-size:12px}
    .session-progress .track {grid-column:auto;min-width:0;gap:5px}.session-progress .track i {height:7px;background:#E6EDF3}.session-progress .track i.done {background:#58A6A0}.session-progress .track i.current {background:#B0D6CF;box-shadow:none}
    .product-main .content,.product-main .content[data-layout="split"] {display:flex;flex-direction:column;min-height:0;padding:0;border:1px solid var(--li-border);border-radius:20px;background:#FFFFFF;overflow:hidden;gap:0}
    .task-header {flex:none;padding:26px 28px 22px;text-align:center}
    .task-header .eyebrow {font-size:10px;letter-spacing:1.6px;font-weight:650;line-height:18px;color:#527C98;margin:0 0 9px;min-height:18px}
    .task-header h2 {max-width:none;width:100%;text-align:center;font-size:clamp(28px,2.5vw,36px);font-weight:650;line-height:1.18;letter-spacing:-1px;color:#1F3553;margin:0 0 12px}
    .task-header .lead,.task-header .intro-copy {font-size:15px;line-height:1.5;margin:0 auto;max-width:720px!important;padding:0;color:#5B7188}
    .task-header .core-glyph {vertical-align:middle;width:22px;height:24px;margin-right:8px}
    .activity-workspace {display:grid;grid-template-columns:minmax(0,1.35fr) minmax(290px,1fr);gap:24px;flex:1;min-height:0;padding:0 24px 24px;align-items:stretch}
    .activity-workspace .playground,.intro .activity-workspace .playground {height:auto;min-height:0;width:100%;margin:0;padding:28px 8px 10px;border:1px solid #DCE8F0;border-radius:16px;background:#FFFFFF;box-shadow:none}
    .activity-workspace .playground-label {font-size:9px;letter-spacing:1.1px;top:13px;left:16px;color:#6A8295}
    .activity-workspace .field-scroll {min-height:0;padding:12px 34px 12px;overflow:auto}.array-caption {font-size:12px;color:#5B7188;line-height:22px;min-height:22px}
    .activity-workspace .reasoning {display:flex;flex-direction:column;justify-content:safe center;align-items:stretch;min-height:0;max-height:none;overflow:auto;padding:24px 20px;border:0;border-radius:16px;background:#F0F8F6;scrollbar-width:thin}
    .content.joining .activity-workspace .reasoning {overflow:visible}
    .reasoning-heading {text-align:center;margin:0 0 20px}.panel-kicker {display:block;font-size:9px;font-weight:650;letter-spacing:1.5px;color:#55817C;margin-bottom:8px}
    .reasoning-heading h3 {font-size:21px;font-weight:600;letter-spacing:-.4px;color:#264852;margin:0;line-height:1.3}.reasoning-heading p {font-size:13px;color:#5D7982;margin:12px 0 0;line-height:1.5}
    .activity-workspace .reasoning>.relation {min-height:52px;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;padding:12px 0;margin:0 0 14px;gap:9px;background:none;border:0}
    .reasoning .relation strong,.reasoning .join-equation {font-size:30px;font-weight:600;color:#254F69;letter-spacing:-.6px}
    .reasoning .relation .quiet {font-size:15px;line-height:1.5;color:#426676;max-width:240px}
    .reasoning .relation .part {background:#DFEDF9;border:0;border-radius:9px;color:#2D5980;padding:8px 12px;font-size:18px}.reasoning .relation .part.blue {background:#D8F0E8;color:#2D6D62;border:0}
    .reasoning [data-work] {flex:none;max-height:none;overflow:visible}.reasoning [data-work]>.quiet {font-size:13px;line-height:1.5;margin:0 0 8px;text-align:center;color:#5D7982}
    .support-surface {display:flex;align-items:flex-start;gap:12px;background:#FFFFFFD9;border:1px solid #DDEAE6;border-radius:12px;padding:14px;margin-top:20px;color:#4A707A;font-size:13px}
    .support-surface .ui-icon {width:22px;height:22px;margin-top:1px;color:#3F8C89}.support-surface p {margin:0;line-height:1.6}
    .reasoning:has(.subfacts) .support-surface {margin-top:16px}.reasoning:has(.feedback) .support-surface {margin-top:16px}
    .reasoning .subfacts,.content[data-layout="split"] .subfacts {grid-template-columns:1fr 1fr;width:100%;gap:12px;margin:0}
    .reasoning .subfact,.reasoning .subfact.blue {background:#DFEDF9;border:0;border-radius:12px;padding:14px 10px;min-width:0}
    .reasoning .subfact.blue {background:#D8F0E8}
    .reasoning .subfact label,.content[data-layout="split"] .subfact label {font-size:20px;display:flex;flex-wrap:wrap;gap:5px;justify-content:center;color:#294F72;font-weight:500;line-height:1.2}
    .reasoning .subfact.blue label {color:#2C685F}
    .reasoning .subfact input,.content[data-layout="split"] .subfact input {display:block;flex:0 0 100%;width:100%;max-width:100px;height:50px;margin:8px auto 0;font-size:30px;background:#FFFFFFBD;border:1px solid #ABC6DB;border-radius:9px;color:#234665}
    .reasoning .subfact.blue input {border-color:#9ECDBF;color:#2C685F}
    .reasoning .support-link {font-size:11px;margin-top:8px;line-height:1.4;color:#356B8A;min-height:30px;padding:2px}
    .reasoning .field-feedback {font-size:12px;line-height:1.4;padding:7px 8px;margin-top:8px}.reasoning .positive {background:#FFFFFF9E;border:0;color:#2E665B}
    .reasoning .feedback {font-size:14px;background:#DEF2E9;border:1px solid #BBDDD0;padding:14px;line-height:1.5}
    .part-tag {color:#315D87;border-color:#88AAD0}.part-tag.blue {color:#307367;border-color:#78B9A6}.part-tag strong {font-size:24px;line-height:1.15}
    .bead {background:linear-gradient(145deg,#88AED8,#749BCA);box-shadow:inset 0 1px 1px #FFFFFF26,inset 0 -1px 1px #355A8612}.dot.second .bead {background:linear-gradient(145deg,#8ACBBF,#71B7A9)}.dot.pooled .bead {background:linear-gradient(145deg,#89B7D3,#75A3C2)}
    .bead:before {opacity:.2}.dot:before {opacity:.2}.pool-bed {background:#EFF7FA;border:1px solid #DFEAF1;box-shadow:none;border-radius:14px}.lane-bed {border-color:#B5CBDC}.lane-add {background:#EDF8F3;border-color:#8CBEB0;color:#367969}
    .cut.recommended span,.cut span {background:#E5F3F0;color:#30746D;border-color:#9AC8BD}
    .action-dock {display:flex;align-items:stretch;min-height:0;position:relative}
    .action-dock .actions,.intro .action-dock .actions {position:static;display:flex;align-items:center;justify-content:space-between;width:100%;height:100%;min-height:0;padding:14px 0;margin:0;border:0;border-radius:0;background:white;gap:16px}
    .action-dock .primary {min-width:166px;min-height:50px;border-radius:11px;background:#358D87;border:1px solid #358D87;color:white;font-size:15px;padding:12px 24px;font-weight:600;box-shadow:none}
    .action-dock .primary:hover:not(:disabled) {background:#2C7D77}.action-dock .secondary,.action-dock .text-button {min-height:50px;border:1px solid #CADCE7;background:white;color:#294D71;font-size:15px;padding:12px 20px;border-radius:11px}
    .action-dock .primary:disabled {background:#D9E8E5;border-color:#D9E8E5;color:#627C77}.action-dock .quiet {font-size:12px;color:#658092}.action-dock .ui-icon {width:20px;height:20px}
    .stage-tools {margin-top:10px}.stage-tool,[data-action="deal"] {background:#EAF5F1;border:1px solid #B8D9CD;color:#2D6F63;min-height:44px;padding:8px 12px;font-size:13px;box-shadow:none;border-radius:10px}.control {padding:8px 10px;gap:10px;border-radius:10px}.control-label {font-size:12px}.stepper {gap:8px}.stepper button {width:34px;height:34px}
    .content[data-stage="intro"] .intro-workspace {grid-template-columns:minmax(0,1.3fr) minmax(290px,1fr)}
    .intro .reasoning .relation {flex-direction:column}.intro .reasoning .relation .arrow {rotate:90deg}.intro .reasoning .relation strong {font-size:34px}
    .content[data-stage="summary"],.content[data-stage="transfer"] {padding:26px 34px;justify-content:center;background:#FFFFFF}
    .transfer-stage,.summary {max-width:900px;width:100%;margin:auto;padding:8px 4px;overflow:auto;text-align:center}
    .transfer-stage h2,.summary h2 {font-size:34px;font-weight:650;color:#1F3553;letter-spacing:-.8px;line-height:1.2;margin:10px 0 16px}
    .transfer-stage .eyebrow,.summary .eyebrow {font-size:10px;letter-spacing:1.5px;color:#527C98}
    .transfer-fact {font-size:54px;font-weight:550;background:#EAF3FB;color:#315F86;display:inline-block;border-radius:14px;padding:12px 40px;margin:4px 0 18px;letter-spacing:-1px}
    .strategy-choices {gap:14px;margin:22px 0}.strategy-choice {font-size:20px;min-height:76px;background:white;border:1.5px solid #C8DBE8;border-radius:12px;box-shadow:none}.strategy-choice[aria-pressed="true"] {background:#E0F2EB;border-color:#4B9E90;padding:11.5px;color:#296C60}
    .transfer-stage .area-model {height:130px;max-width:560px}.transfer-stage .area-model>div {background:#DFEDF9;color:#315D87;border-color:#C6DDED;font-size:24px}.transfer-stage .area-model>div+div {background:#D8F0E8;color:#2D6D62;border-color:#B8DDCE}
    .transfer-note.transfer-success {padding:13px 18px;font-size:14px;background:#E3F3ED;border-color:#CEE4DC;border-radius:10px}.transfer-stage .relation {min-height:46px}.summary .check-list {background:#F6FAFB;padding:8px 24px;border:0;border-radius:14px;max-width:600px;margin:24px auto}.summary .check-list li {padding:15px 0;font-size:15px}.summary-mark {width:60px;height:60px;margin-bottom:18px}
    .debug {top:24px;right:18px}.product-shell:has(+.debug:not([hidden])) .header-context {margin-right:24px}
    @media(max-height:800px) {
      .product-header.top {height:64px;padding-top:10px;padding-bottom:10px}.product-main {grid-template-rows:60px minmax(0,1fr) 74px;padding:0 20px}
      .task-header {padding:19px 22px 16px}.task-header h2 {font-size:29px;margin-bottom:8px}.task-header .lead,.task-header .intro-copy {font-size:14px}.task-header .eyebrow {margin-bottom:5px}
      .activity-workspace {gap:18px;padding:0 18px 18px;grid-template-columns:minmax(0,1.35fr) minmax(280px,1fr)}
      .activity-workspace .reasoning {padding:16px}.reasoning-heading {margin-bottom:12px}.reasoning-heading h3 {font-size:19px}.support-surface {padding:10px;margin-top:14px;font-size:12px}
      .reasoning .relation strong,.reasoning .join-equation {font-size:27px}.reasoning .subfact input {height:44px;font-size:27px}.reasoning .subfact {padding:10px 8px}
      .activity-workspace .reasoning>.relation {min-height:36px;padding:6px 0;margin-bottom:10px}.reasoning:has(.subfacts) .support-surface {display:none}.reasoning .relation .part {font-size:16px}.session-rail {padding-top:20px}
      .content[data-stage="transfer"],.content[data-stage="summary"] {padding:16px 24px}.transfer-stage h2,.summary h2 {font-size:29px;margin-bottom:10px}.transfer-fact {font-size:40px;padding:8px 32px;margin-bottom:10px}.strategy-choices {margin:14px 0}.strategy-choice {min-height:60px;font-size:18px}.transfer-stage .area-model {height:100px}.transfer-stage .quiet {margin:6px 0}.summary .check-list {margin:14px auto}.summary .check-list li {padding:10px 0}
    }
    @media(max-width:1250px) {.product-body {grid-template-columns:148px minmax(0,1fr)}.session-rail {padding-left:12px;padding-right:12px}.product-header .identity {width:140px}.product-breadcrumb {gap:10px;font-size:12px}.session-rail li {font-size:11px;gap:7px}.module-name {font-size:10px}.product-main {padding:0 18px}.activity-workspace {gap:16px;padding-left:16px;padding-right:16px;grid-template-columns:minmax(0,1.3fr) minmax(270px,1fr)}}
    @media(max-width:1050px) {.product-body {grid-template-columns:116px minmax(0,1fr)}.session-rail {padding-left:8px;padding-right:8px}.session-rail li {flex-direction:column;text-align:center;gap:5px;padding:8px 4px}.subject-mark {align-self:center;margin-left:0}.subject-name,.module-name {align-self:center;margin-left:0}.module-name {text-align:center}.rail-label {font-size:8px;letter-spacing:1px}.rail-footer {font-size:10px}.product-breadcrumb {font-size:12px}.activity-workspace {grid-template-columns:minmax(0,1fr) 260px;gap:12px}.task-header h2 {font-size:27px}.reasoning .subfacts {grid-template-columns:1fr 1fr}.reasoning .subfact label {font-size:16px}.reasoning-heading h3 {font-size:18px}.support-surface {font-size:11px}.module-caption {font-size:12px}.session-progress {gap:18px}.module-caption span {font-size:10px}.session-progress .progress {gap:8px;font-size:11px}}
    @media(max-width:850px) {.session-rail {display:none}.product-body {grid-template-columns:1fr}.product-main {padding:0 14px}.product-header.top {padding-left:18px;padding-right:18px}.product-header .identity {width:auto}.product-breadcrumb {margin-left:auto;flex:none}.product-header .header-context {display:none}.activity-workspace {grid-template-columns:minmax(0,1.2fr) minmax(240px,1fr);padding:0 12px 12px}.reasoning .support-surface {display:none}.task-header {padding:16px}.task-header h2 {font-size:26px}}
    @media(max-width:650px) {.product-breadcrumb {display:none}.product-main {grid-template-rows:56px minmax(0,1fr) 74px}.activity-workspace,.content[data-stage="intro"] .intro-workspace {display:flex;flex-direction:column;gap:10px}.activity-workspace .playground {flex:1;min-height:110px}.activity-workspace .reasoning {flex:none;max-height:42%;padding:10px 12px}.reasoning-heading {display:none}.reasoning .support-surface {display:none}.reasoning .relation {margin-bottom:6px!important}.reasoning .subfacts {gap:8px}.reasoning .subfact {padding:7px}.reasoning .subfact input {height:34px;font-size:23px;max-width:80px!important}.task-header h2 {font-size:24px}.task-header .lead {font-size:12px}.task-header .eyebrow {font-size:9px}.action-dock .primary,.action-dock .secondary,.action-dock .text-button {min-width:0;min-height:46px;padding:10px 14px;font-size:13px}.action-dock .quiet {font-size:10px;max-width:40%}.module-caption span {display:none}.strategy-choices {grid-template-columns:1fr}.strategy-choice {min-height:46px;font-size:16px}.transfer-stage h2,.summary h2 {font-size:26px}.transfer-fact {font-size:34px}.content[data-stage="transfer"],.content[data-stage="summary"] {padding:14px}.intro .reasoning .relation {flex-direction:row}.intro .reasoning .relation .arrow {rotate:0deg}}
`;
  const materialStyles = `
/* Targeted alignment: the visible expression, not its hidden predecessor, sets width. */
.product-shell .transfer-stage h2,.product-shell .summary h2,.product-shell .task-header h2{width:100%;max-width:none;text-align:center;margin-inline:auto}
.product-shell .reasoning-heading{text-align:center}
.product-shell .join-prefix{min-width:0;position:relative;display:block}
.product-shell .join-prefix .fact-prefix{position:absolute;inset:0}
.product-shell .join-equation.is-final .sum-prefix{position:absolute;inset:0}
.product-shell .join-equation.is-final .fact-prefix{position:relative;inset:auto}
.product-shell .join-equation{justify-content:center;margin-inline:auto}
.product-shell .sum-result{min-width:0;text-align:center}
.product-shell .transfer-fact{width:fit-content;margin-inline:auto;text-align:center}
.transfer-guide{height:52px;display:flex;justify-content:center;margin:6px auto 0}.transfer-guide .ribbon-glyph{width:48px;height:52px}
.product-shell .transfer-stage{position:relative}
.product-shell .math-token,.product-shell .transfer-stage .relation,.product-shell .join-equation.is-final .sum-result{animation:number-settle var(--motion-math,800ms) var(--material-ease,ease-out) both}
.product-shell .area-model>div{animation:part-arrive var(--motion-math,800ms) var(--material-ease,ease-out) both}.product-shell .area-model>div+div{animation-delay:100ms}
@keyframes number-settle{0%{opacity:.2;translate:0 -5px;scale:.98;filter:drop-shadow(0 5px 4px #2f4a3b1c)}65%{opacity:1;translate:0 1px;scale:1.01 .99}100%{opacity:1;translate:0 0;scale:1;filter:drop-shadow(0 0 0 transparent)}}
@keyframes part-arrive{from{opacity:0;translate:0 5px;scale:.985}to{opacity:1;translate:0 0;scale:1}}
@media(prefers-reduced-motion:reduce){.product-shell .math-token,.product-shell .area-model>div,.product-shell .transfer-stage .relation,.product-shell .join-equation.is-final .sum-result{animation:none}}
:host{--forest:#2F4A3B;--sage:#A7B89F;--ivory:#FAF8F2;--slate:#6B7F93;--brass:#B69B68;--neutral:#D9D7D0;--shadow-contact:0 2px 2px #263c3226;--shadow-lift:0 6px 7px #263c321c;--radius-object:31%;--motion-fast:200ms;--motion-normal:340ms;--motion-math:800ms;--motion-resolve:650ms;--motion-magnetic:680ms;--material-ease:cubic-bezier(.22,.61,.36,1)}
.product-shell{position:relative}.activity-workspace .playground{background:linear-gradient(160deg,#FEFEFC,#F5F7F2);box-shadow:inset 0 2px 4px #344d3c05;border-color:#DFE5DC}.activity-workspace .reasoning{background:#F2F5F0}
.ribbon-glyph.core-glyph{display:inline-block;position:relative;width:58px;height:68px;margin:0;vertical-align:middle;background:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;rotate:0!important;flex:none;padding:0;animation:glyph-arrive 420ms var(--material-ease) both}
.ribbon-glyph:before,.ribbon-glyph:after{content:none!important}.ribbon-glyph svg{width:100%;height:100%;overflow:visible}.glyph-body{transform-origin:50px 65px}.glyph-eyes{transition:transform var(--motion-normal)}.glyph-smile,.glyph-marks,.glyph-spark{opacity:0}
.ribbon-glyph[data-glyph="neutral"] .glyph-body{animation:glyph-breathe 5s ease-in-out 2}
.ribbon-glyph[data-glyph="notice"] .glyph-body,.ribbon-glyph[data-glyph="attention"] .glyph-body{animation:glyph-notice 900ms ease-in-out both}.ribbon-glyph[data-glyph="notice"] .glyph-eyes,.ribbon-glyph[data-glyph="attention"] .glyph-eyes{transform:translate(-2px,1px)}.ribbon-glyph[data-glyph="notice"] .glyph-marks,.ribbon-glyph[data-glyph="attention"] .glyph-marks{animation:glyph-marks 1200ms ease both}
.ribbon-glyph[data-glyph="hint"] .glyph-body{transform:rotate(-7deg)}.ribbon-glyph[data-glyph="hint"] .glyph-eyes{transform:translate(-2px,2px)}
.ribbon-glyph[data-glyph="complete"] .glyph-eyes{opacity:0}.ribbon-glyph[data-glyph="complete"] .glyph-smile{opacity:1}.ribbon-glyph[data-glyph="complete"] .glyph-spark{animation:glyph-marks 1600ms ease both}.ribbon-glyph[data-glyph="complete"] .glyph-body{animation:glyph-settle 650ms var(--material-ease) both}
.context-glyph{position:absolute;z-index:20;pointer-events:none;transition:opacity var(--motion-fast),translate var(--motion-fast)}.context-glyph.leaving{opacity:0;translate:0 3px}.context-glyph .ribbon-glyph{width:62px;height:72px}.summary-mark .ribbon-glyph{width:72px;height:84px}.support-surface:has(.ribbon-glyph){gap:12px;padding:10px 14px}.field-feedback:has(.ribbon-glyph){display:flex;align-items:center;gap:9px;background:var(--ivory);color:var(--forest);border:1px solid #DCDCCD;border-radius:13px 13px 13px 3px}.field-feedback .ribbon-glyph{width:40px;height:46px}.support-live:not(:empty){display:flex;align-items:center;gap:6px;background:var(--ivory);border:1px solid #DCDCCD;border-radius:10px;padding:8px;color:var(--forest);animation:glyph-arrive 420ms var(--material-ease)}
.support-live .ribbon-glyph{width:30px;height:36px}
@keyframes glyph-arrive{from{opacity:0;translate:0 5px;scale:.98}to{opacity:1;translate:0 0;scale:1}}@keyframes glyph-breathe{50%{transform:translateY(-1.5px) rotate(1deg)}}@keyframes glyph-notice{40%{transform:translateX(-3px) rotate(-8deg)}100%{transform:rotate(-3deg)}}@keyframes glyph-marks{0%,100%{opacity:0}25%,70%{opacity:1}}@keyframes glyph-settle{from{transform:translateY(-3px)}to{transform:translateY(0)}}
.product-shell .dot{border-radius:var(--radius-object)}.product-shell .dot .bead{border-radius:var(--radius-object);background:linear-gradient(145deg,#708875 0%,#4C6955 43%,#344E3F 100%);box-shadow:inset 1px 2px 2px #FFFFFF35,inset -1px -2px 3px #142A3035,0 2px 1px #263B332B;isolation:isolate}
.product-shell .dot.second .bead{background:linear-gradient(145deg,#96A7B4,#748B9B 48%,#566F81)}.product-shell .dot.pooled .bead{background:linear-gradient(145deg,#C5CEB9,#ACBA9C 48%,#8C9F80)}
.product-shell .bead:before{left:13%;top:7%;width:64%;height:33%;rotate:0;border-radius:50%;background:linear-gradient(155deg,#FFFFFF30,#FFFFFF00);opacity:.65}.product-shell .bead:after{border:1px solid #FFFFFF16;border-bottom-color:#20392D28;border-radius:inherit;inset:1px}
.product-shell .dot:before{top:29px;height:10px;left:6px;right:5px;opacity:.8;background:radial-gradient(ellipse,#2F4A3B55,transparent 70%);transition:transform var(--motion-fast),opacity var(--motion-fast)}
.content.joining .dot{transition-duration:var(--motion-magnetic);transition-timing-function:cubic-bezier(.4,0,.2,1)}.product-shell .dot.in-flight .bead{translate:0 -3px;scale:1.025;box-shadow:inset 1px 2px 2px #FFF3,inset -1px -2px 3px #142A3020,0 4px 4px #263B331A}.product-shell .dot.in-flight:before{transform:scale(1.3);opacity:.35}
.product-shell .dot:focus-visible .bead,.product-shell .dot[data-action]:hover:not(:disabled) .bead{translate:0 -2px}.product-shell .dot[data-action]:active:not(:disabled) .bead{translate:0 1px;scale:1.02 .97}
.product-shell .pool-bed{background:#F1F2E9;border:1px solid #D7DDCF;box-shadow:inset 0 2px 5px #354D3E0D,inset 0 -2px 0 #FFF;border-radius:18px}.product-shell .lane-bed{border:1px solid #D7E0D5;border-radius:12px;background:#F6F8F2;box-shadow:inset 0 1px 3px #2F4A3B08}.product-shell .lane-add{border-color:#A1B499;background:var(--ivory);color:var(--forest);border-radius:12px;box-shadow:inset 0 1px 0 #FFF,0 2px 1px #2F4A3B14}
.product-shell .cut:before,.product-shell .cut.recommended:before{background:#E8EDE0;color:var(--forest);border-color:#A8B79B;border-radius:7px;box-shadow:var(--shadow-contact)}.product-shell .cut span{background:var(--ivory);color:var(--forest)}
.reasoning .subfact{background:#E4EBDD}.reasoning .subfact.blue{background:#E2E9EE}.reasoning .relation .part{background:#E4EBDD;color:var(--forest)}.reasoning .relation .part.blue{background:#E2E9EE;color:#405C70}.product-shell .part-tag{color:var(--forest)}.product-shell .part-tag.blue{color:#405C70}.product-shell .subfact label{color:var(--forest)}.product-shell .subfact.blue label{color:#405C70}.product-shell .subfact input{background:var(--ivory);border-color:#BBC8B3;color:var(--forest);box-shadow:inset 0 2px 3px #2F4A3B09}.product-shell .subfact.blue input{border-color:#B7C5CE;color:#405C70}
.action-dock .primary{background:linear-gradient(155deg,#446553,var(--forest));border:1px solid #2C4538;box-shadow:inset 0 1px 0 #FFFFFF25,0 3px 0 #20382D;transition:translate var(--motion-fast),box-shadow var(--motion-fast)}.action-dock .primary:hover:not(:disabled){background:linear-gradient(155deg,#4C6C5B,#354F40);translate:0 -1px}.action-dock .primary:active:not(:disabled){translate:0 2px;box-shadow:inset 0 1px 2px #142B3320,0 1px 0 #20382D}.action-dock .secondary,.action-dock .text-button{background:var(--ivory);border-color:#D2DACB;color:var(--forest);box-shadow:inset 0 1px 0 #FFF,0 2px 1px #2F4A3B0C}.product-shell [data-action="deal"]{background:var(--ivory);border-color:#B7C5AE;color:var(--forest);box-shadow:inset 0 1px 0 #FFF,0 3px 0 #CBD4C3}.product-shell .tool-teeth i{background:var(--forest)}
.session-progress .track.material-journey{position:relative;display:flex;align-items:center;justify-content:space-between;gap:6px;height:48px;width:100%;max-width:600px;padding:0 6px;isolation:isolate}.journey-path{position:absolute;inset:0;width:100%;height:100%;z-index:-1;overflow:visible}.journey-path path{fill:none;stroke:#D9E1D1;stroke-width:5;stroke-linecap:round}.journey-path .journey-flow{opacity:0}.journey-advancing .journey-path .journey-flow{opacity:1;clip-path:inset(0 calc(100% - var(--journey-end,100%)) 0 var(--journey-start,0%));stroke:var(--sage);stroke-dasharray:70 530;animation:path-flow 650ms ease-out}
.session-progress .material-journey i{position:relative;display:block;flex:none;width:38px;height:38px;background:none!important;box-shadow:none!important;border-radius:0;transition:translate 450ms var(--material-ease);color:#DDDCD4;filter:drop-shadow(0 2px 1px #2F4A3B1A)}.node-shape{display:block;width:100%;height:100%;overflow:visible}.node-shape>path:first-of-type{fill:currentColor;stroke:#C7CABE;stroke-width:1;paint-order:stroke;filter:drop-shadow(0 1px 0 #FFF8);transition:fill 400ms,stroke 400ms}.node-light{stroke:none;pointer-events:none}.node-seam{fill:none;stroke:#A0A79C;stroke-width:1}.node-status{position:absolute;inset:0;display:grid;place-items:center;font-style:normal}.node-status:after{content:'';width:6px;height:6px;border-radius:50%;background:#A6ADA0;box-shadow:inset 0 1px 1px #2F4A3B15}
.session-progress .material-journey i.done{color:#496B55}.material-journey i.done .node-shape>path:first-of-type{stroke:#334F3E}.material-journey i.done .node-status:after{content:'✓';width:auto;height:auto;background:none;box-shadow:none;color:var(--ivory);font-size:19px;font-weight:500}
.session-progress .material-journey i.current{color:var(--slate);translate:0 -2px;filter:drop-shadow(0 3px 2px #2F4A3B20)}.material-journey i.current .node-shape>path:first-of-type{stroke:var(--ivory);stroke-width:4;filter:drop-shadow(0 0 1px var(--brass))}.material-journey i.current .node-status:after{width:9px;height:9px;background:var(--ivory);box-shadow:0 1px 1px #2F4A3B30}.material-journey .node-resolve{animation:node-settle 520ms var(--material-ease)}
@keyframes node-settle{0%{translate:0 -2px}65%{translate:0 1px}100%{translate:0 0}}@keyframes path-flow{from{stroke-dashoffset:80}to{stroke-dashoffset:-530}}
@media(max-height:800px){.content[data-stage="guide"] .support-surface:has(.ribbon-glyph){display:flex}.session-progress .track.material-journey{height:42px}.session-progress .material-journey i{width:33px;height:33px}.support-surface .ribbon-glyph{width:44px;height:50px}}
@media(max-width:850px){.session-progress{gap:12px}.session-progress .material-journey i{width:29px;height:29px}.session-progress .progress{gap:8px}.context-glyph .ribbon-glyph{width:48px;height:56px}}
@media(prefers-reduced-motion:reduce){.ribbon-glyph *,.material-journey *{animation:none!important;transition:none!important}.ribbon-glyph[data-glyph="complete"] .glyph-spark{opacity:1}}
`;
  // Contracts: telemetry.logEvent(name,payload,context); policy.selectNextChallenge(learner,history).
  // Shell helpers emit scoped markup; games own their stage and mathematical representations.
  const header = ({title}) => `<header class="top product-header"><div class="identity"><img class="brand-logo" src="logifera-icon.png" width="40" height="40" alt=""><h1>Logifera</h1></div><div class="product-breadcrumb">Intervention <span>/</span> <strong>${title}</strong></div><span class="header-context">Explore at your own pace</span></header>`;
  const sessionProgress = ({count,label,total=6}) => `<div class="session-progress"><div class="module-caption">Math foundations <span>Multiplication & division</span></div><div class="progress"><span class="progress-label">${label}</span>${progressRail(count,total)}</div></div>`;
  const journey = stage => {
    const index=stage==='INTRO'?0:stage==='GUIDE'?1:stage==='TRANSFER'?3:stage==='SUMMARY'?4:2;
    return `<aside class="session-rail" aria-label="Your learning session"><div class="subject-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></div><strong class="subject-name">Math</strong><span class="module-name">Array Architects</span><p class="rail-label">YOUR SESSION</p><ol>${['Introduction','Guided practice','Practice','Transfer'].map((name,i)=>`<li class="${i===index?'active':i<index?'complete':''}" ${i===index?'aria-current="step"':''}><span class="journey-dot" aria-hidden="true">${i<index?'✓':i+1}</span><span>${name}</span></li>`).join('')}</ol><div class="rail-footer"><span class="rail-flower" aria-hidden="true"></span><p>Small steps.<br>Connected ideas.</p></div></aside>`;
  };
  const feedback = f => f?`<p class="field-feedback ${f.type==='success'?'positive':'warning'}" role="status">${f.type.includes('hint')?glyph('hint'):''}${f.message}</p>`:'';
  const api={motion,baseLearner,glyph,icon,progressRail,header,sessionProgress,journey,feedback,styles,productStyles,materialStyles};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LogiferaInterventionCore=api;
})(globalThis);
