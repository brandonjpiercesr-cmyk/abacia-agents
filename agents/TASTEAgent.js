/**
 * ⬡B:abacia.agent.taste:AGENT:taste.audio⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.2
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Tactical Audio Selection and Transcription Engine (TASTE)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Tactical Audio Selection and Transcription Engine
 * ACRONYM: TASTE
 * AGENT NUMBER: #51
 * 
 * DEPARTMENT: VOICE (under VARA)
 * DEPARTMENT LEAD: NO (reports to VARA)
 * HIERARCHY: AIR → VARA → TASTE → Transcription
 * 
 * AUTONOMOUS: YES - processes audio queue
 * SCHEDULE: On audio received
 * COMMANDABLE: YES - /api/taste/transcribe
 * 
 * TYPE: AUDIO_AGENT
 * ACL TAG: ⬡B:abacia.agent.taste:AGENT:taste.audio⬡
 * 
 * TETHERED TO: AIR, VARA, HEAR, Deepgram, Whisper
 * UI VISIBLE: NO - background processing
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Tactical Audio Selection and Transcription Engine (TASTE)
 * selects the best transcription engine for each audio file. Compares
 * Deepgram, Whisper, and other options based on accuracy, speed, cost.
 * 
 * ROUTING: HEAR*AIR*TASTE*[DEEPGRAM|WHISPER]*TRANSCRIPT
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');

const AGENT_CONFIG = {
  id: 'TASTE',
  fullName: 'Tactical Audio Selection and Transcription Engine',
  acronym: 'TASTE',
  agentNumber: 51,
  department: 'VOICE',
  departmentLead: false,
  reportsTo: 'VARA',
  hierarchy: 'AIR → VARA → TASTE → Transcription',
  autonomous: true,
  schedule: 'On audio received',
  commandable: true,
  apiEndpoint: '/api/taste/transcribe',
  type: 'AUDIO_AGENT',
  acl: '⬡B:abacia.agent.taste:AGENT:taste.audio⬡',
  tetheredTo: ['AIR', 'VARA', 'HEAR', 'Deepgram', 'Whisper'],
  uiVisible: false,
  vaulted: false,
  engines: ['deepgram', 'whisper', 'google_stt']
};

async function handle(intent, request) {
  AIR.trace('AIR', 'TASTE', 'ENGINE', 'Selecting transcription engine', 'ANALYZING');
  
  const audioLength = request?.duration || 60;
  const quality = request?.quality || 'standard';
  
  // Select engine based on requirements
  let selectedEngine = 'deepgram';
  if (quality === 'high' || audioLength > 300) {
    selectedEngine = 'whisper';
  }
  
  AIR.trace('TASTE', 'AIR', 'DELIVERY', `Selected ${selectedEngine}`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    selectedEngine,
    audioLength,
    quality,
    weAreAllABA: true
  };
}

module.exports = { config: AGENT_CONFIG, handle };
// We Are All ABA.
