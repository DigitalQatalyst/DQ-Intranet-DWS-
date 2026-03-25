import { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

const SectionParagraph = ({ paragraph }: { paragraph: string }) => {
  if (paragraph.startsWith('•')) {
    return (
      <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed ml-4">
        {paragraph.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
          <li key={lineIndex} className="text-gray-700">
            {line.replace(/^•\s*/, '')}
          </li>
        ))}
      </ul>
    );
  }
  
  if (paragraph.includes('|') && paragraph.includes('Platform')) {
    return (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              {paragraph.split('\n')[0].split('|').map((header, headerIndex) => (
                <th key={headerIndex} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
                  {header.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paragraph.split('\n').slice(1).filter(row => row.includes('|')).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.split('|').map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 px-4 py-2 text-gray-700">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  if (paragraph.includes('Class 01:') || paragraph.includes('Class 02:') || paragraph.includes('Class 03:') || paragraph.includes('Class 04:')) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="space-y-2">
          {paragraph.split('\n').map((line, lineIndex) => (
            <div key={lineIndex}>
              {line.startsWith('Class') ? (
                <h4 className="font-semibold text-gray-900 mb-2">{line}</h4>
              ) : line.startsWith('- Product') ? (
                <div className="ml-4 text-gray-700">• {line.substring(2)}</div>
              ) : line.trim() ? (
                <p className="text-gray-700 leading-relaxed">{line}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <p className="text-gray-700 leading-relaxed">
      {paragraph}
    </p>
  );
};

export default function CDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="introduction"], [id^="marcom-mandate"], [id^="marcom-ecosystem"], [id^="purpose"], [id^="key-stakeholders"], [id^="campaigns-strategy"], [id^="content-pillars"], [id^="dq-story-framework"], [id^="dq-offerings"], [id^="roles-responsibilities"], [id^="target-audience"], [id^="channel-strategy"], [id^="channels-vs-content-pillars"], [id^="campaign-lifecycle"], [id^="campaigns-planning"]');
      const scrollPosition = window.scrollY + 200;

      let currentSection = '';
      sections.forEach((section) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentSection = element.id;
        }
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const sections = [
    {
      id: 'introduction',
      title: '1. INTRODUCTION',
      content: `Marketing at DigitalQatalyst is not just about brand presence—it is a structured practice of shaping the organization's narrative, educating the digital economy, and orchestrating movements across channels and stakeholders. The Marketing Campaigns Design System (CDS) offers a unified operating framework for how campaigns are conceived, planned, designed, deployed, and reviewed—anchored by DQ's 5 strategic Content Pillars.`
    },
    {
      id: 'marcom-mandate',
      title: '1.1. DQ MarCom | Mandate',
      content: `The Marketing & Communication (MarCom) Unit in DQ works along with the BD Unit to orchestrate Leads, Opportunities and Deals for the organisation offerings. The joint mandate of Marketing and BD is "To Accelerate Efficient DCO & DBP Deals Pipeline (Traffic | Contacts | Leads | Opportunities) in DQ".

• Across the Organisation, Units success in DQ is measured in terms of contribution to (1) DQ Insight, (2) DQ Agility, (3) DQ Growth.
• Marketing Campaigns are the primary activities undertaken in the Marketing Unit to (1) build the DQ Brand and, (2) Generate followership & Leads.`
    },
    {
      id: 'marcom-ecosystem',
      title: '1.2. DQ MarCom | Ecosystem',
      content: `The DQ MarCom Unit delivers targeted promotional and lead generation campaigns in collaboration with key Units across the organization. Operating as a centralized support function, it ensures that each campaign aligns with both the strategic goals of the Unit it supports and the broader DQ brand and business objectives.

• DQ Organisation: Branding Positioning
• DQ Delivery Units: Leads Generation (DQ Designs and Deploys)
• DQ Products Units: Leads Generation (DQ DT2.0 and DCO offerings)`
    },
    {
      id: 'purpose',
      title: '1.3. DQ CDS | Purpose',
      content: `At its core, the Campaigns Design System (CDS) is a mechanism for ensuring consistency, quality, and strategic clarity across all outputs. It transforms campaign activity into a disciplined process of storytelling, brand expression, and stakeholder engagement—while embedding visual and narrative standards that unify the brand experience. This ensures that every campaign is not only impactful, but also aligned, repeatable, and reflective of DQ's digital leadership.

• Provide a standardized, high-impact system for managing all marketing campaigns
• Empower teams to build campaigns that align with DQ's vision, values, and voice
• Accelerate production, improve consistency, and enhance campaign effectiveness`
    },
    {
      id: 'key-stakeholders',
      title: '1.4. DQ CDS | Key Stakeholders',
      content: `The CDS not only standardizes campaign execution but also enables true collaboration across diverse stakeholders. By providing a shared system, language, and set of quality benchmarks, it empowers cross-functional teams to co-create campaigns that are not only high-quality but deeply aligned with DQ's brand identity and transformation mission. Campaign success is thus not a solo act, but a coordinated effort—made possible by the CDS.

• Marketing Leadership – Strategic alignment and oversight
• Campaign Beneficiaries – All stakeholders across the organisation
• Campaign Specialists – Campaign planning, scripting, and content design
• Designers & Creators – Visual identity, videos, carousels
• DevOps / WebOps – Programming, deployment, asset integration
• Campaign Data Analysts – Measurement, reporting, optimization
• Delivery / Products Teams – Cross-functional campaign initiators`
    }
,
    {
      id: 'campaigns-strategy',
      title: '2. STAGE 00 – CAMPAIGNS STRATEGY (90%)',
      content: `This section defines the strategic foundation of DQ campaigns: the Content Pillars, target channels, overall lifecycle, and roles.

It establishes the strategic layer of the CDS by clarifying how DQ's core messages, brand presence, and offerings are structured and delivered across multiple campaigns. A unified strategy ensures that all campaigns, regardless of target audience or format, are consistent with DQ's positioning as a leading digital transformation partner. This consistency is achieved through the integration of five clearly defined content pillars, a well-mapped channel distribution logic, a repeatable campaign lifecycle, and the active participation of cross-functional roles. Together, these strategic components enable DQ to operate with clarity, scale campaigns efficiently, and achieve maximum brand and business impact.`
    },
    {
      id: 'content-pillars',
      title: '2.1 DQ CDS | 5 Content Pillars',
      content: `The foundation of every DQ marketing campaign is built upon five core content pillars. These pillars are not merely organizational categories—they are strategic expressions of DQ's value proposition and positioning in the digital transformation space. Each pillar traces directly to a core aspect of what DQ offers the world: visionary thought leadership, transformative products, a compelling cultural identity, practical digital enablement, and a vibrant community ecosystem. The top 5 content pillars for DQ are here introduced.

1. Thought Leadership & Insight: Advance DQ as the brain trust for digital transformation.
2. Product & Service Value – Showcase the functionality and outcomes of DQ products.
3. Brand Identity & Culture – Humanize the brand through emotion and values.
4. Education & Enablement – Teach and enable audiences to take action.
5. Community & Ecosystem – Highlight DQ's role as a movement, not just a company.

The foundation of every DQ marketing campaign is built upon five core content pillars. These pillars are not simply categories—they are strategic lenses that ensure every message, asset, and activation aligns with DQ's broader mission and ecosystem. By organizing all campaign activity through these pillars, DQ guarantees both consistency in messaging and flexibility in creative execution, allowing the brand to speak with one voice across diverse audiences, formats, and platforms. Structuring campaigns around the Content Pillars ensures consistent brand messaging and amplifies impact—both in terms of brand perception and lead generation. This strategic alignment enables every campaign to reinforce DQ's positioning while delivering measurable business outcomes.`
    },
    {
      id: 'dq-story-framework',
      title: '2.2 DQ CDS | The DQ Story Framework',
      content: `The DQ Value Proposition and Operating Model is encapsulated in a comprehensive framework titled the DQ GHC (Golden HoneyComb of Competencies). The 7th element of the GHC further expands into a research-driven structure called the 6xD (6 Primary Dimensions for Digital Success), which defines the worldview, strategic pillars, and product architecture of DQ.

Together, these two frameworks act as the narrative engine behind all campaign storytelling. They provide the vocabulary, themes, and structural alignment that enable DQ to communicate its unique value to the world. Every marketing campaign is, in essence, a translation of these frameworks into targeted, emotionally resonant content aligned with one or more of the five core content pillars. This strategic anchoring ensures that each campaign not only promotes a service or insight, but reinforces the broader identity and positioning of DQ in the global digital economy.

DQ GHC (Golden HoneyComb of Competencies) DQ Vision, Identity and Work Patterns
DQ 6xD (6 Primary Dimensions for Digital Success) DQ Worldview, Insight and Product Offerings`
    }
,
    {
      id: 'dq-offerings',
      title: '2.3 DQ CDS | The DQ Offerings',
      content: `The DQ Marketing campaigns are intended to develop the DQ Brand, whilst generating leads for the DQ Products & Offerings. The DQ Products are organised in the 6xD Framework withing the 6th Dimension. The DQ Products are categorised in 4 Product Classes:

Class 01: DBP Reference Products
A set of products and product element establishing a reference view of Digital Business Platforms (DBPs) pertinent charateristics; along with a set of conceptuals tools and asset to realise a DBP. The Class 01 product are the foundation for the design and development of all other DQ products.
- Product 11: DTMF (Digital Transformation Management Framework)
- Product 12: Digital Canvas (Digital Cognitive Organisation Canvas)

Class 02: DT2.0 (Digital Transformation 2.0) Products
A set of products intended to accelerate the realisation of DBPs, leveraging Data-driven and Architectural-led best practices techniques. All the DT2.0 products and features emerge from the Class 01 products
- Product 21: DTMP (Digital Transformation Management Platform)
- Product 22: DTO4T (Digital Twin of Organisation for Transformation)
- Product 23: DTMaaS (Digital Transformation Management as a Service)

Class 03: DCO (Digital Cognitive Organisation) Products
A set of insight and educational products intended to guide the realisation of DCOs (Digital Cognitive Organisations), essentially reformulating Organisations into Digital Cognitive Constructs. All the DCO products and features emerge from the Class 01 products
- Product 31: DTMI (Digital Transformation Management Insight)
- Product 32: DTMA (Digital Transformation Management Academy)
- Product 33: DTMB (Digital Transformation Management Books)

Class 04: Niche Products
A set of periphery products building on DCOs (Digital Cognitive Organisations), and DBP (Digital Business Platforms) specialised requirements. Niche products emerge from specific digital opportunities or specialised industry sectors adaptations
- Product 41: D2GPRC (Data-Driven Govern Perform Risk Comply) – RegTech | SupTech)
- Product 42: Others (i.e. LoanMS | PlanBPM…)`
    }
,
    {
      id: 'roles-responsibilities',
      title: '2.3 DQ CDS | Roles & Responsibilities',
      content: `Effective execution relies on clearly defined roles and seamless team collaboration. In the CDS model, roles are not isolated silos but interdependent contributors in a unified campaign workflow. When responsibilities are clearly delineated and synchronized, campaigns benefit from accelerated delivery, improved message quality, and sharper alignment with strategic objectives. This structure also promotes accountability, fosters creative synergy, and enables continuous learning within and across campaign teams:

• Campaign Owner – Strategic direction & alignment
• Creative Lead – Messaging, visuals, pillar fit
• Creative Editor – Canva, video, animation
• Creative Writer – Scripts, captions, CTA writing
• DXP Feature Dev (Platform) – Distribution, platform compliance
• DXP Feature Dev (Data) – Metrics tracking, insights, reporting`
    },
    {
      id: 'target-audience',
      title: '2.3 DQ CDS | Target Audience',
      content: `TBC
- Digital Organisation Executive
- Digital Leaders (CTO | CDO |
- Digital Architect
- Digital Worker`
    }
,
    {
      id: 'channel-strategy',
      title: '2.4 DQ MarCom | Channel Strategy',
      content: `Each content pillar has a native channel fit, ensuring that campaigns are distributed through the platforms most aligned with their purpose, audience, and format. The effectiveness of DQ's marketing efforts depends not only on message clarity but also on platform precision. By aligning each campaign with the most relevant social and digital channels, DQ increases its ability to deliver the right message, in the right format, to the right audience—maximizing reach, resonance, and conversion.

Below is a table of the Top 10 Social Channels leveraged by DQ for campaign distribution, mapped to their typical use and strategic purpose:

Platform | Target Audience | Content Type(s) | Priority Tier
Website | All audiences | Core content hub, product & service pages, whitepaper archive, DTMA, DTMI access | 🟩 Tier 1
LinkedIn | B2B execs, decision-makers | POVs, frameworks, success stories, team features | 🟩 Tier 1
YouTube | Professionals, learners, clients | Explainer videos, walkthroughs, DTMA sessions, client showcases | 🟩 Tier 1
Instagram | Creative talent, young professionals | Brand storytelling, behind-the-scenes, reels, carousels | 🟩 Tier 1
Email | Existing community, prospects | Newsletters, new whitepapers, product releases, course drops | 🟩 Tier 1
WhatsApp / Telegram | Core community, clients, partners | Micro-updates, alerts, whitepaper drops, direct engagement | 🟨 Tier 2
X (Twitter) | Industry thinkers, fast movers | Real-time updates, insight threads, reactions to trends | 🟨 Tier 2
Medium / Substack | Insight-focused readers | DTMI essays, whitepaper previews, research reflections | 🟨 Tier 2
Facebook | General public, Africa/MENA region | Campaign promotions, community engagement, events | 🟨 Tier 2
TikTok | Gen Z, creative audience | Short-form explainers, cultural moments, behind-the-scenes fun | 🟨 Tier 2
Pinterest | Visual designers, researchers | Infographics, templates, visual storyboards | 🟥 Tier 3
SlideShare | Corporate audience, researchers | DQ Playbooks, capability decks, strategic models | 🟥 Tier 3
Threads | Instagram-linked users | Micro-content, soft announcements, teaser threads | 🟥 Tier 3`
    }
,
    {
      id: 'channels-vs-content-pillars',
      title: '2.5 DQ MarCom | Channels vs Content Pillars',
      content: `While each campaign pillar serves a unique strategic purpose, their impact is amplified when mapped to the channels best suited to their strengths. This alignment ensures that content resonates in both form and function—delivered through the platform where it naturally thrives. The table below maps the 5 Content Pillars to DQ's top digital channels, offering a strategic guide for distribution decisions.

# | Content Pillar | Primary Channels | Supporting Channels
1 | Thought Leadership & Insight | LinkedIn, Medium/Substack, YouTube, Website | X (Twitter), Threads, SlideShare, Email, WhatsApp/Telegram
2 | Product & Service Value | Website, YouTube, LinkedIn, Email | Instagram (Reels), WhatsApp/Telegram, Facebook, X (Twitter), SlideShare
3 | Brand Identity & Culture | Instagram, YouTube, TikTok, Website | Threads, Facebook, Pinterest, WhatsApp/Telegram
4 | Education & Enablement | YouTube, Instagram (Carousels/Reels), Website, Email | Pinterest, Medium/Substack, LinkedIn, WhatsApp/Telegram
5 | Community, Events & Ecosystem | Instagram, LinkedIn, WhatsApp/Telegram, Email, Website | Facebook, X (Twitter), Threads

Each of the channels offers a number of specific features making it most relevant for a type of content as promoted in specific content pillars. The mapping of channels to pillars is here illustrated:

Channel | Best for Pillars
LinkedIn | 1, 2, 5 – Thought leadership, product, community
YouTube | 1, 2, 3, 4 – All video storytelling & education
Instagram | 3, 4, 5 – Visual identity, engagement, culture
Website | 1, 2, 4, 5 – Hub for conversion & discovery
Email | 2, 4, 5 – Targeted nurture & CTA delivery
WhatsApp/Telegram | 2, 5 – Alerts, client/community activations
Medium/Substack | 1, 4 – In-depth articles and POVs
X (Twitter) | 1, 2, 5 – Fast insights, reactions, awareness
Facebook | 3, 5 – Broad outreach, regional audience
Pinterest | 3, 4 – Visual models and templates
SlideShare | 1, 2 – Decks and visual frameworks
TikTok | 3 – Brand culture and talent magnet
Threads | 1, 3, 5 – Micro storytelling & community tone

The style of posts emerging from the content pillars points to specialized social channel for best engagement, as illustrated in the table below.

Pillar | Sample Post | Channel(s)
Thought Leadership | "Why DT2.0 Replaces Siloed Projects" | LinkedIn + Medium + Website
Product Value | TMaaS Demo Video | YouTube + Email + LinkedIn
Brand Identity | "Day in DQ: Culture Reel" | Instagram + TikTok + Threads
Education | "What is a Work Unit?" carousel | Instagram + Website + Email
Community / Ecosystem | "Join the DTMA Launch Event" post | LinkedIn + WhatsApp + Email`
    }
,
    {
      id: 'campaign-lifecycle',
      title: '2.6 DQ MarCom | Campaign Lifecycle',
      content: `This lifecycle serves as the operational engine of the Campaigns Design System (CDS). It provides a reliable framework that helps teams move from strategic intent to execution with consistency, speed, and clarity. Each stage reinforces the previous one—ensuring campaigns are well-aligned with content pillars, properly resourced, and primed for measurable impact. This repeatable structure also enables iterative learning and continuous improvement across campaigns of all types and sizes. All campaigns move through 4 core stages:

1. Planning – Strategy, objectives, storyboarding
2. Design – Scripts, visuals, messaging, prompts
3. Execution – Programming, scheduling, deployment
4. Governance – Monitoring, review, reporting, retros

Each of these four lifecycle stages is expanded in detail in the subsequent sections of the CDS playbook. These sections provide specific guidance, tools, templates, and examples to help teams execute campaigns at the highest level of quality and consistency—while maintaining alignment with DQ's broader transformation and marketing strategy.`
    },
    {
      id: 'campaigns-planning',
      title: '3. STAGE 01 – CAMPAIGNS PLANNING',
      content: `Planning transforms ideas into structured campaigns by aligning creative intent with strategic clarity. It is the foundation where vision meets execution. A well-structured planning stage not only ensures that campaigns are purposeful and aligned with DQ's broader transformation goals, but also sets the stage for smooth collaboration and quality output.

This section outlines the core components that bring structure and intent to every campaign, including the use of strategic canvases to align teams early, briefs to clarify direction and approvals, and resource mapping to ensure execution readiness. Thoughtful planning enables campaigns to be launched faster, perform better, and deliver consistent value across platforms and audiences.`
    }
,
    {
      id: 'campaign-canvas',
      title: '3.1. DQ CDS | Campaign Canvas',
      content: `The campaign canvas is a one-pager that distills the core strategy of a campaign into a format that is easily understood and shared across teams. It captures all critical dimensions—audience, messaging, channels, objectives, and success measures—on a single page. This ensures that every contributor, from designers and content writers to media planners and data analysts, operates from the same strategic foundation. It is a collaboration tool, a clarity tool, and a quality assurance tool rolled into one—essential for aligning intent before any design or execution begins.

Each element in the canvas plays a vital role in shaping a successful campaign. Together, they establish a comprehensive strategic blueprint that enables alignment, creative focus, and measurable performance:

• Campaign Title & Summary – The name and short summary serve as the campaign's identity and elevator pitch. They are often repurposed across internal documentation, presentations, and reporting. Example: "Platform Power | DT2.0 Explained" – A short-form awareness campaign introducing DQ's Platform Economy positioning.
• Primary Content Pillar(s) – Ties the campaign to one or more of DQ's five strategic content categories. Pillar alignment ensures that each campaign contributes to a broader narrative and portfolio of impact. Example: Product & Service Value – Highlighting TMaaS and DTO4T features.
• Objective – Specifies what the campaign aims to accomplish. This should be unambiguous, measurable, and mapped to the stage of the marketing funnel it supports. Example: Awareness – Generate 5,000+ views and 100 saves on LinkedIn explainer carousel.
• Target Audience – Goes beyond basic demographics to define the campaign's persona, segmentation, and tier. This enables message precision, cross all formats. Example: "Digital transformation doesn't have to be improvised—there's a smarter blueprint."
• Call-to-Action (CTA) – A well-crafted CTA connects value to action. It must be aligned with audience readiness and available channels. Example: "Download the TMaaS Strategy Sheet"
• Channel Strategy – Details where the campaign will be seen, by whom, and in what format. Aligns with DQ's master channel plan and supports platform-persona fit. Example: LinkedIn carousel + website landing page + YouTube explainer.
• Success Metrics – Each campaign should declare its win conditions. Whether through reach, engagement, or conversions, metrics make performance tangible. Example: 5% CTR, 300 downloads, 150 shares.
• Hero Asset Type – Defines the lead creative expression of the campaign, which drives visual identity, content reuse, and narrative delivery. Example: 60-second animated explainer video.
• design alignment, and platform targeting. Example: Digital Architects and Transformation Officers in Tier 1 markets.
• Core Message & Value Hook – The heart of the campaign. This should combine emotional resonance with practical relevance. It acts as the idea anchor.`
    }
,
    {
      id: 'campaign-brief-template',
      title: '3.2. Campaign Brief Template',
      content: `This standardized document is used to formally initiate a campaign by consolidating strategic clarity, operational readiness, and creative direction into a single source of truth. It serves as the definitive reference point for all downstream activities—across planning, design, production, and review. By capturing the strategic 'why' and tactical 'how' of a campaign, the brief ensures that cross-functional teams are aligned, stakeholders are informed, and outcomes are measurable. It is both a guiding blueprint and an accountability tool that maintains campaign integrity from concept to execution.

Each field in the brief contributes to a clear, executable plan by surfacing the campaign's purpose, priorities, and required resources. They provide clarity for contributors, governance for reviewers, and a reliable foundation for high-quality execution.

• Strategic Context – Summarize the background, problem space, or opportunity that led to the campaign. This helps ground all collaborators in the "why." Example: DQ recently launched a new set of DT2.0 whitepapers and needs to amplify awareness across C-level audiences.
• Trigger or Business Need – Clarify what specifically prompted this campaign now: a product release, trend, event, or strategic priority. Example: Launch of the DT2.0 Platform and increase in inbound client queries on transformation methodology.
• Creative Direction – Describe the desired creative approach, theme, or conceptual mood. This helps steer the tone, format, and storytelling style. Example: High-contrast visuals with kinetic typography and abstract blueprint elements to convey speed and orchestration.
• Visual Tone & Brand Considerations – Identify any design language, brand guidelines, or aesthetic parameters that must be reflected across all assets. Example: Apply the DTMB silver-black color scheme with professional, high-trust typography (Cormorant Garamond + Open Sans).
• Content Pillar Justification – Indicate which of the five DQ content pillars the campaign supports and explain how this alignment reinforces broader narrative and brand value. Example: Thought Leadership & Insight – The campaign extends DQ's position as a strategic authority on transformation models.
• Timeline & Milestones – Define the working window for the campaign, including key dates for draft reviews, approvals, and go-live. Example: Draft by Sept 1, Review by Sept 4, Final by Sept 7, Launch on Sept 10.
• Budget & Resources – Outline the financial scope, available tools, content contributors, or third-party support allocated to the campaign. Example: $100 production budget, 2 days in-house CES + motion designer, supported by HeyGen + Canva Pro + Narrato.
• Review and Approval Sign-offs – List the stakeholders responsible for reviewing and signing off on the campaign across stages, ensuring governance and accountability. Example: Campaign Owner – Stephane; Creative Lead – Pelagie; Final Sign-off – DQ MarCom Review Board.`
    }
,
    {
      id: 'campaigns-design',
      title: '4. STAGE 02 – CAMPAIGNS DESIGN',
      content: `This section covers the full creative production process: from storyboarding and scripting to asset design, message framing, and AI prompting. It is where creative vision meets executional detail, ensuring that campaign assets are not only visually aligned with the DQ brand, but emotionally resonant and narratively coherent. By standardizing narrative structures, content formats, and design rules, this stage guarantees a consistent and compelling experience across platforms. It also establishes a streamlined handoff from strategy to production, enabling high-quality execution at scale.`
    },
    {
      id: 'messaging-narrative-framework',
      title: '4.1. DQ CDS | Messaging & Narrative Framework',
      content: `To ensure consistency and engagement across all content formats, use the following narrative flow. This structure enables DQ to craft messages that not only inform but also emotionally resonate with diverse audiences. Whether used in short-form reels, detailed carousels, or video explainers, this proven narrative structure strengthens clarity, attention, and recall. It helps create a predictable rhythm across campaigns—one that builds trust and recognition while reinforcing key value propositions.

• Hook – A bold, emotional, or insightful opening that captures attention and stirs curiosity. Example: "Imagine if every transformation project actually delivered transformation."
• Context – Sets the scene and introduces relevance or a core problem to build interest and emotional alignment. Example: "Most organizations treat digital transformation as a set of disconnected projects…"
• Value – Describes the key benefit, insight, or outcome that the audience should walk away with. Example: "DT2.0 connects strategy, systems, and skills into one unified blueprint."
• CTA – Directs the viewer on what to do next with urgency and clarity. Example: "Download the DT2.0 Reference Sheet to learn more."`
    },
    {
      id: 'content-asset-templates',
      title: '4.2. DQ CDS | Content Asset Templates (by Pillar)',
      content: `Each of DQ's content pillars has typical asset formats best suited to its purpose. These templates serve as strategic starting points for content production teams, ensuring every asset is crafted with a clear intent, aligned tone, and fit-for-purpose structure. By defining commonly used content types for each pillar, the system helps creators stay focused, reduces ambiguity during execution, and accelerates production timelines. These pillar-linked templates also make it easier to repurpose or remix content while staying within brand and messaging bounds:

• Thought Leadership – Explainer reels, whitepaper quotes, carousels. Example: A 45-second animated quote from Volume 1 Anchor Paper on the future of platform economies.
• Product Value – Walkthroughs, case studies, user reviews. Example: DTO4T visual journey from insight capture to twin deployment.
• Brand Culture – Team reels, behind-the-scenes, storytelling videos. Example: "Inside DQ: A Day in the Life of a CES."
• Education – Mini tutorials, toolkit downloads, how-to carousels. Example: "3 Ways to Use the DQ Strategy Canvas" visual carousel.
• Community – Shoutouts, partner highlights, polls, event promos. Example: "Shoutout to our Factor Express team—Africa's last-mile transformation is here!"`
    },
    {
      id: 'visual-style-guides',
      title: '4.3. DQ CDS | Visual & Style Guides',
      content: `To maintain consistency, recognizability, and emotional coherence across all creative outputs, refer to the DQ Content Design System (CDS). The CDS acts as the visual and stylistic operating system for all DQ assets—ensuring that every color, font, layout, and animation cue contributes to a unified brand experience. It empowers creators to work independently while maintaining brand alignment, and allows audiences to immediately recognize and emotionally connect with DQ content regardless of format or platform. The system could include:

• Brand Colors and Gradients – Midnight Navy, Silver Gray, Warm Neutrals.
• Typography and Font Pairings – Cormorant Garamond for hero text, Open Sans for body text.
• Image Composition and Usage – Consistent lighting, minimal backdrops, organic framing.
• Layout Rules – Grid-based, wide margins, content foreground priority.
• Animation Style – Minimalist transitions, elegant overlays, linear reveal sequences.
• Emotional Tone Guidelines – Inspirational for Thought Leadership, Practical for Education, Intimate for Brand Culture.`
    },
    {
      id: 'ai-powered-production-tools',
      title: '4.4. DQ CDS | AI-Powered Production Tools',
      content: `DQ leverages AI tools to accelerate asset generation and maintain brand consistency while reducing turnaround time. These tools are integrated into the campaign workflow to assist with ideation, design, video production, layout generation, and content optimization. They allow teams to move faster without compromising quality—supporting the CDS by automating repetitive tasks, scaling visual production, and testing messaging effectiveness before deployment. Their role is not to replace creative thinking but to enhance it—providing real-time augmentation across all phases of design and content creation:

• Heygen – Script-to-video for animated explainers.
• MidJourney – AI-generated image mood boards and compositions.
• ChatGPT – Captioning, CTA generation, hook design, and script writing.
• MagicPatterns – Creative layouts and brand-fit aesthetic pattern generation.
• Rocket/Lovable – Smart previews, design QA, A/B prompt testing, and message clarity scoring.
- Notion Campaign Tracker (Backlog, In Progress, Complete)
- Canva Template Library (by Content Pillar)
- AI Prompt Library (ChatGPT, Heygen, MidJourney)
- Campaign Calendar Generator (Notion/Excel)
- UTM Tagging and Performance Dashboard (Google Sheets)
- Platform Publishing Specs (Reel sizes, carousel specs, etc.)`
    }
,
    {
      id: 'campaigns-execution',
      title: '5. STAGE 03 – CAMPAIGNS EXECUTION',
      content: `With all creative and messaging assets finalized, the execution stage becomes the launchpad for campaign visibility and impact. It is the moment when strategy and storytelling manifest in the public arena. Every element—creative, messaging, media—comes together in synchronized motion to reach audiences where they are, in the format they prefer, with the message that matters most. It's the transformation of ideas into immersive, real-time audience experiences. This phase demands more than just hitting "publish." It requires technical precision, platform fluency, and orchestration across cross-functional teams. Programming and scheduling must align perfectly with platform specifications and audience behavior, while creative integrity must be preserved through responsive, QA-tested content deployment. Consistency in copy, visuals, metadata, and links ensures cohesion in tone and messaging.

Equally critical is agility. Campaign teams must actively monitor signals from live engagement—comments, click-throughs, shares, sentiment—and be prepared to adapt quickly. The execution stage sets the tempo for performance optimization. What appears to the public as smooth delivery is underpinned by rigorous back-end workflows, collaborative ownership, and a readiness to pivot based on insights.`
    },
    {
      id: 'compilation-programming',
      title: '5.1. Compilation & Programming',
      content: `Before any campaign can go live, assets must be fully compiled, tested, and programmed for deployment. This phase bridges the creative and technical layers—ensuring that what was imagined can be flawlessly delivered across multiple touchpoints. Every asset must be operationally ready, context-aware, and tracked for performance. Teams should work collaboratively across content, design, and platform ops to conduct a final pre-launch check. This stage transforms a creative concept into a technically robust and platform-compliant campaign ecosystem. Key activities include:

• Organize all assets in versioned folders (per platform): Ensures that files are clearly labeled, accessible, and properly grouped for platform-specific workflows. This streamlines collaboration, approval cycles, and scheduling handoffs. Example: For a multi-platform product launch, separate folders for Instagram (Reels, Stories), LinkedIn (carousel, article), and YouTube (demo video) ensure clear handover to the publishing team.
• Tag assets with metadata and UTMs: Embeds performance tracking codes directly into the content to facilitate precise analytics, audience behavior insights, and campaign attribution across platforms and dashboards. Example: A LinkedIn post promoting a whitepaper includes a UTM-tagged link to track engagement, conversion rate, and referral source in the analytics dashboard.
• Finalize and standardize caption text, hashtags, emojis, and links: Maintains content tone and platform coherence, enhancing the consistency and effectiveness of each post across different distribution channels. Example: A campaign's Instagram and LinkedIn captions are reviewed to ensure consistent brand voice while adapting for character count and emoji usage on each platform.
• QA all visuals, copy, videos, and scripts: A final quality control step to detect and correct errors, reinforce brand consistency, and ensure the campaign meets technical and creative expectations before going live. Example: The team reviews a promotional video for logo placement, audio clarity, brand colors, and subtitle accuracy before publishing to YouTube.`
    },
    {
      id: 'deployment-checklist',
      title: '5.2. Deployment Checklist',
      content: `Use this checklist to guide the precise deployment of each campaign. This process ensures the transition from creative to live is both structured and adaptable, allowing for optimal content visibility and user experience across channels:

• Automated Scheduling: Schedule content via trusted social media tools (e.g., Simplified) to ensure timed, coordinated, and consistent publishing across all selected platforms. Example: Use Simplified to queue LinkedIn posts and Instagram reels for scheduled release every Monday, Wednesday, and Friday during the campaign window.
• Manual Native Posting: Manually post to native platforms when needed (e.g., Instagram Stories, LinkedIn Polls) to accommodate formats or features not supported by automation. Example: A LinkedIn Poll asking "Where is your company in its digital journey?" is manually posted mid-campaign to spark engagement.
• Cross-Linking Between Assets: Ensure interlinking between content pieces (e.g., carousels linking to blog posts, videos to forms) to guide users across channels and increase overall engagement. Example: An Instagram carousel ends with a CTA linking users to a downloadable whitepaper via the website link-in-bio.
• Compliance & Verification Alerts: Activate alerts and tracking monitors to confirm all assets comply with platform standards and are successfully published without issues. Example: Use publishing dashboards or browser plugins to verify that YouTube thumbnails render correctly across devices and that scheduled posts have gone live.
• Live Engagement Monitoring: Actively monitor comments, shares, and DMs in real-time to engage audiences, surface feedback, and signal positive interaction to platform algorithms. Example: The platform manager replies to early YouTube comments and uses audience questions to inspire follow-up reels.`
    },
    {
      id: 'mid-campaign-adjustments',
      title: '5.3. Mid-Campaign Adjustments',
      content: `Execution doesn't end at launch. During the campaign window, ongoing performance tracking should inform real-time tactical adjustments. These mid-campaign optimizations help maximize relevance, extend reach, and improve conversion potential across audience segments and formats:

• Creative Refresh: Refresh visuals, hooks, or CTAs if early performance signals (e.g., low CTR or watch time) suggest poor engagement or content fatigue. This keeps the campaign dynamic and aligned with audience interests. Example: A hero visual for a LinkedIn post is swapped mid-week for a higher contrast version that performed better in A/B testing.
• Smart Retargeting: Retarget content to high-performing audience clusters or test alternate formats (e.g., static vs. animated) based on live behavior patterns. This enables better message fit and more effective content delivery. Example: After identifying high click-through rates from users in finance roles, a version of the carousel is retargeted specifically to that segment.
• Format Remixing: Remix or elevate top-performing assets into complementary formats like Stories, Shorts, or bite-sized Reels to boost recirculation, visibility, and engagement across platforms. Example: A popular long-form product walkthrough is edited into a 30-second teaser for Instagram Stories and YouTube Shorts.
• Audience Expansion: Extend the campaign's lifespan and visibility by activating new audience segments, launching geo-variants, or adapting messaging for regional resonance. This ensures the campaign reaches its full potential by tapping into untapped or adjacent audiences. Example: After success in GCC markets, the campaign is adapted for East Africa by tweaking visual language and switching CTAs to regional partners.`
    }
,
    {
      id: 'campaigns-governance',
      title: '6. STAGE 04 – CAMPAIGNS GOVERNANCE',
      content: `Governance transforms DQ's campaigns into repeatable success models. Rather than isolated creative outputs, campaigns are treated as high-impact initiatives that deliver measurable value—and are continuously improved over time. Governance ensures a structured approach to performance tracking, quality assurance, and lessons learned.

This stage connects campaign execution with strategy refinement. It embeds learning loops by translating metrics into improvements, audience sentiment into storytelling refinement, and performance gaps into clear action. The result: more effective content, smarter campaigns, and a stronger brand.

Governance also helps embed accountability across all contributors. When everyone understands how campaigns are measured and reviewed, collaboration becomes more purposeful and outcomes become more predictable. This fosters a culture of quality—where content isn't just delivered, but deliberately improved. The visibility that governance provides across campaign performance also empowers leaders to make data-informed decisions on messaging, creative investment, and content formats.

What follows is a breakdown of the three main governance mechanisms: pillar-specific KPIs, campaign reviews, and monthly quality sessions—all calibrated to help DQ sustain excellence.`
    },
    {
      id: 'kpi-model-by-pillar',
      title: '6.1. KPI Model by Pillar',
      content: `The KPI Model translates the strategic goals of each content pillar into clear, actionable metrics that allow campaign performance to be tracked with purpose. Each KPI is selected to reflect the intended value and role of its associated pillar, ensuring that outcomes are measured meaningfully—not just quantitatively. This focused approach supports more accurate evaluation, better content iteration, and smarter decision-making across platforms.

Aligning KPIs to each pillar helps DQ understand which messages, tones, and formats drive desired outcomes across different audiences. For example, a campaign built around Thought Leadership should prioritize engagement signals like saves and reposts, while Product Value content must drive tangible conversions or deep attention. Below are the pillar-specific KPIs, each tied to its strategic purpose:

• Thought Leadership: Shares, Reach, Saves, Reposts Signals the spread and perceived value of insight-driven content. Example: A carousel summarizing a whitepaper is saved 120 times and reposted by industry experts, signaling high value and thought leadership authority.
• Product Value: Click-Through Rate (CTR), Conversions, Engagement Time Indicates audience action, interest, and content depth. Example: A TMaaS explainer video generates a 9% CTR and leads to 14 demo booking requests within one week.
• Brand Culture: Reactions, Comments, Reposts Reveals emotional connection and brand affinity. Example: An "Inside DQ" team photo series gains 350+ reactions and heartfelt comments on LinkedIn.
• Education: Completion Rate, Downloads, Saves Measures the effectiveness of knowledge transfer and utility. Example: A 60-second mini tutorial sees an 82% completion rate and over 200 downloads of the associated framework.
• Community: RSVPs, Tagging, DMs, Poll Responses Tracks interactive engagement and collective participation. Example: A DTMA launch event post results in 450 RSVPs, 50 user tags, and 80 responses to an Instagram poll.`
    },
    {
      id: 'campaign-review-template',
      title: '6.2. Campaign Review Template',
      content: `Following each campaign, the review process extracts actionable insights to inform both tactical adjustments and long-term content strategy. The process is structured to ensure that evaluations go beyond vanity metrics and deliver usable intelligence. The intent is not simply to assess performance, but to understand why a campaign performed the way it did, what factors contributed, and how this knowledge can sharpen the design and deployment of future campaigns.

The standardized format facilitates apples-to-apples comparisons across campaigns and teams. It promotes alignment on what constitutes campaign success and helps identify patterns across content types, audience reactions, and formats. Campaign reviews are stored in a central repository, becoming a growing database of learnings for DQ.

• Results vs Objectives: Did we meet or exceed expectations? Example: A target of 1,000 email signups was exceeded with 1,235 captured.
• Top-Performing Assets: What content formats resonated most? Example: Instagram Reels had higher engagement than carousels in a Brand Culture campaign.
• Audience Feedback Themes: What did people say—and how did they feel? Example: Comments revealed excitement around the product demo but confusion about pricing.
• Visual & Tone Resonance: Was the brand voice visually and emotionally consistent? Example: One carousel used an off-brand color palette, prompting a correction in the next iteration.
• Budget Use and ROI: Did we get value for our spend? Example: $200 spent on boosted posts returned 400+ clicks and 20 qualified leads.
• Lessons Learned: What should we repeat, avoid, or tweak? Example: Early posting (before 9am) generated the highest organic impressions.
• Pillar Impact Assessment: Which content pillar drove the highest engagement? Example: Education content drove the most saves and comments, indicating strong utility.`
    },
    {
      id: 'monthly-quality-review',
      title: '6.3. Monthly Quality Review',
      content: `DQ's monthly campaign quality reviews serve as a cornerstone of continuous improvement. These sessions are designed not only to inspect outputs but to calibrate the creative and strategic health of DQ's campaigns. By conducting regular assessments, the team identifies patterns of excellence, surfaces areas for refinement, and ensures evolving brand standards are upheld across every content stream.

These reviews bring together cross-functional leads—Head of Content, CES, and Design Leads—to provide a holistic evaluation across messaging, visuals, tone, and platform impact. Each campaign selected for review is assessed for both outcome and alignment with strategic goals. These meetings also act as a creative knowledge-sharing forum, allowing teams to celebrate what worked and learn from what didn't.

• Review of Campaign Assets: Including evaluation by the Head of Content, CES, and Design Leads. Example: A community video reel is reviewed for emotional tone, sequencing, and clarity of CTA.
• Editorial, Emotional, and Visual Checks: Focus on tone, quality, and brand presence. Example: A headline is reworked to better reflect the conversational tone of DQ's Brand Culture pillar.
• Pillar Mapping: Ensure each asset fulfills its pillar's strategic purpose. Example: An educational post that leans heavily into product features may be reclassified or split across pillars.
• Improvement Logging: Capture and assign specific improvements. Example: A recommendation to update outdated design templates is logged and assigned to the design team.
• Framework Enhancements: Apply lessons learned to evolve tools and templates. Example: A new AI script writing prompt is added to the Messaging Framework after testing its effectiveness.

By institutionalizing this review process, DQ embeds a culture of precision, reflection, and growth across its entire content ecosystem. These recurring governance moments are not just about correcting missteps—they serve as an engine for amplifying creative excellence, reinforcing what works, and fine-tuning what doesn't. From messaging cadence to visual nuance, every element becomes subject to collaborative scrutiny.

This cyclical feedback loop builds confidence among teams and provides structure for creativity to flourish within defined quality boundaries. It also supports onboarding and upskilling by giving new contributors a real-time window into what quality looks like in practice. As a result, quality review becomes both a checkpoint and a learning forum.

Ultimately, this governance cycle transforms campaign development from a one-time effort into an iterative, team-wide craft. Over time, it ensures DQ's campaigns are not only aligned with strategic goals but also capable of setting new benchmarks in storytelling, branding, and engagement.`
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate the exact position accounting for header and padding
      const headerHeight = 80; // Approximate header height
      const additionalOffset = 32; // Additional padding for better positioning
      const elementPosition = element.offsetTop - headerHeight - additionalOffset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen flex flex-col">
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
                FRAMEWORK
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Campaign Design System (CDS)
              </h1>

              <p className="text-base text-white/80 max-w-xl leading-relaxed">
                CDS defines DQ's unified operating system for designing strategic, scalable, high-impact marketing campaigns.
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
                        {section.content.split('\n\n').map((paragraph: string, index: number) => (
                          <div key={index} className="mb-4">
                            <SectionParagraph paragraph={paragraph} />
                          </div>
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