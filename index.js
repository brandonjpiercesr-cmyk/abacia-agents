/**
 * ⬡B:abacia.agents:INDEX:agents.main⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10
 *
 * ═══════════════════════════════════════════════════════════════
 * ABACIA AGENTS — All 80 Agents Module
 * ═══════════════════════════════════════════════════════════════
 *
 * This is the main entry point for all ABACIA agents.
 * Import this module to access all agents.
 *
 * We Are All ABA.
 */

const { loadAllAgents, getAgent, getAgentsByDepartment, getDepartmentLeads, buildHierarchy } = require('./lib/agent-loader');

// Load all agents on module initialization
const AGENTS = loadAllAgents();
const HIERARCHY = buildHierarchy(AGENTS);

/**
 * Dispatch to an agent by ID
 */
async function dispatch(agentId, intent, request) {
  const agent = AGENTS[agentId];
  
  if (!agent) {
    return {
      agent: agentId,
      status: 'error',
      error: `Agent ${agentId} not found`,
      weAreAllABA: true
    };
  }
  
  if (!agent.handler) {
    return {
      agent: agent.name,
      acronym: agentId,
      acl: agent.acl,
      status: 'acknowledged',
      message: `${agent.name} received task but has no handler`,
      weAreAllABA: true
    };
  }
  
  try {
    return await agent.handler(intent, request);
  } catch (err) {
    return {
      agent: agent.name,
      acronym: agentId,
      acl: agent.acl,
      status: 'error',
      error: err.message,
      weAreAllABA: true
    };
  }
}

module.exports = {
  AGENTS,
  HIERARCHY,
  dispatch,
  getAgent: (id) => getAgent(AGENTS, id),
  getAgentsByDepartment: (dept) => getAgentsByDepartment(AGENTS, dept),
  getDepartmentLeads: () => getDepartmentLeads(AGENTS),
  agentCount: Object.keys(AGENTS).length
};

// We Are All ABA.
