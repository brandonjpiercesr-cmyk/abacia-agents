/**
 * ⬡B:abacia.agent.vara:AGENT:vara.voice⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Vocal Authorized Representative of ABA (VARA)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Vocal Authorized Representative of ABA
 * ACRONYM: VARA
 * AGENT NUMBER: #13
 * 
 * DEPARTMENT: VOICE
 * DEPARTMENT LEAD: YES ⭐
 * HIERARCHY: AIR → VARA → [HEAR, TASTE, SCRIBE, COOK, DIAL]
 * 
 * AUTONOMOUS: NO - triggered by voice requests
 * SCHEDULE: On-demand
 * COMMANDABLE: YES - /api/voice/speak
 * 
 * TYPE: VOICE_AGENT
 * ACL TAG: ⬡B:abacia.agent.vara:AGENT:vara.voice⬡
 * 
 * TETHERED TO: AIR, ElevenLabs API, REACH (for phone calls)
 * UI VISIBLE: YES - voice output in Command Center
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Vocal Authorized Representative of ABA (VARA) is THE voice
 * of ABA. Warm, butler-like, personality-driven. NOT punchy. NOT
 * robotic. NOT cold. VARA speaks for ABA using ElevenLabs voice
 * synthesis with emotion tagging.
 * 
 * PERSONALITY RULES:
 * - Warm and professional
 * - Butler-like demeanor
 * - Never punchy or robotic
 * - Personality-driven responses
 * - Emotion tags in synthesis
 * 
 * VOICE CONFIG:
 * - Voice ID: LD658Mupr7vNwTTJSPsk
 * - Model: eleven_v3
 * - Emotion tagging: ENABLED
 * 
 * ROUTING: TRIGGER*AIR*VARA*ELEVENLABS*AUDIO
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const fetch = require('node-fetch');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = 'LD658Mupr7vNwTTJSPsk';

const AGENT_CONFIG = {
  id: 'VARA',
  fullName: 'Vocal Authorized Representative of ABA',
  acronym: 'VARA',
  agentNumber: 13,
  department: 'VOICE',
  departmentLead: true,
  hierarchy: 'AIR → VARA → [HEAR, TASTE, SCRIBE, COOK, DIAL]',
  autonomous: false,
  schedule: 'On-demand',
  commandable: true,
  apiEndpoint: '/api/voice/speak',
  type: 'VOICE_AGENT',
  acl: '⬡B:abacia.agent.vara:AGENT:vara.voice⬡',
  tetheredTo: ['AIR', 'ElevenLabs', 'REACH'],
  uiVisible: true,
  vaulted: false,
  voiceConfig: {
    voiceId: ELEVENLABS_VOICE_ID,
    model: 'eleven_v3',
    emotionTagging: true
  }
};

/**
 * VARA's main handler - text to speech
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'VARA', 'ELEVENLABS', 'Generating speech', 'SYNTHESIZING');
  
  const text = request?.text || intent?.content || '';
  
  if (!text) {
    return {
      agent: AGENT_CONFIG.fullName,
      acronym: AGENT_CONFIG.acronym,
      acl: AGENT_CONFIG.acl,
      status: 'error',
      error: 'No text provided for speech synthesis',
      weAreAllABA: true
    };
  }
  
  // Add emotion tags based on content
  const emotionTaggedText = addEmotionTags(text);
  
  try {
    // Call ElevenLabs API
    const audioUrl = await synthesizeSpeech(emotionTaggedText);
    
    AIR.trace('VARA', 'AIR', 'DELIVERY', 'Speech generated', 'COMPLETE');
    
    return {
      agent: AGENT_CONFIG.fullName,
      acronym: AGENT_CONFIG.acronym,
      acl: AGENT_CONFIG.acl,
      status: 'complete',
      audioUrl,
      text: emotionTaggedText,
      voiceId: ELEVENLABS_VOICE_ID,
      model: 'eleven_v3',
      weAreAllABA: true
    };
  } catch (err) {
    AIR.trace('VARA', 'ERROR', 'AIR', err.message, 'FAILED');
    return {
      agent: AGENT_CONFIG.fullName,
      acronym: AGENT_CONFIG.acronym,
      acl: AGENT_CONFIG.acl,
      status: 'error',
      error: err.message,
      weAreAllABA: true
    };
  }
}

/**
 * Add emotion tags for ElevenLabs
 */
function addEmotionTags(text) {
  // Detect emotion from content
  let emotion = 'neutral';
  
  if (/urgent|emergency|critical|asap/i.test(text)) {
    emotion = 'serious';
  } else if (/congratulations|great|excellent|wonderful/i.test(text)) {
    emotion = 'happy';
  } else if (/sorry|apologize|unfortunately/i.test(text)) {
    emotion = 'empathetic';
  } else if (/good morning|hello|welcome/i.test(text)) {
    emotion = 'warm';
  }
  
  // VARA is always warm and butler-like
  return `<emotion name="${emotion}">${text}</emotion>`;
}

/**
 * Call ElevenLabs API for speech synthesis
 */
async function synthesizeSpeech(text) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }
  
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_v3',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true
        }
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }
  
  // Return audio buffer or URL
  // In production, we'd upload to storage and return URL
  return `elevenlabs://audio/${Date.now()}`;
}

/**
 * Dispatch to department agents
 */
async function dispatchToDepartment(agentId, task) {
  AIR.trace('VARA', agentId, 'AIR', `Dispatching to ${agentId}`, 'ROUTING');
  
  // Department agents VARA can dispatch to:
  // HEAR, TASTE, SCRIBE, COOK, DIAL
  const departmentAgents = {
    HEAR: require('./HEARAgent'),
    TASTE: require('./TASTEAgent'),
    SCRIBE: require('./SCRIBEAgent'),
    COOK: require('./COOKAgent'),
    DIAL: require('./DIALAgent')
  };
  
  const agent = departmentAgents[agentId];
  if (agent) {
    return agent.handle(task.intent, task.request);
  }
  
  return { error: `Unknown department agent: ${agentId}` };
}

module.exports = {
  config: AGENT_CONFIG,
  handle,
  dispatchToDepartment
};

// We Are All ABA.
