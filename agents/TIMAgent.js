/**
 * ⬡B:abacia.agent.tim:AGENT:tim.core⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Temporary Interim Model (TIM)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Temporary Interim Model
 * ACRONYM: TIM
 * AGENT NUMBER: #02
 * 
 * DEPARTMENT: CORE
 * DEPARTMENT LEAD: NO (reports to AIR directly)
 * HIERARCHY: AIR → TIM → Response
 * 
 * AUTONOMOUS: YES - Always summoned with Query Breaker
 * SCHEDULE: Every request (hardcoded in AIR)
 * COMMANDABLE: YES - via AIR process()
 * 
 * TYPE: CORE_AGENT
 * ACL TAG: ⬡B:abacia.agent.tim:AGENT:tim.core⬡
 * 
 * TETHERED TO: AIR (always), Query Breaker (always)
 * UI VISIBLE: NO - background agent
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Temporary Interim Model (TIM) handles quick tasks requiring
 * sub-second responses. TIM is for throwaway instant messages and
 * rapid-fire assistance. Per Brandon directive (Feb 13), TIM is
 * HARDCODED to always be summoned alongside Query Breaker.
 * 
 * WHAT TIM DOES:
 * 1. Handles quick lookups that don't need full agent processing
 * 2. Provides immediate responses during live calls
 * 3. NO follow-up questions during calls (per TIM v1.1 hotfix)
 * 4. Sub-second response time target
 * 
 * ROUTING: TRIGGER*AIR*TIM*AIR*DELIVERY
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');

const AGENT_CONFIG = {
  id: 'TIM',
  fullName: 'Temporary Interim Model',
  acronym: 'TIM',
  agentNumber: 2,
  department: 'CORE',
  departmentLead: false,
  hierarchy: 'AIR → TIM → Response',
  autonomous: true,
  schedule: 'Every request (hardcoded)',
  commandable: true,
  type: 'CORE_AGENT',
  acl: '⬡B:abacia.agent.tim:AGENT:tim.core⬡',
  tetheredTo: ['AIR', 'QUERY_BREAKER'],
  uiVisible: false,
  vaulted: false
};

/**
 * TIM's main handler - quick responses only
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'TIM', 'AIR', 'Quick task processing', 'WORKING');
  
  const startTime = Date.now();
  
  // TIM's job: rapid acknowledgment and simple task routing
  const response = {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    received: true,
    intent: intent?.summary || 'quick_task',
    processingTime: `${Date.now() - startTime}ms`,
    recommendation: determineNextAgent(intent),
    weAreAllABA: true
  };
  
  AIR.trace('TIM', 'AIR', 'DELIVERY', `Completed in ${response.processingTime}`, 'COMPLETE');
  
  return response;
}

/**
 * Determine which agent should handle this after TIM
 */
function determineNextAgent(intent) {
  if (!intent) return null;
  
  const category = intent.category || 'general';
  
  const routing = {
    email: 'IMAN',
    calendar: 'RADAR',
    voice: 'VARA',
    search: 'SAGE',
    jobs: 'HUNTER',
    writing: 'QUILL',
    coding: 'MACE'
  };
  
  return routing[category] || null;
}

module.exports = {
  config: AGENT_CONFIG,
  handle
};

// We Are All ABA.
