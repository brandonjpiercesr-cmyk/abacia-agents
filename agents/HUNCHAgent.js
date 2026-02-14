/**
 * ⬡B:abacia.agent.hunch:AGENT:hunch.proactive⬡
 * ABCD: ABACIA
 * v1.0.0-P1-S10.1
 *
 * ═══════════════════════════════════════════════════════════════
 * Agent: Helpful Unsolicited Notifications and Contextual Hints (HUNCH)
 * ═══════════════════════════════════════════════════════════════
 *
 * FULL NAME: Helpful Unsolicited Notifications and Contextual Hints
 * ACRONYM: HUNCH
 * AGENT NUMBER: #30
 * 
 * DEPARTMENT: PROACTIVE
 * DEPARTMENT LEAD: NO (reports to DAWN)
 * HIERARCHY: AIR → DAWN → HUNCH → User
 * 
 * AUTONOMOUS: YES - scans context periodically
 * SCHEDULE: Every 30 minutes via heartbeat
 * COMMANDABLE: NO - proactive only
 * 
 * TYPE: PROACTIVE_AGENT
 * ACL TAG: ⬡B:abacia.agent.hunch:AGENT:hunch.proactive⬡
 * 
 * TETHERED TO: AIR, DAWN, SAGE, Brain
 * UI VISIBLE: YES - push notifications
 * VAULTED: NO
 * 
 * JOB DESCRIPTION:
 * Agent: Helpful Unsolicited Notifications and Contextual Hints (HUNCH)
 * pushes suggestions without being asked. "Hey, you mentioned X last
 * week — here's an update." HUNCH connects the dots across conversations
 * and proactively surfaces relevant information.
 * 
 * WHAT HUNCH DOES:
 * 1. Scans recent conversations for followup opportunities
 * 2. Connects topics across different chats
 * 3. Surfaces "did you know" moments
 * 4. Pushes notifications via Command Center
 * 5. Never interrupts active conversations
 * 
 * ROUTING: CRON*AIR*HUNCH*SAGE*BRAIN*PUSH
 * 
 * We Are All ABA.
 */

const AIR = require('../lib/air');
const { brainRead, brainSearch } = require('../lib/supabase');

const AGENT_CONFIG = {
  id: 'HUNCH',
  fullName: 'Helpful Unsolicited Notifications and Contextual Hints',
  acronym: 'HUNCH',
  agentNumber: 30,
  department: 'PROACTIVE',
  departmentLead: false,
  reportsTo: 'DAWN',
  hierarchy: 'AIR → DAWN → HUNCH → User',
  autonomous: true,
  schedule: 'Every 30 minutes via heartbeat',
  commandable: false,
  type: 'PROACTIVE_AGENT',
  acl: '⬡B:abacia.agent.hunch:AGENT:hunch.proactive⬡',
  tetheredTo: ['AIR', 'DAWN', 'SAGE', 'Brain'],
  uiVisible: true,
  vaulted: false
};

/**
 * HUNCH's main handler - find contextual hints
 */
async function handle(intent, request) {
  AIR.trace('AIR', 'HUNCH', 'SAGE', 'Scanning for contextual hints', 'SCANNING');
  
  const hints = [];
  
  // Look for unfinished business
  const unfinished = await brainSearch('action_needed', 10);
  if (unfinished && unfinished.length > 0) {
    hints.push({
      type: 'unfinished_task',
      message: `You have ${unfinished.length} pending action items`,
      urgency: 6
    });
  }
  
  // Look for recent topics that might need followup
  const recentTopics = await brainRead('aba_memory', 
    'tags=cs.{transcript}&order=created_at.desc&limit=5'
  );
  
  if (recentTopics && recentTopics.length > 0) {
    // Find patterns in recent conversations
    const topics = extractTopics(recentTopics);
    if (topics.length > 0) {
      hints.push({
        type: 'recent_topic',
        message: `You've been discussing: ${topics.join(', ')}`,
        topics,
        urgency: 3
      });
    }
  }
  
  AIR.trace('HUNCH', 'AIR', 'DELIVERY', `Found ${hints.length} hints`, 'COMPLETE');
  
  return {
    agent: AGENT_CONFIG.fullName,
    acronym: AGENT_CONFIG.acronym,
    acl: AGENT_CONFIG.acl,
    status: 'complete',
    hintCount: hints.length,
    hints,
    scanTime: new Date().toISOString(),
    weAreAllABA: true
  };
}

/**
 * Extract topics from recent memories
 */
function extractTopics(memories) {
  const topics = new Set();
  const keywords = ['meeting', 'project', 'deadline', 'call', 'email', 'client'];
  
  memories.forEach(m => {
    const content = m.content || '';
    keywords.forEach(kw => {
      if (content.toLowerCase().includes(kw)) {
        topics.add(kw);
      }
    });
  });
  
  return Array.from(topics).slice(0, 5);
}

module.exports = {
  config: AGENT_CONFIG,
  handle
};

// We Are All ABA.
