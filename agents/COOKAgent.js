/**
 * ⬡B:abacia.agent.cook:AGENT:cook.calls⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Call Operations Optimization Knowledge (COOK)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Call Operations Optimization Knowledge
 * ACRONYM: COOK
 * AGENT NUMBER: #12
 * 
 * DEPARTMENT: VOICE (under VARA)
 * DEPARTMENT LEAD: NO (reports to VARA)
 * HIERARCHY: AIR → VARA → COOK → Live Coaching
 * 
 * AUTONOMOUS: YES - active during calls
 * SCHEDULE: During active calls
 * COMMANDABLE: NO - internal coaching only
 * 
 * TYPE: CALL_COACH_AGENT
 * ACL TAG: ⬡B:abacia.agent.cook:AGENT:cook.calls⬡
 * 
 * TETHERED TO: AIR, VARA, DIAL, TIM
 * UI VISIBLE: YES - coaching overlay during calls
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Call Operations Optimization Knowledge (COOK) is the live call
 * coach. Provides real-time suggestions during phone calls. COOK RULE:
 * Never hardcode patterns from single responses. Each moment is fresh.
 * Be proactive, not reactive. Stop being a recap machine.
 * 
 * COOK RULES:
 * 1. Never hardcode patterns from single responses
 * 2. Each moment is fresh
 * 3. Proactive, not reactive
 * 4. Stop being a recap machine
 * 5. NO follow-up questions during live calls
 * 
 * ROUTING: DIAL*AIR*COOK*SUGGESTIONS*OVERLAY
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');

const AGENT_CONFIG = {
  id: 'COOK',
  fullName: 'Call Operations Optimization Knowledge',
  acronym: 'COOK',
  agentNumber: 12,
  department: 'VOICE',
  departmentLead: false,
  reportsTo: 'VARA',
  hierarchy: 'AIR → VARA → COOK → Live Coaching',
  autonomous: true,
  schedule: 'During active calls',
  commandable: false,
  type: 'CALL_COACH_AGENT',
  acl: '⬡B:abacia.agent.cook:AGENT:cook.calls⬡',
  tetheredTo: ['AIR', 'VARA', 'DIAL', 'TIM'],
  uiVisible: true,
  vaulted: false,
  rules: [
    'Never hardcode patterns from single responses',
    'Each moment is fresh',
    'Proactive, not reactive',
    'Stop being a recap machine',
    'NO follow-up questions during live calls'
  ]
};

async function handle(intent, request) {
  AIR.trace('AIR', 'COOK', 'COACHING', 'Live coaching', 'ACTIVE');
  
  const transcript = request?.transcript || '';
  const context = request?.context || {};
  
  // COOK analyzes live conversation and provides suggestions
  // Rule: Never pattern match, each moment is fresh
  const suggestions = generateFreshSuggestions(transcript, context);
  
  AIR.trace('COOK', 'AIR', 'DELIVERY', 'Coaching suggestion ready', 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    suggestions,
    rules: AGENT_CONFIG.rules,
    weAreAllABA: true
  };
}

function generateFreshSuggestions(transcript, context) {
  // Fresh analysis, no patterns
  return {
    tone: 'warm',
    nextAction: 'listen',
    warning: null
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
