(function (root) {
  'use strict';
  const PREFIX = 'logifera.array-architects.v2.';
  const ACTIVE = PREFIX + 'active';
  const clone = value => JSON.parse(JSON.stringify(value));

  // Storage is injected: replace this adapter with an API without changing game logging.
  class Telemetry {
    constructor(storage) {
      this.storage = storage;
      this.persistent = Boolean(storage);
      try {
        const active = storage?.getItem(ACTIVE);
        const saved = active && JSON.parse(storage.getItem(PREFIX + active));
        if (saved && [2,3].includes(saved.version)) this.session = {...saved,version:3,events:saved.events||[],summaries:saved.summaries||[]};
      } catch (_) { this.persistent = false; }
      if (!this.session) this.start();
    }

    start() {
      this.session = { version:3, sessionId:root.crypto?.randomUUID?.() || `aa-${Date.now()}-${Math.random().toString(36).slice(2)}`, startedAt:new Date().toISOString(), completed:false, events:[], summaries:[], snapshot:null };
      this.logEvent('session_started', {}, {});
      return this.session;
    }

    logEvent(eventName, payload = {}, context = {}) {
      const event = { sessionId:this.session.sessionId, timestamp:new Date().toISOString(), challengeId:context.challengeId || null, challengeType:context.challengeType || null, skill:context.skill || null, eventName, attemptNumber:context.attemptNumber || 0, payload:clone(payload) };
      this.session.events.push(event);
      if (['challenge_completed','transfer_completed'].includes(eventName)) this.session.summaries.push(clone(payload));
      if (eventName === 'session_completed') this.session.completed = true;
      this.persist();
      return event;
    }

    saveSnapshot(snapshot) { this.session.snapshot = clone(snapshot); this.persist(); }

    persist() {
      try {
        if (!this.storage) { this.persistent = false; return; }
        this.storage.setItem(PREFIX + this.session.sessionId, JSON.stringify(this.session));
        this.storage.setItem(ACTIVE, this.session.sessionId);
        this.persistent = true;
      } catch (_) { this.persistent = false; }
    }

    allSessions() {
      const sessions = new Map([[this.session.sessionId, this.session]]);
      try {
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i);
          if (key?.startsWith(PREFIX) && key !== ACTIVE) {
            const value = JSON.parse(this.storage.getItem(key));
            if ([2,3].includes(value?.version) && value.sessionId !== this.session.sessionId) sessions.set(value.sessionId, value);
          }
        }
      } catch (_) { /* In-memory current session remains exportable. */ }
      return [...sessions.values()];
    }

    exportCSV() { return toCSV(this.allSessions()); }
  }

  function toCSV(sessions) {
    const columns = ['rowType','sessionId','timestamp','challengeId','challengeType','skill','eventName','attemptNumber','feedbackType','scaffoldLevel','relatedField','split','firstTryCorrect','independentSuccess','finalSuccess','attemptCount','hintCount','highestScaffoldLevel','selfCorrected','selectedSplitStrategy','subfactAccuracy','completionTimeMs','selectedSplit','partial1Attempts','partial2Attempts','partial1Outcome','partial2Outcome','supportUsed','supportType','supportOpened','supportCompleted','attentionCueShown','cueType','splitCueShown','addOneCueShown','plusDotCueShown','challengeFamily','representationType','anchorType','adaptivePolicy','masteryBefore','masteryAfter','transferItem','nearTransferSuccess','transferStrategySelected','transferIndependent','transferHintUsed','transferAttemptCount','transferRepresentation','supportDependence','selfCorrectionEvidence','reason','candidateFamily','selectedChallenge','learnerSignal','payload'];
    const rows = [];
    for (const session of sessions) {
      for (const event of session.events||[]) rows.push({ rowType:'event', ...event, ...Object.fromEntries(['challengeFamily','representationType','anchorType','adaptivePolicy','masteryBefore','masteryAfter','transferItem','nearTransferSuccess','transferStrategySelected','transferIndependent','transferHintUsed','transferAttemptCount','transferRepresentation','supportDependence','selfCorrectionEvidence','reason','candidateFamily','selectedChallenge','learnerSignal','feedbackType','scaffoldLevel','relatedField','split','supportUsed','supportType','supportOpened','supportCompleted','attentionCueShown','cueType','splitCueShown','addOneCueShown','plusDotCueShown'].map(k => [k,event.payload?.[k]])), payload:JSON.stringify(event.payload) });
      for (const summary of session.summaries||[]) rows.push({ rowType:'challenge_summary', sessionId:session.sessionId, timestamp:summary.completedAt, ...summary });
    }
    const escape = value => {
      let text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (/^[\s\uFEFF]*[=+@\-]|^[\t\r\n]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    };
    return '\uFEFF' + [columns.join(','), ...rows.map(row => columns.map(key => escape(row[key])).join(','))].join('\r\n');
  }
  const api = { Telemetry, toCSV, PREFIX };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ArrayArchitectsTelemetry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
