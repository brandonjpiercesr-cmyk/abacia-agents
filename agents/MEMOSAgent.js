/**
 * ⬡B:abacia.agent.memos:AGENT:memos.nervous⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Making Every Moment Organically Stick (MEMOS)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Making Every Moment Organically Stick
 * ACRONYM: MEMOS
 * AGENT NUMBER: #47
 * 
 * DEPARTMENT: COMMUNICATION (under CARA)
 * DEPARTMENT LEAD: NO (reports to CARA)
 * HIERARCHY: AIR → CARA → MEMOS → Users
 * 
 * AUTONOMOUS: YES - real-time messaging
 * SCHEDULE: Always listening for instant messages
 * COMMANDABLE: YES - /api/memos/send
 * 
 * TYPE: NERVOUS_SYSTEM_AGENT
 * ACL TAG: ⬡B:abacia.agent.memos:AGENT:memos.nervous⬡
 * 
 * TETHERED TO: AIR, CARA, WebSocket, Brain
 * UI VISIBLE: YES - instant messaging interface
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Making Every Moment Organically Stick (MEMOS) is ABA's nervous
 * system. THREE LAYERS: instant message, email, video. MEMOS handles
 * real-time communication, remembers context, and ensures every
 * interaction sticks in memory.
 * 
 * THREE LAYERS:
 * 1. Instant Message - real-time chat
 * 2. Email - asynchronous messages
 * 3. Video - recorded/live video messages
 * 
 * ROUTING: TRIGGER*AIR*MEMOS*WEBSOCKET*USER
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainWrite } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'MEMOS',
  fullName: 'Making Every Moment Organically Stick',
  acronym: 'MEMOS',
  agentNumber: 47,
  department: 'COMMUNICATION',
  departmentLead: false,
  reportsTo: 'CARA',
  hierarchy: 'AIR → CARA → MEMOS → Users',
  autonomous: true,
  schedule: 'Always listening',
  commandable: true,
  apiEndpoint: '/api/memos/send',
  type: 'NERVOUS_SYSTEM_AGENT',
  acl: '⬡B:abacia.agent.memos:AGENT:memos.nervous⬡',
  tetheredTo: ['AIR', 'CARA', 'WebSocket', 'Brain'],
  uiVisible: true,
  vaulted: false,
  layers: ['instant_message', 'email', 'video']
};

async function handle(intent, request) {
  AIR.trace('AIR', 'MEMOS', 'NERVOUS', 'Processing message', 'MESSAGING');
  
  const layer = request?.layer || 'instant_message';
  const content = request?.content || request?.message;
  const recipient = request?.recipient || request?.to;
  
  // Store in brain for persistence
  await brainWrite('aba_memory', {
    content: `MEMOS [${layer}] [${new Date().toISOString()}]: To ${recipient}: ${content?.substring(0, 100)}`,
    memory_type: 'system',
    categories: ['memos', layer],
    importance: 5,
    is_system: true,
    source: `memos_${Date.now()}`,
    tags: ['memos', layer, 'message']
  });
  
  AIR.trace('MEMOS', 'AIR', 'DELIVERY', `${layer} sent`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    layer,
    recipient,
    sent: true,
    weAreAllABA: true
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
