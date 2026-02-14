/**
 * ⬡B:abacia.agent.roam:AGENT:roam.research⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Research Opportunities and Meeting Mapper (ROAM)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Research Opportunities and Meeting Mapper
 * ACRONYM: ROAM
 * AGENT NUMBER: #28
 * 
 * DEPARTMENT: CALENDAR (under RADAR)
 * DEPARTMENT LEAD: NO (reports to RADAR)
 * HIERARCHY: AIR → RADAR → ROAM → Conferences/Meetups
 * 
 * AUTONOMOUS: YES - scans for opportunities weekly
 * SCHEDULE: Weekly on Mondays
 * COMMANDABLE: YES - /api/roam/search
 * 
 * TYPE: RESEARCH_AGENT
 * ACL TAG: ⬡B:abacia.agent.roam:AGENT:roam.research⬡
 * 
 * TETHERED TO: AIR, RADAR, SAGE, Web APIs
 * UI VISIBLE: YES - opportunity dashboard
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Research Opportunities and Meeting Mapper (ROAM) finds
 * conferences for EBC clients and GMG meetups. Maps networking
 * opportunities, tracks industry events, suggests relevant gatherings.
 * 
 * ROUTING: CRON*AIR*ROAM*WEB*BRAIN
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainWrite, brainSearch } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'ROAM',
  fullName: 'Research Opportunities and Meeting Mapper',
  acronym: 'ROAM',
  agentNumber: 28,
  department: 'CALENDAR',
  departmentLead: false,
  reportsTo: 'RADAR',
  hierarchy: 'AIR → RADAR → ROAM → Conferences/Meetups',
  autonomous: true,
  schedule: 'Weekly on Mondays',
  commandable: true,
  apiEndpoint: '/api/roam/search',
  type: 'RESEARCH_AGENT',
  acl: '⬡B:abacia.agent.roam:AGENT:roam.research⬡',
  tetheredTo: ['AIR', 'RADAR', 'SAGE', 'Web APIs'],
  uiVisible: true,
  vaulted: false
};

async function handle(intent, request) {
  AIR.trace('AIR', 'ROAM', 'RESEARCH', 'Searching opportunities', 'SCANNING');
  
  const query = request?.query || intent?.content || '';
  const results = await brainSearch(query || 'conference meetup event', 10);
  
  AIR.trace('ROAM', 'AIR', 'DELIVERY', `Found ${results?.length || 0} opportunities`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    query,
    opportunityCount: results?.length || 0,
    weAreAllABA: true
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
