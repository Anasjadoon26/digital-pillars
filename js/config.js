// Central content + constants. Edit copy here, not in markup.
export const ACCENT = 0xf2b544; // brass: the single accent (mirrors --accent in CSS)

export const SERVICES = [
  { slug:'paid-social', name:'Paid Social', variant:'pillar',
    tag:'Meta advertising built on testing, not guesswork.',
    value:'We run Meta campaigns as a system: sharp audiences, a steady creative testing rhythm, and reporting that ties spend to revenue.',
    scope:['Campaign strategy','Audience research','Creative testing','Campaign setup','Conversion optimization','Retargeting','Performance tracking','Weekly reporting'],
    process:[['Audit','Account, pixel and offer review.'],['Structure','Audiences, budgets and tracking plan.'],['Test','Creative and hook variants against a control.'],['Scale','Move budget to proven winners.']],
    deliver:['Tracking and Conversions API setup','Creative test roadmap','Live performance dashboard','Monthly strategy review'],
    stats:[['4.82x','Average ROAS, retail clients'],['-31%','Cost per acquisition in 90 days'],['12','Creative tests per month']], related:['social-growth','consulting'] },
  { slug:'social-growth', name:'Social Growth', variant:'network',
    tag:'Audience building that compounds.',
    value:'A content system with a clear point of view, so your brand posts with purpose and the right people keep coming back.',
    scope:['Social strategy','Content planning','Brand positioning','Audience growth','Community engagement','Content systems','Analytics'],
    process:[['Position','Voice, pillars and audience map.'],['Plan','Quarterly themes, monthly calendar.'],['Produce','Repeatable formats your team can sustain.'],['Review','Monthly read on what earned attention.']],
    deliver:['Brand voice guide','90-day content calendar','Format templates','Monthly analytics report'],
    stats:[['84.6K','Followers grown for a lead client'],['3.4x','Engagement rate vs. baseline'],['6 mo','Typical time to a steady rhythm']], related:['paid-social','web'] },
  { slug:'web', name:'Web Design & Development', variant:'arch',
    tag:'Fast sites designed to convert.',
    value:'We design and build responsive sites around one question: what should a visitor do next? Then we make that path obvious and quick.',
    scope:['Strategy','UX/UI design','Responsive design','Frontend development','Performance engineering','Conversion-focused layouts','Ongoing optimization'],
    process:[['Frame','Goals, content and structure.'],['Design','Wireframes to a full visual system.'],['Build','Clean code, tested on real devices.'],['Improve','Measure, then refine after launch.']],
    deliver:['Design system','Production website','Performance budget','Post-launch optimization plan'],
    stats:[['95+','Lighthouse performance target'],['<2s','Load on a 4G connection'],['+2.18%','Conversion lift after redesign']], related:['consulting','paid-social'] },
  { slug:'consulting', name:'Digital Consulting', variant:'decision',
    tag:'Clear decisions about where to grow next.',
    value:'We review your funnel, data and tools, then hand you a ranked plan: what to fix, what to build, and what to leave alone.',
    scope:['Digital strategy','Growth opportunities','Marketing systems','Funnel analysis','Performance analysis','Technology recommendations'],
    process:[['Listen','Stakeholder and data interviews.'],['Analyze','Funnel, spend and stack review.'],['Prioritize','Impact against effort, ranked.'],['Advise','Roadmap and optional hands-on support.']],
    deliver:['Funnel analysis','Prioritized roadmap','Tool and stack recommendations','Executive summary'],
    stats:[['2 wks','Typical engagement to first roadmap'],['7.42%','Conversion rate reached post-fix'],['5','Priorities, never fifty']], related:['web','social-growth'] },
];

export const FAQ = [
  ['What services do you offer?','Paid social on Meta, social media growth, web design and development, and digital consulting. Each has its own page.'],
  ['How do I get started?','Send a short brief. We reply within one business day to book a 30-minute call, then send a scoped proposal.'],
  ["What's your typical turnaround?",'Campaigns usually launch in 10 to 14 days. Websites run 4 to 8 weeks, depending on scope.'],
  ['Do you work with small businesses?','Yes. Most of our clients are growing businesses, and we scope work to fit the budget you have.'],
  ['Do you manage Meta ad campaigns?','Yes: strategy, creative testing, setup, optimization, retargeting and reporting, managed end to end.'],
  ['Can you build websites?','Yes. We design and build fast, responsive sites focused on conversion, and keep improving them after launch.'],
  ['What does working with Digital Pillars look like?','A small senior team, one point of contact, a shared dashboard and a monthly review of what moved and why.'],
];

export const TESTIMONIALS = [
  ['Amira Khan','Founder, Noor Living','Our cost per purchase fell by a third within the first quarter, and for once we understood why.','-31% CPA'],
  ['Daniel Reyes','Marketing Lead, Fieldwork Co.','They rebuilt our site in six weeks. It loads instantly and the enquiry rate went up the same month.','+2.18% conversion'],
  ['Sara Malik','Director, Atelier Nine','The content system gave our small team a rhythm we can keep. Followers followed.','84.6K followers'],
  ['Tom Becker','COO, Harbor Supply','The roadmap was blunt and useful. We stopped three projects and doubled down on one.','2 wks to plan'],
];