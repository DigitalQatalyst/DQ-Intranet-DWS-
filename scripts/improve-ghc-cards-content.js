import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Improved, clean, and appealing content for each guide
const IMPROVED_CONTENT = {
  'DQ Journey': {
    summary: `Discover DQ's evolution from a 2015 startup to a global digital transformation leader, driving innovation across industries with a vision to perfect life's transactions.`,
    body: `# DQ Journey

## How DQ Started

Founded in 2015 in Dubai by Dr. Stephane Niango, DQ emerged from a powerful conviction: organizations weren't leveraging technology effectively to solve real-world inefficiencies. Dr. Niango's PhD research revealed that when technology is implemented thoughtfully, it can dramatically enhance quality of life—a principle that became DQ's foundation.

## Evolution of DQ

DQ's growth story reflects strategic transformation: from securing clients across multiple countries to expanding globally, and evolving from a service-based model to a product-focused business. With a clear strategy to scale to 10,000 accounts, DQ is positioning itself as a leader in digital transformation, ultimately seeking strategic exits or partnerships to maximize value.

## DQ's Achievements

**First 12 Months (2015-2016)**
- Surpassed 10 clients across three countries: UAE, Qatar, and Saudi Arabia

**Next Five Years (2016-2021)**
- Client base grew to 50 clients
- Established a strong regional presence

**By 2023**
- Delivery operations expanded to over five countries
- Built a reputation for excellence in digital transformation

## DQ's Aspirations

DQ aims to build market trust through refined products and strategic client partnerships, scaling globally from 400 to 10,000 accounts. The focus is on rapid feature deployment, bespoke delivery, and global expansion.

**2028 Goal:** Reach 2,000 accounts, enhancing market appeal

**2029 Goal:** Achieve 4,000 accounts, solidifying global recognition

**2030 Vision:** Position DQ for strategic exit or partnership at 10,000 accounts`
  },

  'DQ Beliefs': {
    summary: `DQ's core beliefs—DT2.0, DCO, and DBP—form the foundation for seamless integration, real-time decision-making, automation, and scalable growth in the digital economy.`,
    body: `# DQ Beliefs

DQ's core beliefs shape how we approach digital transformation. These three fundamental principles guide our work and define our vision for the future of business.

## 1. Digital Transformation 2.0 (DT2.0)

DT2.0 represents a paradigm shift from fragmented digital initiatives to a unified, interconnected approach. Unlike traditional transformation, DT2.0 focuses on creating seamless ecosystems through integrated platforms.

**Key Principles:**
- **Interconnectivity:** Building unified digital ecosystems that connect all business functions
- **Integration & Scalability:** Enabling real-time decision-making, automation, and scalable growth
- **Empowered Digital Workers:** Equipping employees with tools and knowledge to thrive in a digital landscape

## 2. Digital Cognitive Organisation (DCO)

DCOs represent the future of business—organizations where human intelligence, digital technologies, and data-driven tools work in harmony to drive operational excellence and innovation.

**Core Characteristics:**
- **Cognitive Capacity:** A collaborative system combining human expertise with AI and advanced technologies
- **Advanced Technology Integration:** Seamless connection between AI, machine learning, ERP, CRM, and BPM systems
- **Data-Driven Decision Making:** Real-time, intelligent decision-making across all organizational levels

**Impact:** DCOs deliver increased revenue, reduced costs, and superior customer experiences, making them essential for future-proofing any organization.

## 3. Digital Business Platform (DBP)

DBP is the unified digital ecosystem that integrates core business systems, enabling real-time insights, enhanced decision-making, and operational efficiency.

**Why Organizations Need DBPs:**
- **Break Operational Silos:** Integrate ERP, CRM, and BPM into a single, cohesive system
- **Enhance Decision-Making:** Access real-time data insights for agile, strategic decisions
- **Support Innovation:** Enable rapid response to market changes and exceptional customer experiences

Together, these beliefs form the foundation of DQ's approach to digital transformation, ensuring organizations can adapt, innovate, and thrive in an ever-evolving digital world.`
  },

  'DQ Vision and Mission': {
    summary: `DQ's vision and mission connect every role to our strategic goals, empowering informed decisions and opening doors to new opportunities as we navigate digital transformation.`,
    body: `# DQ Vision and Mission

At DQ, everything we do is connected to our strategy and vision. A clear vision outlines our long-term aspirations, while our strategy provides the roadmap to get there. This connection empowers every associate to make informed decisions and feel invested in our collective success.

## 1. DQ World View: DCO

In today's fast-paced landscape, industries must transcend traditional methods to thrive. Digital Cognitive Organizations (DCOs) represent the pinnacle of this evolution, seamlessly integrating digital technology and AI with human expertise.

**Why DCOs Matter:**
- Harmonious collaboration between humans and AI drives increased revenue
- Reduced operational costs through intelligent automation
- Superior customer experiences that set organizations apart

For DQ, promoting DCOs means enabling industries to achieve these transformative benefits, ensuring their competitive edge and long-term success.

## 2. De Facto Architecture: DBP

To evolve into a Digital Cognitive Organization, organizations need a foundational Digital Business Platform (DBP)—an integrated suite of advanced technologies that positions them at the pinnacle of their industries.

**TMaaS Role:** Transformation Management as a Service provides the expertise and tools necessary to design and deploy a formidable DBP effectively, making the journey clear and streamlined.

## 3. DQ Vision

### Perfecting Life's Transactions

At DQ, we envision a world where digital technologies are seamlessly integrated across all sectors of the economy, creating a more empowering and fulfilling life for everyone, regardless of demographic background.

**Our Goal:** Harness the power of digital transformation to enhance everyday interactions, making transactions smoother, more efficient, and ultimately more rewarding.

By deploying cutting-edge digital solutions, we aim to improve quality of life for all, driving societal progress and inclusivity through technological advancement.

## 4. DQ Mission

Our mission unfolds through strategic phases:

| Year | Milestone |
|------|-----------|
| **2023** | Launch DQ2.0, the foundation for our digital transformation journey |
| **2024** | Establish a dedicated Center of Excellence, build skilled teams across Business Units, and equip our workforce with new knowledge through educational tools |
| **2025** | Establish two high-performing DCO operations globally and accelerate transformation with DQ Digital Business Platform and DT2.0 Accelerators |
| **2026 & Beyond** | Continue our long-term DCO transformation journey, extending our impact past 2025`
  },

  'DQ Strategy 2021-2030': {
    summary: `Explore DQ's bold journey to lead the $20 trillion global digital economy by 2030 through a phased strategy that empowers businesses to transition into Digital Cognitive Organizations.`,
    body: `# DQ Strategy 2021-2030

Explore DigitalQatalyst's bold journey to lead the $20 trillion global digital economy by 2030. Our phased strategy empowers businesses to transition into Digital Cognitive Organizations (DCOs), leveraging cutting-edge technology, seamless operations, and personalized solutions to achieve global competitiveness.

## 2021 – Phase 00: Dare 2 Venture

**Significance:** The foundational year marking DQ's transition from DQ1.0 to DQ2.0, establishing the groundwork for global ambitions.

**Focus:** Transitioning from an academic advisory boutique to a global digital transformation provider.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Early Product Partners (RAI) |
| KRI 02 | Product Impact | Messaging Impact with DTMF and SPL |
| KRI 03 | Squad | Volume Ramp-Up for Small Organizations |

## 2022 – Phase 01: Probe 2 Pinpoint

**Significance:** Refining strategies and diagnosing opportunities to align products with market needs.

**Focus:** Diagnosing key growth opportunities and identifying client needs.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Early Product Deals (iPL + SPL) |
| KRI 02 | Product Impact | Enhanced Product Messaging using DTMF |
| KRI 03 | Squad | Steady Ramp-Down to concentrate resources |

## 2023 – Phase 02: Shock 2 Repell

**Significance:** Critical preparation for scalability, resolving inefficiencies and restructuring the product portfolio.

**Focus:** Preparing for large-scale operations by resolving inefficiencies and structuring DQ2.0's product portfolio.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Established Boundaries (SPL + DFSA) |
| KRI 02 | Product Impact | Structured Portfolio of Eight Core Products |
| KRI 03 | Squad | Accelerated Clean-Up with Base Squads |

## 2024 – Phase 03: Explore 2 Rebuild

**Significance:** Positioning DQ2.0 for market penetration through key product unveilings and high-quality tools.

**Focus:** Market penetration through introduction of key products and robust foundational tools.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Products Unveiled (DFSA + SAIB) |
| KRI 02 | Product Impact | Portfolio End Value through Deploy Tools |
| KRI 03 | Squad | Quality Missionaries for high-quality delivery |

## 2025 – Phase 04: Cement 2 Rebuild

**Significance:** Strengthening market trust through refined products delivered to key clients.

**Focus:** Building market trust with refined products and gaining strategic client confidence.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Trusted Accounts (10x) |
| KRI 02 | Product Impact | Refined Feature Adoption |
| KRI 03 | Squad | Elite Missionaries for bespoke delivery |

## 2026 – Phase 05: Open 2 Scale

**Significance:** Beginning global scaling operations by onboarding 80 accounts, supported by rapid feature deployment.

**Focus:** Expanding DQ2.0's footprint globally by scaling to 80 accounts.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Scaled Accounts (80x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2027 – Phase 06: Clone 2 Expand

**Significance:** Continued global expansion, scaling to 400 accounts while ensuring quality delivery.

**Focus:** Aggressive global expansion to grow the client base to 400 accounts.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Scaled Accounts (400x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2028 – Phase 07: Polish 2 Appeal

**Significance:** Enhancing global appeal by refining offerings and targeting 2,000 accounts.

**Focus:** Refining products and services to enhance global appeal and competitiveness.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Scaled Accounts (2000x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2029 – Phase 08: Sell 2 Recognize

**Significance:** Solidifying global recognition as a digital transformation leader with 4,000 accounts.

**Focus:** Achieving global recognition as a leader in digital transformation.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Scaled Accounts (4000x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2030 – Phase 09: Sell 2 Exit

**Significance:** Positioning DQ2.0 for strategic exit opportunities or partnerships at 10,000 accounts.

**Focus:** Finalizing DQ2.0's long-term strategy by maximizing value through strategic exits or partnerships.

| KRI | Area | Achievement |
|-----|------|-------------|
| KRI 01 | Clients | Scaled Accounts (10000x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations`
  },

  'DQ Competencies': {
    summary: `Discover DQ's core competencies—Agile, Culture, Technical, and Framework—that empower organizations to innovate, adapt, and thrive in the digital economy.`,
    body: `# DQ Competencies

DQ's core competencies form the foundation of our approach to digital transformation. These four key areas—Agile, Culture, Technical, and Framework—empower organizations to innovate, adapt, and thrive in the digital economy.

## 1. DQ Competency (Agile)

The Agile competency focuses on fostering a flexible, collaborative work environment, ensuring DQ embraces agility to efficiently meet evolving business demands and challenges.

**Key Practices:**
- Iterative development cycles
- Rapid feedback loops
- Adaptive planning
- Continuous improvement

Agile refers to the set of skills, practices, and methodologies that DQ uses to ensure agility in operations, project delivery, and overall business transformation.

## 2. DQ Competency (Culture)

The DQ Competency (Culture), centered around the House of Values, defines the core beliefs and behaviors that drive Digital Qatalyst's success.

**House of Values:**
- Innovation
- Collaboration
- Accountability
- Respect
- Continuous Learning
- Sustainability

**Cultural Pillars:**
- Agility
- Empowerment
- Trust
- Well-being

These values and pillars guide how associates engage, make decisions, and perform, fostering a positive and inclusive environment where collaboration, adaptability, and growth are prioritized.

## 3. DQ Competency (Technical)

DQ Competency (Technical) focuses on the key technical capabilities driving DQ's digital transformation efforts.

| Area | Description |
|------|-------------|
| **DQ Governance** | Led by CEO, COE, and CTO to align strategic decisions and technological direction |
| **DQ Accounts** | Collaboration between marketing, business development, and delivery to create client-focused, market-ready solutions |
| **DQ Products (Engineering)** | Includes frameworks, design, deployment services, and platforms like DTMP to deliver scalable and secure digital transformation solutions |
| **DQ Products (Content)** | Encompasses DT Academy for upskilling, DT Books for knowledge sharing, and DT Podcast for industry insights |

## 4. DQ Competency (Framework)

At DigitalQatalyst, we empower organizations with a comprehensive, tailored approach to digital transformation through our DQ Product Family.

| Solution Area | Description |
|---------------|-------------|
| **Advisory** | Developing customized Digital Transformation 2.0 blueprints aligned with client goals |
| **Solutions** | Implementing advanced technologies to turn DT 2.0 visions into actionable strategies |
| **Framework** | A robust, best-practice-driven toolkit with ten essential frameworks for digital success |
| **Automation** | Streamlining operations by automating repetitive tasks, freeing resources for strategic initiatives |
| **Upskilling** | Equipping client teams with the skills needed to excel in the digital age |

## 5. The DQ Storybook

The DQ Storybook introduces the Golden Honeycomb of Competencies (GHC)—a framework of frameworks that unites vision, culture, identity, governance, operations, and products into one cohesive organizational system.

**Inside the Storybook:**
- **DQ Purpose & Vision:** Why we exist and how we aim to perfect life's transactions through Digital Blueprints
- **DQ Culture & Identity:** The values, mindsets, and persona that shape how Qatalysts show up and collaborate
- **DQ Ways of Working:** Agile systems for tasks, governance, and value delivery that make agility scalable
- **DQ Product Architecture:** Transformation playbooks, blueprints, and tools that help organizations evolve into Digital Cognitive Organisations`
  },

  'DQ Products': {
    summary: `DQ is transitioning to a product-led organization. Our portfolio includes DTMP, DTO4T, TMaaS, DTMA, and DGPRC—platforms designed to enhance agility, scalability, and compliance.`,
    body: `# DQ Products

## DQ: A Product-led Organisation

DQ is transitioning from a service-oriented organization to a product-led organization. Our portfolio includes platforms designed to manage data and analytics, accelerate AI-driven transformation, provide flexible transformation solutions, deliver specialized training, and ensure governance compliance.

Together, these products ensure holistic transformation success, enhancing agility, scalability, and compliance in your organization.

## 1. DTMP

**Digital Transformation Management Platform**

DTMP creates a seamless digital ecosystem with a centralized platform to manage data, processes, and analytics.

| Feature | Capability |
|---------|------------|
| **Data Storage** | Robust and scalable data storage to keep your organization's data secure and accessible |
| **Analytics** | Leverage AI for generating advanced insights and driving informed decision-making |

## 2. DTO4T

**Digital Twin of Organization for Transformation**

DTO4T is an AI-driven platform for accelerating digital transformation by creating digital twins of organizations.

| Feature | Capability |
|---------|------------|
| **AI-Driven Acceleration** | Speeds up transformations through automated processes |
| **Agile Approach** | Enables flexible workflows for scaling at pace |
| **Digital Blueprint** | Provides a roadmap for seamless digital transformation |

## 3. TMaaS

**Transformation Management as a Service**

TMaaS is a flexible, on-demand service empowering organizations to manage digital transformation with expert assistance at scalable costs.

| Feature | Capability |
|---------|------------|
| **Customization Options** | Tailored solutions for unique business needs |
| **AI-Powered Assistance** | Automated workflows for efficiency and precision |
| **Subscription Models** | Flexible pricing to scale based on usage |

## 4. DTMA

**Digital Transformation Management Academy**

DTMA is designed to upskill teams with tailored training to become digital leaders with expertise, certifications, and innovative tools.

| Feature | Capability |
|---------|------------|
| **Specialized Training** | Programs tailored for every level of expertise |
| **AI Integration** | Integration of cutting-edge tools for enhanced learning |

## 5. D2GPRC

**Data-Driven Governance, Performance, Risk, and Compliance**

DGPRC is a data-driven product that empowers governance, risk, and compliance management for smart decision-making.

| Feature | Capability |
|---------|------------|
| **RegTech** | Advanced compliance processes and reporting tools |
| **AI-Powered DataTech** | Data-driven insights for proactive risk management |
| **Governance** | Align organizational policies with data-driven decisions |

Together, these products form a comprehensive suite that enables organizations to navigate digital transformation with confidence, efficiency, and strategic alignment.`
  }
};

async function improveGHCCardsContent() {
  console.log('✨ Improving GHC service cards content...\n');

  const { data: allGuides, error } = await supabase
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  let updatedCount = 0;

  for (const [title, content] of Object.entries(IMPROVED_CONTENT)) {
    const guide = (allGuides || []).find(g => g.title === title);
    
    if (guide) {
      console.log(`Updating "${title}"...`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          summary: content.summary,
          body: content.body,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', guide.id);

      if (updateError) {
        console.error(`   ❌ Error: ${updateError.message}`);
      } else {
        console.log(`   ✅ Updated successfully`);
        updatedCount++;
      }
    } else {
      console.log(`⚠️  "${title}" not found`);
    }
  }

  console.log(`\n✅ Successfully updated ${updatedCount} guide(s)!`);
}

improveGHCCardsContent().catch(console.error);

