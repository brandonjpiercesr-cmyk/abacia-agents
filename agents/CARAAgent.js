/**
 * ⬡B:abacia.agent.cara:AGENT:cara.outreach⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Communication And Reach Agent (CARA)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Communication And Reach Agent
 * ACRONYM: CARA
 * AGENT NUMBER: #62
 * 
 * DEPARTMENT: OUTREACH
 * DEPARTMENT LEAD: YES ⭐
 * HIERARCHY: AIR → CARA → [MEMOS, DIAL, REACH]
 * 
 * AUTONOMOUS: NO - triggered by outreach requests
 * SCHEDULE: On-demand
 * COMMANDABLE: YES - /api/outreach/send
 * 
 * TYPE: OUTREACH_AGENT
 * ACL TAG: ⬡B:abacia.agent.cara:AGENT:cara.outreach⬡
 * 
 * TETHERED TO: AIR, IMAN, REACH, Twilio, Nylas
 * UI VISIBLE: YES - outreach dashboard
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Communication And Reach Agent (CARA) is ABA's touch — the
 * persona agent. CARA handles multi-platform outreach with consistent
 * voice across email, SMS, social, and calls. CARA maintains the
 * relationship persona with all external contacts.
 * 
 * WHAT CARA DOES:
 * 1. Multi-channel outreach (email, SMS, call, social)
 * 2. Maintains consistent ABA voice across platforms
 * 3. Tracks relationship history with contacts
 * 4. Coordinates with IMAN for email, DIAL for calls
 * 5. Dispatches to MEMOS for instant messages
 * 
 * ROUTING: TRIGGER*AIR*CARA*[IMAN|DIAL|MEMOS]*DELIVERY
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainWrite, brainSearch } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'CARA',
  fullName: 'Communication And Reach Agent',
  acronym: 'CARA',
  agentNumber: 62,
  department: 'OUTREACH',
  departmentLead: true,
  hierarchy: 'AIR → CARA → [MEMOS, DIAL, REACH]',
  autonomous: false,
  schedule: 'On-demand',
  commandable: true,
  apiEndpoint: '/api/outreach/send',
  type: 'OUTREACH_AGENT',
  acl: '⬡B:abacia.agent.cara:AGENT:cara.outreach⬡',
  tetheredTo: ['AIR', 'IMAN', 'REACH', 'Twilio', 'Nylas'],
  uiVisible: true,
  vaulted: false
};

/**
 * CARA's main handler - outreach coordination
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'CARA', 'OUTREACH', 'Processing outreach request', 'ROUTING');
  
  const channel = request?.channel || intent?.category || 'email';
  const recipient = request?.recipient || request?.to;
  const message = request?.message || request?.content;
  
  if (!recipient || !message) {
    return {
      agent: AGENT_CONFIG.fullName,
      acronym: AGENT_CONFIG.acronym,
      acl: AGENT_CONFIG.acl,
      status: 'error',
      error: 'Recipient and message required',
      weAreAllABA: true
    };
  }
  
  // Determine which agent handles this channel
  const channelRouting = {
    email: 'IMAN',
    sms: 'REACH',
    call: 'DIAL',
    message: 'MEMOS'
  };
  
  const targetAgent = channelRouting[channel] || 'IMAN';
  
  AIR.trace('CARA', targetAgent, 'AIR', `Routing to ${targetAgent}`, 'DISPATCHING');
  
  // Get contact history
  const history = await brainSearch(recipient, 5);
  
  // Log outreach
  await brainWrite('aba_memory', {
    content: `OUTREACH [${new Date().toISOString()}]: ${channel} to ${recipient} via ${targetAgent}`,
    memory_type: 'system',
    categories: ['outreach', channel, targetAgent.toLowerCase()],
    importance: 5,
    is_system: true,
    source: `cara_${Date.now()}`,
    tags: ['outreach', channel, 'cara']
  });
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    channel,
    recipient,
    routedTo: targetAgent,
    contactHistory: history?.length || 0,
    weAreAllABA: true
  };
}

/**
 * Dispatch to department agents
 */
async function dispatchToDepartment(agentId, task) {
  AIR.trace('CARA', agentId, 'AIR', `Dispatching to ${agentId}`, 'ROUTING');
  
  // Department agents CARA can dispatch to:
  // MEMOS, DIAL, REACH (service)
  return {
    dispatched: true,
    agent: agentId,
    task
  };
}

module.exports = {
  config: AGENT_CONFIG,
  handle,
  dispatchToDepartment
};

// We Are All ABA.
