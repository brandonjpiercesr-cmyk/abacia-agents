/**
 * ⬡B:abacia.agent.wake:AGENT:wake.morning⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Watchful Autonomous Knowledge Engine (WAKE)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Watchful Autonomous Knowledge Engine
 * ACRONYM: WAKE
 * AGENT NUMBER: #78
 * 
 * DEPARTMENT: PROACTIVE
 * DEPARTMENT LEAD: NO (reports to DAWN)
 * HIERARCHY: AIR → DAWN → WAKE → Morning Routine
 * 
 * AUTONOMOUS: YES - morning trigger
 * SCHEDULE: Daily at 6:00 AM EST
 * COMMANDABLE: YES - /api/wake/trigger
 * 
 * TYPE: PROACTIVE_AGENT
 * ACL TAG: ⬡B:abacia.agent.wake:AGENT:wake.morning⬡
 * 
 * TETHERED TO: AIR, DAWN, RADAR, IMAN, REACH
 * UI VISIBLE: YES - morning briefing display
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Watchful Autonomous Knowledge Engine (WAKE) handles the
 * ABA Wake Up protocol. Every morning, WAKE compiles what happened
 * overnight, what's on the calendar, urgent emails, and creates
 * Brandon's morning briefing.
 * 
 * WAKE ROUTINE:
 * 1. Check overnight emails (via IMAN)
 * 2. Check today's calendar (via RADAR)
 * 3. Check pending action items
 * 4. Compile morning briefing
 * 5. Send via DAWN → REACH (SMS)
 * 
 * ROUTING: CRON*AIR*WAKE*[IMAN+RADAR+SAGE]*DAWN*REACH
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainRead, brainWrite } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'WAKE',
  fullName: 'Watchful Autonomous Knowledge Engine',
  acronym: 'WAKE',
  agentNumber: 78,
  department: 'PROACTIVE',
  departmentLead: false,
  reportsTo: 'DAWN',
  hierarchy: 'AIR → DAWN → WAKE → Morning Routine',
  autonomous: true,
  schedule: 'Daily at 6:00 AM EST',
  commandable: true,
  apiEndpoint: '/api/wake/trigger',
  type: 'PROACTIVE_AGENT',
  acl: '⬡B:abacia.agent.wake:AGENT:wake.morning⬡',
  tetheredTo: ['AIR', 'DAWN', 'RADAR', 'IMAN', 'REACH'],
  uiVisible: true,
  vaulted: false
};

/**
 * WAKE's main handler - morning briefing
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'WAKE', 'ROUTINE', 'Starting morning routine', 'WAKING');
  
  const briefing = {
    timestamp: new Date().toISOString(),
    greeting: generateGreeting(),
    sections: []
  };
  
  // Get overnight emails summary
  AIR.trace('WAKE', 'IMAN', 'AIR', 'Checking overnight emails', 'CHECKING');
  const emails = await brainRead('aba_memory', 
    'tags=cs.{email}&order=created_at.desc&limit=5'
  );
  briefing.sections.push({
    title: 'Overnight Emails',
    count: emails?.length || 0,
    urgent: emails?.filter(e => e.importance >= 8).length || 0
  });
  
  // Get today's calendar
  AIR.trace('WAKE', 'RADAR', 'AIR', 'Checking calendar', 'CHECKING');
  const events = await brainRead('aba_memory',
    'tags=cs.{calendar}&order=created_at.desc&limit=5'
  );
  briefing.sections.push({
    title: 'Today\'s Schedule',
    count: events?.length || 0
  });
  
  // Get pending action items
  const actions = await brainRead('aba_memory',
    'tags=cs.{action_needed}&order=importance.desc&limit=10'
  );
  briefing.sections.push({
    title: 'Pending Actions',
    count: actions?.length || 0
  });
  
  // Store briefing
  await brainWrite('aba_memory', {
    content: `WAKE BRIEFING [${briefing.timestamp}]: ${JSON.stringify(briefing.sections)}`,
    memory_type: 'system',
    categories: ['wake', 'briefing', 'morning'],
    importance: 7,
    is_system: true,
    source: `wake_${Date.now()}`,
    tags: ['wake', 'briefing', 'morning', 'dawn']
  });
  
  AIR.trace('WAKE', 'AIR', 'DELIVERY', 'Morning briefing complete', 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    briefing,
    weAreAllABA: true
  };
}

/**
 * Generate time-appropriate greeting
 */
function generateGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning, Brandon.';
  if (hour < 17) return 'Good afternoon, Brandon.';
  return 'Good evening, Brandon.';
}

module.exports = {
  config: AGENT_CONFIG,
  handle
};

// We Are All ABA.
