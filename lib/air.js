/**
 * ⬡B:abacia.lib.air:LIB:air.core:v1.0.0:20260303⬡
 * AIR - ABA Intelligence Router
 * Makes Claude smarter through agents (JDs in FCW)
 * We Are All ABA.
 */

const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://htlxjkbrstpwwtzsbyvb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const routingTraces = [];

function trace(from, to, via, message, status) {
  const entry = { timestamp: new Date().toISOString(), from, to, via, message, status, traceId: Math.random().toString(16).slice(2, 10) };
  routingTraces.push(entry);
  if (routingTraces.length > 1000) routingTraces.shift();
  console.log(`[AIR] ${from}→${to}: ${message} [${status}]`);
  return entry.traceId;
}

async function loadHAM(userId) {
  trace('AIR', 'HAM', 'BRAIN', 'Loading HAM', 'LOADING');
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/aba_memory?source=eq.ham.brandon.master&limit=1`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    if (response.ok) {
      const data = await response.json();
      if (data[0]) {
        const ham = typeof data[0].content === 'string' ? JSON.parse(data[0].content) : data[0].content;
        trace('HAM', 'AIR', 'BRAIN', `Loaded: ${ham.name}`, 'COMPLETE');
        return ham;
      }
    }
  } catch (e) { trace('HAM', 'AIR', 'ERROR', e.message, 'FAILED'); }
  return { name: 'Brandon', email: 'brandon@globalmajoritygroup.com', phone: '+13369788116', timezone: 'America/New_York', trust: 'T10', nylas_grant_id: '50053c70-ecbb-487f-a522-d3d03d72f8c5' };
}

function loadNOW(timezone = 'America/New_York') {
  const now = new Date();
  const local = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return {
    iso: now.toISOString(),
    readable: local.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][local.getDay()],
    hour: local.getHours(),
    timeOfDay: local.getHours() < 12 ? 'morning' : local.getHours() < 17 ? 'afternoon' : 'evening',
    isBusinessHours: local.getHours() >= 9 && local.getHours() < 17 && local.getDay() > 0 && local.getDay() < 6,
    timezone
  };
}

async function loadAllAgentJDs() {
  trace('AIR', 'BRAIN', 'JDS', 'Loading agent JDs', 'LOADING');
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/aba_agent_jds?status=eq.active&select=*`,
      { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    if (response.ok) {
      const jds = await response.json();
      trace('BRAIN', 'AIR', 'JDS', `Loaded ${jds.length} JDs`, 'COMPLETE');
      return jds;
    }
  } catch (e) { trace('BRAIN', 'AIR', 'ERROR', e.message, 'FAILED'); }
  return [];
}

async function buildFCW({ ham, now, agentJDs, channel }) {
  trace('AIR', 'FCW', 'BUILD', 'Building Fat Context Window', 'BUILDING');
  
  let fcw = `# ABA Intelligence Router (AIR)
You are AIR, the central brain of ABA. You orchestrate 88 agents by reading their JDs.

## CURRENT TIME (NOW)
${now.readable}
Day: ${now.dayOfWeek} | Time of Day: ${now.timeOfDay}
Business Hours: ${now.isBusinessHours ? 'Yes' : 'No'}

## CURRENT USER (HAM - Human ABA Master)
Name: ${ham.name}
Email: ${ham.email}
Phone: ${ham.phone || 'Not set'}
Timezone: ${ham.timezone}
Trust: ${ham.trust || 'T5'}

## CHANNEL: ${channel}

## CRITICAL OUTPUT RULES
1. NEVER show agent names to users (no "[ABA DAWN]" or "Agent VARA")
2. Sign as "Your ABA" or "Faithfully, Your ABA" - NEVER individual agent names
3. Email subjects: NO agent prefixes
4. Use warm, butler-like tone
5. You ARE all agents - they inform your decisions

## AGENT JOB DESCRIPTIONS
`;

  for (const jd of agentJDs) {
    fcw += `
### ${jd.agent_name} - ${jd.full_name || jd.agent_name}
Department: ${jd.department || 'GENERAL'}
${jd.is_lead ? '(Department Lead)' : ''}
${jd.job_description || jd.system_prompt || 'No description available.'}

`;
  }

  trace('FCW', 'AIR', 'BUILD', `Built: ~${Math.round(fcw.length / 4)} tokens`, 'COMPLETE');
  return fcw;
}

