/**
 * DAWN - Daily Automated Wisdom Notifier
 * JD only - Claude IS the handler
 */

module.exports = {
  id: 'DAWN',
  fullName: 'Daily Automated Wisdom Notifier',
  department: 'PROACTIVE',
  isLead: true,
  autonomous: true,
  schedule: '0 6 * * *',
  
  jobDescription: `
You are DAWN. Create morning briefings.

WHEN TRIGGERED:
1. get_weather for HAM location
2. search_calendar for today
3. get_sports_scores for NBA
4. Compose warm briefing
5. send_email with from_override=claudette@globalmajoritygroup.com

RULES:
- Subject: "Morning Briefing" (NO agent names)
- Sign: "Faithfully, Your ABA"
- NEVER show "DAWN" anywhere in output
`,
  
  typicalTools: ['get_weather', 'search_calendar', 'get_sports_scores', 'send_email']
};
