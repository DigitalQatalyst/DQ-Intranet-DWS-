// Content data for the 8 core service area detail pages
// This content should be used exactly as provided - do not summarize or change

export interface GuideContent {
  title: string
  subtitle: string
  shortOverview: string
  highlights: string[]
  storybookIntro: string
  whatYouWillLearn: string[]
  courseIntro?: string
  whatYouWillPractice?: string[]
}

export const GUIDE_CONTENT: Record<string, GuideContent> = {
  'ghc': {
    title: 'The GHC (Golden Honeycomb of Competencies)',
    subtitle: 'The Master Map',
    shortOverview: 'The Golden Honeycomb of Competencies (GHC) defines how work is organised at Digital Qatalyst. It brings together our direction, culture, and ways of working into one clear system that guides how decisions are made and work gets done.\n\nGHC exists to create clarity at every level. By connecting organisational goals to everyday work, it helps associates understand how their contributions matter and how to move work forward with confidence.\n\nGHC allows DQ to grow, adapt, and solve difficult problems without losing alignment. It enables consistent collaboration, clear execution, and reliable delivery across the organisation, through seven connected competencies: Vision, House of Values, Persona, Agile TMS, Agile SoS, Agile Flows, and Agile 6xD.',
    highlights: [
      'Clear Direction: Understand what matters most so your efforts stay aligned instead of pulling in different directions.',
      'Confidence in Change: Adapt to new challenges with a structure that helps you shift priorities without losing focus or momentum.',
      'Better Collaboration: Coordinate and move work forward with others using a shared approach that removes constant clarification.',
      'Meaningful Impact: Link daily tasks to broader goals to see how your effort contributes to real outcomes and not just activity.',
      'Consistent Growth: Use GHC tools to develop your skills and take on new responsibilities as our work evolves.'
    ],
    storybookIntro: 'The Golden Honeycomb of competencies isn\'t just a framework; it is what drives us in Digital Qatalyst. It shows exactly how we design our work, make decisions, and stay aligned as one team.\n\nGet to know the seven core elements that make up our DNA. Instead of seeing them as separate rules, you will see how they link together; how our Culture drives our Execution, and how our Vision shapes your daily Tasks.\n\nWhen you understand the Golden Honeycomb of competencies, You will see clearly where your role fits into the team, making it easier to prioritize work, collaborate with teammates, and move forward with total confidence; even when the path gets complex.',
    whatYouWillLearn: [
      'The seven competencies: What each one represents and how they connect as one system.',
      'How the system fits together: How direction, culture, roles, and execution work in sync.',
      'Your place in the system: How your role connects to the broader way of working.',
      'How decisions stay aligned: How priorities, choices, and outcomes move together as work changes.',
      'How work turns into outcomes: How ideas progress from intent to delivery, even in complex situations.'
    ],
    courseIntro: 'Start with the GHC Overview video to understand the full picture of how work operates at Digital Qatalyst. It shows how our vision, culture, and ways of working connect and how that system shapes the work you do every day.\n\nUse the Golden Honeycomb whenever you are planning work, setting priorities, or making decisions. It helps you connect daily tasks to shared goals, clarify what matters most, and move forward without second-guessing your focus.\n\nAs work evolves, apply the Golden Honeycomb when priorities shift, collaboration becomes complex, or new challenges appear. It becomes a practical guide for decision-making and teamwork, helping you stay aligned, confident, and effective; even in uncertain situations.',
    whatYouWillPractice: [
      'The full picture: See how the seven competencies connect and work together as one system.',
      'Purposeful action: Turn daily tasks into meaningful progress by linking work directly to shared goals.',
      'Clear decision-making: Make confident choices using a shared logic without waiting for permission.',
      'Seamless collaboration: Work across teams using a common language that keeps everyone aligned.',
      'Staying agile: Maintain focus and momentum as priorities shift and work evolves.'
    ]
  },
  'dq-vision': {
    title: 'The Vision (Purpose)',
    subtitle: 'Understand the core mission that aligns our squads and brings real value to the systems we build.',
    shortOverview: 'Our Vision is more than a catchphrase; it is the shared foundation that aligns every team at Digital Qatalyst. It defines exactly why we exist: to perfect life\'s transactions.\n\nEvery day, people interact with systems by paying a bill, filling out a form, or checking a record. When those systems are clunky or confusing, people feel the frustration. We exist to fix that by building systems that are clear, connected, and thoughtful.\n\nThe Vision connects our highest company goals directly to your daily tasks. It helps you see how your specific work makes these everyday moments smoother for real people. By keeping this in mind, you can confidently say "no" to distractions and "yes" to the work that truly makes a difference.',
    highlights: [
      'Strategic Alignment: Ensure every task you do helps build smarter, more connected organisations.',
      'Clear Purpose: Find real meaning in your daily work by understanding how we remove everyday frustrations for people.',
      'Focused Decisions: Use the Vision as a filter to prioritize work that adds the most value and decline unnecessary distractions.',
      'Unified Teamwork: Work smoothly with other squads, knowing we are all building toward the exact same goal.',
      'Inspired Action: Stay motivated by seeing how your individual role helps shape a better, easier digital future.'
    ],
    storybookIntro: 'Understand the core parts of our strategy, from our main purpose to our specific goals. This is not just theory. It is the real logic we use to set targets and measure our success.\n\nYou will see how our vision breaks down into clear steps that our teams can actually execute. This clarity prevents confusion and ensures everyone is working together.\n\nUnderstanding these elements gives you the context to make confident decisions. You will see exactly how your team\'s specific tasks link directly to the overall success of Digital Qatalyst.',
    whatYouWillLearn: [
      'The Big Picture: The difference between our core purpose, our ambition, and our strategic goals.',
      'The Strategy Link: How company-wide goals break down into daily, actionable tasks for your squad.',
      'Success Measures: The exact results we track to know if we are succeeding.',
      'The "Why" Logic: The reasoning behind the choices we make and how we choose to serve our clients.',
      'Your Role: Exactly where your work fits into the bigger plan of the organisation.'
    ],
    courseIntro: 'Start with the Vision Overview to understand the fundamental goals of our organisation. You will learn to explain our purpose clearly and use it to inspire those around you.\n\nFrom there, dive into practical exercises that help you connect your daily tasks to our main objectives. You will learn to identify when work is off-track and how to realign it with our core purpose.\n\nFinally, practice using the Vision as a decision-making tool in real-world scenarios. This builds your ability to lead conversations and make choices that support the future of the organisation.',
    whatYouWillPractice: [
      'Explaining Purpose: Practice sharing the DQ Vision clearly with your team and stakeholders.',
      'Connecting Work: Learn to link your daily tasks directly to our main strategic goals.',
      'Prioritization: Practice using the Vision to decide what to work on and what to pause.',
      'Alignment Checks: Learn how to run quick checks to ensure your team is still on the right path.',
      'Inspiring Others: Practice using the Vision to motivate teammates during challenging sprints.'
    ]
  },
  'dq-hov': {
    title: 'The HoV (Culture)',
    subtitle: 'The Culture That Powers Our Execution',
    shortOverview: 'Culture is not just a vibe; it is an engineered system. At Digital Qatalyst, the House of Values (HoV) defines the mindset and behaviors that make high performance possible. It is the cultural foundation that builds trust, enabling us to move fast and deliver exceptional results.\n\nInstead of relying on rigid rules, the HoV uses shared principles to give you the freedom to act autonomously while staying aligned with the team. When we all live by these values, we create an environment where innovation thrives and people grow.\n\nThis framework governs how we treat each other, how we handle challenges, and how we approach our work. It ensures that how we deliver results is just as important as the results themselves.',
    highlights: [
      'Psychological Safety: Build a fearless environment where Qatalysts feel safe to speak up, share ideas, and take calculated risks.',
      'Faster Decisions: Rely on our shared Guiding Values to make quick, confident choices without needing constant approval.',
      'Stronger Trust: Collaborate seamlessly with anyone in the organisation because you share a common behavioral code.',
      'Reduced Friction: Resolve conflicts easily by referring to our agreed-upon standards of work.',
      'Sustainable Growth: Work in a way that prioritises continuous learning and self-development alongside high performance.'
    ],
    storybookIntro: 'Understand the specific Mantras and Guiding Values that hold up our culture. We break down what these values actually look like in practice, moving beyond buzzwords to real, everyday actions.\n\nYou will explore the specific behaviors that define how we interact with our teams, our clients, and our work. This helps you recognize what good looks like and understand what to do when a situation requires more from you.\n\nBy understanding the HoV, you gain the tools to build a high-performing team dynamic. It clarifies the exact expectations we have for every Qatalyst, regardless of their role or seniority.',
    whatYouWillLearn: [
      'The Core Mantras: The three foundational beliefs (Self-Development, Lean Working, Value Co-Creation) that shape our mindset.',
      'Guiding Values: The specific actions and behaviors that demonstrate our culture in everyday scenarios.',
      'The Trust Equation: How honesty, clarity, and shared responsibility build the trust needed for speed.',
      'Cultural Evolution: How we use the Competing Values Framework (CVF) to measure and shift our culture toward innovation and agility.',
      'Accountability: How we hold ourselves and each other responsible for maintaining these high standards.'
    ],
    courseIntro: 'Start with the HoV Overview to see how culture directly drives performance. You will learn why emotional intelligence and collaboration are not just "soft skills" but the actual engines of our success.\n\nFrom there, explore how to apply the three Mantras to your daily work. You will learn practical techniques for giving feedback, owning your decisions, and building trust within your squad.\n\nFinally, practice these behaviors through real-world scenarios. This helps you build the muscle memory to react with precision, empathy, and focus, even under pressure.',
    whatYouWillPractice: [
      'Active Listening: Practice listening deeply to understand client and team needs, building stronger trust.',
      'Constructive Feedback: Learn to use feedback and failure to drive personal and collective growth.',
      'Conflict Resolution: Practice resolving disagreements by focusing on solutions and shared purpose rather than personalities.',
      'Living the Values: Learn how to model our Guiding Values in stressful or high-stakes situations.',
      'Team Collaboration: Practice working openly and without silos to co-create greater value and impact.'
    ]
  },
  'dq-persona': {
    title: 'The Persona (Identity)',
    subtitle: 'Discover the mindset, traits, and specific roles that define who succeeds at Digital Qatalyst.',
    shortOverview: 'Great missions need the right people. At Digital Qatalyst, success is never just about what we do; it is about who we are.\n\nInstead of just looking at technical skills or rigid job titles, we focus on the DQ Persona. This is our model for identifying and empowering the people who bring clarity, courage, and emotional intelligence to our work. It defines the human traits that make success possible across our entire ecosystem.\n\nWhether you are an employee, a client, or a partner, the DQ Persona is not a job title. It is a specific way of showing up. By understanding these personas, you know exactly what is expected of you and how to interact effectively with everyone around you.',
    highlights: [
      'Clear Expectations: Understand the exact mindset and behaviors required to succeed in your specific role.',
      'Ecosystem Alignment: See how employees, customers, partners, and investors all share a unified approach to transformation.',
      'Empowerment: Take full ownership of your work, knowing you are trusted to act with purpose and precision.',
      'Reduced Friction: Avoid confusion by understanding how different personas collaborate and support each other.',
      'Growth Mindset: Focus on continuous learning and responsibility rather than just checking boxes.'
    ],
    storybookIntro: 'Understand the four main relational categories that make up the DQ ecosystem: Associates, Customers, Partners, and Investors. We break down the specific traits and contributions of each group.\n\nYou will explore the five core characteristics that every successful persona shares: being Purpose-Driven, Perceptive, Proactive, Persevering, and Precise. This helps you recognize what good looks like, no matter who you are working with.\n\nBy understanding this framework, you can navigate the organisation and our external relationships much more effectively. You will know exactly how to build trust and co-create value with anyone in the DQ network.',
    whatYouWillLearn: [
      'The Core Traits: The five characteristics (Purpose-Driven, Perceptive, Proactive, Persevering, Precise) shared by everyone in the DQ ecosystem.',
      'DQ Associates: The specific expectations for our Employees, Contractors, and Leaders to drive the mission forward.',
      'DQ Customers: How we identify ideal accounts and work with "Account Coaches" to build digital futures together.',
      'DQ Partners: How we collaborate with "Solution Coaches" to co-build scalable transformation playbooks.',
      'DQ Investors: How we align with "Growth Coaches" who fund our long-term systemic impact.'
    ],
    courseIntro: 'Start with the Persona Overview to see the full cast of characters that make up the Digital Qatalyst ecosystem. You will learn why behavioral fit is just as important as technical skill.\n\nFrom there, dive into the specifics of your own primary persona (like an Employee or a Leader) and those you interact with most. You will learn how to embed the House of Values into your daily behavior and how to move with purpose and structure.\n\nFinally, practice identifying these traits in real-world scenarios. This builds your ability to collaborate seamlessly across different teams, clients, and partners.',
    whatYouWillPractice: [
      'Embodying the Traits: Practice applying the five core traits (Proactive, Precise, etc.) to your daily tasks.',
      'Collaborative Delivery: Learn how to hand off work and co-create solutions smoothly with Contractors and Partners.',
      'Customer Empathy: Practice seeing challenges from the perspective of our clients and their Account Coaches.',
      'Leading with Culture: Learn how DQ Leaders reinforce clarity, model emotional intelligence, and develop others.',
      'System Thinking: Practice looking beyond your immediate task to see how your work impacts the wider DQ ecosystem.'
    ]
  },
  'dq-agile-tms': {
    title: 'Agile TMS (Tasks)',
    subtitle: 'Discover how our Task Management System turns high-level strategy into focused, structured, and purposeful daily action.',
    shortOverview: 'Great work does not start with hustle; it starts with structure. The Agile Task Management System (TMS) is the beating heart of how we work at Digital Qatalyst. If our Vision gives us purpose, Agile TMS gives us a clear, accountable model for getting things done.\n\nAgile at DQ is not about doing more. It is about doing what matters most right now. The TMS breaks complex work into its most essential parts: what needs to be done, who is doing it, by when, and why it matters.\n\nThis system replaces static job descriptions with dynamic, purposeful execution. It empowers you to reprioritize when needed and ensures that speed never compromises the quality of our work.',
    highlights: [
      'Purposeful Action: Ensure every task is tied directly to a larger strategic goal before you start working.',
      'Structured Delivery: Use a living workflow model that aligns your effort with clear intent and tracks progress transparently.',
      'Empowered Ownership: Take control of your daily tasks without micromanagement, knowing exactly what success looks like.',
      'Continuous Momentum: Keep work moving forward through structured cadences, daily check-ins, and clear visibility.',
      'Adaptable Execution: Pivot quickly when priorities change, using a system designed for flexibility and focus.'
    ],
    storybookIntro: 'Understand the core logic behind how we work. Instead of traditional functional silos, we organize our execution around the 7S Tenets: Specify, Socialize, Share, Scrum, Structure, Succeed, and Speed-up.\n\nYou will explore how these tenets guide everything from how we define a task to how we run our meetings. You will also understand the ATP (Associate Timesheet & Performance) system, which is the backbone of our transparent work management.\n\nBy understanding this system, you see exactly how your daily backlog connects to the company\'s biggest goals. It demystifies how we measure success and how you can accelerate your own growth.',
    whatYouWillLearn: [
      'The 7S Tenets: The seven actionable principles that guide all work and collaboration at DQ.',
      'Working Sessions: The specific formats (like CWS, BWS, and PWS) we use to collaborate, brainstorm, or do deep solo work.',
      'Agile Rituals: The rhythm of our daily standups, weekly Control Tower sessions, and monthly Townhalls.',
      'The ATP System: How we use the Associate Timesheet & Performance model to structure, track, and validate work.',
      'The xPA Framework: How your performance, development, and rewards are measured and supported.'
    ],
    courseIntro: 'Start with the Agile TMS Overview to understand how we translate strategy into movement. You will learn why reducing waste and focusing on clarity is our primary competitive advantage.\n\nFrom there, dive into the specifics of the 7S Tenets. You will learn how to properly "Specify" a task with clear intent, and how to "Socialize" your progress so your team stays aligned without unnecessary meetings.\n\nFinally, practice using the different Working Session formats and the ATP system. This builds your ability to manage your time effectively, collaborate seamlessly, and deliver high-value outcomes.',
    whatYouWillPractice: [
      'Task Specification: Practice defining the clear Context, Purpose, and Outcome for every task you create.',
      'Working Sessions: Learn when to call a fast-paced Co-Working Session (CWS) versus blocking out time for Personal Work (PWS).',
      'Daily Discipline: Practice using the SEDU (Start-End Day Update) to keep your team aligned asynchronously.',
      'Agile Cadence: Learn how to participate effectively in Daily Scrums and Weekly Control Tower sessions.',
      'Smart Acceleration: Practice using AI and productivity tools to speed up your workflow without losing precision.'
    ]
  },
  'dq-agile-sos': {
    title: 'Agile SoS (Governance)',
    subtitle: 'Discover how our four pillars of governance enable intelligent, disciplined, and aligned execution across the entire organisation.',
    shortOverview: 'Execution at scale demands more than just discipline; it demands design. Agile SoS acts as a System of Systems, connecting our independent teams into a unified and high-performing network. It provides the governance layer that ensures every separate squad functions in perfect harmony with the whole.\n\nAt Digital Qatalyst, governance is not the enemy of agility. It is the enabler. This structure prevents silos by synchronizing information flow and critical decision making. It ensures that the output of one team seamlessly integrates with the strategic needs of the organisation.\n\nIt serves as our ultimate alignment tool, allowing us to scale agility without relying on micromanagement. When complex challenges arise, this framework provides the stability and pathways to resolve them instantly.',
    highlights: [
      'Scale with Clarity: Manage complex interactions across multiple teams without losing your speed or focus.',
      'Systemic Alignment: Ensure all teams move toward the exact same strategic goals using our Functional Trackers.',
      'Engineered Quality: Uphold high standards everywhere through our System of Quality and shared playbooks.',
      'Intentional Value: Design value into every task from the start to ensure measurable business impact.',
      'Built-in Discipline: Use structured protocols to pause, reflect, and fix root causes when team momentum drops.'
    ],
    storybookIntro: 'Understand how our System of Systems functions to govern our scaling efforts without adding heavy bureaucracy. We break down the mechanics of how our four core systems link together to form a cohesive whole.\n\nYou will explore the protocols that allow information to flow smoothly across the network. This clarity prevents the chaos that usually happens when organisations try to grow without a strong foundation.\n\nBy grasping this concept, you will see that governance is the true operating system of our organisation. It clarifies how your daily team decisions impact our global performance and long-term success.',
    whatYouWillLearn: [
      'The Four Systems: How Governance, Quality, Value, and Discipline work together to guide our execution.',
      'Steering with SoG: How functional trackers connect high-level strategy directly to your daily tasks.',
      'Engineering Quality: The specific tools and playbooks that make excellence a repeatable habit.',
      'Designing Value: How we measure the actual impact of our work rather than just tracking our effort.',
      'Maintaining Discipline: How we use tools like the STOP Protocol to self-correct and solve recurring problems.'
    ],
    courseIntro: 'Start with the SoS Overview to visualize the four governance systems in action across the organisation. You will learn the specific behaviors required to operate effectively within this highly interconnected environment.\n\nFrom there, dive into the protocols for synchronization and escalation that keep our wider network healthy. You will learn to identify real value and how to filter out distractions to focus on what matters most.\n\nFinally, practice your role as a connector within this framework through real-world scenarios. This builds your ability to navigate our complex web of relationships and deliver high-quality results at scale.',
    whatYouWillPractice: [
      'Aligning Work: Practice using functional trackers to connect your tasks to the broader business strategy.',
      'Upholding Standards: Learn to use our shared playbooks and quality guidelines in your daily delivery.',
      'Measuring Impact: Practice asking how your work creates value and defining how that success is measured.',
      'Applying Discipline: Learn when and how to use the STOP Protocol to address recurring team challenges.',
      'Cross-System Sync: Practice aligning your local team rhythm with the global heartbeat of the organisation.'
    ]
  },
  'dq-agile-flows': {
    title: 'Agile Flows (Value Streams)',
    subtitle: 'How We Orchestrate Value',
    shortOverview: 'Value does not just come from what we build; it comes from how we build it. Agile Flows is our operating architecture for creating value at scale. It outlines how we design and deliver outcomes not as isolated departments, but as connected systems.\n\nIn most organisations, delivery is broken. Strategy happens in one place, design in another, and execution somewhere else. This creates bottlenecks, lost time, and diluted results. At Digital Qatalyst, Agile Flows prevents this by connecting our entire process into structured streams.\n\nThis is not just project management or ticket tracking. It is value orchestration. It ensures that every handoff between teams is intentional, every dependency is clear, and every outcome is traceable directly back to our strategic goals.',
    highlights: [
      'End-to-End Visibility: See exactly how work moves from an initial idea all the way to lasting client loyalty.',
      'Seamless Handoffs: Eliminate the friction and wait times that usually happen when work passes between different teams.',
      'Outcome Focus: Ensure every task is tied directly to a larger business outcome, not just a list of activities.',
      'Continuous Efficiency: Use Value Stream Mapping as a living tool to constantly find and fix bottlenecks in our process.',
      'Scale Without Chaos: Maintain a steady, predictable rhythm of delivery across the entire organisation.'
    ],
    storybookIntro: 'Understand the specific stages of our end-to-end value chain. We break down the six critical flows that take us from market insight to revenue and loyalty.\n\nYou will explore how we use "Outcome Layering" to ensure our daily work actually improves the digital systems we build for our clients. This logic shows how frictionless client experiences, powered by data and intelligence, become our engine for growth.\n\nBy understanding these flows, you gain the ability to spot where work is getting stuck in your own team. You will see clearly how your specific role contributes to the bigger picture of revenue and client success.',
    whatYouWillLearn: [
      'The Six Value Streams: The specific stages from Market to Lead (M2L) all the way to Revenue to Loyalty (R2L).',
      'Outcome Layering: How we connect high-level goals down to the specific tasks in your Agile TMS.',
      'Value Specifications: How we define the success criteria for every Epic, Feature, User Story, and Task.',
      'Task Friction: How we remove blockers by making ownership and accountability explicit at every stage.',
      'The Growth Equation: How seamless client experiences and intelligent decision-making drive repeatable growth.'
    ],
    courseIntro: 'Start with the Flows Overview to visualize the standard path for delivery at DQ. You will learn why we map our value streams not just to diagnose problems, but as a dynamic tool for continuous improvement.\n\nFrom there, dive into the specific flow that matches your role. For example, if you are in business development, you will focus on Market to Lead (M2L) and Lead to Opportunity (L2O). If you are in delivery, you will focus on Order to Fulfillment (O2F).\n\nFinally, practice connecting your daily tasks to these larger streams. This builds your ability to work cross-functionally and ensures you are participating in the flow of value, not just performing isolated tasks.',
    whatYouWillPractice: [
      'Stream Navigation: Practice identifying exactly where your current project sits within the six DQ Agile Flows.',
      'Outcome Alignment: Learn how to link your daily backlog items directly to defined value outcomes.',
      'Frictionless Handoffs: Practice passing work to the next team (e.g., from Sales to Delivery) without dropping critical context.',
      'Bottleneck Identification: Learn to use Value Stream Maps to spot where work is slowing down and propose solutions.',
      'Client Nurturing: Practice structured feedback loops in the Revenue to Loyalty (R2L) stage to turn delivery into repeat business.'
    ]
  },
  'dq-agile-6xd': {
    title: 'Agile 6xD (Products)',
    subtitle: 'Six Lenses for Digital Transformation',
    shortOverview: 'The 6xD model is our comprehensive guide for transforming into a Digital Cognitive Organisation (DCO). It provides six distinct lenses to view the digital economy, ensuring we don\'t miss any critical angle of change.\n\nIt answers every fundamental question of transformation, from why we must change to who will deliver it. This holistic view prevents blind spots and ensures our strategies are robust and future-proof.\n\nBy mastering these perspectives, you align your work with the deeper shifts in the market. You move beyond simple digitization to creating true cognitive capabilities that adapt and learn.',
    highlights: [
      'Strategic Context: Understand the specific market shifts (Digital Economy) that explain why organisations must change.',
      'Clear Destination: Visualize exactly where we are headed: the intelligent, adaptive Digital Cognitive Organisation.',
      'Scalable Foundation: Focus on building the right modular architectures (DBP) to make transformation scalable.',
      'Repeatable Success: Treat transformation as a designed discipline (DT2.0) with reliable methods rather than chaotic guesswork.',
      'Empowered Delivery: Ensure the digital workforce (DW:WS) has the right skills and environment to sustain the change.'
    ],
    storybookIntro: 'Understand the six critical perspectives that define a successful digital transformation. We explore the shift in market logic and customer behavior that dictates why organisations must evolve.\n\nYou will examine the "What" and "How" by diving into Digital Business Platforms and Transformation 2.0. This framework turns abstract concepts into a structured design discipline that is easy to follow.\n\nFinally, we connect these systems to the people and tools that bring them to life. You will see how the Digital Worker and Accelerators determine the speed and sustainability of our impact.',
    whatYouWillLearn: [
      'The Context (DE): The shifts in market logic and value creation that drive the need for transformation.',
      'The Goal (DCO): The concept of an intelligent enterprise capable of learning and orchestrating at scale.',
      'The Engine (DBP): The modular, integrated, and data-driven architectures required to enable change.',
      'The Method (DT2.0): How to design and deploy transformation using repeatable flows and governance.',
      'The Enablers: Who delivers the change (Digital Worker) and how we compress time-to-value (Accelerators).'
    ],
    courseIntro: 'Start with the 6xD Overview to see how the six perspectives fit together to build a Digital Cognitive Organisation. You will learn to diagnose where an organisation stands and which specific lever needs to be pulled next.\n\nFrom there, dive into the mechanics of Digital Business Platforms and the specific tools of the trade. You will learn to design transformation flows that are scalable, resilient, and data-driven.\n\nFinally, practice applying these lenses to real-world business challenges. This helps you move from "doing digital" to truly "being digital" in your daily decision-making and design work.',
    whatYouWillPractice: [
      'Market Analysis: Practice identifying the shifts in the Digital Economy that impact your specific project.',
      'Platform Thinking: Learn to design modular solutions (DBP) rather than monolithic dead-ends.',
      'Transformation Design: Practice using DT2.0 methods to orchestrate change systematically.',
      'Workforce Enablement: Learn how to set up the environment for the Digital Worker to succeed.',
      'Accelerating Value: Practice using specific tools to shorten the time it takes to see real impact.'
    ]
  }
}
