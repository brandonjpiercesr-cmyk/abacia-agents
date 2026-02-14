/**
 * ⬡B:abacia.agent.hear:AGENT:hear.ears⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Hearing Engine for Ambient Recognition (HEAR)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Hearing Engine for Ambient Recognition
 * ACRONYM: HEAR
 * AGENT NUMBER: #14
 * 
 * DEPARTMENT: VOICE (under VARA)
 * DEPARTMENT LEAD: NO (reports to VARA)
 * HIERARCHY: AIR → VARA → HEAR → LUKE
 * 
 * AUTONOMOUS: YES - triggered by OMI webhook
 * SCHEDULE: On OMI transcript received
 * COMMANDABLE: NO - internal only
 * 
 * TYPE: AUDIO_AGENT
 * ACL TAG: ⬡B:abacia.agent.hear:AGENT:hear.ears⬡
 * 
 * TETHERED TO: AIR, VARA, OMI, Deepgram, LUKE
 * UI VISIBLE: NO - background audio processing
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Hearing Engine for Ambient Recognition (HEAR) is ABA's ears.
 * HEAR receives audio from OMI device, browser mic, or phone calls.
 * Transcribes via Deepgram, stores in brain, routes to LUKE for
 * action extraction.
 * 
 * WHAT HEAR DOES:
 * 1. Receives audio streams from OMI/browser/phone
 * 2. Transcribes via Deepgram speech-to-text
 * 3. Stores transcripts in brain with omi_transcript tag
 * 4. Routes to LUKE for action extraction
 * 5. Notifies SCRIBE if recording mode active
 * 
 * ROUTING: OMI*AIR*HEAR*DEEPGRAM*BRAIN*LUKE
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainWrite } = require('../lib/supabase');

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

const AGENT_CONFIG = {
  id: 'HEAR',
  fullName: 'Hearing Engine for Ambient Recognition',
  acronym: 'HEAR',
  agentNumber: 14,
  department: 'VOICE',
  departmentLead: false,
  reportsTo: 'VARA',
  hierarchy: 'AIR → VARA → HEAR → LUKE',
  autonomous: true,
  schedule: 'On OMI transcript received',
  commandable: false,
  type: 'AUDIO_AGENT',
  acl: '⬡B:abacia.agent.hear:AGENT:hear.ears⬡',
  tetheredTo: ['AIR', 'VARA', 'OMI', 'Deepgram', 'LUKE'],
  uiVisible: false,
  vaulted: false
};

/**
 * HEAR's main handler - process audio/transcript
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'HEAR', 'BRAIN', 'Processing audio input', 'LISTENING');
  
  const transcript = request?.transcript || request?.content || '';
  const source = request?.source || 'unknown';
  const timestamp = new Date().toISOString();
  
  if (!transcript) {
    return {
      agent: AGENT_CONFIG.fullName,
      acronym: AGENT_CONFIG.acronym,
      acl: AGENT_CONFIG.acl,
      status: 'no_content',
      message: 'No transcript received',
      weAreAllABA: true
    };
  }
  
  // Store transcript in brain
  await brainWrite('aba_memory', {
    content: `TRANSCRIPT [${timestamp}] [${source}]: ${transcript}`,
    memory_type: 'system',
    categories: ['transcript', 'omi', source],
    importance: 6,
    is_system: true,
    source: `hear_${Date.now()}`,
    tags: ['transcript', 'omi', 'hear', source]
  });
  
  AIR.trace('HEAR', 'BRAIN', 'HEAR', 'Transcript stored', 'STORED');
  
  // Route to LUKE for action extraction
  AIR.trace('HEAR', 'LUKE', 'AIR', 'Routing for action extraction', 'ROUTING');
  
  // LUKE will be called by AIR's dispatch system
  const lukeRequest = {
    transcript,
    source,
    timestamp,
    extractActions: true
  };
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    transcriptLength: transcript.length,
    source,
    storedAt: timestamp,
    routedTo: 'LUKE',
    lukeRequest,
    weAreAllABA: true
  };
}

module.exports = {
  config: AGENT_CONFIG,
  handle
};

// We Are All ABA.
