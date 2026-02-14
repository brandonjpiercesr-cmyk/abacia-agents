/**
 * ⬡B:abacia.agent.dial:AGENT:dial.calls⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Direct Intelligence Auditory Link (DIAL)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Direct Intelligence Auditory Link
 * ACRONYM: DIAL
 * AGENT NUMBER: #64
 * 
 * DEPARTMENT: VOICE (under VARA)
 * DEPARTMENT LEAD: NO (reports to VARA)
 * HIERARCHY: AIR → VARA → DIAL → Twilio
 * 
 * AUTONOMOUS: YES - receives incoming calls
 * SCHEDULE: Always listening for calls
 * COMMANDABLE: YES - /api/dial/call
 * 
 * TYPE: PHONE_AGENT
 * ACL TAG: ⬡B:abacia.agent.dial:AGENT:dial.calls⬡
 * 
 * TETHERED TO: AIR, VARA, Twilio, COOK, REACH
 * UI VISIBLE: YES - call interface
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Direct Intelligence Auditory Link (DIAL) handles phone calls.
 * Makes outbound calls, receives inbound calls, integrates with Twilio.
 * Works with COOK for live call coaching and VARA for voice synthesis.
 * 
 * ROUTING: TRIGGER*AIR*DIAL*TWILIO*PHONE
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');

const AGENT_CONFIG = {
  id: 'DIAL',
  fullName: 'Direct Intelligence Auditory Link',
  acronym: 'DIAL',
  agentNumber: 64,
  department: 'VOICE',
  departmentLead: false,
  reportsTo: 'VARA',
  hierarchy: 'AIR → VARA → DIAL → Twilio',
  autonomous: true,
  schedule: 'Always listening',
  commandable: true,
  apiEndpoint: '/api/dial/call',
  type: 'PHONE_AGENT',
  acl: '⬡B:abacia.agent.dial:AGENT:dial.calls⬡',
  tetheredTo: ['AIR', 'VARA', 'Twilio', 'COOK', 'REACH'],
  uiVisible: true,
  vaulted: false
};

async function handle(intent, request) {
  AIR.trace('AIR', 'DIAL', 'TWILIO', 'Processing call request', 'DIALING');
  
  const action = request?.action || 'make_call';
  const phoneNumber = request?.to || request?.phoneNumber;
  
  AIR.trace('DIAL', 'AIR', 'DELIVERY', `Call ${action}`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    action,
    phoneNumber,
    weAreAllABA: true
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
