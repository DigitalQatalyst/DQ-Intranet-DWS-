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

const STRATEGY_VISION_SUMMARY = `At DQ, everything you do is connected to the strategy and vision that guide our success. A clear vision outlines our long-term aspirations, while the strategy serves as the roadmap to get us there.`;

const STRATEGY_VISION_BODY = `# Strategy & Vision

At DQ, everything you do is connected to the strategy and vision that guide our success. A clear vision outlines our long-term aspirations, while the strategy serves as the roadmap to get us there. It connects your role to DQ's goals, allowing you to make informed decisions and feel more invested in our collective success. This knowledge also opens doors to new opportunities as we navigate changes and initiatives.

## 1. DQ World View: DCO

In today's fast-paced and competitive landscape, industries must transcend traditional methods to thrive. Digital Cognitive Organizations (DCOs) represent the pinnacle of this evolution, seamlessly integrating digital technology and AI with human expertise to revolutionize business operations. For DQ, DCOs are not just a concept but a core belief.

The harmonious collaboration between humans and AI within a DCO leads to increased revenue, reduced costs, and superior customer experiences, making it an indispensable strategy for future-proofing any organization. For DQ, promoting DCOs is about enabling industries to achieve these transformative benefits, ensuring their competitive edge and long-term success.

**DQ Digital Cognitive Organization**

## 2. De Facto Architecture: DBP

To truly evolve into a Digital Cognitive Organization, a foundational step is the establishment of a Digital Business Platform (DBP). A DBP is an integrated suite of advanced technologies that positions organizations at the pinnacle of their industries, serving as the backbone for digital evolution.

TMaaS plays a pivotal role in this transformation. It provides the expertise and tools necessary to design and deploy a formidable DBP effectively. With TMaaS, the journey to crafting a DBP is clear and streamlined and sets the foundation for your organization's evolution into a Digital Cognitive Organization.

**DQ Digital Business Platform**

## 3. DQ Vision

### Our Vision: Perfecting Life's Transactions

At DQ, we envision a world where digital technologies are seamlessly integrated across all sectors of the economy, creating a more empowering and fulfilling life for everyone, regardless of their demographic background. Our goal is to harness the power of digital transformation to enhance everyday interactions, making transactions smoother, more efficient, and ultimately, more rewarding.

By deploying cutting-edge digital solutions, we aim to improve the quality of life for all, driving societal progress and inclusivity through technological advancement. This vision underscores our commitment to leveraging digital innovation to create a better, more equitable future for all individuals.

**DQ Vision**

## 4. DQ Mission

| Timeline | Mission Milestone |
|----------|-------------------|
| 2023 | We launch DQ2.0, the foundation for our digital transformation journey. |
| 2024 | To propel DQ2.0, we establish a dedicated Center of Excellence, build a skilled team across all the Business Units to equip our workforce with new knowledge through educational tools. |
| 2025 | We establish two high-performing DCO operations globally and accelerate our transformation with the development of a DQ Digital Business Platform and DT2.0 Accelerators. |
| 2026 & Beyond | This roadmap lays the groundwork for our long-term DCO transformation journey, extending past 2025.`;

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function createStrategyVisionGuide() {
  console.log('📝 Creating Strategy & Vision guide...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%Strategy & Vision%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  Strategy & Vision guide already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'Strategy & Vision');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'Strategy & Vision',
        summary: STRATEGY_VISION_SUMMARY,
        body: STRATEGY_VISION_BODY,
        domain: 'Strategy',
        sub_domain: 'journey',
        guide_type: 'Journey',
        unit: 'Stories',
        location: 'DXB',
        hero_image_url: imageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guideId);

    if (updateError) {
      console.error(`❌ Error updating: ${updateError.message}`);
    } else {
      console.log(`✅ Successfully updated Strategy & Vision guide!`);
    }
    return;
  }

  // Create new guide
  const slug = 'strategy-vision';
  const title = 'Strategy & Vision';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: STRATEGY_VISION_SUMMARY,
    body: STRATEGY_VISION_BODY,
    domain: 'Strategy',
    sub_domain: 'journey',
    guide_type: 'Journey',
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
    console.log('✅ Successfully created Strategy & Vision guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: journey`);
    console.log(`   Guide Type: Journey`);
  }
}

createStrategyVisionGuide().catch(console.error);

