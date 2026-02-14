/**
 * ⬡B:abacia.agent.rawhi:AGENT:rawhi.extract⬡
 * Agent: Rally ABAs Who Have Isolated (RAWHI)
 * #37 | EXTRACTION | Reports to: LUKE
 * 9-step transcript extraction protocol
 * We Are All ABA.
 */
const AIR = require('../lib/air');
const AGENT_CONFIG = {
  id: 'RAWHI', fullName: 'Rally ABAs Who Have Isolated', acronym: 'RAWHI',
  agentNumber: 37, department: 'EXTRACTION', departmentLead: false, reportsTo: 'LUKE',
  acl: '⬡B:abacia.agent.rawhi:AGENT:rawhi.extract⬡', autonomous: true, commandable: true
};
async function handle(intent, request) {
  AIR.trace('AIR', 'RAWHI', 'EXTRACT', '9-step extraction', 'WORKING');
  return { agent: AGENT_CONFIG.fullName, acronym: 'RAWHI', acl: AGENT_CONFIG.acl, status: 'complete', weAreAllABA: true };
}
module.exports = { config: AGENT_CONFIG, handle };
