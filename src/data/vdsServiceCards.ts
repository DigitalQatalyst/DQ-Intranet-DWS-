export interface SummaryTableColumn {
  header: string;
  accessor: string;
}

export interface TableData {
  columns: SummaryTableColumn[];
  data: Record<string, string | number>[];
}

export interface VDSServiceCard {
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

export const VDS_SERVICE_CARDS: VDSServiceCard[] = [
  {
    id: 'vds-framework',
    title: 'V.DS (Video Design System)',
    description: "DQ Stories' unified blueprint for producing high-impact, cinematic-quality video content across every stage of creation and distribution.",
    section: 'V1.0.1 | 01.11.25',
    system: 'V.DS',
    type: 'framework',
    content: {
      subsections: [
        {
          id: '1',
          title: '1. Introduction',
          content: "This section introduces the **V.DS (Video Design System)** - DQ's unified blueprint for producing high-impact, cinematic-quality video content. It represents a shift from traditional production routines to a creative excellence framework that embeds intentionality, precision, and measurable performance into every stage of video creation.\n\nThe **V.DS** ensures that every DQ video - whether instructional, promotional, or strategic - delivering a seamless blend of storytelling, design, and emotional resonance, reinforcing brand authority and audience trust across all DQ platforms."
        },
        {
          id: 'who',
          title: 'Who is this for?',
          content: 'Across DigitalQatalyst, video content is created by diverse teams and for multiple purposes - onboarding videos that introduce DQ\'s culture, learning modules that build capability, marketing campaigns that generate engagement, thought leadership pieces that establish authority, and strategic narratives that drive transformation. V.DS is for all of these creators. It serves scriptwriters crafting compelling narratives, video editors refining rhythm and flow, video designers producing visuals and motion sequences, video reviewers ensuring quality and accuracy, marketers strategizing distribution and performance, and executive approvers validating brand alignment. Whether someone is filming authentic testimonials, generating AI-powered explainers, or producing cinematic brand stories, V.DS provides the unified framework that guides every stage from ideation to publication, ensuring consistent excellence across all DQ video outputs.'
        },
        {
          id: 'problem',
          title: 'What problem does it solve?',
          content: 'Before V.DS, video production often evolved inconsistently across teams - each unit working with different standards, formats, and review processes. Videos were created without strategic alignment, quality varied based on individual effort, and teams spent time fixing misalignments instead of enhancing storytelling impact. V.DS transforms this experience by providing a shared, end-to-end system that brings structure and intentionality to the entire video lifecycle - from strategic planning and ideation to scripting, storyboarding, production, review, and distribution. By introducing common standards, clear roles, and quality checkpoints, V.DS removes ambiguity, reduces rework, and makes cinematic excellence repeatable rather than accidental. As a result, teams spend less time correcting and coordinating, and more time creating videos that are visually compelling, narratively coherent, and strategically aligned - allowing video content to function as a powerful asset that consistently advances DQ\'s thought leadership, brand trust, and audience engagement at scale.'
        },
        {
          id: '1.1',
          title: '1.1 Content Mandate (DQ Units)',
          content: 'Multiple units across DQ contribute to producing **exceptional, high-impact video content** that shapes perception, influences decisions, and inspires meaningful action. Each unit develops video outputs aligned with its function, audience, and strategic purpose.\n\n**Primary Video-Producing Units**\n\n**DQ Marketing** – Produces campaign, social, and brand videos designed to captivate audiences and strengthen emotional engagement.\n\n**DQ HRA** – Creates onboarding, training, and culture videos that enhance internal alignment, learning, and belonging.\n\n**DQ DTMA** – Develops high-quality eLearning and course videos, merging pedagogical clarity with cinematic execution.\n\n**DQ Stories** – Crafts narrative-driven explainers and storytelling videos that simplify complex ideas with visual elegance and impact.'
        },
        {
          id: '1.2',
          title: '1.2 Relevant Ecosystem',
          content: "The V.DS standards define the creative and technical DNA of every DQ video. They apply universally across the content ecosystem to ensure cinematic consistency, storytelling harmony, and production excellence across all video types and delivery channels.\n\n**Where V.DS Applies**\n\nInternal communications and executive briefings that require clarity and professionalism\n\nDTMB companion and promotional videos that visually extend DQ's thought leadership\n\nDTMA learning modules and course materials designed for immersive, high-retention education\n\nDTMI insights and thought-leadership videos that distill ideas with elegance and authority\n\nBusiness development, proposals, and client presentations that demand credibility and impact\n\nDQ brand campaigns and social storytelling assets that build emotional connection and trust\n\n**Mandate:** Every DQ video - whatever its format, length, or platform - must exemplify cinematic quality, narrative precision, and visual excellence, meeting the highest standard of impact and brand distinction."
        },
        {
          id: '1.3',
          title: '1.3 V.DS | Purpose',
          content: "The **V.DS** is a **strategic, end-to-end system** that governs how video content is conceptualized, produced, and distributed. It transforms creativity into **structured excellence**, ensuring every output delivers **clarity, emotion, and measurable performance**.\n\n**Core Outcomes**\n\nCinematic quality that elevates DQ's brand presence and message delivery.\n\nNarrative coherence ensuring every frame supports the story.\n\nSeamless collaboration across creative, technical, and strategic teams.\n\nOptimized viewer engagement through data-driven insights and design.\n\nConsistent brand expression across every channel and audience touchpoint."
        },
        {
          id: '1.4',
          title: '1.4 V.DS | Key Stakeholders',
          content: 'Delivering high-impact video excellence requires collaboration among distinct creative and operational roles, each accountable for maintaining DQ’s quality standards and production flow.',
          tableData: {
            columns: [
              { header: 'Role', accessor: 'role' },
              { header: 'Core Responsibilities', accessor: 'responsibilities' }
            ],
            data: [
              { role: 'Scriptwriters', responsibilities: 'Design compelling narratives, structure pacing, and maintain message fidelity to DQ’s tone and purpose.' },
              { role: 'Video Editors', responsibilities: 'Refine rhythm, transitions, and storytelling flow for maximum clarity and emotional engagement.' },
              { role: 'Video Designers', responsibilities: 'Produce visuals, animation, and motion sequences that enhance storytelling and brand recognition.' },
              { role: 'Video Reviewers', responsibilities: 'Ensure technical soundness, conceptual accuracy, and adherence to production standards.' },
              { role: 'Marketers', responsibilities: 'Strategize distribution, SEO optimization, and performance tracking for amplified reach and ROI.' },
              { role: 'Executive Approvers', responsibilities: 'Guarantee that each video upholds DQ’s vision, values, and excellence benchmarks before release.' }
            ]
          }
        },
        {
          id: '2',
          title: '2. Stage 00 – Video Strategy (V.PF)',
          content: "**Overview**\n\nStage 00 defines the strategic lens through which all video productions are conceived. It ensures videos are not produced in isolation but anchored in DQ's overarching narrative, frameworks, product positioning, and audience engagement strategy. This stage guarantees that every video serves a clear business, educational, or branding purpose, directly contributing to DQ's strategic and communication objectives.\n\nBy establishing this strategic foundation, each video aligns with DQ's transformation philosophy, enhances the quality of visual storytelling, and reinforces thought leadership through cinematic impact, emotional resonance, and narrative clarity."
        },
        {
          id: '2.1',
          title: '2.1 DQ Stories | Frameworks',
          content: "Every video created under the **V.DS (Video Design System)** must align with DQ's master narrative: the transformation journey toward **Digital Cognitive Organizations (DCO)**, serving as the creative compass for all scriptwriting, visual design, and emotional tone. By embedding this DCO story, each video reinforces DQ's transformation mission and intellectual leadership, engages audiences through purposeful storytelling and high-impact visuals, and delivers consistent, cinematic cohesion across DQ's global ecosystem, ultimately strengthening its emotional and visual footprint while elevating brand perception and audience engagement worldwide."
        },
        {
          id: '2.2',
          title: '2.2 DQ Stories | Video Artefact Class (VAC)',
          content: "DQ video productions are organized into five **Video Artefact Classes (VACs)** that serve as high-level frameworks guiding creative direction, quality standards, and message coherence. These classes ensure every DQ video remains diverse in form yet unified in purpose, tone, and impact - maintaining full alignment with DQ's strategic vision and cinematic standards of excellence.\n\nThe five Video Artefact Classes (VACs) include:\n\n**Thought Leadership Videos** – Designed to shape perspectives, communicate insight, and establish DQ's authority through powerful storytelling and visual intelligence.\n\n**Product & Service Videos** – Created to demonstrate, promote, or enable adoption of DQ's offerings through engaging walkthroughs and solution-driven narratives.\n\n**Brand & Culture Videos** – Developed to strengthen internal identity and external reputation, capturing DQ's essence and people in motion.\n\n**Education & Learning Videos** – Produced to simplify complex ideas, enhance digital literacy, and foster capability-building through visually engaging learning experiences.\n\n**Community & Ecosystem Videos** – Crafted to engage markets, partners, and audiences through storytelling that connects and inspires participation in DQ's wider ecosystem.\n\n**Insight:** These VACs form the backbone of the V.DS, ensuring all video content meets DQ's high creative and technical standards - balancing diversity with coherence and consistently delivering visual impact aligned to DQ's vision."
        },
        {
          id: '2.3',
          title: '2.3 Video Items | Video Artefact Type (VAT)',
          content: "Each Video Artefact Class (VAC) is divided into specific **Video Artefact Types (VATs)** - production formats intentionally designed to serve DQ's internal onboarding, learning, and external marketing goals. These VATs enable DQ to create cinematic, educational, and engaging video content that can be easily repurposed across channels such as YouTube, LinkedIn, and Instagram while maintaining brand coherence and message consistency.\n\nCore VATs in use across DQ include:\n\n**Onboarding & Culture Videos** – Introduce DQ's people, values, and working principles; used for both internal induction and culture reinforcement.\n\n**Learning Explainers** – Visually dynamic tutorials or short-form courses supporting internal and external capability-building through the DTMA Academy.\n\n**Insight Shorts** – High-impact micro-videos distilling frameworks, data, or concepts for social media and knowledge engagement.\n\n**Product & Service Promos** – Short, cinematic pieces highlighting DQ's digital products, platforms, and client solutions.\n\n**Case & Impact Stories** – Storytelling videos that demonstrate real-world transformation results and client success.\n\n**Thought Leadership Narratives** – Visionary commentaries, expert interviews, or motion explainers establishing DQ's authority and insight leadership.\n\n**Event Highlights & Community Reels** – Capturing moments from internal workshops, live sessions, or public events to showcase engagement and ecosystem vitality.\n\nEach VAT follows a standardized creative workflow within the V.DS to ensure that every piece - whether a learning module or marketing reel - delivers cinematic quality, clarity of message, and measurable impact in alignment with DQ's standards and vision."
        },
        {
          id: '2.4',
          title: '2.4 Video Items | Types vs Channels',
          content:
            'This section defines how Video Artefact Types (VATs) are strategically distributed across platforms to maximize learning impact, marketing visibility, and engagement across internal and external audiences. It ensures each video is optimized for the medium - repurposed where necessary - while maintaining cinematic quality, message clarity, and alignment with DQ’s brand standards.',
          tableData: {
            columns: [
              { header: 'Video Artefact Type', accessor: 'type' },
              { header: 'Primary Channels', accessor: 'channels' }
            ],
            data: [
              { type: 'Onboarding & Culture Videos', channels: 'Internal Portals, DTMA, DTMI Platform, LinkedIn' },
              { type: 'Learning Explainers', channels: 'DTMA LMS, YouTube, Partner Platforms' },
              { type: 'Insight Shorts', channels: 'LinkedIn, Instagram, DTMI Platform, YouTube Shorts' },
              { type: 'Product & Service Promos', channels: 'Instagram, YouTube, DTMI Platform, LinkedIn, Email Campaigns' },
              { type: 'Case & Impact Stories', channels: 'DTMP Portal, Client Showcases, Website' },
              { type: 'Thought Leadership Narratives', channels: 'YouTube, DTMI Platform, LinkedIn' },
              { type: 'Event Highlights & Community Reels', channels: 'LinkedIn, Instagram, DTMI Platform' }
            ]
          },
          contentAfterTable:
            'Purpose: To ensure every video - whether for onboarding, learning, or marketing - reaches its audience in the right context with high visual and narrative impact, maintaining DQ’s standards of excellence and coherence across platforms.'
        },
        {
          id: '2.5',
          title: '2.5 Video Items | Video Development Lifecycle (VDL)',
          content: "The **Video Development Lifecycle (VDL)** defines the two interconnected phases of video production - **Creation** and **Distribution** - ensuring each project flows through structured creativity, rigorous quality control, and data-driven release strategies.\n\n2.5.1 Creation Phase\n\nTransforms ideas into visually and emotionally compelling deliverables through a structured creative and technical workflow:\n\n**Ideation & Validation** – Define the creative vision, storyline, and alignment with DQ's strategy and overarching narrative.\n\n**Production Strategy & Planning** – Document objectives, contributors, and milestones in the Video Production Tracker, setting schedules, resources, and requirements for both filmed and AI-generated projects.\n\n**Scripting & Storyboarding** – Convert approved ideas into concise scripts and visual boards, balancing clarity, pacing, and emotional tone.\n\n**Video Production & Composition** – Execute creation across two paths: filmed videos emphasizing authenticity and emotion, and AI-generated videos offering efficiency and scalability - each aligned to purpose and DQ standards.\n\n**Review & Refinement** – Perform final reviews to confirm narrative consistency, visual polish, and brand alignment before distribution.\n\n2.5.2 Distribution Phase\n\nFocuses on maximizing video visibility and measuring viewer impact:\n\n**Publishing & Tagging** – Upload videos with metadata, subtitles, and SEO alignment.\n\n**Promotion & Analytics Loop** – Launch campaigns, monitor engagement metrics, and refine strategies for continuous improvement.\n\nGoal: Deliver cinematic-quality videos that consistently reflect DQ's brand excellence and drive emotional and intellectual connection."
        },
        {
          id: '2.6',
          title: '2.6 VI.VDL | Video Roles RACI',
          content: 'Defines accountability across the **VDL** using the **RACI model** to clarify responsibilities, streamline teamwork, and uphold consistent production quality and standards.',
          tableData: {
            columns: [
              { header: 'Role Category', accessor: 'role' },
              { header: 'Primary Responsibilities', accessor: 'responsibilities' }
            ],
            data: [
              { role: 'Responsible', responsibilities: 'Scriptwriters, Video Designers, and Video Editors to produce videos that meet creative and quality benchmarks.' },
              { role: 'Accountable', responsibilities: 'Product Owners and Video Leads to oversee alignment, delivery, and brand consistency.' },
              { role: 'Consulted', responsibilities: 'Video Reviewers validate message accuracy and visual quality.' },
              { role: 'Informed', responsibilities: 'Marketeers and Executive Approvers stay updated on publication timelines and performance.' }
            ]
          },
          contentAfterTable: 'The **RACI framework** builds operational clarity, accelerates workflow, and strengthens creative accountability.'
        },
        {
          id: '2.7',
          title: '2.7 VI.VDL | AI Production Tools',
          content: 'AI-powered tools enhance creativity, efficiency, and precision across every stage of the **VDL** - from planning to analytics - supporting seamless collaboration and high-quality output.',
          tableData: {
            columns: [
              { header: 'Process Area', accessor: 'area' },
              { header: 'AI Tools & Purpose', accessor: 'tools' }
            ],
            data: [
              { area: 'Concept & Validation', tools: 'ChatGPT, Gemini Advanced: Support idea framing, narrative structure, and creative direction.' },
              { area: 'Production Strategy & Planning', tools: 'Teams, Azure DevOps: Document objectives, resources, and milestones in production trackers.' },
              { area: 'Scripting & Storyboarding', tools: 'ChatGPT, Gemini Advanced: Draft scripts and visualize storyboards with clarity and narrative flow.' },
              { area: 'Video Production & Composition', tools: 'HeyGen, Canva: Enable AI-assisted video generation, compositing, and motion design.' }
            ]
          },
          contentAfterTable: 'Integrated AI tools transform production efficiency, ensuring DQ videos deliver consistent cinematic quality, creative agility, and measurable audience impact.'
        },
        {
          id: '3',
          title: '3. Stage 01 – VI Production (Ideation & Validation)',
          content: '**Overview**\n\nStage 01 inaugurates the video item production through clarifying vision, scope, and preparation. It ensures every video begins with clear intent, visual direction, and measurable impact. This stage sets the creative and technical foundation for delivering high-quality, cinematic outputs that embody DQ\'s brand excellence and storytelling standards.'
        },
        {
          id: '3.1',
          title: '3.1 VI Ideation | Purpose',
          content: 'Ideation ensures every video is rooted in a defined purpose, guided by DQ\'s transformation narrative, and tailored to specific audience needs. It provides a focused space to clarify creative intent, message impact, and desired emotion - whether the goal is to inform, inspire, influence, or activate. Through this process, videos become more than communication tools; they become strategic visual assets aligned with DQ\'s vision.'
        },
        {
          id: '3.2',
          title: '3.2 V Ideation | Principles',
          content: 'To guarantee focus, storytelling quality, and production feasibility, the following five principles guide video ideation:\n\n**Strategic Relevance:** Every video must align with DQ\'s frameworks (e.g., D6, DBP, DT2.0) and vision, reinforcing the transformation story through visuals and engaging narrative.\n\n**Audience Impact:** Designed with empathy and insight, videos must resonate emotionally and intellectually with defined audience segments to promote engagement.\n\n**Purpose-Driven Design:** Each concept begins with a clear creative intent (inform, inspire, activate), anchoring all artistic and narrative decisions.\n\n**Feasibility & Format Fit:** Ideation must account for realistic delivery constraints and select the most suitable artefact type for the message.\n\n**Innovation & Collaboration:** Blend creativity, technology, and teamwork to produce videos that are both imaginative and executable.\n\nThese principles ensure each video concept is actionable, visually compelling, and strategically aligned with DQ\'s transformation mission.'
        },
        {
          id: '3.3',
          title: '3.3 Ideation Principle | Strategic Relevance',
          content: 'Every video must embody DQ\'s strategic vision and express its transformation message through purposeful visuals and narrative flow. Strategic relevance links each production to DQ\'s intellectual foundation, ensuring every frame contributes to an impactful and engaging storytelling experience.\n\n**Example:** A video about "The Future of Digital Organizations" should weave D6 and DBP visuals into its storyline to reinforce DQ\'s leadership in digital transformation.'
        },
        {
          id: '3.4',
          title: '3.4 Ideation Principle | Audience Impact',
          content: 'Videos should be created with a deep understanding of the audience\'s mindset, needs, and context. Whether targeting executives, partners, or learners, they must engage emotionally, sustain viewer attention, and deliver tangible value that motivates continued participation or action.\n\n**Example:** A thought leadership video for executives should use cinematic storytelling and vision-driven tone, while training videos focus on clarity and practical application.'
        },
        {
          id: '3.5',
          title: '3.5 Ideation Principle | Purpose-Driven Design',
          content: 'Every video concept begins with a clear emotional and strategic purpose that directs the script, tone, and visual rhythm. Purpose-driven design ensures clarity, coherence, and sustained engagement by aligning creative expression with audience motivation and DQ\'s impact goals.\n\n**Example:** A motivational video introducing a new DQ initiative will differ significantly in tone, visuals, and music from a tutorial explaining internal workflows.'
        },
        {
          id: '3.6',
          title: '3.6 Ideation Principle | Feasibility & Format Fit',
          content: 'Ideation must account for real-world delivery constraints - such as time, budget, team skills, and platform readiness - while selecting the most effective format to convey the message. The chosen artefact type should match both the content\'s intent and the audience\'s consumption habits, balancing ambition with executional feasibility.\n\n**Example:** An AI-generated explainer may be ideal for scalability and speed, while a filmed testimonial better conveys authenticity and emotion.'
        },
        {
          id: '3.7',
          title: '3.7 Ideation Principle | Innovation & Collaboration',
          content: 'Ideation should merge creativity with strategic alignment, fostering active collaboration between production, design, and marketing teams. This integration cultivates bold ideas that balance innovation with practicality, ensuring each concept is distinctive, engaging, and fully aligned with DQ\'s brand and impact objectives.\n\n**Example:** Co-developing an explainer video with design and content teams can combine creative flair with DQ\'s strategic precision.'
        },
        {
          id: '3.8',
          title: '3.8 Story Validation | Production Canvas',
          content: 'The **Production Canvas** ensures that every content item is aligned with DQ\'s intellectual architecture and production standards. The canvas captures key validations, including:\n\n**Alignment with DQ frameworks** (e.g., D6, DBP, DT2.0)\n\n**Coherence with the overarching narrative structure** and transformation storyline\n\n**Clear artefact classification** (e.g., Onboarding Video, Promo, Event Highlights)\n\n**Production scope, ownership, and timeline mapping**\n\nBy formalizing this validation step, the canvas helps content teams avoid misalignment, clarify expectations, and accelerate production readiness with confidence and shared understanding. The canvas template is illustrated in the Appendix.'
        },
        {
          id: '3.9',
          title: '3.9 Story Validation | Plotline Alignment',
          content: 'Plotline alignment involves systematically reviewing the production canvas to ensure that the storyline, messaging, and flow are fully in sync with DQ\'s communication standards and transformation logic. This validation guarantees that every video delivers visual coherence, emotional depth, and measurable audience impact consistent with DQ\'s brand vision but also embody its cognitive design principles - making the content both strategically resonant and intellectually coherent.'
        },
        {
          id: '4',
          title: '4. Stage 02 – V.DS Production (Production Strategy & Planning)',
          content: '**Overview**\n\nThis stage formalizes how every video is scoped, structured, and organized before production begins. It bridges the gap between ideation and creation through a clear, quality-driven roadmap that prioritizes visual excellence, narrative coherence, and operational precision. Effective briefing and planning ensure that every contributor shares a unified understanding of the objectives, format, ownership, and timeline - ultimately accelerating production and elevating quality.'
        },
        {
          id: '4.1',
          title: '4.1 VI Briefing | Purpose',
          content: 'The purpose of the Production Strategy is to translate high-level creative intent into a structured, actionable production blueprint. It ensures the team has full clarity on what is being created, why it matters, who it serves, and how it will be executed. By aligning storytelling objectives with production realities, the strategy stage guarantees that both filmed and AI-generated videos are designed with purpose, precision, and impact.'
        },
        {
          id: '4.2',
          title: '4.2 VI Briefing | Principles',
          content: 'Effective video strategizing within the V.DS is anchored on five guiding principles that ensure creative clarity, cross-team alignment, and delivery excellence:\n\n**Clarity over Complexity** – Simplify concepts into actionable components that accelerate creative understanding and execution.\n\n**Unified Alignment** – Ensure every contributor - from directors to editors - shares a single vision for tone, structure, and outcomes.\n\n**Format & Style Precision** – Clearly define the video format, outlining its scope, structure, and design considerations from the outset.\n\n**Collaborative Input** – Engage diverse perspectives across production, design, and strategy to strengthen both creativity and feasibility.\n\n**Outcome Anchoring** – Establish measurable storytelling and engagement goals, ensuring that every scene drives emotional and visual impact.\n\nThese principles turn the briefing process into a creative synchronization point, ensuring artistic ambition is matched by technical readiness and narrative cohesion.'
        },
        {
          id: '4.3',
          title: '4.3 Story Tracking | VI Objectives',
          content: 'This tracker aligns each production with DQ\'s transformation priorities and brand storytelling goals. It defines the strategic purpose, visual message, and performance expectations of each video - serving as both a creative compass and accountability tool for measurable audience engagement and brand consistency.'
        },
        {
          id: '4.4',
          title: '4.4 Story Tracking | VI Templates & References',
          content: 'This section introduces the V.DS templates and creative reference materials that streamline planning and maintain production coherence. These tools ensure that all outputs reflect DQ\'s signature visual identity and cinematic quality.\n\nKey resources include:\n\n**VI Strategy Template** – Captures creative direction, objectives, format, and delivery milestones.\n\n**Audience Mapping Canvas** – Identifies target viewers, emotional tone, and engagement intent.\n\n**Video Format Selector** – Guides whether a concept is a best fit with the most appropriate artefact type and format.\n\n**Video Artefact Class (VAC) Matrix** – Links video types to strategic purpose and ensures ecosystem consistency.\n\nTogether, these tools serve as a creative reference kit to ensure all contributors start from the same point of clarity, consistency, and strategic alignment.'
        },
        {
          id: '4.5',
          title: '4.5 Story Tracking | VI Contributors',
          content: 'Defines the roles, ownership, and creative responsibilities for each video production. Contributors are mapped using the **RACI model** to ensure clear accountability and seamless collaboration across all **V.DS** production phases.'
        },
        {
          id: '4.6',
          title: '4.6 Video Planning | Timeline & Milestones',
          content: 'The V.DS Planning Framework establishes a milestone-driven workflow that balances agility, creativity, and precision - ensuring each production advances smoothly from concept to completion with maintained quality and impact. This timeline establishes transparency, sets expectations, and allows contributors to coordinate efficiently.\n\nKey milestones include:\n\n**Ideation Approval** – Validate the idea, narrative fit, and creative direction.\n\n**Strategy Finalization** – Approve the VI Strategy with defined scope, objectives, and roles.\n\n**Script & Storyboard Completion** – Deliver the first draft for internal review and refinement.\n\n**Production & Editing** – Finalize all visual assets, layout, and formatting aligned to brand guidelines.\n\n**Final Review** – Conduct brand and storytelling validation before release.\n\n**Publication & Activation** – Confirm distribution and promotional rollout across chosen channels.\n\nA structured plan like this ensures momentum, accountability, and creative consistency across the production lifecycle.'
        },
        {
          id: '4.7',
          title: '4.7 Video Planning | Tracker',
          content: 'The **V.DS Tracker** serves as the operational hub for all video projects. It is a live operational tool to monitor, manage, and optimize the progress of all content items across the production lifecycle. The tracker serves as a real-time dashboard and shared workspace for contributors, offering clear visibility into the current status and next steps of each item.\n\nIt captures key production data, including:\n\n• **Video ID and Title:** Unique identifier and working title for reference.\n\n• **Artefact Type:** Defined format of the content\n\n• **Assigned Contributors:** Assigned roles\n\n• **Current Status:** Live progress status (Planning, Filming, Editing, Review)\n\n• **Upcoming Milestones and Deliverables:** Immediate next steps and deadlines.\n\n• **Publishing Schedule:** Targeted publication and promotion dates.\n\nAs the **single source of truth**, it drives clarity, transparency, and performance across all V.DS initiatives.\n\nThe V.DS Tracker acts as the **single source of truth** for cross-functional collaboration, accountability, and performance monitoring - minimizing confusion, delays, and duplicate efforts.'
        },
        {
          id: '4.8',
          title: '4.8 Video Planning | Strategy Sessions',
          content: 'Structured **strategy sessions** bring all relevant contributors together - live or asynchronously - to align on the strategic and operational direction of each video. These sessions confirm clarity on content goals, target audience, artefact type, messaging tone, production pathway, and required sign-offs.\n\nTo ensure smooth execution, tasks must be formally assigned to contributors during or immediately after the session and logged in the **V.DS Tracker** with clear deliverables, deadlines, and status updates. Contributors should also schedule timely review checkpoints, either self-led or peer-reviewed, to maintain quality, track progress, and flag potential risks early.\n\nThis integrated approach of live alignment, formal task assignment, and structured review creates a closed-loop workflow that accelerates delivery while upholding DQ\'s editorial, creative, and strategic standards - ensuring every video achieves visual excellence, narrative depth, and measurable audience impact in full alignment with the **V.DS framework**.'
        },
        {
          id: '5',
          title: '5. Stage 03 – VI Production | Scriptwriting',
          content: '**Overview**\n\nStage 03 marks the beginning of the creative development phase, where video concepts evolve into structured, emotionally engaging narratives. This stage defines how scripts are written, refined, and validated to ensure clarity, coherence, and impact. It also integrates AI editing support, tonal calibration, and quality control to uphold DQ\'s storytelling standards under the V.DS framework.'
        },
        {
          id: '5.1',
          title: '5.1 V Scriptwriting | Purpose',
          content: 'The purpose of V Scriptwriting is to convey a single, clear message that educates, inspires, and aligns viewers with DigitalQatalyst\'s principles. Each script serves as a storytelling vehicle that transforms strategic concepts into relatable, human narratives that drive understanding and action.\n\n**Core Communication Goals:**\n\nMake complex ideas understandable and actionable.\n\nCommunicate why the message matters within DQ\'s broader mission.\n\nEnsure consistency in storytelling, tone, and cultural alignment across all videos.\n\nInspire individuals to recognize their role in DQ\'s collective journey.\n\nEvery script contributes to a unified learning and engagement experience, helping audiences not only absorb key messages but also see themselves as active participants in the DQ story. A strong script establishes flow, structure, and tone while guiding the emotional journey of the audience and aligning with DQ\'s frameworks and brand voice.'
        },
        {
          id: '5.2',
          title: '5.2 V Scriptwriting | Principles',
          content: 'Effective video scripts adhere to the following principles:\n\n**Narrative Clarity** – Keep messages simple, structured, and purpose-driven.\n\n**Audience Connection** – Adapt tone, pace, and style to resonate with target viewers.\n\n**Purpose Alignment** – Ensure every line serves a clear intent: to inform, inspire, influence, or activate.\n\n**Emotional Flow** – Craft rhythm and tone that sustain viewer engagement and emotional resonance.\n\n**Brevity & Impact** – Keep narration concise, vivid, and visually adaptable.'
        },
        {
          id: '5.3',
          title: '5.3 VI Scriptwriting | Engaging Scriptwriting',
          content: 'Engagement is the cornerstone of impactful video communication across DQ. In today\'s attention economy, audiences choose what to watch - meaning every script must earn their focus through clarity, emotion, and relevance.\n\nA well-written script transforms information into an experience that captures curiosity, triggers emotion, and sustains attention - whether for learning, storytelling, or marketing.\n\n**Key Reasons for Engaging Scriptwriting**\n\n**To Humanize Communication:** People connect more deeply when ideas are expressed through human stories and authentic emotions rather than technical descriptions.\n\n**To Reinforce Organizational Culture:** Every script represents DQ\'s voice. It should convey empathy, purpose, and excellence while reflecting the organization\'s values.\n\n**To Drive Retention and Action:** Emotionally engaging narratives help viewers internalize key messages, remember them, and apply them in real-world scenarios.\n\n**To Inspire Reflection and Ownership:** The goal is not just to inform but to empower viewers to see themselves as active participants in DQ\'s ongoing transformation.\n\nEngaging scriptwriting turns passive viewership into meaningful interaction - transforming every video into a vehicle for learning, alignment, and inspiration.'
        },
        {
          id: '5.4',
          title: '5.4 V Scriptwriting | Voice & Tone',
          content: 'DQ scripts must embody a voice of authority, insight, and empathy, reflecting DigitalQatalyst\'s dual identity - intellectually rigorous yet human, precise yet personable. Every script should balance conceptual depth with emotional accessibility, maintaining professional clarity while adopting a conversational, authentic tone.\n\nScripts should:\n\nMaintain structural discipline and clarity while feeling natural and relatable.\n\nBalance analytical insight with human warmth, ensuring credibility and connection.\n\nSpeak to the viewer rather than at them, using inclusive language ("we," "us," "you") to foster shared ownership.\n\nEvoke pride and belonging, reinforcing that every contributor is part of a unified organizational mission.\n\nEditors and writers should continuously calibrate tone using feedback and AI tone analyzers to preserve this balance, ensuring every video communicates with both precision and humanity across all V.DS artefacts.'
        },
        {
          id: '5.5',
          title: '5.5 V Scriptwriting | Preparation Requirements',
          content: 'Before beginning the writing process, scriptwriters must have a clear understanding of both the subject matter and the intended communication outcome. Each script should serve a well-defined purpose - whether to inform, inspire, or promote engagement - and must be built upon a solid foundation of insight and intent.\n\n**Topic Definition:** Clearly identify the central theme or concept the video will explore. This sets the creative and intellectual anchor for the script.\n\n**Communication Objective:** Define the primary purpose - whether to inform, inspire, educate, or persuade - and ensure the narrative supports that intent throughout.\n\n**Core Message:** Distill the main takeaway into one clear, memorable idea that the viewer should understand or feel after watching.\n\n**Key Takeaways:** Outline the essential points or lessons that reinforce the video\'s purpose and help the audience connect ideas to practical relevance.\n\n**Emotional Hook:** Determine the emotional driver - curiosity, empathy, excitement, or reflection - that will sustain attention and engagement from start to finish.\n\n**Call to Action:** Conclude with a meaningful invitation for the viewer to reflect, explore, share, or take a specific next step that aligns with DQ\'s broader mission.'
        },
        {
          id: '5.6',
          title: '5.6 V Scriptwriting | Script Structure',
          content: 'All DQ video scripts, regardless of duration or purpose, must follow a foundational narrative structure that creates clarity, engagement, and emotional continuity throughout the viewing experience.\n\nStandard Structure Overview:\n\n**Hook** → **Context** → **Core Content** → **Recap** → **Call to Action (CTA)**\n\nThis sequence ensures that every script flows naturally - capturing attention, framing purpose, delivering insight, reinforcing memory, and inspiring action. It mirrors the way human attention evolves across an experience: from curiosity → understanding → reflection → ownership.\n\nBy following this structure, DQ ensures that all videos - whether instructional, cultural, or promotional - maintain coherence, emotional precision, and lasting resonance. Each element contributes to a seamless storytelling flow that informs, inspires, and connects audiences while reinforcing DQ\'s vision and values. The full structural framework for script development is provided in Appendix X for detailed reference.'
        },
        {
          id: '5.7',
          title: '5.7 V Scriptwriting | AI Prompting Guidelines',
          content: 'AI tools such as **ChatGPT, Gamma, and Descript** play a valuable role in supporting scriptwriters by refining flow, phrasing, and tone, and by suggesting creative variations that enhance clarity and storytelling impact. These tools accelerate drafting, help maintain structural coherence, and assist in adjusting tone for different audiences or platforms. However, human editors must always review AI-assisted drafts to safeguard nuance, authenticity, and emotional depth, ensuring that every script maintains DQ\'s visual, narrative, and strategic standards. This **hybrid approach** maximizes efficiency while preserving the originality, intention, and creative integrity behind every DQ video.'
        },
        {
          id: '5.8',
          title: '5.8 V Scriptwriting | Platform Adaptation',
          content: 'Scripts should anticipate how narratives adapt across channels (YouTube, LinkedIn, Instagram, LMS). Each platform may require adjustments in pacing, format, and dialogue style. Short-form content should deliver impact in seconds, while long-form videos can explore deeper context and storytelling arcs. Guidelines for each platform are detailed in Appendix X.'
        },
        {
          id: '5.9',
          title: '5.9 VI Scriptwriting | Checklist & Sign-off',
          content: 'Before proceeding to storyboarding, every script must undergo a V.DS Script Quality Review to verify readiness and alignment. The checklist includes:\n\nNarrative clarity and flow validation.\n\nTone and emotional consistency check.\n\nCompliance with DQ\'s frameworks and brand standards.\n\nVerification of accuracy, pacing, and CTA placement.\n\nOnce approved by the Creative Lead and Product Owner, the script is considered final and ready for the Storyboarding Stage.'
        },
        {
          id: '6',
          title: '6. Stage 04 – VI Production | Storyboarding',
          content: '**Overview**\n\nThis section focuses on storyboarding, the process of visually mapping a completed script into a sequence of scenes. It bridges narrative and production, enabling teams to visualize transitions, emotions, and technical elements before filming or AI generation begins. Storyboarding ensures creative alignment and production efficiency, serving as the critical bridge between storytelling intent and on-screen execution.'
        },
        {
          id: '6.1',
          title: '6.1 V Storyboarding | Purpose',
          content: 'The purpose of **V Storyboarding** is to translate the approved script into a visual sequence that defines how the story will appear on screen. Storyboarding helps visualize flow, emotion, and pacing before production - ensuring alignment between scriptwriters, editors, and creative designers. It reduces rework, improves consistency, and enables creative experimentation, serving as a blueprint for production that clarifies timing, framing, motion, and emotional flow. This stage is especially critical when using AI tools like **HeyGen**, where the quality of the output depends directly on the clarity of the storyboard and the precision of its prompts.'
        },
        {
          id: '6.2',
          title: '6.2 V Storyboarding | Principles',
          content: 'Effective storyboards follow these principles:\n\n**Visual Logic** – Maintain a seamless visual and narrative flow between scenes to ensure coherence and continuity.\n\n**Tone & Emotion Mapping** – Align visuals, pacing, and transitions with the intended emotional journey to reinforce impact.\n\n**Camera Intent** – Clearly define framing, perspective, and motion to guide both traditional and AI-driven production workflows.\n\n**Scene Efficiency** – Craft scenes that are visually dynamic yet purposeful, reducing complexity while emphasizing clarity.\n\n**Creative Flexibility** – Encourage iteration, feedback, and creative experimentation throughout the process to enhance storytelling quality and adaptability.'
        },
        {
          id: '6.3',
          title: '6.3 V Storyboarding | Written Storyboarding',
          content: 'A **Written Storyboard** is a scene-by-scene outline describing what happens visually, emotionally, and narratively in a video - written in plain language. This approach allows teams to think visually through text before any design work begins. Each scene represents one core message or emotional shift within the script. Written storyboards are fast, collaborative, and ensure that creative direction is clear before visual assets are developed. The full written storyboard template is included in Appendix X.'
        },
        {
          id: '6.4',
          title: '6.4 V Storyboarding | Developing Visuals',
          content: 'The storyboarding process begins by translating a written narrative into visually compelling and emotionally resonant scenes. This process helps bridge imagination and execution while aligning the team on the intended look and feel before production begins.\n\n**Extract the Message:** Identify the central idea or intent behind each line or moment in the script.\n\n**Define the Emotion:** Determine what the viewer should feel during that moment and how to evoke it authentically.\n\n**Select the Visual Metaphor:** Translate that feeling or message into a strong visual concept - through imagery, pacing, motion, or symbolism.\n\nMastering these steps ensures that storyboards achieve both emotional and conceptual depth, transforming written words into vivid, purposeful visuals that connect meaningfully with the audience and set a clear direction for production.'
        },
        {
          id: '6.5',
          title: '6.5 V Storyboarding | Scene Grouping Breakdown',
          content: 'For longer videos (2+ minutes), scenes are grouped into clusters based on narrative progression or emotional focus. As a rule of thumb, videos should not exceed this benchmark: no more than 10–15 total scenes, with 2–3 scenes per section, to maintain focus, pacing, and engagement. This keeps pacing tight and ensures visual diversity without overcomplicating production. Scene grouping helps identify where to emphasize emotion, transitions, and storytelling beats. A sample grouping framework is detailed in Appendix X.'
        },
        {
          id: '6.6',
          title: '6.6 V Storyboarding | Storyboard → AI Prompt Conversion',
          content: 'Once the storyboard is complete, it can be converted into detailed AI prompts for production tools (such as **HeyGen**). This involves merging all scene information - visuals, voiceover, emotion, and transitions - into concise, structured prompts. Clear storyboards lead to precise AI execution, producing professional, high-quality results consistently. The conversion process and example prompts are provided in Appendix X.'
        },
        {
          id: '6.7',
          title: '6.7 V Storyboarding | Tools & Collaboration',
          content: 'AI and creative tools such as **HeyGen** and **Canva** help generate visual compositions, motion cues, and scene previews. Collaboration between scriptwriters, designers, and directors ensures storyboards stay consistent with the narrative while optimizing visual style and flow.'
        },
        {
          id: '6.8',
          title: '6.8 V Storyboarding | Accessibility & Readability',
          content: 'Storyboards must be easy for all contributors to interpret. Each frame should clearly illustrate scene setup, dialogue, and emotional tone, with annotations for transitions or effects. High-contrast visuals, clear labels, and concise notes improve cross-functional communication.'
        },
        {
          id: '6.9',
          title: '6.9 V Storyboarding | Quality & Sign-off',
          content: 'Before production begins, each storyboard undergoes a V.DS Quality Review to validate clarity, emotional tone, and technical readiness. The checklist includes:\n\nAlignment with the approved script\n\nConsistent tone and emotion across scenes\n\nVerified camera angles and transitions\n\nAnnotated notes for production and post-production teams\n\nOnce approved by the Creative Director and Product Owner, the storyboard moves into the Production & Composition phase, ready for execution.'
        },
        {
          id: '7',
          title: '7. Stage 05 – VI Production | Video Production & Composition',
          content: '**Overview**\n\nThis stage governs the visual and structural design of all video artefacts, ensuring they meet DQ\'s brand identity, design integrity, and quality standards. This stage focuses on transforming finalized storyboards and scenes into visually coherent, professionally styled, and impactful video compositions that reflect DQ\'s premium design language. It ensures that every video - whether AI-generated or filmed - communicates with visual precision, emotional resonance, and brand consistency.'
        },
        {
          id: '7.1',
          title: '7.1 VI Video Production | Purpose',
          content: 'The purpose of design within the **V.DS framework** is to elevate content beyond visuals - to craft a complete sensory and intellectual experience. Effective design enhances comprehension, emotional engagement, and recall. It ensures each frame is purposeful, clear, and aesthetically aligned to DQ\'s visual identity, creating seamless harmony between storytelling and brand.'
        },
        {
          id: '7.2',
          title: '7.2 V Design | Principles',
          content: "DQ's design principles are rooted in clarity, cohesion, and brand distinction:\n\n**Purposeful Visuals:** Every design element must reinforce the core message, simplifying rather than cluttering communication.\n\n**Structured Visual Hierarchy:** Composition, color, and typography must guide the viewer's eye intuitively across scenes.\n\n**Brand Integrity:** Maintain DQ's distinctive identity through consistent use of color, motion, and typography.\n\n**Inclusive Accessibility:** Designs should remain readable, inclusive, and adaptable across viewing devices and resolutions.\n\n**Systemic Consistency:** Visual rules must be applied uniformly across formats to ensure recognizability and professional cohesion."
        },
        {
          id: '7.3',
          title: '7.3 V Design | Brand Identity',
          content: "DQ's brand identity embodies a minimal, sophisticated, and forward-thinking aesthetic that communicates clarity, confidence, and innovation. The design language serves as both a visual and emotional signature across all videos, reinforcing brand authority and trust.\n\nCore Brand Attributes:\n\nClean, structured layouts with generous negative space.\n\nHarmonious font pairing to balance elegance and legibility.\n\nThoughtful color and motion cues to guide emotional tone.\n\nSubtle transitions that enhance continuity without distraction."
        },
        {
          id: '7.4',
          title: '7.4 V Design | Color Palette',
          content: "DQ's **video color palette** consists of the following:\n\n**Midnight Navy (#001035):** Represents intelligence, authority, and trust.\n\n**Pure Black (#000000):** Provides contrast, clarity, and focus.\n\n**Silver Gray (#E0E0E0):** Serves as a neutral divider for layered visuals.\n\n**Pure White (#FFFFFF):** Adds balance, openness, and calm.\n\n**Accent Colors (Limited Use):** Used to highlight or differentiate key visuals, graphs, and text overlays.\n\nDominant colors should retain DQ's refined aesthetic, while accents are used sparingly to avoid distraction and visual fatigue."
        },
        {
          id: '7.5',
          title: '7.5 V Formatting | Typography Standards',
          content: 'Typography defines visual tone and ensures legibility across all formats:\n\n**Heading Font:** Raleway (Bold/Medium)\n\n**Body Font:** Raleway (Regular)\n\n**Font Ratios:** Maintain proportional consistency between headings, body text, and captions.\n\n**Alignment & Spacing:** Use left alignment for readability, consistent line spacing, and structured text blocks.\n\nTypography should feel balanced - professional yet approachable - and adaptable for multiple screen sizes.'
        },
        {
          id: '7.6',
          title: '7.6 V Formatting | Iconography & Motion Graphics',
          content: 'Visual elements such as icons, diagrams, and animations should complement the message and tone of the video.\n\nUse line-based, minimalist icons aligned with DQ\'s aesthetic.\n\nMaintain consistent stroke thickness and animation style.\n\nPrefer metaphorical visuals over literal ones to enhance conceptual engagement.\n\nMotion graphics should support narrative flow, not overwhelm the story.'
        },
        {
          id: '7.7',
          title: '7.7 V Formatting | Layout & Composition',
          content: 'Each frame must maintain visual order and balance. Key layout rules include:\n\nUse a consistent grid structure across all scenes.\n\nGroup visual elements logically to emphasize relationships.\n\nMaintain consistent padding and safe margins for all overlays and text.\n\nRespect white space to promote focus and clarity.\n\nLayout integrity ensures visual comfort and cognitive clarity, especially in fast-paced or information-rich sequences.'
        },
        {
          id: '7.8',
          title: '7.8 V Formatting | Imagery & B-Roll',
          content: 'All imagery and B-roll footage must:\n\nReinforce the intended message and emotional tone.\n\nBe high-quality, licensed, and brand-consistent.\n\nAvoid clichés or culturally narrow visuals.\n\nApply consistent filters or overlays to achieve a unified look.\n\nImages and footage should complement, not distract - enhancing narrative credibility and emotional immersion.'
        },
        {
          id: '7.9',
          title: '7.9 V Formatting | Accessibility & Readability',
          content: 'Accessibility in design ensures all viewers can comfortably consume DQ content:\n\nMaintain minimum contrast ratios for readability.\n\nUse clear captions and subtitles for all dialogue and voiceover.\n\nEnsure motion timing accommodates comprehension (avoid rapid transitions).\n\nInclude alt-text or scene descriptions for key visuals when applicable.'
        },
        {
          id: '7.10',
          title: '7.10 V Formatting | Checklist & Sign-off',
          content: 'Before any video moves into final rendering or publication, it must undergo a V.DS Visual QA Review to confirm:\n\nAlignment with DQ\'s color, typography, and brand principles.\n\nLayout precision and balance across scenes.\n\nProper integration of imagery, motion graphics, and captions.\n\nAccessibility and resolution compliance.\n\nFinal approval is issued jointly by the Visual Lead and Creative Director, ensuring every DQ video meets the organization\'s standards of excellence and brand distinction.'
        },
        {
          id: '8',
          title: '8. Stage 06 – VI Production | Review & Refinement',
          content: '**Overview**\n\nThis stage integrates all forms of video and visual review into a structured, multi-layered quality assurance process. It validates the accuracy, clarity, alignment, and emotional impact of every video before release. The process includes mini-reviews after the scriptwriting and storyboarding stages, followed by a comprehensive review once the video is fully produced. This ensures that all outputs under the V.DS framework reflect DQ\'s standards for storytelling excellence, visual quality, and brand integrity.'
        },
        {
          id: '8.1',
          title: '8.1 VI Review | Purpose',
          content: 'The purpose of review and refinement is to uphold the quality, impact, and consistency of every DQ video. Reviews ensure that each artefact aligns with DQ\'s tone, frameworks, and creative intent while achieving clarity, emotional engagement, and production precision. This process also strengthens collaboration by establishing checkpoints for input, validation, and continuous improvement.'
        },
        {
          id: '8.2',
          title: '8.2 VI Review | Principles',
          content: 'Reviews follow these core principles to ensure consistency and excellence:\n\n**Alignment:** The video must align with its intended message, audience, and the DQ narrative.\n\n**Clarity:** Every scene should be visually and narratively coherent, supporting comprehension and emotional connection.\n\n**Accuracy:** Facts, visuals, and data references must be verified for precision and authenticity.\n\n**Consistency:** Maintain DQ\'s signature tone, pacing, and brand identity across all sequences.\n\n**Visual Integrity:** Design, composition, and transitions must follow V.DS visual standards for color, typography, and layout.\n\nThese principles ensure that DQ videos meet both intellectual and emotional standards for storytelling and impact.'
        },
        {
          id: '8.3',
          title: '8.3 VI Review | Interim Quality Reviews',
          content: 'To maintain quality throughout production, interim reviews occur at critical milestones:\n\n**After Scriptwriting:** Ensures the message, tone, and intent align with DQ\'s narrative and that the script is engaging and clear before storyboarding begins.\n\n**After Storyboarding:** Validates that the visual flow, scene transitions, and emotional mapping reflect the script\'s purpose and brand tone.\n\nThese early-stage reviews help identify misalignments, ensuring smoother execution and minimizing downstream revisions.'
        },
        {
          id: '8.4',
          title: '8.4 VI Review | Final Review & Refinement',
          content: 'The main review is conducted after the video is produced and edited. It validates the final output\'s coherence, pacing, and emotional resonance. This review confirms that:\n\nThe narrative and visuals align with the approved storyboard.\n\nTransitions, motion graphics, and captions enhance rather than distract.\n\nAudio, voiceover, and visual rhythm complement the intended mood.\n\nAccessibility and resolution standards are met.\n\nThis stage also assesses whether the video delivers its intended message with impact, ensuring readiness for internal or public release.'
        },
        {
          id: '8.5',
          title: '8.5 VI Review | Quality Checklist',
          content: 'Each review round uses a defined V.DS Quality Checklist covering the following dimensions:\n\n**Content Alignment:** Verifies message accuracy, tone, and audience relevance.\n\n**Visual Design:** Confirms brand adherence in layout, typography, and motion.\n\n**Narrative Flow:** Checks continuity and pacing between segments.\n\n**Technical Precision:** Ensures sound clarity, resolution, and synchronization.\n\n**Accessibility:** Confirms inclusion of captions, contrast compliance, and readability.\n\nThe checklist provides an objective measure of readiness before sign-off.'
        },
        {
          id: '8.6',
          title: '8.6 VI Review | Optimization & Iteration',
          content: 'Videos typically go through 1–2 optimization rounds, addressing reviewer feedback and refining both content and visuals. Each iteration focuses on specific improvements - such as tightening pacing, clarifying messaging, or enhancing visual storytelling - ensuring incremental quality gains. Feedback must be documented, and resolutions tracked to maintain transparency and accountability.'
        },
        {
          id: '8.7',
          title: '8.7 VI Review | Sign-off',
          content: 'Final sign-off follows a two-tiered approval structure:\n\n**Creative Sign-off:** Conducted by the assigned editor or visual lead to validate storytelling, technical quality, and brand compliance.\n\n**Executive Sign-off:** Approved by a senior content or creative director to ensure the video aligns with DQ\'s strategic and brand objectives.\n\nThis structured review and refinement cycle safeguards DQ\'s creative reputation, ensuring that every video released under the V.DS framework achieves excellence in clarity, emotion, and execution.'
        },
        {
          id: '9',
          title: '9. Stage 07 – VI Production | Publishing & Tagging',
          content: '**Overview**\n\nThis stage marks the transition from the creation phase to the distribution phase, ensuring every video produced under the V.DS framework is technically compliant, strategically positioned, and ready for dissemination across DQ\'s internal and external channels. Publishing and tagging are not administrative steps - they are strategic actions that determine discoverability, engagement, and lifecycle management of DQ\'s video assets.'
        },
        {
          id: '9.1',
          title: '9.1 VI Publication | Purpose',
          content: 'Publication transforms a completed video into an active communication asset. It ensures each video is deployed with intention - aligned with target audiences, channels, and campaign objectives. Publishing validates not only readiness but also visibility, ensuring each release strengthens DQ\'s digital presence, learning culture, and brand reputation.'
        },
        {
          id: '9.2',
          title: '9.2 VI Publication | Principles',
          content: 'The following principles guide publication and tagging across all DQ video outputs:\n\n**Strategic Deployment:** Every video must serve a defined objective - education, engagement, marketing, or brand storytelling.\n\n**Platform Precision:** Optimize each upload for the target channel (e.g., **LMS, YouTube, LinkedIn, Instagram**, or internal portals) to suit its audience and format.\n\n**Quality Integrity:** No video is published without passing all review and refinement stages under **V.DS QA**.\n\n**Metadata Consistency:** Every published video must include standardized titles, descriptions, keywords, and version control identifiers.\n\n**Performance Readiness:** Ensure all assets (captions, thumbnails, tags) are prepared to maximize discoverability and viewer retention.'
        },
        {
          id: '9.3',
          title: '9.3 VI Publication | Dissemination Canvas',
          content: 'The Dissemination Canvas provides a structured way to plan video releases across DQ\'s ecosystem. It includes fields for:\n\nAudience & Purpose\n\nPublication Channels\n\nTagging & Keywords\n\nCampaign or Initiative Alignment\n\nDistribution Date & Ownership\n\nPerformance Metrics (views, engagement, completion rate)\n\nThis canvas ensures all videos are released strategically, with traceability and accountability for outcomes. Templates and examples are available in Appendix X.'
        },
        {
          id: '9.4',
          title: '9.4 VI Publication | Channel Prerequisites',
          content: 'Each publication channel - whether internal (**LMS, Notion, Teams**) or external (**YouTube, LinkedIn, Instagram**) - has its own standards for file size, format, length, resolution, and metadata. The publication team must ensure:\n\n**Correct export formats** (MP4, 4K, HD, or adaptive versions).\n\n**Optimized video length per channel** (e.g., 60–90s for social, 5–10min for academy).\n\n**Platform-specific captioning, thumbnail sizing, and descriptions.**\n\n**Channel approval** (e.g., Academy Admin for LMS, Marketing Lead for social).\n\nThese prerequisites guarantee smooth upload, optimal playback, and compliance with brand and platform standards.'
        },
        {
          id: '9.5',
          title: '9.5 VI Publication | Publication Standard & Checklist',
          content: 'Before release, every video must pass the **V.DS Publication Checklist**, validating:\n\n**Final visual and audio QA confirmation.**\n\n**Correct application of DQ\'s title, version, and metadata standards.**\n\n**Approved captions and thumbnail design.**\n\n**Platform export optimization.**\n\n**Verified accessibility compliance.**\n\nThe checklist serves as a go/no-go gate ensuring that each video leaving production meets DQ\'s full creative and technical criteria.'
        },
        {
          id: '9.6',
          title: '9.6 VI Publication | Execution Process',
          content: 'The publication process includes:\n\n**Upload & Verification:** The video is uploaded to the assigned platform with metadata, tags, and thumbnails.\n\n**Internal Review:** The content owner and channel manager verify that all parameters are correctly set.\n\n**Activation:** The video goes live per scheduled date or campaign trigger.\n\n**Performance Monitoring:** Data on reach, engagement, and retention are logged and reviewed after release.\n\nThis structured approach ensures each publication is deliberate, traceable, and performance-oriented.'
        },
        {
          id: '9.7',
          title: '9.7 VI Publication | Sign-off & Handover',
          content: 'Final publication approval is granted after confirming completion of all preceding stages (**Scriptwriting** → **Storyboarding** → **Production** → **Review**). The **Publishing Lead** confirms readiness, followed by approval from the **Creative Director** or **Department Head**. Once published, ownership of analytics and performance tracking transfers to the **Marketing & Data team**, ensuring continued visibility and optimization.'
        }
      ]
    },
    tags: ['V.DS', 'Video', 'Framework'],
    imageUrl: '/images/vds.png'
  }
];