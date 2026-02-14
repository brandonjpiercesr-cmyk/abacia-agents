/**
 * ⬡B:abacia.agent.now:AGENT:now.time⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Network Oriented Worldclock (NOW)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Network Oriented Worldclock
 * ACRONYM: NOW
 * AGENT NUMBER: #55
 * 
 * DEPARTMENT: CALENDAR (under RADAR)
 * DEPARTMENT LEAD: NO (reports to RADAR)
 * HIERARCHY: AIR → RADAR → NOW → Time APIs
 * 
 * AUTONOMOUS: NO - on-demand only
 * SCHEDULE: On-demand
 * COMMANDABLE: YES - /api/now/time
 * 
 * TYPE: UTILITY_AGENT
 * ACL TAG: ⬡B:abacia.agent.now:AGENT:now.time⬡
 * 
 * TETHERED TO: AIR, RADAR
 * UI VISIBLE: YES - time display
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Network Oriented Worldclock (NOW) provides date, time, timezone,
 * and location awareness. NOW wraps all time-related functions and ensures
 * consistent timezone handling across the system.
 * 
 * ROUTING: TRIGGER*AIR*NOW*TIME
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');

const AGENT_CONFIG = {
  id: 'NOW',
  fullName: 'Network Oriented Worldclock',
  acronym: 'NOW',
  agentNumber: 55,
  department: 'CALENDAR',
  departmentLead: false,
  reportsTo: 'RADAR',
  hierarchy: 'AIR → RADAR → NOW → Time APIs',
  autonomous: false,
  schedule: 'On-demand',
  commandable: true,
  apiEndpoint: '/api/now/time',
  type: 'UTILITY_AGENT',
  acl: '⬡B:abacia.agent.now:AGENT:now.time⬡',
  tetheredTo: ['AIR', 'RADAR'],
  uiVisible: true,
  vaulted: false
};

async function handle(intent, request) {
  AIR.trace('AIR', 'NOW', 'TIME', 'Getting time', 'CHECKING');
  
  const timezone = request?.timezone || 'America/New_York';
  const now = new Date();
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    utc: now.toISOString(),
    local: now.toLocaleString('en-US', { timeZone: timezone }),
    timezone,
    dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long', timeZone: timezone }),
    weAreAllABA: true
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
