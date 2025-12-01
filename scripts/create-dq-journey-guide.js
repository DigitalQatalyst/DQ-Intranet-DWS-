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

const DQ_JOURNEY_SUMMARY = `Welcome to DQ Journey! Discover how DQ started in 2015, evolved into a global digital transformation leader, achieved milestones across multiple countries, and aspires to scale to 10,000 accounts.`;

const DQ_JOURNEY_BODY = `# DQ Journey

Welcome to DQ Journey!

## How DQ Started?

Founded in 2015 in Dubai by Dr. Stephane Niango, DQ was driven by the conviction that many organizations were not leveraging a technical approach to solve inefficiencies in technology. Dr. Niango believed that when technology is implemented effectively, it can greatly enhance our quality of life. This vision, refined through his PhD research, became the foundation of DQ's core values.

## Evolution of DQ

DQ's evolution story highlights its growth from securing clients in multiple countries to expanding globally and transitioning from a service-based to a product-focused business. With a strategy aimed at scaling to 10,000 accounts, DQ is positioning itself as a leader in digital transformation. Ultimately, DQ seeks strategic exits or partnerships to maximize its value.

## DQ's Achievements

In the first 12 months after its creation, DQ successfully surpassed a benchmark of 10 clients, with these clients spanning across three countries: UAE, Qatar, and Saudi Arabia. Over the next five years, DQ's client base grew to 50 clients. By 2023, the company's delivery operations expanded further, reaching over five countries.

## DQ's Aspirations

DQ aims to build market trust with refined products and strategic clients, scaling globally from 400 to 10,000 accounts. The focus is on quick feature deployment, bespoke delivery, and global expansion. By 2028, DQ plans to reach 2,000 accounts, enhancing appeal, and by 2029, to solidify global recognition with 4,000 accounts. The ultimate goal is to position DQ for a strategic exit or partnership at 10,000 accounts.`;

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

async function createDQJourneyGuide() {
  console.log('📝 Creating DQ Journey guide...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%DQ Journey%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  DQ Journey guide already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    // Update the first one
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'DQ Journey');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'DQ Journey',
        summary: DQ_JOURNEY_SUMMARY,
        body: DQ_JOURNEY_BODY,
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
      console.log(`✅ Successfully updated DQ Journey guide!`);
    }
    return;
  }

  // Create new guide
  const slug = 'dq-journey';
  const title = 'DQ Journey';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: DQ_JOURNEY_SUMMARY,
    body: DQ_JOURNEY_BODY,
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
    console.log('✅ Successfully created DQ Journey guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: journey`);
    console.log(`   Guide Type: Journey`);
  }
}

createDQJourneyGuide().catch(console.error);

