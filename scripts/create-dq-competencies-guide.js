import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DQ_COMPETENCIES_SUMMARY = `Discover how Digital Qatalyst's core competencies—Agile, Culture, Technical, and Framework—empower organizations to innovate, adapt, and thrive in the digital economy.`;

const DQ_COMPETENCIES_BODY = `# DQ Competencies

Discover how Digital Qatalyst's core competencies—Agile, Culture, Technical, and Framework—empower organizations to innovate, adapt, and thrive in the digital economy.

## 1. DQ Competency (Agile)

The Agile competency focuses on fostering a flexible, collaborative work environment, ensuring that DQ embraces agility to efficiently meet evolving business demands and challenges. It emphasizes the importance of iterative development, rapid feedback loops, and adaptive planning to maintain competitive advantage.

Agile refers to the set of skills, practices, and methodologies that Digital Qatalyst (DQ) uses to ensure agility in its operations, project delivery, and overall business transformation.

## 2. DQ Competency (Culture)

The DQ Competency (Culture), centered around the House of Values, defines the core beliefs and behaviors that drive Digital Qatalyst's success. The House of Values emphasizes innovation, collaboration, accountability, respect, continuous learning, and sustainability as key principles.

These values are supported by cultural pillars of agility, empowerment, trust, and well-being, guiding how associates engage, make decisions, and perform. The House of Values fosters a positive and inclusive environment where collaboration, adaptability, and growth are prioritized, ensuring that the company thrives and evolves in a fast-paced digital landscape.

## 3. DQ Competency (Technical)

DQ Competency (Technical) focuses on the key technical capabilities driving Digital Qatalyst's (DQ) digital transformation efforts. It includes:

| Area | Description |
|------|-------------|
| DQ Governance | Led by the CEO, COE, and CTO to align strategic decisions and technological direction. |
| DQ Accounts | Collaboration between marketing, business development, and delivery to create client-focused, market-ready solutions. |
| DQ Products (Engineering) | Includes frameworks, design, deployment services, and platforms like DTMP to deliver scalable and secure digital transformation solutions. |
| DQ Products (Content) | Encompasses the DT Academy for upskilling, DT Books for knowledge sharing, and DT Podcast for industry insights. |

## 4. DQ Competency (Framework)

At DigitalQatalyst, we empower organizations with a comprehensive, tailored approach to digital transformation. Our DQ Product Family offers solutions across five key areas:

| Area | Description |
|------|-------------|
| Advisory | Developing a customized Digital Transformation 2.0 blueprint aligned with client goals. |
| Solutions | Implementing advanced technologies to turn DT 2.0 visions into actionable strategies for change. |
| Framework | A robust, best-practice-driven toolkit with ten essential frameworks for achieving digital success. |
| Automation | Streamlining operations by automating repetitive tasks, freeing resources for strategic initiatives. |
| Upskilling | Equipping client teams with the skills needed to excel in the digital age. |

**DQ Framework**

## 5. The DQ Storybook

The DQ Storybook introduces the Golden Honeycomb of Competencies (GHC). It's a framework of frameworks that unites vision, culture, identity, governance, operations, and products into one cohesive organisational system. Inside, you'll discover:

| Component | Description |
|-----------|-------------|
| DQ Purpose & Vision | Why we exist and how we aim to perfect life's transactions through Digital Blueprints. |
| DQ Culture & Identity | The values, mindsets, and persona that shape how Qatalysts show up and collaborate. |
| DQ Ways of Working | Agile systems for tasks, governance, and value delivery that make agility scalable. |
| DQ Product Architecture | The transformation playbooks, blueprints, and tools that help organisations evolve into Digital Cognitive Organisations.`;

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de',
    '1507003211169-0a1dd7228fbb', '1516321318469-88ce825ef878', '1556761175-597af40f565e',
    '1556073709-9fae23b835b2', '1557804816-2b21ebcb1977', '1559827261-9cbd8d3600a9',
    '1559827261-9cbd8d3600a9', '1551288049-bebda4e38f71', '1557800636-23f87b1063e4',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function createDQCompetenciesGuide() {
  console.log('📝 Creating DQ Competencies guide...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%DQ Competencies%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  DQ Competencies guide already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'DQ Competencies');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'DQ Competencies',
        summary: DQ_COMPETENCIES_SUMMARY,
        body: DQ_COMPETENCIES_BODY,
        domain: 'Strategy',
        sub_domain: 'ghc',
        guide_type: 'Framework',
        unit: 'Stories',
        location: 'DXB',
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guideId);

    if (updateError) {
      console.error(`❌ Error updating: ${updateError.message}`);
    } else {
      console.log(`✅ Successfully updated DQ Competencies guide!`);
    }
    return;
  }

  // Create new guide
  const slug = 'dq-competencies';
  const title = 'DQ Competencies';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: DQ_COMPETENCIES_SUMMARY,
    body: DQ_COMPETENCIES_BODY,
    domain: 'Strategy',
    sub_domain: 'ghc',
    guide_type: 'Framework',
    unit: 'Stories',
    location: 'DXB',
    hero_image_url: imageUrl,
    status: 'Approved'
  };

  const { data, error } = await supabase
    .from('guides')
    .insert(newGuide)
    .select();

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Successfully created DQ Competencies guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: ghc`);
    console.log(`   Guide Type: Framework`);
  }
}

createDQCompetenciesGuide().catch(console.error);