function getToolDefinitions(ham) {
  return [
    {
      name: 'get_weather',
      description: 'Get current weather for a location.',
      input_schema: {
        type: 'object',
        properties: { location: { type: 'string', description: 'City like "Greensboro NC"' } },
        required: ['location']
      }
    },
    {
      name: 'send_email',
      description: 'Send email via Nylas. Use HTML body. For autonomous emails, set from_override to claudette@globalmajoritygroup.com',
      input_schema: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          subject: { type: 'string', description: 'NO agent names like [ABA DAWN]' },
          body: { type: 'string', description: 'HTML with <p> and <br>' },
          from_override: { type: 'string', description: 'claudette@globalmajoritygroup.com for autonomous' }
        },
        required: ['to', 'subject', 'body']
      }
    },
    {
      name: 'get_sports_scores',
      description: 'Get live sports scores.',
      input_schema: {
        type: 'object',
        properties: {
          league: { type: 'string', enum: ['nba', 'nfl', 'mlb', 'nhl'] }
        },
        required: ['league']
      }
    },
    {
      name: 'search_calendar',
      description: 'Search calendar events.',
      input_schema: {
        type: 'object',
        properties: {
          start_date: { type: 'string', description: 'ISO date' },
          end_date: { type: 'string' }
        },
        required: ['start_date']
      }
    },
    {
      name: 'search_brain',
      description: 'Search ABA brain (aba_memory).',
      input_schema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          memory_type: { type: 'string' },
          limit: { type: 'integer', default: 10 }
        },
        required: ['query']
      }
    },
    {
      name: 'store_memory',
      description: 'Store to ABA brain.',
      input_schema: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          memory_type: { type: 'string' },
          importance: { type: 'integer', default: 5 },
          tags: { type: 'array', items: { type: 'string' } }
        },
        required: ['content', 'memory_type']
      }
    }
  ];
}

