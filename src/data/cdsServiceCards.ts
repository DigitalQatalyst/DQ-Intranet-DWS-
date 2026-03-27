export interface SummaryTableColumn {
  header: string;
  accessor: string;
}

export interface TableData {
  columns: SummaryTableColumn[];
  data: Record<string, string | number>[];
}

export interface CDSServiceCard {
  id: string;
  title: string;
  description: string;
  section: string;
  system?: string;
  type?: string;
  content: {
    overview?: string;
    subsections?: {
      id: string;
      title: string;
      content: string;
      tableData?: TableData;
      contentAfterTable?: string;
    }[];
  };
  tags?: string[];
  imageUrl?: string;
}

export const CDS_SERVICE_CARDS: CDSServiceCard[] = [
  {
    id: 'cds-campaigns-design-system',
    title: 'Campaigns Design System (CDS)',
    description:
      "DQ Marketing’s operating system for how campaigns are conceived, planned, designed, deployed, and reviewed across channels.",
    section: '1. Introduction',
    system: 'CDS',
    type: 'framework',
      content: {
        subsections: [
        {
          id: '1',
          title: '1. Introduction',
          content: `Marketing at DigitalQatalyst is not just about brand presence-it is a structured practice of shaping the organization's narrative, educating the digital economy, and orchestrating movements across channels and stakeholders. The Marketing Campaigns Design System (CDS) offers a unified operating framework for how campaigns are conceived, planned, designed, deployed, and reviewed-anchored by DQ's five strategic Content Pillars.`
        },
          {
            id: 'who',
            title: 'Who is this for?',
            content: `Across DigitalQatalyst, campaigns are how ideas turn into movements-how insight becomes visibility, visibility becomes engagement, and engagement becomes growth. CDS is for the people responsible for making those movements happen. It serves marketing leaders setting strategic direction, campaign specialists designing narratives and journeys, designers and creators shaping visual and multimedia assets, and DevOps and WebOps teams deploying campaigns across platforms. It also supports delivery and product teams who initiate campaigns to generate demand, and data analysts who measure performance and optimize outcomes. For anyone involved in planning, executing, or scaling marketing campaigns at DQ, CDS provides the shared operating system that brings structure and alignment to collective effort.`
          },
          {
            id: 'problem',
            title: 'What problem does it solve?',
            content: `Without a unified system, campaigns often evolve as isolated efforts-planned differently by each team, executed with inconsistent standards, and measured unevenly across channels. This leads to fragmented brand expression, slower execution, and missed opportunities to build momentum across the pipeline. CDS transforms campaigns from ad-hoc activities into a disciplined, repeatable practice. It provides a common framework anchored in DQ's content pillars, shared standards, and clear roles, enabling teams to collaborate with confidence and speed. By embedding consistency, quality benchmarks, and performance thinking into every stage of campaign design and delivery, CDS reduces friction, improves effectiveness, and ensures that every campaign contributes coherently to DQ's brand, growth, and market leadership.`
          },
          {
            id: '1.1',
            title: '1.1 DQ MarCom | Mandate',
            content: `The Marketing & Communication (MarCom) Unit in DQ works along with the BD Unit to orchestrate leads, opportunities, and deals for the organisation offerings. The joint mandate of Marketing and BD is "To Accelerate Efficient DCO & DBP Deals Pipeline (Traffic | Contacts | Leads | Opportunities) in DQ". Across the organisation, success is measured in terms of contribution to (1) DQ Insight, (2) DQ Agility, (3) DQ Growth. Marketing campaigns are the primary activities undertaken to build the DQ Brand and generate followership and leads.`
          },
          {
            id: '1.2',
            title: '1.2 DQ MarCom | Ecosystem',
            content: `The DQ MarCom Unit delivers targeted promotional and lead-generation campaigns in collaboration with key units across the organization. Operating as a centralized support function, it ensures each campaign aligns with both the strategic goals of the unit it supports and the broader DQ brand and business objectives.\n\n**DQ Organisation:** Branding positioning.\n\n**DQ Delivery Units:** Leads generation (DQ Designs and Deploys).\n\n**DQ Products Units:** Leads generation (DQ DT2.0 and DCO offerings).`
          },
          {
            id: '1.3',
            title: '1.3 DQ CDS | Purpose',
            content: `At its core, the Campaigns Design System (CDS) is a mechanism for ensuring consistency, quality, and strategic clarity across all outputs. It transforms campaign activity into a disciplined process of storytelling, brand expression, and stakeholder engagement while embedding visual and narrative standards that unify the brand experience. This ensures every campaign is impactful, aligned, repeatable, and reflective of DQ's digital leadership.\n\n**Provide a standardized, high-impact system** for managing all marketing campaigns.\n\n**Empower teams to build campaigns** that align with DQ's vision, values, and voice.\n\n**Accelerate production, improve consistency, and enhance campaign effectiveness.**`
          },
          {
            id: '1.4',
            title: '1.4 DQ CDS | Key Stakeholders',
            content: `CDS standardizes campaign execution and enables collaboration across diverse stakeholders, providing a shared system, language, and quality benchmarks to co-create high-quality, brand-aligned campaigns.\n\n**Marketing Leadership** – Strategic alignment and oversight.\n\n**Campaign Beneficiaries** – All stakeholders across the organisation.\n\n**Campaign Specialists** – Campaign planning, scripting, and content design.\n\n**Designers & Creators** – Visual identity, videos, carousels.\n\n**DevOps / WebOps** – Programming, deployment, asset integration.\n\n**Campaign Data Analysts** – Measurement, reporting, optimization.\n\n**Delivery / Products Teams** – Cross-functional campaign initiators.`
          },
        {
          id: '2',
          title: '2. Stage 00 - Campaigns Strategy (90%)',
          content: `This section defines the strategic foundation of DQ campaigns: the Content Pillars, target channels, overall lifecycle, and roles. It establishes the strategic layer of the CDS by clarifying how DQ’s core messages, brand presence, and offerings are structured and delivered across multiple campaigns. A unified strategy ensures that all campaigns, regardless of target audience or format, are consistent with DQ’s positioning as a leading digital transformation partner.\n\nThis consistency is achieved through integration of five clearly defined content pillars, a well-mapped channel distribution logic, a repeatable campaign lifecycle, and the active participation of cross-functional roles. Together, these strategic components enable DQ to operate with clarity, scale campaigns efficiently, and achieve maximum brand and business impact.`
        },
        {
          id: '2.1',
          title: '2.1 DQ CDS | 5 Content Pillars',
          content: `The foundation of every DQ marketing campaign is built upon five core content pillars. These pillars are strategic expressions of DQ's value proposition and positioning.\n\n**Thought Leadership & Insight:** Advance DQ as the brain trust for digital transformation.\n\n**Product & Service Value:** Showcase the functionality and outcomes of DQ products.\n\n**Brand Identity & Culture:** Humanize the brand through emotion and values.\n\n**Education & Enablement:** Teach and enable audiences to take action.\n\n**Community & Ecosystem:** Highlight DQ's role as a movement, not just a company.\n\nStructuring campaigns around these pillars ensures consistent messaging and measurable outcomes.`
        },
        {
          id: '2.2',
          title: '2.2 DQ CDS | The DQ Story Framework',
          content: `The DQ Value Proposition and Operating Model is encapsulated in the Golden HoneyComb of Competencies (GHC). The 7th element expands into the research-driven 6xD (6 Primary Dimensions for Digital Success), defining worldview, strategic pillars, and product architecture. These frameworks act as the narrative engine behind all campaign storytelling, providing vocabulary, themes, and structural alignment so every campaign reinforces DQ’s identity and positioning.`
        },
        {
          id: '2.3',
          title: '2.3 DQ CDS | The DQ Offerings',
          content: `Campaigns develop the DQ brand and generate leads for products organized in the 6xD framework. Four product classes include:\n\n**Class 01: DBP Reference Products**\n\n**Product 11:** DTMF (Digital Transformation Management Framework)\n\n**Product 12:** Digital Canvas (Digital Cognitive Organisation Canvas)\n\n**Class 02: DT2.0 (Digital Transformation 2.0) Products**\n\n**Product 21:** DTMP (Digital Transformation Management Platform)\n\n**Product 22:** DTO4T (Digital Twin of Organisation for Transformation)\n\n**Product 23:** DTMaaS (Digital Transformation Management as a Service)\n\n**Class 03: DCO (Digital Cognitive Organisation) Products**\n\n**Product 31:** DTMI (Digital Transformation Management Insight)\n\n**Product 32:** DTMA (Digital Transformation Management Academy)\n\n**Product 33:** DTMB (Digital Transformation Management Books)\n\n**Class 04: Niche Products**\n\n**Product 41:** D2GPRC (Data-Driven Govern Perform Risk Comply) – RegTech | SupTech\n\n**Product 42:** Others (i.e. LoanMS | PlanBPM…)`
        },
        {
          id: '2.4',
          title: '2.4 DQ CDS | Roles & Responsibilities',
          content: `Effective execution relies on clearly defined roles and seamless collaboration. Roles are interdependent contributors in a unified campaign workflow, improving speed, quality, and alignment:\n\n**Campaign Owner** – Strategic direction & alignment.\n\n**Creative Lead** – Messaging, visuals, pillar fit.\n\n**Creative Editor** – Canva, video, animation.\n\n**Creative Writer** – Scripts, captions, CTA writing.\n\n**DXP Feature Dev (Platform)** – Distribution, platform compliance.\n\n**DXP Feature Dev (Data)** – Metrics tracking, insights, reporting.`
        },
        {
          id: '2.5',
          title: '2.5 DQ CDS | Target Audience',
          content: `To be refined per campaign; typical personas include:\n\n**Digital Organisation Executive**\n\n**Digital Leaders** (CTO | CDO)\n\n**Digital Architect**\n\n**Digital Worker**`
        },
        {
          id: '2.6',
          title: '2.6 DQ MarCom | Channel Strategy',
          content: `Each content pillar has a native channel fit. Mapping platform to audience and purpose ensures precision and reach across DQ’s top social and digital channels.`,
          tableData: {
            columns: [
              { header: 'Platform', accessor: 'platform' },
              { header: 'Target Audience', accessor: 'audience' },
              { header: 'Content Type(s)', accessor: 'types' },
              { header: 'Priority Tier', accessor: 'priority' }
            ],
            data: [
              { platform: 'Website', audience: 'All audiences', types: 'Core content hub, product & service pages, whitepaper archive, DTMA, DTMI access', priority: 'Tier 1' },
              { platform: 'LinkedIn', audience: 'B2B execs, decision-makers', types: 'POVs, frameworks, success stories, team features', priority: 'Tier 1' },
              { platform: 'YouTube', audience: 'Professionals, learners, clients', types: 'Explainer videos, walkthroughs, DTMA sessions, client showcases', priority: 'Tier 1' },
              { platform: 'Instagram', audience: 'Creative talent, young professionals', types: 'Brand storytelling, behind-the-scenes, reels, carousels', priority: 'Tier 1' },
              { platform: 'Email', audience: 'Existing community, prospects', types: 'Newsletters, whitepaper releases, product and course drops', priority: 'Tier 1' },
              { platform: 'WhatsApp / Telegram', audience: 'Core community, clients, partners', types: 'Micro-updates, alerts, drops, direct engagement', priority: 'Tier 2' },
              { platform: 'X (Twitter)', audience: 'Industry thinkers, fast movers', types: 'Real-time updates, insight threads, reactions to trends', priority: 'Tier 2' },
              { platform: 'Medium / Substack', audience: 'Insight-focused readers', types: 'DTMI essays, whitepaper previews, research reflections', priority: 'Tier 2' },
              { platform: 'Facebook', audience: 'General public, Africa/MENA region', types: 'Campaign promotions, community engagement, events', priority: 'Tier 2' },
              { platform: 'TikTok', audience: 'Gen Z, creative audience', types: 'Short-form explainers, cultural moments, behind-the-scenes', priority: 'Tier 2' },
              { platform: 'Pinterest', audience: 'Visual designers, researchers', types: 'Infographics, templates, storyboards', priority: 'Tier 3' },
              { platform: 'SlideShare', audience: 'Corporate audience, researchers', types: 'DQ playbooks, capability decks, strategic models', priority: 'Tier 3' },
              { platform: 'Threads', audience: 'Instagram-linked users', types: 'Micro-content, soft announcements, teaser threads', priority: 'Tier 3' }
            ]
          }
        },
        {
          id: '2.7',
          title: '2.7 DQ MarCom | Channels vs Content Pillars',
          content: `While each campaign pillar serves a unique strategic purpose, their impact is amplified when mapped to the channels best suited to their strengths. This alignment ensures that content resonates in both form and function - delivered through the platform where it naturally thrives.`,
          tableData: {
            columns: [
              { header: '#', accessor: 'number' },
              { header: 'Content Pillar', accessor: 'pillar' },
              { header: 'Primary Channels', accessor: 'primary' },
              { header: 'Supporting Channels', accessor: 'supporting' }
            ],
            data: [
              { number: '1', pillar: 'Thought Leadership & Insight', primary: 'LinkedIn, Medium/Substack, YouTube, Website', supporting: 'X (Twitter), Threads, SlideShare, Email, WhatsApp/Telegram' },
              { number: '2', pillar: 'Product & Service Value', primary: 'Website, YouTube, LinkedIn, Email', supporting: 'Instagram (Reels), WhatsApp/Telegram, Facebook, X (Twitter), SlideShare' },
              { number: '3', pillar: 'Brand Identity & Culture', primary: 'Instagram, YouTube, TikTok, Website', supporting: 'Threads, Facebook, Pinterest, WhatsApp/Telegram' },
              { number: '4', pillar: 'Education & Enablement', primary: 'YouTube, Instagram (Carousels/Reels), Website, Email', supporting: 'Pinterest, Medium/Substack, LinkedIn, WhatsApp/Telegram' },
              { number: '5', pillar: 'Community, Events & Ecosystem', primary: 'Instagram, LinkedIn, WhatsApp/Telegram, Email, Website', supporting: 'Facebook, X (Twitter), Threads' }
            ]
          },
          contentAfterTable: `Each of the channels offers a number of specific features making it most relevant for a type of content as promoted in specific content pillars. The mapping of channels to pillars is here illustrated:\n\n**Channel Best for Pillars**\n\n**LinkedIn** – 1, 2, 5 (Thought leadership, product, community)\n\n**YouTube** – 1, 2, 3, 4 (All video storytelling & education)\n\n**Instagram** – 3, 4, 5 (Visual identity, engagement, culture)\n\n**Website** – 1, 2, 4, 5 (Hub for conversion & discovery)\n\n**Email** – 2, 4, 5 (Targeted nurture & CTA delivery)\n\n**WhatsApp/Telegram** – 2, 5 (Alerts, client/community activations)\n\n**Medium/Substack** – 1, 4 (In-depth articles and POVs)\n\n**X (Twitter)** – 1, 2, 5 (Fast insights, reactions, awareness)\n\n**Facebook** – 3, 5 (Broad outreach, regional audience)\n\n**Pinterest** – 3, 4 (Visual models and templates)\n\n**SlideShare** – 1, 2 (Decks and visual frameworks)\n\n**TikTok** – 3 (Brand culture and talent magnet)\n\n**Threads** – 1, 3, 5 (Micro storytelling & community tone)\n\nThe style of posts emerging from the content pillars points to specialized social channel for best engagement, as illustrated in the table below.`
        },
        {
          id: '2.7a',
          title: '2.7a DQ MarCom | Sample Post Examples by Pillar',
          content: `The style of posts emerging from the content pillars points to specialized social channel for best engagement.`,
          tableData: {
            columns: [
              { header: 'Pillar', accessor: 'pillar' },
              { header: 'Sample Post', accessor: 'post' },
              { header: 'Channel(s)', accessor: 'channels' }
            ],
            data: [
              { pillar: 'Thought Leadership', post: '"Why DT2.0 Replaces Siloed Projects"', channels: 'LinkedIn + Medium + Website' },
              { pillar: 'Product & Service Value', post: 'TMaaS Demo Video', channels: 'YouTube + Email + LinkedIn' },
              { pillar: 'Brand Identity & Culture', post: '"Day in DQ: Culture Reel"', channels: 'Instagram + TikTok + Threads' },
              { pillar: 'Education & Enablement', post: '"What is a Work Unit?" carousel', channels: 'Instagram + Website + Email' },
              { pillar: 'Community / Ecosystem', post: '"Join the DTMA Launch Event" post', channels: 'LinkedIn + WhatsApp + Email' }
            ]
          }
        },
        {
          id: '2.8',
          title: '2.8 DQ MarCom | Campaign Lifecycle',
          content: `A repeatable structure that moves from strategic intent to execution with clarity and speed. Four core stages:\n\n**Planning** – Strategy, objectives, storyboarding.\n\n**Design** – Scripts, visuals, messaging, prompts.\n\n**Execution** – Programming, scheduling, deployment.\n\n**Governance** – Monitoring, review, reporting, retros.`
        },
        {
          id: '3',
          title: '3. Stage 01 - Campaigns Planning',
          content: `Planning transforms ideas into structured campaigns by aligning creative intent with strategic clarity. It sets the foundation where vision meets execution and uses canvases, briefs, and resource mapping to enable faster, higher-quality launches.`
        },
        {
          id: '3.1',
          title: '3.1 DQ CDS | Campaign Canvas',
          content: `A one-pager that distills the core strategy of a campaign: title, summary, pillars, objective, audience, core message/value hook, CTA, channel strategy, success metrics, hero asset type, personas, and alignment. Ensures all contributors share the same strategic foundation before execution begins.`
        },
        {
          id: '3.2',
          title: '3.2 Campaign Brief Template',
          content: `Formal initiation of a campaign with a single source of truth. Captures strategic context, trigger, creative direction, visual tone, pillar justification, timeline and milestones, budget and resources, and review/approval sign-offs. Keeps contributors aligned and accountable from concept through launch.`
        },
        {
          id: '4',
          title: '4. Stage 02 - Campaigns Design',
          content: `Covers the full creative production process from storyboarding and scripting to asset design, message framing, and AI prompting. Standardized narrative structures, content formats, and design rules ensure a coherent brand experience across platforms.`
        },
        {
          id: '4.1',
          title: '4.1 DQ CDS | Messaging & Narrative Framework',
          content: `Use the core flow to drive clarity and engagement across all formats:\n\n**Hook** – A bold, emotional, or insightful opening that captures attention and stirs curiosity.\n\n**Context** – Sets the scene and introduces relevance or a core problem to build interest and emotional alignment.\n\n**Value** – Describes the key benefit, insight, or outcome that the audience should walk away with.\n\n**CTA** – Directs the viewer on what to do next with urgency and clarity.`
        },
        {
          id: '4.2',
          title: '4.2 DQ CDS | Content Asset Templates (by Pillar)',
          content: `Templates provide fit-for-purpose starting points:\n\n**Thought Leadership** – Explainer reels, whitepaper quotes, carousels.\n\n**Product & Service Value** – Walkthroughs, case studies, user reviews.\n\n**Brand Identity & Culture** – Team reels, behind-the-scenes, storytelling videos.\n\n**Education & Enablement** – Mini tutorials, toolkit downloads, how-to carousels.\n\n**Community & Ecosystem** – Shoutouts, partner highlights, polls, event promos.`
        },
        {
          id: '4.3',
          title: '4.3 DQ CDS | Visual & Style Guides',
          content: `Maintain consistency and recognizability with the CDS visual system:\n\n**Brand Colors and Gradients** – Midnight Navy, Silver Gray, Warm Neutrals.\n\n**Typography and Font Pairings** – Cormorant Garamond for hero text, Open Sans for body text.\n\n**Image Composition and Usage** – Consistent lighting, minimal backdrops, organic framing.\n\n**Layout Rules** – Grid-based, wide margins, content foreground priority.\n\n**Animation Style** – Minimalist transitions, elegant overlays, linear reveal sequences.\n\n**Emotional Tone Guidelines** – Inspirational for Thought Leadership, Practical for Education, Intimate for Brand Culture.`
        },
        {
          id: '4.4',
          title: '4.4 DQ CDS | AI-Powered Production Tools',
          content: `Integrated tools accelerate production without sacrificing quality:\n\n**HeyGen** – Script-to-video for animated explainers.\n\n**MidJourney** – AI-generated image mood boards and compositions.\n\n**ChatGPT** – Captioning, CTA generation, hook design, and script writing.\n\n**MagicPatterns** – Creative layouts and brand-fit aesthetic pattern generation.\n\n**Rocket/Lovable** – Smart previews, design QA, A/B prompt testing, and message clarity scoring.\n\n**Notion Campaign Tracker** (Backlog, In Progress, Complete)\n\n**Canva Template Library** (by Content Pillar)\n\n**AI Prompt Library** (ChatGPT, HeyGen, MidJourney)\n\n**Campaign Calendar Generator** (Notion/Excel)\n\n**UTM Tagging and Performance Dashboard** (Google Sheets)\n\n**Platform Publishing Specs** (Reel sizes, carousel specs, etc.)`
        },
        {
          id: '5',
          title: '5. Stage 03 - Campaigns Execution',
          content: `Execution brings strategy and storytelling to market with technical precision, platform fluency, and agility. Synchronize creative, messaging, and media for cohesive, real-time audience experiences while monitoring signals for optimization.`
        },
        {
          id: '5.1',
          title: '5.1 Compilation & Programming',
          content: `Pre-launch readiness to ensure flawless delivery across touchpoints:\n\n**Organize all assets in versioned folders (per platform):** Ensures that files are clearly labeled, accessible, and properly grouped for platform-specific workflows.\n\n**Tag assets with metadata and UTMs:** Embeds performance tracking codes directly into the content to facilitate precise analytics, audience behavior insights, and campaign attribution.\n\n**Finalize and standardize caption text, hashtags, emojis, and links:** Maintains content tone and platform coherence, enhancing the consistency and effectiveness of each post.\n\n**QA all visuals, copy, videos, and scripts:** A final quality control step to detect and correct errors, reinforce brand consistency, and ensure the campaign meets technical and creative expectations before going live.`
        },
        {
          id: '5.2',
          title: '5.2 Deployment Checklist',
          content: `Guide precise go-live:\n\n**Automated Scheduling:** Schedule content via trusted social media tools (e.g., Simplified) to ensure timed, coordinated, and consistent publishing across all selected platforms.\n\n**Manual Native Posting:** Manually post to native platforms when needed (e.g., Instagram Stories, LinkedIn Polls) to accommodate formats or features not supported by automation.\n\n**Cross-Linking Between Assets:** Ensure interlinking between content pieces (e.g., carousels linking to blog posts, videos to forms) to guide users across channels and increase overall engagement.\n\n**Compliance & Verification Alerts:** Activate alerts and tracking monitors to confirm all assets comply with platform standards and are successfully published without issues.\n\n**Live Engagement Monitoring:** Actively monitor comments, shares, and DMs in real-time to engage audiences, surface feedback, and signal positive interaction to platform algorithms.`
        },
        {
          id: '5.3',
          title: '5.3 Mid-Campaign Adjustments',
          content: `Optimize during the campaign window:\n\n**Creative Refresh:** Refresh visuals, hooks, or CTAs if early performance signals (e.g., low CTR or watch time) suggest poor engagement or content fatigue.\n\n**Smart Retargeting:** Retarget content to high-performing audience clusters or test alternate formats (e.g., static vs. animated) based on live behavior patterns.\n\n**Format Remixing:** Remix or elevate top-performing assets into complementary formats like Stories, Shorts, or bite-sized Reels to boost recirculation, visibility, and engagement.\n\n**Audience Expansion:** Extend the campaign's lifespan and visibility by activating new audience segments, launching geo-variants, or adapting messaging for regional resonance.`
        },
        {
          id: '6',
          title: '6. Stage 04 - Campaigns Governance',
          content: `Governance turns campaigns into repeatable success models through structured performance tracking, quality assurance, and learning loops. It embeds accountability and data-driven decisions across messaging, design, and delivery.`
        },
        {
          id: '6.1',
          title: '6.1 KPI Model by Pillar',
          content: `Measure outcomes aligned to pillar intent:\n\n**Thought Leadership:** Shares, Reach, Saves, Reposts. Signals the spread and perceived value of insight-driven content.\n\n**Product & Service Value:** Click-Through Rate (CTR), Conversions, Engagement Time. Indicates audience action, interest, and content depth.\n\n**Brand Identity & Culture:** Reactions, Comments, Reposts. Reveals emotional connection and brand affinity.\n\n**Education & Enablement:** Completion Rate, Downloads, Saves. Measures the effectiveness of knowledge transfer and utility.\n\n**Community & Ecosystem:** RSVPs, Tagging, DMs, Poll Responses. Tracks interactive engagement and collective participation.`
        },
        {
          id: '6.2',
          title: '6.2 Campaign Review Template',
          content: `Post-campaign review for actionable insights:\n\n**Results vs Objectives:** Did we meet or exceed expectations?\n\n**Top-Performing Assets:** What content formats resonated most?\n\n**Audience Feedback Themes:** What did people say - and how did they feel?\n\n**Visual & Tone Resonance:** Was the brand voice visually and emotionally consistent?\n\n**Budget Use and ROI:** Did we get value for our spend?\n\n**Lessons Learned:** What should we repeat, avoid, or tweak?\n\n**Pillar Impact Assessment:** Which content pillar drove the highest engagement?`
        },
        {
          id: '6.3',
          title: '6.3 Monthly Quality Review',
          content: `Cross-functional review (Head of Content, CES, Design Leads) to assess messaging, visuals, tone, and platform impact; map assets to pillars; log improvements; and evolve frameworks, prompts, and QA checklists.\n\n**Review of Campaign Assets:** Including evaluation by the Head of Content, CES, and Design Leads.\n\n**Editorial, Emotional, and Visual Checks:** Focus on tone, quality, and brand presence.\n\n**Pillar Mapping:** Ensure each asset fulfills its pillar's strategic purpose.\n\n**Improvement Logging:** Capture and assign specific improvements.\n\n**Framework Enhancements:** Apply lessons learned to evolve tools and templates.`
        },
        {
          id: '7',
          title: '7. Appendix | Templates and Style Guides',
          content: `Supporting tools and references: Campaign Brief Template, DQ Campaign Canvas, KPI Scorecard, Creative Request Form, Post-Campaign Review Template, Monthly Quality Review Rubric, Creative Clinic Worksheets, QA Checklists, and pillar style guides for narrative tone, emotional style, visual style, and do/don't guidance. Also includes DQ DXP integration approach for content, engagement, tracking, and analytics across the stack (Simplified.AI, React site, Headless CMS, Dynamics 365, Power Automate, GTM/UTM, Segment, Clarity, analytics dashboards).`
        }
      ]
    },
    tags: ['CDS', 'Campaigns', 'Marketing'],
    imageUrl: '/images/cds.png'
  }
];
