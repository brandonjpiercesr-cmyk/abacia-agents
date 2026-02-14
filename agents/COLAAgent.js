/**
 * ⬡B:abacia.agent.cola:AGENT:cola.analysis⬡
 * Agent: Context Oriented Language Analyzer (COLA)
 * #20 | ANALYSIS | Department Lead ⭐
 * Context analysis for conversations
 * We Are All ABA.
 */
const AIR = require('../lib/air');
const AGENT_CONFIG = {
  id: 'COLA', fullName: 'Context Oriented Language Analyzer', acronym: 'COLA',
  agentNumber: 20, department: 'ANALYSIS', departmentLead: true,
  acl: '⬡B:abacia.agent.cola:AGENT:cola.analysis⬡', autonomous: true, commandable: true
};
async function handle(intent, request) {
  AIR.trace('AIR', 'COLA', 'ANALYZE', 'Context analysis', 'WORKING');
  return { agent: AGENT_CONFIG.fullName, acronym: 'COLA', acl: AGENT_CONFIG.acl, status: 'complete', weAreAllABA: true };
}
module.exports = { config: AGENT_CONFIG, handle };
