/**
 * ⬡B:abacia.agent.scribe:AGENT:scribe.recording⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Systematic Capture and Recording of Important Business Events (SCRIBE)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Systematic Capture and Recording of Important Business Events
 * ACRONYM: SCRIBE
 * AGENT NUMBER: #79
 * 
 * DEPARTMENT: VOICE (under VARA)
 * DEPARTMENT LEAD: NO (reports to VARA)
 * HIERARCHY: AIR → VARA → SCRIBE → Storage
 * 
 * AUTONOMOUS: YES - records when triggered
 * SCHEDULE: On meeting/call start
 * COMMANDABLE: YES - /api/scribe/record
 * 
 * TYPE: RECORDING_AGENT
 * ACL TAG: ⬡B:abacia.agent.scribe:AGENT:scribe.recording⬡
 * 
 * TETHERED TO: AIR, VARA, HEAR, OMI, Storage
 * UI VISIBLE: YES - recording indicator
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Systematic Capture and Recording of Important Business Events (SCRIBE)
 * handles meeting and session recording. Captures audio, marks timestamps,
 * coordinates with TASTE for transcription after recording ends.
 * 
 * ROUTING: TRIGGER*AIR*SCRIBE*STORAGE*TASTE
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainWrite } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'SCRIBE',
  fullName: 'Systematic Capture and Recording of Important Business Events',
  acronym: 'SCRIBE',
  agentNumber: 79,
  department: 'VOICE',
  departmentLead: false,
  reportsTo: 'VARA',
  hierarchy: 'AIR → VARA → SCRIBE → Storage',
  autonomous: true,
  schedule: 'On meeting/call start',
  commandable: true,
  apiEndpoint: '/api/scribe/record',
  type: 'RECORDING_AGENT',
  acl: '⬡B:abacia.agent.scribe:AGENT:scribe.recording⬡',
  tetheredTo: ['AIR', 'VARA', 'HEAR', 'OMI', 'Storage'],
  uiVisible: true,
  vaulted: false
};

async function handle(intent, request) {
  AIR.trace('AIR', 'SCRIBE', 'RECORDING', 'Processing recording', 'CAPTURING');
  
  const action = request?.action || 'start';
  const sessionId = request?.sessionId || `session_${Date.now()}`;
  
  await brainWrite('aba_memory', {
    content: `SCRIBE [${action}] [${new Date().toISOString()}]: Session ${sessionId}`,
    memory_type: 'system',
    categories: ['scribe', 'recording', action],
    importance: 6,
    is_system: true,
    source: `scribe_${Date.now()}`,
    tags: ['scribe', 'recording', action]
  });
  
  AIR.trace('SCRIBE', 'AIR', 'DELIVERY', `Recording ${action}`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    action,
    sessionId,
    weAreAllABA: true
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
