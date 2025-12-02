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

const AGILE_6XD_SUMMARY = `The Agile 6xD Framework is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process. Built on Six Essential Perspectives that answer fundamental questions every organisation must face on its path to relevance in the digital age.`;

const AGILE_6XD_BODY = `# Agile 6xD (Products)

Transformation isn't something we talk about.

It's something we build.

The Agile 6xD Framework is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.

It's built on Six Essential Perspectives — each answering a fundamental question every organisation must face on its path to relevance in the digital age.

## The 6 Digital Perspectives

### 1. Digital Economy (DE)

**Why should organisations change?**

Helps leaders understand shifts in market logic, customer behaviour, and value creation — identifying the forces that drive transformation.

### 2. Digital Cognitive Organisation (DCO)

**Where are organisations headed?**

Defines the future enterprise — intelligent, adaptive, and orchestrated — capable of learning, responding, and coordinating seamlessly across people, systems, and decisions.

### 3. Digital Business Platforms (DBP)

**What must be built to enable transformation?**

Focuses on the modular, integrated, and data-driven architectures that unify operations and make transformation scalable and resilient.

### 4. Digital Transformation 2.0 (DT2.0)

**How should transformation be designed and deployed?**

Positions transformation as a discipline of design and orchestration, introducing the methods, flows, and governance needed to make change repeatable and outcome-driven.

### 5. Digital Worker & Workspace (DW:WS)

**Who delivers the change, and how do they work?**

Centers on people and their environments — redefining roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively.

### 6. Digital Accelerators (Tools)

**When will value be realised, and how fast, effective, and aligned will it be?**

Drives execution speed and alignment through tools, systems, and strategies that compress time-to-value and scale measurable impact.

## The Transformation Compass

Together, these six perspectives form a transformation compass — a blueprint that helps organisations move with clarity, discipline, and speed.

They help organisations not only design for change, but live it — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.`;

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de',
    '1507003211169-0a1dd7228fbb', '1516321318469-88ce825ef878', '1556761175-597af40f565e',
    '1556073709-9fae23b835b2', '1557804816-2b21ebcb1977', '1559827261-9cbd8d3600a9',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function createAgile6xDProductsGuide() {
  console.log('📝 Creating Agile 6xD (Products) guide...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%Agile 6xD%Products%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  Agile 6xD (Products) guide already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'Agile 6xD Products');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'Agile 6xD (Products)',
        summary: AGILE_6XD_SUMMARY,
        body: AGILE_6XD_BODY,
        domain: 'Strategy',
        sub_domain: 'digital-framework,6xd',
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
      console.log(`✅ Successfully updated Agile 6xD (Products) guide!`);
    }
    return;
  }

  // Create new guide
  const slug = 'agile-6xd-products';
  const title = 'Agile 6xD (Products)';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: AGILE_6XD_SUMMARY,
    body: AGILE_6XD_BODY,
    domain: 'Strategy',
    sub_domain: 'digital-framework,6xd',
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
    console.log('✅ Successfully created Agile 6xD (Products) guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: digital-framework,6xd`);
    console.log(`   Guide Type: Framework`);
  }
}

createAgile6xDProductsGuide().catch(console.error);

