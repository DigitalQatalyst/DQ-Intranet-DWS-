// DEPLOYMENT: 2026-03-17 - Force Vercel deployment for feature branch
// FINAL VERSION: 2026-03-17 - Complete Design System Marketplace Implementation
// Updated: 2026-03-17 - Design System Marketplace with improved scroll functionality
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function CIDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id]');
      const scrollPosition = window.scrollY + 150; // Adjusted offset for better detection

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(element.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: `Defines how DQ produces high-quality content through structured processes, clear guidelines, and review standards.`
    },
    {
      id: 'content-mandate',
      title: '1.1 Content Mandate (DQ Units)',
      content: `Multiple units across DQ are tasked with producing content that delivers strategic impact—content designed to influence decisions, spark engagement, and drive targeted actions across diverse scenarios. Each unit contributes a distinct content type aligned to its function within the broader DQ transformation methodology.

These content-producing units include:

• DTMB (Digital Transformation Management Books) – Develops long-form publications and whitepapers that articulate strategic frameworks, transformation logic, and thought leadership.

• DTMI (Digital Transformation Management Insights) – Publishes analytical insights, trend overviews, and high-frequency thought leadership pieces aligned to market and sector dynamics.

• DTMA (Digital Transformation Management Academy) – Produces structured learning content, training modules, and course materials to support digital capability building.

• DQ Designs – Generates architecture diagrams, strategic blueprints, and design specifications for products, platforms, and organizational constructs.

• DQ Deploys – Delivers implementation-focused content such as guides, manuals, technical documents, and use-case playbooks.

• DQ Deals – Crafts strategic proposals, bid responses, capability decks, and customized engagement presentations.

• DQ Content – Leads on multimedia, editorial, and campaign-driven content across digital channels, including social posts, scripts, videos, and creative assets.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.2 Relevant Ecosystem',
      content: `The CI.DS guidelines apply universally across the DQ content ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every content output. This includes all formats, platforms, and touchpoints where DQ content is created or shared.

Specifically, CI.DS must be followed:

• Within internal DQ documentation and communications

• In DTMB Papers and formal publications

• In DTMA Course Materials and Learning Assets

• Across DTMI Insights and all social media channels

• Within BD proposals, sales decks, and outreach content

• In client-facing deliverables, reports, and strategic outputs`
    },
    {
      id: 'purpose',
      title: '1.3 CI.DS | Purpose',
      content: `The CI.DS is defined as a strategic, end-to-end system that ensures all content items are intentionally planned, professionally produced, and strategically promoted. It provides a unified framework that brings structure, precision, and purpose to the entire content lifecycle.

By applying CI.DS, DQ ensures that every output—whether a whitepaper, insight, visual asset, or course material—is clear in its message, consistent with the brand, and optimized for measurable performance. This leads to stronger engagement, greater trust from audiences, streamlined production processes, and higher content ROI across all platforms and channels.`
    },
    {
      id: 'key-stakeholders',
      title: '1.4 CI.DS | Key Stakeholders',
      content: `The success of the CI.DS relies on clear role definition and collaboration across a range of key stakeholders. Each participant in the content lifecycle plays a unique role in ensuring that content meets its intended purpose with clarity, quality, and strategic alignment.

• Writers are responsible for shaping narratives that align with DQ's tone, logic, and frameworks, grounding every piece in clarity and purpose.

• Editors refine the structure, tone, and coherence of written content, ensuring it meets CI.DS quality standards.

• Designers translate ideas into visuals, applying the brand's visual language and layout logic to enhance clarity, engagement, and comprehension.

• Reviewers—often subject matter experts—validate technical accuracy, conceptual integrity, and narrative strength.

• Marketers ensure content visibility and impact by planning distribution strategies, tagging for SEO, and coordinating promotional campaigns.

• Executive Approvers provide final validation, ensuring that each content item supports DQ's strategic vision, brand standards, and ecosystem positioning.

Together, these stakeholders uphold a shared commitment to quality and coherence, using CI.DS as the central system that guides planning, creation, validation, and publication.`
    },
    {
      id: 'stage-00-content-strategy',
      title: '2. Stage 00 – Content Item Strategy (CI.DS)',
      content: `Stage 00 defines the strategic lens through which all content items are shaped. It ensures that content is not created in isolation but instead anchored in DQ's narrative, frameworks, product positioning, and distribution strategy. This stage provides the foundational logic that ensures content serves a clear business and branding purpose across the organization.`
    },
    {
      id: 'dq-frameworks',
      title: '2.1 DQ Stories | Frameworks',
      content: `Every piece of content produced under CI.DS must be grounded in DQ's core narrative: the transformation journey toward Digital Cognitive Organizations (DCOs). This overarching story is more than a backdrop—it is the strategic compass that connects DQ's thought leadership, product philosophy, and transformation agenda.

By embedding the DCO story within content, creators ensure consistency of purpose, relevance to the target audience, and alignment with DQ's global positioning. This storytelling framework provides coherence across diverse content formats and strengthens the organization's intellectual footprint in the digital transformation space.`
    },
    {
      id: 'content-artefact-class',
      title: '2.2 DQ Stories | Content Artefact Class (CAC)',
      content: `DQ content is generally organized into five Content Artefact Classes (CAC), each representing a strategic category aligned with the intent, audience, and business value of the content produced. These classes provide a high-level framework to ensure that content outputs are not just diverse in format but coherent in purpose.

The five CACs include:

1. Thought Leadership Artefacts – Designed to shape industry perspectives and establish DQ's intellectual position. Examples include whitepapers, research briefs, anchor papers, and insight decks.

2. Product & Service Artefacts – Focused on describing, promoting, or enabling adoption of DQ's offerings. This includes solution overviews, proposal decks, use-case templates, and service blueprints.

3. Brand Identity & Culture Artefacts – These reinforce internal values and external image. Artefacts include culture books, onboarding kits, tone-of-voice guidelines, and brand design manuals.

4. Education & Enablement Artefacts – Created to build digital capabilities for clients, partners, or internal teams. Includes LMS modules, learning guides, how-to scripts, and certification assessments.

5. Community & Ecosystem Artefacts – Aimed at engaging the broader market and partner ecosystem. Includes event highlights, partnership announcements, social campaigns, and ecosystem visualizations.

These five CACs act as the backbone of the CI.DS structure and provide direction for the development, review, and strategic use of content across the organization.`
    },
    {
      id: 'content-artefact-type',
      title: '2.3 Content Items | Content Artefact Type (CAT)',
      content: `Each Content Artefact Class (CAC) comprises a diverse set of Content Artefact Types (CATs), each tailored to specific formats, audience needs, and strategic intents. These artefact types ensure content is delivered with structure, relevance, and consistency across the organization. Examples include:

• Whitepapers / Anchor Papers– In-depth strategic explorations grounded in research and frameworks

• Articles / Blogs – Shorter-form narrative thought pieces that are highly relatable and aligned to campaigns or trends.

• Storyboards – Visual story plans used in script development or motion content

• Scripts – Written dialogue or guidance for videos, LMS courses, or explainers

• Templates – Pre-designed formats for consistent content creation and reuse

• Case Studies – Real-world examples of impact showcasing transformation success

• Visual Reports – Graphically rich documents that synthesize insights and outcomes

• Learning Modules – Structured course units part of educational programs

• Social Media Posts – Bite-sized, high-impact content optimized for engagement

• Proposal Decks – Commercial documents presenting DQ's capabilities and solutions

Each artefact type has its own production methodology, review process, and outcome expectations, all governed under the CI.DS system to ensure cross-functional alignment and content excellence.`
    },
    {
      id: 'content-types-vs-channels',
      title: '2.4 Content Items | Content Types vs Channels',
      content: `This section details the primary platforms and media through which DQ content is distributed. Mapping content artefact types to their most appropriate channels ensures clarity in formatting, boosts audience relevance, and strengthens campaign impact.

Content Artefact Type | Primary Channels:

Whitepapers, Anchor Papers: DQ Website, DTMI Platform, Email Submissions

Strategic Blogs, Co-Branded Insights: DTMI Platform, LinkedIn

Proposal Decks, Commercial Offers: Email Submissions, Deliverables Portal (DTMP), Notion Internal Portals

Brand Tone Guides, Culture Decks: Notion, Internal Portals

Course Modules, How-to Guides: DTMA LMS, Partner Platforms, DQ Website

Event Highlights, Social Templates: LinkedIn, social media, DTMI Platform

Research Briefs, Frameworks: DTMI Platform, DQ Website

Ecosystem Maps, Partner Posts: LinkedIn, Email Submissions, DTMI Platform

Service Blueprints, Use-Case Templates: Deliverables Portal (DTMP), Notion, Email

This matrix ensures content creators select the most effective distribution path for each artefact type—supporting targeted engagement, search discoverability, and stakeholder alignment across all DQ initiatives.`
    },
    {
      id: 'content-development-lifecycle',
      title: '2.5 Content Items | Content Development Lifecycle (CDL)',
      content: `The Content Development Lifecycle (CDL) outlines the full journey of a content item—divided into two core stages: Production and Dissemination. This structured lifecycle embeds quality, alignment, and performance at each step of the process, ensuring every content asset is purposeful and impactful.

Production Stage focuses on transforming strategic ideas into high-quality, brand-aligned content:

1. Ideation & Validation – Define the strategic intent of the content, align it with relevant DQ frameworks, and validate with key stakeholders.

2. Briefing & Planning – Document objectives, contributors, and milestones in the CI Brief and CI Tracker.

3. Drafting & Editing – Create content using approved templates, applying tone, structure, and referencing standards.

4. Design & Formatting – Shape the content visually with compliant layouts, branded visuals, and multimedia.

5. Review & Approvals – Conduct structured reviews with SMEs and leaders to finalize content for publishing.

Dissemination Stage focuses on delivering the content with maximum reach, visibility, and feedback:

6. Publication & SEO Tagging – Distribute content to the right channels with proper metadata, SEO, and publishing standards.

7. Promotion & Feedback Loop – Activate content through campaigns, track performance metrics, and gather insights for future refinement.

This lifecycle ensures traceability, role clarity, and continuous improvement across all CI.DS-driven content activities.`
    },
    {
      id: 'content-roles-raci',
      title: '2.6 CI.CDL | Content Roles RACI',
      content: `Maps role responsibilities across the content lifecycle using the RACI model to ensure clarity, accountability, and efficient collaboration:

• Responsible: Writers and Designers are tasked with content creation, ensuring adherence to tone, structure, and visual standards.

• Accountable: Product Owners and Project Managers ensure final delivery quality, strategic fit, and that timelines are met.

• Consulted: Reviewers and Subject Matter Experts provide critical input, validation, and subject-specific refinement.

• Informed: Marketing and Executive Sponsors are kept updated on progress, publication timing, and campaign alignment.

This RACI framework supports a well-orchestrated content development process, reducing ambiguity and enabling cross-functional teamwork.`
    },
    {
      id: 'ai-working-tools',
      title: '2.7 CI.CDL | AI Working Tools',
      content: `A curated suite of AI-powered tools is embedded across each stage of the content lifecycle to enhance speed, consistency, and strategic quality in CI.DS operations:

• Content Drafting Support: Tools such as ChatGPT, Gamma AI, and Canva accelerate ideation and drafting—providing structure, voice alignment, and conceptual clarity from the outset.

• Design Assistance: Canva and Midjourney streamline the production of compelling visuals, infographics, and branded layouts, supporting rapid prototyping and iteration.

• Review Automation: Grammarly, SEO Surfer, and similar assistants reinforce tone, clarity, grammar, and keyword alignment—enhancing editorial accuracy while reducing manual overhead.

• Publishing & Tagging: Tools like Power Automate and Notion enable seamless automation of metadata tagging, SEO embedding, platform distribution, and version control.

Together, these tools form an intelligent augmentation layer across the content lifecycle—supporting CI.DS contributors in delivering professional, high-impact outputs faster and more reliably.`
    },
    {
      id: 'stage-01-ideation-validation',
      title: '3. Stage 01 – CI Production (Ideation & Validation)',
      content: `Stage 01 formalizes how content is framed, scoped, and prepared for production. It ensures that each content item begins with clear intent, strategic alignment, and defined impact. This stage lays the intellectual foundation for production, enabling teams to move forward with confidence, clarity, and creative focus.`
    },
    {
      id: 'ci-ideation-purpose',
      title: '3.1 CI Ideation | Purpose',
      content: `Ideation ensures that every content item is born from a clearly defined need, shaped by strategic priorities, and grounded in DQ's transformation narrative. It provides the space to clarify intent, align with audience needs, and determine the most impactful form of delivery—whether to inform, influence, inspire, or activate. Through effective ideation, content becomes more than just communication; it becomes a purposeful asset within the broader storytelling and transformation strategy.`
    },
    {
      id: 'ci-ideation-principles',
      title: '3.2 CI Ideation | Principles',
      content: `These principles help ensure each content item begins with focused intent, strategic clarity, and executional feasibility. The five consolidated principles guiding effective content ideation are:

1. Strategic Relevance – All content must align with DQ's vision, transformation agenda, and overarching frameworks (e.g., D6, DBP, DT2.0), ensuring each piece contributes to the broader narrative.

2. Audience Impact – Content should be developed with a deep understanding of the target audience—what they need, how they think, and how the content should influence or resonate with them.

3. Purpose-Driven Design – Every idea must begin with a clearly defined intent (to inform, influence, inspire, activate), anchoring the content direction and expected outcome.

4. Feasibility & Format Fit – Ideation must account for realistic delivery constraints and select the most suitable artefact type (whitepaper, blog, video, template, etc.) for the message.

5. Innovation & Collaboration – Ideation should welcome bold thinking and leverage input from cross-functional contributors, ensuring creativity is balanced with insight and executional rigor.

These five principles enable teams to generate content ideas that are thoughtful, actionable, and aligned to DQ's transformation objectives.`
    },
    {
      id: 'ideation-strategic-relevance',
      title: '3.3 Ideation Principle | Strategic Relevance',
      content: `Every content item must be rooted in DQ's overarching strategy—aligning with its vision, transformation priorities, and key frameworks such as D6, DBP, and DT2.0. Strategic relevance ensures that each piece not only reflects the organization's intellectual foundation but also reinforces its narrative coherence and transformation mission.

For example, a whitepaper on 'The Role of Digital Platforms in Economic Evolution' should not only cite the D6 Framework and DBP model but also echo DQ's broader stance on platform-driven transformation—ensuring the content contributes meaningfully to the evolving logic of the Digital Cognitive Organization.`
    },
    {
      id: 'ideation-audience-impact',
      title: '3.4 Ideation Principle | Audience Impact',
      content: `Content should be designed with empathy and precision, grounded in a clear understanding of the target audience's profile, challenges, motivations, and informational needs. Whether the audience is composed of executives, partners, practitioners, or learners, content must resonate with their worldview and deliver actionable value.

For example, content targeting digital transformation leaders should highlight strategic models and innovation pathways, while content for practitioners may focus on practical tools, frameworks, and how-to guidance. Matching tone, format, and message depth to the audience ensures higher engagement, stronger recall, and greater impact.`
    },
    {
      id: 'ideation-purpose-driven-design',
      title: '3.5 Ideation Principle | Purpose-Driven Design',
      content: `Every content idea must originate from a clearly articulated purpose—whether it aims to inform, inspire, influence, or activate. This defined intent serves as the anchor for all downstream decisions: from narrative structure and tone, to artefact selection and performance measures. Purpose-driven design ensures that each content piece remains focused, coherent, and outcome-oriented throughout the lifecycle.

For example, a content item meant to inspire digital adoption within public sector leadership would differ significantly in tone, storytelling, and evidence base from a guide designed to inform internal teams on CI.DS roles and workflows.`
    },
    {
      id: 'ideation-feasibility-format-fit',
      title: '3.6 Ideation Principle | Feasibility & Format Fit',
      content: `Ideation must actively consider production realities—time, resources, skills, and platform constraints—while selecting the format that best serves the message and audience. The chosen artefact type should match both content intent and consumption patterns, balancing creative ambition with practical execution.

For example, a short, animated explainer video may be far more suitable than a dense whitepaper when introducing a new DQ framework to time-poor executives.`
    },
    {
      id: 'ideation-innovation-collaboration',
      title: '3.7 Ideation Principle | Innovation & Collaboration',
      content: `Ideation must actively encourage bold, unconventional thinking and integrate cross-functional collaboration to unlock fresh perspectives and solutions. Innovation fuels originality—pushing boundaries in format, structure, and storytelling—while collaboration ensures those ideas are strategically sound and exceptionally feasible. Engaging product, strategy, design, and marketing teams in the ideation phase ensures ideas are both disruptive and doable.

For example, co-developing a new interactive framework explainer with contributions from the content, design, and product teams can result in content that is creatively compelling, strategically aligned, and production-ready.`
    },
    {
      id: 'story-validation-production-canvas',
      title: '3.8 Story Validation | Production Canvas',
      content: `This tool ensures that every content item is aligned with DQ's intellectual architecture and production standards. The canvas captures key validations including:

• Alignment with DQ frameworks (e.g., D6, DBP, DT2.0)

• Coherence with the overarching narrative structure and transformation storyline

• Clear artefact classification (e.g., whitepaper, blog, video, template)

• Production scope, ownership, and timeline mapping

By formalizing this validation step, the canvas helps content teams avoid misalignment, clarify expectations, and accelerate production readiness with confidence and shared understanding. The canvas template is illustrated in the Appendix.`
    },
    {
      id: 'story-validation-plotline-alignment',
      title: '3.9 Story Validation | Plotline Alignment',
      content: `Plotline alignment involves systematically reviewing the production canvas to ensure that the storyline, messaging, and flow are fully in sync with DQ's communication standards and transformation logic. This validation guarantees that the narrative sequence, tone, and structure not only reflect DQ's message architecture but also embody its cognitive design principles—making the content both strategically resonant and intellectually coherent.`
    },
    {
      id: 'stage-02-briefing-planning',
      title: '4. Stage 02 – CI Production (Briefing & Planning)',
      content: `This stage formalizes how content is scoped, structured, and organized before production begins. It bridges the gap between ideation and creation by providing a clear roadmap and operational clarity for all contributors. Effective briefing and planning ensure that everyone involved in a content item shares a unified understanding of the objectives, format, ownership, and timeline—ultimately accelerating production and elevating quality.`
    },
    {
      id: 'ci-briefing-purpose',
      title: '4.1 CI Briefing | Purpose',
      content: `The purpose of CI Briefing is to convert high-level content intent into an actionable plan. It ensures the production team has full clarity on what is being created, for whom, why it matters, and how it will be executed. Briefing aligns strategic goals with delivery constraints and design opportunities.`
    },
    {
      id: 'ci-briefing-principles',
      title: '4.2 CI Briefing | Principles',
      content: `Effective briefing is anchored in five core principles that ensure clarity, alignment, and executional success:

1. Clarity over Complexity – Break down complex concepts into clear, digestible, and actionable briefing components to accelerate understanding and action.

2. Unified Alignment – Ensure all contributors, from writers to designers, leave the briefing with a shared understanding of scope, tone, objectives, and timelines.

3. Artefact Clarity – Clearly define the content format (e.g., whitepaper, blog, video), outlining its scope, structure, and design considerations from the outset.

4. Collaborative Input – Integrate diverse perspectives across content, design, product, and strategy functions to ensure the briefing is comprehensive and well-rounded.

5. Outcome Anchoring – Explicitly state the purpose, target audience, and success criteria for the content, anchoring it to measurable user or business outcomes.`
    },
    {
      id: 'story-tracking-ci-objectives',
      title: '4.3 Story Tracking | CI Objectives',
      content: `This tracker defines the purpose and objectives of each content item in relation to broader DQ themes and priorities. It links content items to transformation narratives, communication goals, and intended outcomes. It also frames the performance expectation from both a storytelling and engagement perspective.`
    },
    {
      id: 'story-tracking-templates-reference',
      title: '4.4 Story Tracking | CI Templates & Reference',
      content: `This section introduces the standardized templates and reference documents that guide contributors across all stages of content planning and production. These assets are designed to reduce ambiguity, accelerate alignment, and maintain consistency in format, tone, and structure.

Key resources include:

• CI Briefing Template – Defines the content scope, objectives, format, contributors, and delivery milestones.

• Audience Mapping Canvas – Helps identify, segment, and prioritize target audiences for tailored messaging.

• Content Format Selector – A tool to match content goals with the most appropriate artefact type and format.

• Artefact Class Matrix – Clarifies the strategic role, structure, and use case of each content type within the DQ ecosystem.

Together, these tools serve as a foundational reference kit to ensure all contributors start from the same point of clarity, consistency, and strategic alignment.`
    },
    {
      id: 'story-tracking-ci-contributors',
      title: '4.5 Story Tracking | CI Contributors',
      content: `Defines the roles, responsibilities, and ownership structure for each content item. Identifies the lead contributor, editor, visual designer, and reviewers. Roles are typically mapped using a RACI model to ensure clarity and accountability.`
    },
    {
      id: 'content-planning-timeline-milestones',
      title: '4.6 Content Planning | Timeline & Milestones',
      content: `Defines a clear, milestone-driven schedule that guides each content item from early planning to final publication. This timeline establishes transparency, sets expectations, and allows contributors to coordinate efficiently. Key milestones include:

• Ideation Approval – Confirm the strategic relevance and feasibility of the content idea.

• Briefing Finalization – Complete and approve the CI brief with aligned scope, roles, and artefact type.

• Draft Submission – Deliver the first draft for internal review and editorial feedback.

• Design Completion – Finalize all visual assets, layout, and formatting aligned to brand guidelines.

• Final Review – Perform quality assurance across editorial, visual, and strategic dimensions.

• Publication Date – Confirm publishing across identified channels and activate dissemination workflows.

Structured timelines like these ensure accountability, avoid bottlenecks, and keep momentum consistent across the content lifecycle.`
    },
    {
      id: 'content-planning-tracker',
      title: '4.8 Content Planning | Tracker',
      content: `Presents the centralized Content Item Tracker as a live operational tool to monitor, manage, and optimize the progress of all content items across the production lifecycle. The tracker serves as a real-time dashboard and shared workspace for contributors, offering clear visibility into the current status and next steps of each item.

It captures key metadata including:

• Content ID and Title – Unique identifier and working title for reference.

• Artefact Type – Defined format of the content (e.g., whitepaper, blog, video).

• Contributor Names – Assigned roles such as lead writer, designer, editor.

• Current Status – Live progress status (e.g., drafting, editing, awaiting review).

• Upcoming Milestones – Immediate next steps and deadlines.

• Delivery Deadlines – Targeted publication and promotion dates.

The CI Tracker acts as the single source of truth for cross-functional collaboration, accountability, and performance monitoring—minimizing confusion, delays, and duplicate efforts.`
    },
    {
      id: 'content-planning-briefing-sessions',
      title: '4.9 Content Planning | Briefing Sessions',
      content: `Outlines how structured briefing sessions bring all relevant contributors together—either live or asynchronously—to co-align on the strategic and operational direction of the content item. These sessions are designed to confirm clarity on content goals, target audience, artefact type, messaging tone, production pathway, and required sign-offs.

To ensure proper follow-through and delivery, tasks must be formally assigned to each contributor during or immediately after the session. These tasks should be logged in the CI Tracker with clear deliverables, deadlines, and status markers. In addition, contributors should schedule timely review checkpoints—either self-led or peer-reviewed—to validate content quality and flag risks early. This combination of live briefing, task assignment, and scheduled review creates a closed-loop system that accelerates execution while upholding editorial and strategic standards.`
    },
    {
      id: 'stage-03-drafting-editing',
      title: '5. Stage 03 – CI Production (Drafting & Editing)',
      content: `This stage focuses on the editorial layer of content production, ensuring every piece meets DQ's standards for clarity, quality, tone, and consistency. It refines raw drafts into high-performing, user-ready artefacts that represent DQ's intellectual authority and brand voice.`
    },
    {
      id: 'ci-editing-purpose',
      title: '5.1 CI Editing | Purpose',
      content: `The purpose of CI editing is to elevate content from first draft to final product by applying rigorous quality control. It ensures that ideas are presented clearly, facts are verified, arguments are coherent, and tone matches audience expectations. Editing also validates adherence to DQ's narrative, voice, and technical standards.`
    },
    {
      id: 'ci-editing-principles',
      title: '5.2 CI Editing | Principles',
      content: `Editorial quality is governed by the following principles:

1. Clarity and Precision – Remove ambiguity and improve sentence construction for sharper understanding.

2. Narrative Consistency – Ensure messaging, tone, and structure stay consistent across sections and align with DQ's frameworks.

3. Audience Appropriateness – Adapt complexity, terminology, and voice to the intended reader.

4. Evidence-based Assertions – Verify data, back claims with sources, and cite appropriately.

5. Editorial Economy – Remove redundancy, keep only what adds value.`
    },
    {
      id: 'ci-editing-ai-reference',
      title: '5.3 CI Editing | AI Editing Reference',
      content: `This section outlines how AI-powered editing tools are used to assist writers and reviewers throughout the editorial process. These tools enhance productivity by providing grammar correction, readability scoring, tone refinement, structural suggestions, and fact-checking prompts—serving as real-time co-editors that accelerate early-stage improvements.

However, AI-generated outputs must undergo deep human review to ensure accuracy, narrative alignment, and emotional resonance. Editors are responsible for humanising AI suggestions, correcting nuance mismatches, and reinforcing the intended voice, tone, and context. This hybrid approach combines the efficiency of automation with the discernment of human judgment—ensuring content remains engaging, strategic, and aligned with DQ's standards of intellectual and editorial excellence.`
    },
    {
      id: 'ci-editing-voice-tone',
      title: '5.4 CI Editing | Voice & Tone',
      content: `DQ content must consistently express a voice that blends authority with approachability, strategy with practicality, and vision with grounded insight. This signature voice reinforces DQ's leadership in digital transformation while making its ideas accessible to diverse stakeholders.

Tone should always be adapted to suit the intended audience segment:

• For Executives: Use confident, concise language that conveys foresight, strategic insight, and measurable outcomes.

• For Practitioners: Adopt an instructional tone, enriched with step-by-step guidance, use cases, and tool-based examples.

• For Public Audiences: Communicate in an engaging and relatable manner, using simple language, metaphors, and benefit-driven framing.

While the voice remains unified, the tonal variation ensures that every audience feels directly addressed—supporting engagement, comprehension, and action. Editors should calibrate tone during drafting and editing using feedback loops and AI-driven tonal analysers' where relevant, ensuring alignment with DQ's evolving communication standards.`
    },
    {
      id: 'ci-drafting-structure',
      title: '5.5 CI Drafting | Structure',
      content: `Each CI type (whitepaper, blog, video script, etc.) should follow a standardized structural blueprint to ensure coherence, clarity, and consistent quality across the content library.

• Whitepaper: Executive Summary → Context & Challenge → Deep Analysis → Frameworks/Models → Case Examples → Conclusion & Implications

• Blog: Compelling Hook → Context/Framing → Core Insight or Opinion → Implications/Meaning → Forward-looking Close / Question / Provocation

• Script: Sequential Scenes → Visual Cues → Voiceover Narration → Emotional Tone → Transitions & Motion Cues

• Slide Deck: Title Slide → Overview/Agenda → Core Insights (visualized) → Recommendation → Q&A/Call-to-Action

• Newsletter: Intro Section → Highlighted Insight/Update → Resource or Feature Link → Closing Note → CTA Button

Adhering to these structure templates streamlines collaboration across teams, reduces revision cycles, and reinforces DQ's editorial brand. It also allows for scalable content operations without sacrificing depth or professionalism.`
    },
    {
      id: 'ci-drafting-academic-research',
      title: '5.6 CI Drafting | Academic Research & Referencing',
      content: `All content must uphold rigorous standards of factual accuracy, traceability, and intellectual credibility. Contributors must use authoritative, up-to-date sources and adhere to DQ's referencing conventions for consistency across formats.

Long-form content such as whitepapers and anchor papers must include academic-style referencing, including properly formatted footnotes or endnotes where needed. Shorter content should include source attribution and hyperlinks where appropriate. Verification of statistics, quotations, and frameworks is mandatory before editorial sign-off.

This approach reinforces the trustworthiness of DQ content and strengthens its position as a credible source of thought leadership in digital transformation. All content must meet high standards of factual accuracy and traceability. Use credible, current sources and cite them using APA 7 referencing style. Academic citations, footnotes, or endnotes should be applied for long-form pieces.`
    },
    {
      id: 'ci-drafting-accessibility-readability',
      title: '5.7 CI Drafting | Accessibility & Readability',
      content: `Content should be inclusive, accessible, and easy to understand for a wide range of readers without compromising on accuracy or depth. Readability is a fundamental quality standard that ensures DQ's thought leadership is approachable, inclusive, and usable.

To achieve this:

• Use plain English and simple sentence structures wherever possible

• Avoid jargon unless clearly explained within context

• Maintain legible font sizes, sufficient contrast, and appropriate spacing during design

• Apply inclusive language that avoids bias, stereotypes, or cultural insensitivity

All content should be written with a professional generalist in mind—someone intelligent but not necessarily an expert in the subject matter. This balance ensures maximum reach and impact while preserving intellectual integrity.`
    },
    {
      id: 'ci-editing-seo-keywording',
      title: '5.8 CI Editing | SEO & Keywording',
      content: `All digital content must be optimized for search visibility to ensure it reaches the right audience through organic search and platform discovery tools. SEO practices should be embedded early during drafting and reinforced during editing and publication.

To maximize discoverability:

• Embed keywords: Integrate primary and secondary keywords naturally into the body text, headers, and metadata.

• Use SEO-friendly headings: Create clear, structured headings that reflect user search intent.

• Apply structured metadata: Include meta descriptions, tags, and excerpts tailored to platform requirements.

• Ensure visual accessibility: Provide alt-text for all images, including infographics and diagrams, for both accessibility and image search optimization.

• Leverage content hierarchy: Use short paragraphs, bullet points, and subheadings to improve scanability.

Together, these practices improve both content visibility and user engagement across digital channels.`
    },
    {
      id: 'ci-editing-cross-linking-metadata',
      title: '5.9 CI Editing | Cross-linking & Metadata',
      content: `Strategic internal linking enhances navigation, contextual continuity, and depth across the DQ content ecosystem—allowing readers to discover related ideas, frameworks, and case studies seamlessly. Thoughtful link integration also improves time-on-page and learning engagement.

Metadata plays a foundational role in structuring, surfacing, and measuring content. When consistently applied, it allows for:

• Thematic and structural classification by content topic, artefact type, DQ framework, and intended audience

• Automated surfacing and recommendation of related content items across platforms (e.g., DTMP, DTMB, DTMA, DTMI)

• Intelligent filtering and search capability within libraries and knowledge bases

• Traceability and reporting across the content lifecycle for governance, performance, and reuse

Together, strategic linking and metadata tagging form the backbone of a connected content system—powering discoverability, personalization, and data-driven insight across the full CI.DS value chain.`
    },
    {
      id: 'ci-editing-checklist-signoff',
      title: '5.10 CI Editing | Checklist & Sign-off',
      content: `Before publication, every content item must pass through a rigorous editorial QA checklist to validate its readiness and strategic alignment. This process ensures the artefact is polished, purposeful, and publication-ready. The checklist includes:

• Tone, grammar, structure, and flow validation

• Compliance with assigned artefact structure and CI briefing parameters

• Alignment with DQ's voice, frameworks, and narrative intent

• Consistent application of metadata, SEO elements, and internal cross-links

In addition to these editorial criteria, contributors must confirm that accessibility and referencing standards have been met.

Upon successful completion, the content is reviewed and signed off by the assigned editor, with final approval granted by a senior content lead or executive reviewer. This structured QA step safeguards DQ's publishing standards and reinforces the delivery of consistent, trusted, and high-impact content across all channels.`
    },
    {
      id: 'stage-04-design-formatting',
      title: '6. Stage 04 – CI Production (Design & Formatting)',
      content: `This stage governs the visual and structural design of content artefacts, ensuring they meet DQ's visual identity, design integrity, and brand consistency. It focuses on transforming editorial content into well-formatted, visually coherent, and aesthetically engaging artefacts that reinforce the DQ brand while supporting readability, clarity, and user experience.`
    },
    {
      id: 'ci-design-purpose',
      title: '6.1 CI Design | Purpose',
      content: `The purpose of design in CI production is to elevate content beyond words—translating ideas into visual experiences that enhance comprehension, increase retention, and create emotional resonance. Effective design makes content more intuitive, professional, and impactful across different channels.`
    },
    {
      id: 'ci-design-principles',
      title: '6.2 CI Design | Principles',
      content: `DQ design principles are guided by a commitment to clarity, usability, and brand distinction:

• Purposeful Design: Every design element must support clarity of communication and content comprehension, never distract or overcomplicate.

• Structured Visual Hierarchy: Typography, layout, and color are used intentionally to guide focus and flow—making content intuitive and easy to navigate.

• Brand Integrity: All visual assets must reinforce DQ's distinct brand identity—through color, typography, iconography, and layout harmony.

• Inclusive Accessibility: Designs must accommodate various reading preferences, accessibility needs, and devices—ensuring equity and ease of use.

• Systemic Consistency: Visual rules must be applied uniformly across all artefact types and distribution platforms, ensuring recognizability and professionalism throughout the DQ content ecosystem.`
    },
    {
      id: 'ci-design-brand-identity',
      title: '6.3 CI Design | Brand Identity',
      content: `DQ's brand identity is anchored in a minimal, sophisticated, and professional design language that embodies clarity, trust, and strategic intent. The visual identity reinforces DQ's position as a forward-thinking thought leader while ensuring every artefact feels premium, purposeful, and user-friendly.

Core brand attributes include:

• Clean, spacious layouts that enhance focus and legibility

• Harmonious font pairings that balance elegance and readability

• Strategic use of color and iconography to guide attention and convey meaning

• Subtle animations in digital formats that enrich interaction without distraction

These principles are not merely aesthetic—they actively support comprehension, engagement, and brand recall, creating a unified and recognizable experience across all content artefacts.`
    },
    {
      id: 'ci-design-colors-palette',
      title: '6.4 CI Design | Colors Palette',
      content: `DQ's color palette consists of primary brand colors and supportive accents:

• Midnight Navy (#001035) – Authority, trust, intelligence

• Pure Black (#000000) – Text, contrast, clarity

• Silver Gray (#E0E0E0) – Neutral backgrounds, separation

• Pure White (#FFFFFF) – Clean space, minimalism

• Accent Colors (limited use) – For charts, highlights, UI elements

Use core colors dominantly, and accents sparingly to retain elegance and avoid visual clutter.`
    },
    {
      id: 'ci-formatting-typography-standards',
      title: '6.5 CI Formatting | Typography Standards',
      content: `Typography drives legibility, tone, and professionalism. Standards include:

• Heading Font: Raleway

• Body Font: Raleway

• Font Sizes: Consistent ratios for headings, subheadings, body text, and captions

• Alignment & Spacing: Left-align body copy, maintain consistent line spacing and paragraph breaks

Typography must balance formality with clarity—supporting a wide range of audiences and formats.`
    },
    {
      id: 'ci-formatting-iconography',
      title: '6.6 CI Formatting | Iconography',
      content: `Icons, diagrams, and illustrations must be clear, consistent, and aligned with content meaning. Standards include:

• Use of line-based, minimalist icons

• Unified stroke thickness and style

• Prefer metaphor-based visuals to generic stock graphics

• Icons must enhance—not substitute—content meaning

Illustrations should be licensed, brand-aligned, and not overly decorative.`
    },
    {
      id: 'ci-formatting-layout-spacing',
      title: '6.7 CI Formatting | Layout & Spacing',
      content: `Content layout governs how information flows and how users engage with it. Key layout guidelines include:

• Use of consistent column grids and page margins

• Group related elements with visual proximity

• Maintain consistent padding around images, blocks, and charts

• Respect whitespace as an essential design tool for clarity

Layouts must be responsive when content is used across print, web, and mobile formats.`
    },
    {
      id: 'ci-formatting-imagery',
      title: '6.8 CI Formatting | Imagery',
      content: `All imagery used in CI artefacts should:

• Reinforce message and emotional tone

• Be high-resolution and license-cleared

• Avoid clichés or culturally exclusive visuals

• Use overlays or duotone treatments where needed for consistency

Images are not decorative—they should support storytelling, humanise ideas, or visually dramatize a point.`
    },
    {
      id: 'ci-formatting-checklist-signoff',
      title: '6.9 CI Formatting | Checklist & Sign-off',
      content: `Before final delivery, each artefact must pass a visual QA process to validate:

• Brand compliance (colors, fonts, logos)

• Layout and spacing accuracy

• Visual alignment with the editorial tone

• Image quality and licensing

• Accessibility standards (contrast, alt-text)

Sign-off is conducted by the assigned designer and a visual lead. This ensures all content published is polished, professional, and brand-aligned.`
    },
    {
      id: 'stage-05-review-approval',
      title: '7. Stage 05 – CI Production (Review & Approval)',
      content: `This stage integrates all forms of content and visual review into a structured, multi-layered quality assurance process. Its aim is to validate the accuracy, clarity, alignment, and strategic value of every content item before publication. The review process ensures content reflects DQ's standards, resonates with its intended audience, and is both editorially and visually ready for dissemination.`
    },
    {
      id: 'ci-review-purpose',
      title: '7.1 CI Review | Purpose',
      content: `The purpose of content review is to uphold the integrity and performance of every content item. It ensures that the artefact aligns with DQ's voice, frameworks, and goals while meeting quality expectations across writing, structure, and presentation. The review process also strengthens internal collaboration by providing a shared checkpoint for input and improvement.`
    },
    {
      id: 'ci-review-principles',
      title: '7.2 CI Review | Principles',
      content: `Review principles ensure a consistent, objective, and high-quality evaluation process across all content artefacts. These principles help reviewers assess not only technical accuracy but also strategic and experiential coherence. All content must:

• Align with the intended audience's needs, context, and communication style

• Demonstrate logical structure, narrative flow, and engaging formatting

• Present verified, well-referenced facts, data, and arguments

• Maintain consistency in tone, voice, and message alignment with DQ's brand

• Exhibit professional visual standards—clean layout, accessibility, and design cohesion

These principles act as a benchmark for continuous improvement, helping identify content gaps, elevate clarity, and ensure readiness for sign-off and publication.`
    },
    {
      id: 'ci-review-quality-standard',
      title: '7.3 CI Review | Quality Standard',
      content: `The quality standard represents the minimum threshold a content artefact must meet to be considered ready for publication. It encompasses editorial depth, visual integrity, strategic alignment, and audience-focused clarity. These dimensions collectively ensure that DQ content is always trusted, respected, and effective in its communication.

Equally critical is the adherence to the CI Design System (CI.DS), which governs all visual and structural elements. Reviewers must not only validate the presence of key content and design elements but also verify that the artefact fully complies with the CI.DS principles—ensuring consistency across layout, typography, spacing, color usage, and brand expression. This is reinforced by use of dedicated review checklists (content, presentation, visual), which serve as objective tools to confirm that both form and function meet DQ's publishing standards.`
    },
    {
      id: 'ci-checklist-review-presentation',
      title: '7.4 CI Checklist | Review Checklist (Presentation)',
      content: `This checklist focuses on validating the artefact's visual presentation and formatting coherence. It ensures that all layout elements not only align with readability expectations but also uphold the standards set by the CI Design System (CI.DS).

Key areas of validation include:

• Logical formatting and intuitive section flow that supports narrative clarity

• Correct and consistent use of headers, bullets, numbering, and embedded visuals

• Adherence to brand-aligned layout principles and CI.DS formatting rules

• Visual balance, appropriate white space, and spacing between components

• Alignment of graphical elements (charts, callouts, infographics) with defined grid structures and margin standards

Reviewers must also confirm that this checklist has been completed thoroughly, with each item validated against the current CI.DS design templates and sample references. This reinforces cross-team consistency and visual quality across all CI types and formats.`
    },
    {
      id: 'ci-checklist-review-content',
      title: '7.5 CI Checklist | Review Checklist (Content)',
      content: `This checklist evaluates the intellectual and structural integrity of the content to ensure it communicates effectively, aligns with DQ's strategic voice, and adheres to the purpose and framing established during ideation and briefing.

Key areas of evaluation include:

• Clear and concise articulation of the core message, ideally positioned early in the artefact to guide the reader

• Logical structure with coherent sequencing, section alignment, and smooth narrative transitions

• Persuasive argumentation supported by verified data, citations, examples, and relevant thought leadership frameworks (e.g., D6, DBP, DT2.0)

• Evident alignment with the original CI brief in terms of intended audience, tone, and expected outcomes

• Internal consistency across terminology, storytelling arc, and visual references

Reviewers must assess whether the artefact's intellectual scaffolding is sound, and whether it delivers a compelling, informed, and strategically framed message. Any deviations from the CI brief or logic gaps should be flagged for clarification or revision during the optimisation rounds.`
    },
    {
      id: 'ci-checklist-review-visual',
      title: '7.6 CI Checklist | Review Checklist (Visual)',
      content: `This checklist confirms that the visual layer of the content adheres to DQ's brand and design system standards. It ensures not only visual consistency but also strategic alignment with the purpose and tone of the content artefact.

Key validation areas include:

• Consistent use of approved brand colors, font families, and design assets as defined in the CI Design System (CI.DS)

• Inclusion of high-resolution, licensed imagery that reinforces the content's message and emotional tone

• Visual coherence between the layout and editorial voice—ensuring harmony between form and function

• Implementation of accessibility best practices, including proper contrast ratios, alt-text for images, and scalable font sizing

• Alignment with spacing, margin, and alignment guidelines for various device types and viewing contexts

Reviewers must explicitly verify that these standards have been applied using the most recent CI.DS templates and reference guides. Any deviations must be documented and corrected before content proceeds to the final sign-off stage. This step protects visual integrity, ensures inclusive usability, and reinforces DQ's identity across all platforms.`
    },
    {
      id: 'ci-review-optimisation-rounds',
      title: '7.7 CI Review | Optimisation Rounds',
      content: `Most content goes through 1–2 structured rounds of review and optimisation, designed to progressively elevate its quality and alignment with CI.DS standards. Each round should:

• Focus on specific improvement dimensions (e.g., tone, flow, factual accuracy, layout precision)

• Be accompanied by reviewer notes that clearly explain the rationale behind each comment or suggestion

• Require documented feedback resolution—including acceptance, revision, or rebuttal—with transparent justification

This iterative cycle is critical to surfacing blind spots, validating stakeholder input, and reinforcing DQ's quality assurance ethos. It also allows for timely escalations or specialist reviews where necessary, particularly for high-impact artefacts. The process ensures every content item undergoes measured refinement before reaching final approval. The appointed content reviewer is responsible to organise a review panel to decide on the review observations, resolutions and closure.`
    },
    {
      id: 'ci-review-signoff',
      title: '7.8 CI Review | Review Sign-off',
      content: `Final sign-off is a two-tiered approval designed to safeguard the quality, intent, and impact of every content artefact:

1. Editorial Sign-off – Performed by the assigned editor, this step confirms that the content meets all internal standards for narrative clarity, structural coherence, sourcing accuracy, and compliance with the CI brief.

2. Executive or Lead Reviewer Sign-off – Conducted by a senior content lead or domain expert, this final approval ensures the artefact aligns with DQ's strategic priorities, brand expression, and readiness for external dissemination.

This layered sign-off process provides a final quality control checkpoint, reinforcing editorial integrity and guaranteeing that no content reaches publication without meeting DQ's highest standards of excellence and intent.`
    },
    {
      id: 'stage-06-publication',
      title: '8. Stage 06 – CI Dissemination (Publication)',
      content: `This stage marks the final transition from content production to live content, ensuring that all aspects of the content (from ideation through to execution) meet the strategic, technical, and brand requirements before it is published. Publication is framed not just as the final step, but as a strategic moment that ensures content reaches its audience with maximum impact and alignment with DQ's objectives.`
    },
    {
      id: 'ci-publication-purpose',
      title: '8.1 CI Publication | Purpose',
      content: `The purpose of the CI Publication phase is to ensure that content is strategically aligned with DQ's goals before it goes live. Publication should be treated as a strategic step—it's not simply the final task, but an essential action that supports content visibility, engagement, and its ability to generate meaningful results. In this phase, content is tested, aligned with DQ's narrative, and fine-tuned to ensure that it speaks to the intended audience with clarity, authority, and purpose.

Key Goals:

• Align content with strategic objectives (e.g., thought leadership, brand visibility, product promotion).

• Ensure content accuracy and compliance with DQ's brand standards and guidelines.

• Prepare content for maximum impact across relevant channels.

• Maintain traceability for performance tracking and future optimization.`
    },
    {
      id: 'ci-publication-principle',
      title: '8.2 CI Publication | Principle',
      content: `Principle: Publication as a strategic action, not merely a final procedural task. The publication phase is pivotal because it translates internal content development into external impact. It requires ensuring that content is optimized, distributed, and tracked effectively to ensure it serves its intended business purpose.

Principles of Strategic Publication:

• Strategic Intent: Publication should never be an afterthought. Every piece of content must be evaluated in light of its purpose—whether to engage, inform, or inspire action.

• Platform-Specific Optimization: Content should be optimized according to the platform it will be published on (e.g., web, social media, email). Each platform has its own requirements in terms of formatting, SEO, and audience expectations.

• Brand Alignment: All published content must stay true to DQ's voice, tone, and visual identity.

• SEO and Accessibility: Content must be SEO-optimized for visibility and accessible to all potential users, including those with disabilities.`
    },

    {
      id: 'ci-publication-dissemination-canvas',
      title: '8.3 CI Publication | Dissemination Canvas (Publication)',
      content: `The Dissemination Canvas is a structured tool that outlines how each piece of content will be distributed and promoted. It acts as a strategic roadmap, ensuring that every step is aligned with the overall purpose of the content. The canvas helps define where content will be published, how it will be positioned, and the expected outcomes from its publication.

Key Elements of the Dissemination Canvas:

• Content Format: What type of content is being published (e.g., blog post, whitepaper, case study)?

• Target Audience: Who is the intended audience, and how should the content be positioned to engage them?

• Publishing Channels: Where will the content be distributed (e.g., website, social media, email, external publications)?

• Promotion Strategy: How will the content be amplified? Will it be promoted via social media, partnerships, email campaigns, etc.?

• Performance Metrics: How will success be measured? Define metrics like views, shares, comments, and conversions.

The Dissemination Canvas ensures a clear, strategic approach to how content is launched across various channels and helps avoid haphazard publishing.`
    },
    {
      id: 'ci-publication-channels-prerequisite',
      title: '8.4 CI.DS | Publication Channels Prerequisite',
      content: `Before content is published, it is essential to ensure that it meets all technical and content standards specific to each platform or channel. These standards guarantee that the content is compliant, consistent, and optimized for its intended audience.

Technical and Content Standards per Platform:

Website:
• Adhere to SEO guidelines (e.g., keyword density, meta descriptions, alt text for images).
• Ensure content is mobile-responsive.
• Format content for ease of navigation (clear headings, internal links, etc.).

Social Media:
• Tailor content for each platform (e.g., Twitter: short, punchy, with hashtags; LinkedIn: more formal, professional tone).
• Optimize content for visual appeal (high-quality images/videos, proper text formatting).
• Ensure the call to action is clear and actionable.

Email:
• Optimize for open rates (engaging subject lines, personalization).
• Include a clear call to action that aligns with the email's objective.
• Ensure accessible design (e.g., readable fonts, contrast, alt text for images).

External Platforms:
• Ensure brand compliance with external publication requirements (e.g., partner websites, co-branded content).
• Trackable links for performance analysis.
• Follow any specific technical requirements set by the platform (e.g., file types, resolution for images).`
    },
    {
      id: 'ci-publication-standard-checklist',
      title: '8.5 CI.DS | Publication Standard & Checklist',
      content: `A Publication Standard & Checklist ensures that content is fully prepared for its live release, adhering to DQ's standards for quality, design, and compliance.

Key Elements of the Publication Checklist:

• Content Alignment: Is the content aligned with the overall strategic objective and target audience?

• Brand Compliance: Does the content adhere to DQ's branding guidelines (e.g., tone, visual identity)?

• SEO Optimization: Has the content been SEO-optimized (e.g., keywords, metadata, alt-text)?

• Formatting: Does the content comply with platform-specific formatting guidelines?

• Compliance: Is the content compliant with legal, ethical, and accessibility standards?

• Internal Approval: Has the content been reviewed and approved by the appropriate stakeholders?

This checklist serves as a final gatekeeper to ensure the content is publication-ready and consistent with DQ's high standards.`
    },
    {
      id: 'ci-publication-execution',
      title: '8.6 CI.DS | Publication Execution',
      content: `Publication Execution outlines the specific steps involved in publishing content across chosen channels, ensuring that all technical, content, and promotional processes are effectively coordinated.

Key Steps in the Publication Execution:

Pre-launch Checks:
• Verify that all technical and content prerequisites are met.
• Final approval from stakeholders (e.g., content team, marketing team, executive sign-off).

Scheduling:
• Determine the best time and frequency for content release (e.g., timing for social media posts, publication date for whitepapers).
• Ensure content is scheduled for optimal visibility (e.g., through social media management tools, CMS, etc.).

Publishing:
• Publish content according to the established distribution plan.
• Double-check that all content is correctly formatted and that links and multimedia are functional.

Promotion:
• Activate promotion strategies (e.g., social media posts, email marketing campaigns).
• Ensure cross-promotion on relevant channels.`
    },
    {
      id: 'ci-publication-signoff',
      title: '8.7 CI.DS | Publication Sign-off',
      content: `Final Approval and Release: The final publication sign-off is a critical step to confirm that everything is in place before content goes live. It involves a final check for compliance, alignment, and quality assurance.

Sign-off Process:

• Content Final Review: Ensure all aspects of the content—strategy, design, tone, formatting, and compliance—are correct.

• Stakeholder Confirmation: Secure final approval from the designated sign-off authority (e.g., content manager, executive leadership).

• Publication Ready: Once signed off, the content is released for publication.`
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Account for sticky header and padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(to right, #192D6C, #051139)' }}>
        {/* soft bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero content — card box on gradient */}
          <div className="pt-8 pb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 px-10 py-14 w-full min-h-[256px] flex flex-col justify-center">
              {/* Framework Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded text-sm font-medium mb-6 w-fit">
                DQ STORIES CI.DS
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                CI.DS (Content Item Design System)
              </h1>

              <p className="text-base text-white/80 max-w-xl leading-relaxed">
                DQ's strategic, end-to-end system that ensures all content items are intentionally planned, professionally produced, and strategically promoted across all platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Table of Contents - Left Side */}
            <div className="w-80">
              <div className="bg-white rounded-lg shadow-sm border sticky top-8" style={{ maxHeight: '80vh' }}>
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-gray-900">Contents</h3>
                </div>
                <nav className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>

            {/* Content - Right Side */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="space-y-12">
                  {sections.map((section) => (
                    <div key={section.id} id={section.id} className="scroll-mt-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {section.title}
                      </h2>
                      <div className="prose prose-gray max-w-none">
                        {section.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer isLoggedIn={false} />
    </div>
  );
}