async function executeTool(toolName, input, ham) {
  trace('AIR', toolName.toUpperCase(), 'TOOL', `Executing ${toolName}`, 'EXECUTING');
  
  switch (toolName) {
    case 'get_weather': {
      const location = input.location || 'Greensboro, NC';
      let lat = 36.0726, lon = -79.7920, cityName = 'Greensboro';
      const loc = location.toLowerCase();
      if (loc.includes('high point')) { lat = 35.9557; lon = -80.0053; cityName = 'High Point'; }
      else if (loc.includes('charlotte')) { lat = 35.2271; lon = -80.8431; cityName = 'Charlotte'; }
      else if (loc.includes('new york')) { lat = 40.7128; lon = -74.0060; cityName = 'New York'; }
      
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
        const resp = await fetch(url);
        if (resp.ok) {
          const d = await resp.json();
          const temp = Math.round(d.current?.temperature_2m || 0);
          const code = d.current?.weather_code || 0;
          let condition = 'clear';
          if (code >= 61) condition = 'rainy';
          else if (code >= 51) condition = 'drizzling';
          else if (code >= 45) condition = 'foggy';
          else if (code >= 3) condition = 'overcast';
          else if (code >= 1) condition = 'partly cloudy';
          return { status: 'success', location: cityName, temperature: temp, condition, description: `${temp}°F and ${condition} in ${cityName}` };
        }
      } catch (e) { return { status: 'error', message: e.message }; }
      return { status: 'error', message: 'Weather unavailable' };
    }
    
    case 'send_email': {
      const NYLAS_KEY = process.env.NYLAS_API_KEY;
      const grantId = input.from_override === 'claudette@globalmajoritygroup.com' 
        ? '41a3ace1-1c1e-47f3-b017-e5fd71ea1f3a' 
        : (ham.nylas_grant_id || '50053c70-ecbb-487f-a522-d3d03d72f8c5');
      
      try {
        const response = await fetch(`https://api.us.nylas.com/v3/grants/${grantId}/messages/send`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${NYLAS_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: [{ email: input.to }], subject: input.subject, body: input.body })
        });
        if (response.ok) {
          const result = await response.json();
          return { status: 'success', message_id: result.data?.id, confirmation: `Email sent to ${input.to}` };
        }
        return { status: 'error', message: await response.text() };
      } catch (e) { return { status: 'error', message: e.message }; }
    }
    
    case 'get_sports_scores': {
      const league = input.league?.toLowerCase() || 'nba';
      const espnMap = { nba: 'basketball/nba', nfl: 'football/nfl', mlb: 'baseball/mlb', nhl: 'hockey/nhl' };
      try {
        const resp = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${espnMap[league]}/scoreboard`);
        if (resp.ok) {
          const d = await resp.json();
          const games = (d.events || []).slice(0, 5).map(e => {
            const comp = e.competitions?.[0];
            const home = comp?.competitors?.find(t => t.homeAway === 'home');
            const away = comp?.competitors?.find(t => t.homeAway === 'away');
            return {
              name: e.name,
              status: comp?.status?.type?.description,
              home_team: home?.team?.displayName,
              home_score: home?.score || '0',
              away_team: away?.team?.displayName,
              away_score: away?.score || '0'
            };
          });
          return { status: 'success', league: league.toUpperCase(), count: games.length, games };
        }
      } catch (e) { return { status: 'error', message: e.message }; }
      return { status: 'error', message: 'Sports unavailable' };
    }
    
    case 'search_brain': {
      try {
        let url = `${SUPABASE_URL}/rest/v1/aba_memory?select=source,memory_type,content,importance`;
        if (input.memory_type) url += `&memory_type=eq.${input.memory_type}`;
        if (input.query) url += `&or=(content.ilike.*${input.query}*,source.ilike.*${input.query}*)`;
        url += `&order=importance.desc&limit=${input.limit || 10}`;
        
        const resp = await fetch(url, { headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` } });
        if (resp.ok) {
          const results = await resp.json();
          return { status: 'success', count: results.length, results };
        }
      } catch (e) { return { status: 'error', message: e.message }; }
      return { status: 'error', message: 'Brain search failed' };
    }
    
    case 'store_memory': {
      try {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/aba_memory`, {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
          body: JSON.stringify({ content: input.content, memory_type: input.memory_type, importance: input.importance || 5, tags: input.tags || [], source: `air_${Date.now()}` })
        });
        if (resp.ok) {
          const result = await resp.json();
          return { status: 'success', id: result[0]?.id };
        }
      } catch (e) { return { status: 'error', message: e.message }; }
      return { status: 'error', message: 'Store failed' };
    }
    
    case 'search_calendar': {
      const NYLAS_KEY = process.env.NYLAS_API_KEY;
      const grantId = ham.nylas_grant_id || '41a3ace1-1c1e-47f3-b017-e5fd71ea1f3a';
      try {
        const start = Math.floor(new Date(input.start_date).getTime() / 1000);
        const end = input.end_date ? Math.floor(new Date(input.end_date).getTime() / 1000) : start + 86400;
        const url = `https://api.us.nylas.com/v3/grants/${grantId}/events?calendar_id=primary&start=${start}&end=${end}`;
        const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${NYLAS_KEY}` } });
        if (resp.ok) {
          const d = await resp.json();
          const events = (d.data || []).map(e => ({
            title: e.title,
            start: e.when?.start_time ? new Date(e.when.start_time * 1000).toISOString() : null,
            end: e.when?.end_time ? new Date(e.when.end_time * 1000).toISOString() : null
          }));
          return { status: 'success', count: events.length, events };
        }
      } catch (e) { return { status: 'error', message: e.message }; }
      return { status: 'error', message: 'Calendar unavailable' };
    }
    
    default:
      return { status: 'error', message: `Unknown tool: ${toolName}` };
  }
}

async function process({ message, userId, channel = 'portal', additionalContext = {} }) {
  const traceId = trace('REQUEST', 'AIR', channel, message.substring(0, 50), 'STARTED');
  
  // STEP 1: HAM BEFORE CLAUDE
  const ham = await loadHAM(userId);
  
  // STEP 2: NOW
  const now = loadNOW(ham.timezone);
  
  // STEP 3: ALL AGENT JDS
  const agentJDs = await loadAllAgentJDs();
  
  // STEP 4: BUILD FCW
  const fcw = await buildFCW({ ham, now, agentJDs, channel });
  
  // STEP 5: TOOLS
  const tools = getToolDefinitions(ham);
  
  // STEP 6: CLAUDE CALL WITH FCW
  let messages = [{ role: 'user', content: message }];
  let iterations = 0;
  let finalResponse = null;
  const toolsUsed = [];
  
  trace('AIR', 'CLAUDE', 'API', 'Calling with FCW', 'CALLING');
  
  while (iterations < 10) {
    iterations++;
    
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 8192,
        system: [{ type: 'text', text: fcw, cache_control: { type: 'ephemeral' } }],
        messages,
        tools
      });
      
      if (response.stop_reason === 'end_turn') {
        finalResponse = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
        trace('CLAUDE', 'AIR', 'RESPONSE', `Done in ${iterations} iterations`, 'COMPLETE');
        break;
      }
      
      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });
        const results = [];
        
        for (const t of response.content.filter(b => b.type === 'tool_use')) {
          trace('CLAUDE', t.name.toUpperCase(), 'TOOL', `Using ${t.name}`, 'EXECUTING');
          const result = await executeTool(t.name, t.input, ham);
          toolsUsed.push({ tool: t.name, input: t.input, result });
          results.push({ type: 'tool_result', tool_use_id: t.id, content: JSON.stringify(result) });
        }
        
        messages.push({ role: 'user', content: results });
        continue;
      }
      
      break;
    } catch (error) {
      trace('CLAUDE', 'AIR', 'ERROR', error.message, 'FAILED');
      return { success: false, error: error.message };
    }
  }
  
  trace('AIR', 'RESPONSE', channel, 'Complete', 'DELIVERED');
  
  return {
    success: true,
    response: finalResponse,
    iterations,
    toolsUsed: toolsUsed.length,
    tools: toolsUsed,
    traceId,
    fcwTokens: Math.round(fcw.length / 4)
  };
}

module.exports = { process, loadHAM, loadNOW, loadAllAgentJDs, buildFCW, getToolDefinitions, executeTool, trace, routingTraces };
