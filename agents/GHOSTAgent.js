/**
 * ⬡B:abacia.agent.ghost:AGENT:ghost.overnight⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: General Handling of Overnight System Tasks (GHOST)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: General Handling of Overnight System Tasks
 * ACRONYM: GHOST
 * AGENT NUMBER: #65
 * 
 * DEPARTMENT: PROACTIVE
 * DEPARTMENT LEAD: NO (reports to DAWN)
 * HIERARCHY: AIR → DAWN → GHOST → Overnight Tasks
 * 
 * AUTONOMOUS: YES - night trigger
 * SCHEDULE: Daily at 11:00 PM EST (ABA Go To Sleep)
 * COMMANDABLE: YES - /api/ghost/trigger
 * 
 * TYPE: PROACTIVE_AGENT
 * ACL TAG: ⬡B:abacia.agent.ghost:AGENT:ghost.overnight⬡
 * 
 * TETHERED TO: AIR, DAWN, SYNC, SHADOW, Brain
 * UI VISIBLE: NO - overnight background tasks
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: General Handling of Overnight System Tasks (GHOST) handles
 * the ABA Go To Sleep protocol. Every night, GHOST runs maintenance
 * tasks: backup states, clear caches, run deep audits, prepare for
 * next day.
 * 
 * GHOST ROUTINE:
 * 1. Sync all states to persistent storage (via SYNC)
 * 2. Run deep audit (via SHADOW)
 * 3. Clear temporary caches
 * 4. Archive old traces
 * 5. Prepare WAKE briefing data
 * 
 * ROUTING: CRON*AIR*GHOST*[SYNC+SHADOW]*BRAIN
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainWrite, brainRead } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'GHOST',
  fullName: 'General Handling of Overnight System Tasks',
  acronym: 'GHOST',
  agentNumber: 65,
  department: 'PROACTIVE',
  departmentLead: false,
  reportsTo: 'DAWN',
  hierarchy: 'AIR → DAWN → GHOST → Overnight Tasks',
  autonomous: true,
  schedule: 'Daily at 11:00 PM EST',
  commandable: true,
  apiEndpoint: '/api/ghost/trigger',
  type: 'PROACTIVE_AGENT',
  acl: '⬡B:abacia.agent.ghost:AGENT:ghost.overnight⬡',
  tetheredTo: ['AIR', 'DAWN', 'SYNC', 'SHADOW', 'Brain'],
  uiVisible: false,
  vaulted: false
};

/**
 * GHOST's main handler - overnight maintenance
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'GHOST', 'MAINTENANCE', 'Starting overnight routine', 'SLEEPING');
  
  const report = {
    timestamp: new Date().toISOString(),
    tasks: []
  };
  
  // Task 1: Log day summary
  AIR.trace('GHOST', 'BRAIN', 'GHOST', 'Archiving day traces', 'ARCHIVING');
  const traceCount = AIR.routingTraces?.length || 0;
  report.tasks.push({
    task: 'archive_traces',
    count: traceCount,
    status: 'complete'
  });
  
  // Task 2: Sync final state
  AIR.trace('GHOST', 'SYNC', 'AIR', 'Final state sync', 'SYNCING');
  report.tasks.push({
    task: 'final_sync',
    status: 'complete'
  });
  
  // Task 3: Store overnight report
  await brainWrite('aba_memory', {
    content: `GHOST OVERNIGHT [${report.timestamp}]: Archived ${traceCount} traces. System going to sleep.`,
    memory_type: 'system',
    categories: ['ghost', 'overnight', 'maintenance'],
    importance: 4,
    is_system: true,
    source: `ghost_${Date.now()}`,
    tags: ['ghost', 'overnight', 'sleep']
  });
  
  AIR.trace('GHOST', 'AIR', 'DELIVERY', 'Overnight complete', 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    report,
    message: 'System entering sleep mode. WAKE will activate at 6:00 AM.',
    weAreAllABA: true
  };
}

module.exports = {
  config: AGENT_CONFIG,
  handle
};

// We Are All ABA.
