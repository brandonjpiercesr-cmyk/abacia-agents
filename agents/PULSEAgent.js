/**
 * ⬡B:abacia.agent.pulse:AGENT:pulse.heartbeat⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Persistent Uptime and Lifecycle Status Engine (PULSE)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Persistent Uptime and Lifecycle Status Engine
 * ACRONYM: PULSE
 * AGENT NUMBER: #51
 * 
 * DEPARTMENT: PROACTIVE
 * DEPARTMENT LEAD: NO (reports to DAWN)
 * HIERARCHY: AIR → DAWN → PULSE → All Agents
 * 
 * AUTONOMOUS: YES - heartbeat monitor
 * SCHEDULE: Every 5 minutes via heartbeat
 * COMMANDABLE: YES - /api/pulse/status
 * 
 * TYPE: HEARTBEAT_AGENT
 * ACL TAG: ⬡B:abacia.agent.pulse:AGENT:pulse.heartbeat⬡
 * 
 * TETHERED TO: AIR, DAWN, HeartbeatService, All Agents
 * UI VISIBLE: YES - status dashboard
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Persistent Uptime and Lifecycle Status Engine (PULSE) monitors
 * the health of ALL agents. PULSE checks heartbeats, kills misbehaving
 * agents, and reports system status. PULSE is the vital signs monitor
 * for the entire ABACIA system.
 * 
 * WHAT PULSE DOES:
 * 1. Checks health of all registered agents
 * 2. Tracks response times and error rates
 * 3. Issues kill commands for misbehaving agents
 * 4. Reports status to Command Center
 * 5. Escalates critical issues to SHADOW
 * 
 * ROUTING: HEARTBEAT*AIR*PULSE*ALL_AGENTS*STATUS
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');

const AGENT_CONFIG = {
  id: 'PULSE',
  fullName: 'Persistent Uptime and Lifecycle Status Engine',
  acronym: 'PULSE',
  agentNumber: 51,
  department: 'PROACTIVE',
  departmentLead: false,
  reportsTo: 'DAWN',
  hierarchy: 'AIR → DAWN → PULSE → All Agents',
  autonomous: true,
  schedule: 'Every 5 minutes via heartbeat',
  commandable: true,
  apiEndpoint: '/api/pulse/status',
  type: 'HEARTBEAT_AGENT',
  acl: '⬡B:abacia.agent.pulse:AGENT:pulse.heartbeat⬡',
  tetheredTo: ['AIR', 'DAWN', 'HeartbeatService', 'All Agents'],
  uiVisible: true,
  vaulted: false
};

// Agent health tracking
const agentHealth = new Map();

/**
 * PULSE's main handler - check system health
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'PULSE', 'ALL_AGENTS', 'Checking system health', 'SCANNING');
  
  const registry = AIR.AGENT_REGISTRY || {};
  const agentCount = Object.keys(registry).length;
  const activeCount = Object.values(registry).filter(a => a.status === 'active').length;
  
  const status = {
    timestamp: new Date().toISOString(),
    systemHealth: 'operational',
    agents: {
      total: agentCount,
      active: activeCount,
      inactive: agentCount - activeCount
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    heartbeatCycles: AIR.routingTraces?.length || 0
  };
  
  // Check for issues
  const issues = [];
  
  if (activeCount < agentCount * 0.5) {
    issues.push('More than half of agents inactive');
    status.systemHealth = 'degraded';
  }
  
  if (process.memoryUsage().heapUsed > 500 * 1024 * 1024) {
    issues.push('High memory usage');
    status.systemHealth = 'warning';
  }
  
  status.issues = issues;
  
  AIR.trace('PULSE', 'AIR', 'DELIVERY', `Health: ${status.systemHealth}`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    systemStatus: status,
    weAreAllABA: true
  };
}

/**
 * Kill a misbehaving agent
 */
async function killAgent(agentId, reason) {
  AIR.trace('PULSE', agentId, 'KILL', `Killing agent: ${reason}`, 'EXECUTING');
  
  // Update agent status in registry
  if (AIR.AGENT_REGISTRY && AIR.AGENT_REGISTRY[agentId]) {
    AIR.AGENT_REGISTRY[agentId].status = 'killed';
    AIR.AGENT_REGISTRY[agentId].killedAt = new Date().toISOString();
    AIR.AGENT_REGISTRY[agentId].killReason = reason;
  }
  
  return {
    agentId,
    killed: true,
    reason,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  config: AGENT_CONFIG,
  handle,
  killAgent
};

// We Are All ABA.
