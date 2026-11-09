/* =========================================================================
   PROITBRIDGE · Success Stories: site settings
   This is the only file you normally edit (besides the Google Sheet).
   ========================================================================= */
window.SS_CONFIG = {

  /* 1) GOOGLE SHEET LINKS
     In the sheet: File → Share → Publish to web → pick the "Stories" tab →
     "Comma-separated values (.csv)" → Publish → paste the link here.
     Do the same for the "Stats" tab. Leave '' to use the saved snapshot only. */
  STORIES_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTSD2WZNdSTqlX_WkddjtnVRGB7hQRCsuIU8IhjbCw7Fz1GUweae1whpyOvuS4xJWjB7Mx_v334pM7/pub?gid=278594384&single=true&output=csv',
  STATS_CSV: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRTSD2WZNdSTqlX_WkddjtnVRGB7hQRCsuIU8IhjbCw7Fz1GUweae1whpyOvuS4xJWjB7Mx_v334pM7/pub?gid=2002935939&single=true&output=csv',

  /* Re-check the sheet every N minutes while the page is open (0 = only on load). */
  REFRESH_MINUTES: 5,

  /* 2) BUTTON LINKS: your Induction (₹89) page and the Categories page.
     Empty = the button scrolls to the stories explorer instead. */
  LINKS: {
    induction: '',
    category: ''
  },

  /* 3) WHATSAPP: digits only with country code, e.g. '919876543210'.
     Empty = WhatsApp buttons are hidden. */
  WHATSAPP: '',

  /* 4) DISPLAY */
  NEW_DAYS: 45,     // offers newer than this get a "New" badge
  PAGE_SIZE: 9,     // offer cards shown before "Show more"

  /* 5) CATEGORIES: the 6 starting points. "joinedAs" is the "started as" line in the Spotlight
     when a story has no Previous role. "aliases" are other words the
     team may type in the sheet's Category column; they all map here.
     Words ending in * get a "New" tag in "Where you land". */
  CATEGORIES: [
    { id:'student', n:'01', name:'College Student', short:'College Student', joinedAs:'College student',
      aliases:['student','college','final year','pre final year'],
      goal:'Career start before graduation', outcome:'3 – 7 LPA', outcomeLbl:'Target first package',
      who:'Pre-final or final year · CS / IT · ECE / EEE · Mech / Civil · any branch · syllabus only, no portfolio',
      pain:'“I know theory. I have no real projects.”',
      learn:[['Advanced Data Analyst','Program 01','Must'],['Advanced Data Science & AI','Program 02','Must'],['Agentic AI + GenAI','Program 03 · projects in your own domain','Flagship · must']],
      land:['AI Engineer','ML Engineer','GenAI Engineer','Agentic AI Engineer','Data Scientist','NLP Engineer','AI Generalist*'] },

    { id:'fresher', n:'02', name:'Fresher', short:'Fresher', joinedAs:'Fresher',
      aliases:['freshers','graduate','recent graduate'],
      goal:'Career start', outcome:'3 – 7 LPA', outcomeLbl:'Target first package',
      who:'2023 – 2026 graduate · B.E / B.Tech · B.Sc / BCA · M.Sc / MCA · any stream · 0 years, no projects',
      pain:'“Degree in hand. No experience. No callbacks.”',
      learn:[['Agentic AI + GenAI','Program 03 · projects in your own domain','Flagship · must'],['Advanced Data Science & AI','Program 02','Good to have'],['Advanced Data Analyst','Program 01','Good to have']],
      land:['AI Engineer','ML Engineer','GenAI Engineer','Agentic AI Engineer','Data Scientist','NLP Engineer','AI Generalist*','AI Agent Developer*'] },

    { id:'career-gap', n:'03', name:'Career Gap', short:'Career Gap', joinedAs:'On a career break',
      aliases:['gap','career gapper','career gappers','restart','career break'],
      goal:'Career restart', outcome:'3 – 7 LPA', outcomeLbl:'Target restart package',
      who:'Family break · Health break · Business · Relocation · Layoff · gap of 1 – 10+ years · IT past or non-IT past',
      pain:'“How do I explain the gap?”',
      learn:[['Agentic AI + GenAI','Program 03 · projects in your own domain','Flagship · must'],['Advanced Data Science & AI','Program 02','Must'],['Advanced Data Analyst','Program 01','Good to have']],
      land:['AI Engineer','ML Engineer','GenAI Engineer','Agentic AI Engineer','Data Scientist','AI Consultant','AI Generalist*','AI Automation Engineer*'] },

    { id:'nonit-switch', n:'04', name:'Non-IT → AI Switch', short:'Non-IT → AI', joinedAs:'Non-IT professional',
      aliases:['non-it','nonit','non it','non-it professional','domain switch','domain switcher'],
      goal:'Career transition into AI', outcome:'30 – 50%', outcomeLbl:'Target salary hike',
      who:'Mechanical · Civil · Banking · BPO · Teaching · Sales · Operations · HR · Pharma · VFX · any non-IT role · any years, zero code',
      pain:'“I\'m stuck. No IT background. No code.”',
      learn:[['Agentic AI + GenAI','Program 03 · projects in your own domain','Flagship · must'],['Advanced Data Science & AI','Program 02','Good to have'],['Advanced Data Analyst','Program 01','Good to have']],
      land:['AI Engineer','ML Engineer','GenAI Engineer','Agentic AI Engineer','Data Scientist','AI Consultant','AI Generalist*','AI Agent Developer*','AI Automation Engineer*'] },

    { id:'it-switch', n:'05', name:'IT → AI Role Switch', short:'IT → AI Switch', joinedAs:'IT professional',
      aliases:['role switch','role switcher','role switchers','it to ai','career switch'],
      goal:'Move into an AI role', outcome:'30 – 300%', outcomeLbl:'Target salary hike',
      who:'Developer (Java / .NET / Python) · QA / Tester · Support · System Engineer · Consultant · DevOps · Cloud · 1 – 30 years in IT, ready for an AI title',
      pain:'“I use AI tools… but interviews ask Agentic AI.”',
      learn:[['Agentic AI + GenAI','Program 03 · projects in your own domain','Flagship · must'],['Advanced Data Science & AI','Program 02','Optional']],
      land:['AI Engineer','Agentic AI Consultant','AI Technical Lead','AI Agent Developer*','AI Automation Engineer*'] },

    { id:'it-upskill', n:'06', name:'IT Upskill & Promotion', short:'IT Upskill', joinedAs:'IT professional',
      aliases:['it','upskill','promotion','ijp','it professional','it working professional','leadership'],
      goal:'IJP · Leadership role', outcome:'30 – 300%', outcomeLbl:'Target salary hike',
      who:'Experienced developers, analysts, leads and managers · Data / BI · Network · 2 – 30 years of experience, aiming for the next level with AI',
      pain:'“I\'m senior, but my next role needs AI on the résumé.”',
      learn:[['Agentic AI + GenAI','Program 03 · projects in your own domain','Flagship · must'],['Advanced Data Science & AI','Program 02','Optional']],
      land:['AI-enabled Developer / QA / SysEng','Technical Lead','AI Consultant','AI Solutions Architect*','AI Ethics Specialist*'] }
  ]
};
