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

const DQ_BELIEFS_SUMMARY = `Explore how DQ's core beliefs—DT2.0, DCO, and DBP—lay the foundation for businesses to achieve seamless integration, real-time decision-making, automation, and scalable growth in the ever-evolving digital world.`;

const DQ_BELIEFS_BODY = `# DQ Beliefs

Explore how DQ's core beliefs—DT2.0, DCO, and DBP—lay the foundation for businesses to achieve seamless integration, real-time decision-making, automation, and scalable growth in the ever-evolving digital world.

## 1. Digital Transformation 2.0 (DT2.0)

Digital Transformation 2.0 (DT2.0) marks a paradigm shift from the fragmented approach of Digital Transformation 1.0. Here's what sets it apart:

| Key Aspect | Description |
|------------|-------------|
| Focus on Interconnectivity | DT2.0 emphasizes the creation of a seamless ecosystem through a unified Digital Business Platform. |
| Integration and Scalability | DBP integrates tools, data, and processes to enable real-time decision-making, automation, and scalable growth. |
| Empowered Digital Workers | Empowering employees to amplify productivity and adapt to an evolving digital landscape. |

## 2. Digital Cognitive Organisation (DCO)

Digital Cognitive Organizations (DCOs) represent the future of business, where human intelligence, digital technologies, and data-driven tools converge to drive operational excellence and innovation.

| Key Aspect | Description |
|------------|-------------|
| Cognitive Capacity | A DCO is a collective of human intelligence, digital technologies, and data-driven tools collaborating to deliver organizational value. |
| Advanced Technology Integration | AI, machine learning, and other technologies integrate with ERP, CRM, and BPM systems. |
| Data-Driven Decision Making | The integration empowers real-time, intelligent decision-making across all levels of the organization. |

## 3. Digital Business Platform (DBP)

The Digital Business Platform (DBP) is a unified digital ecosystem that integrates core business systems to enable real-time data insights, enhance decision-making, and fosters operational efficiency. Here's why should organizations deploy DBPs?

| Key Benefit | Description |
|-------------|-------------|
| Break Operational Silos | Integrates business systems like ERP, CRM, and BPM into a unified digital ecosystem. |
| Enhance Decision-Making | Provides real-time data insights to improve agility and strategic decision-making. |
| Support Innovation and Competitiveness | Enables rapid response to market changes, innovation, and exceptional customer experiences to stay competitive in the digital economy.`;

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function createDQBeliefsGuide() {
  console.log('📝 Creating DQ Beliefs guide...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%DQ Beliefs%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  DQ Beliefs guide already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'DQ Beliefs');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'DQ Beliefs',
        summary: DQ_BELIEFS_SUMMARY,
        body: DQ_BELIEFS_BODY,
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
      console.log(`✅ Successfully updated DQ Beliefs guide!`);
    }
    return;
  }

  // Create new guide
  const slug = 'dq-beliefs';
  const title = 'DQ Beliefs';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: DQ_BELIEFS_SUMMARY,
    body: DQ_BELIEFS_BODY,
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
    console.log('✅ Successfully created DQ Beliefs guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: journey`);
    console.log(`   Guide Type: Journey`);
  }
}

createDQBeliefsGuide().catch(console.error);

