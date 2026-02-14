/**
 * ⬡B:abacia.loader:LIB:agent.loader⬡
 * ABCD: ABACIA | v1.0.0-P1-S10
 * AGENT LOADER — Loads all 80 agents into AIR
 * We Are All ABA.
 */
const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '../agents');

function loadAllAgents() {
  const agents = {};
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('Agent.js'));
  
  for (const file of files) {
    try {
      const agentModule = require(path.join(AGENTS_DIR, file));
      const config = agentModule.config;
      if (config && config.id) {
        agents[config.id] = {
          name: config.fullName, acronym: config.acronym, agentNumber: config.agentNumber,
          department: config.department, departmentLead: config.departmentLead, reportsTo: config.reportsTo,
          acl: config.acl, autonomous: config.autonomous, commandable: config.commandable,
          uiVisible: config.uiVisible, vaulted: config.vaulted, status: 'active', handler: agentModule.handle
        };
      }
    } catch (err) {
      console.error(`[LOADER] Failed to load ${file}: ${err.message}`);
    }
  }
  console.log(`[LOADER] Loaded ${Object.keys(agents).length} agents`);
  return agents;
}

module.exports = { loadAllAgents };
