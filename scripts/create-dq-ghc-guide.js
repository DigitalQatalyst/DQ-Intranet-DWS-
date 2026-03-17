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

const DQ_GHC_SUMMARY = `The GHC is your guide to working, learning, and growing at DQ. It helps you collaborate, make smart decisions, and create real value with your team. Think of it as the blueprint for everything we do here at DQ.`;

const DQ_GHC_BODY = `# DQ Golden Honeycomb of Competencies (GHC)

## Introduction

Welcome to DigitalQatalyst (DQ)! 🎉

Starting at a new company can feel overwhelming. But here's the secret at DQ: everything has a system, a clear guide that shows you how we think, work, and create value. That system is the **Golden Honeycomb of Competencies (GHC)**.

Think of it as your map, compass, and toolkit all in one. It's designed to help you:

- Work together seamlessly with your team
- Make decisions that actually move the needle
- Solve problems creatively and confidently
- Deliver real, measurable value to our clients

In short, the GHC is your guide to thriving as a Qatalyst, understanding how DQ operates, and why it matters.

## Why the GHC Exists

DQ tackles complex digital challenges across industries. Without alignment, things can get messy fast. The GHC exists to make everything coherent, purposeful, and impactful:

- Everyone knows why we do what we do
- Teams can collaborate effortlessly
- Work moves forward with clarity and intention
- Learning and improvement are built into every task

Put simply, the GHC is the reason DQ feels cohesive, agile, and unstoppable, even in fast-changing environments.

## How the GHC Shapes You

The GHC isn't just theory — it shapes your daily work, your choices, and your impact. Here's how:

### 1️⃣ Grow Yourself Every Day

- Embrace learning and feedback — every experience is an opportunity to improve
- Stay calm, present, and accountable under pressure
- Turn challenges into moments of growth

### 2️⃣ Work Smart and Lean

- Focus on what truly matters — eliminate distractions
- Take initiative — don't wait to be told
- Sweat the small details — they often make the biggest difference

### 3️⃣ Create Value with Others

- Collaborate openly — intelligence scales when we work together
- Design solutions with empathy for clients
- Build trust through honesty, clarity, and consistency

Think of these as practical superpowers you can start using from day one.

## How Work Flows at DQ

At DQ, work doesn't happen in silos. Everything moves through connected value streams, from ideas to delivery to lasting impact.

Here's what that means for you:

- **Agile task management** – know exactly what to do, who owns it, and why it matters
- **Guided governance** – direction and quality without slowing down
- **End-to-end collaboration** – your work links directly to client outcomes

By understanding these flows, you'll see how your contribution fits into the bigger picture, making your role meaningful every day.

## Your Role as a Qatalyst

You don't need to master everything at once. Start small, and keep the Honeycomb in mind:

- Ask yourself: "Does this task create real value?"
- Look for opportunities to collaborate and help others
- Apply GHC principles to make confident decisions
- Notice how your work connects to larger projects and outcomes

The GHC is called a Honeycomb for a reason — every part is connected, and every Qatalyst strengthens the whole. The more you live it, the more impactful, confident, and strategic you'll become.

**Pro Tip:**
Keep this Honeycomb in mind as you start your journey. Whether it's a sprint, a client call, or a problem-solving session, your choices, actions, and mindset shape the DQ mission — transaction by transaction, life by life, organisation by organisation.`;

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

async function createDQGHCGuide() {
  console.log('📝 Creating DQ GHC guide...\n');

  const slug = 'dq-ghc';
  const title = 'DQ Golden Honeycomb of Competencies (GHC)';

  // Check if it already exists by slug
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title, slug')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    console.log('⚠️  DQ GHC guide already exists:');
    console.log(`   - ${existing.title} (ID: ${existing.id}, Slug: ${existing.slug})`);
    console.log('\nUpdating existing guide...');
    
    const guideId = existing.id;
    const imageUrl = getUniqueImage(guideId, title);
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: title,
        summary: DQ_GHC_SUMMARY,
        body: DQ_GHC_BODY,
        domain: 'Strategy',
        sub_domain: 'ghc',
        guide_type: 'Framework',
        unit: 'Stories',
        location: 'DXB',
        hero_image_url: imageUrl,
        status: 'Approved',
        last_updated_at: new Date().toISOString()
      })
      .eq('id', guideId);

    if (updateError) {
      console.error(`❌ Error updating: ${updateError.message}`);
      process.exit(1);
    } else {
      console.log(`✅ Successfully updated DQ GHC guide!`);
      console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
    }
    return;
  }

  // Create new guide
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: DQ_GHC_SUMMARY,
    body: DQ_GHC_BODY,
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
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log('✅ Successfully created DQ GHC guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Slug: ${data[0].slug}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: ghc`);
    console.log(`   Guide Type: Framework`);
    console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
  }
}

createDQGHCGuide().catch(console.error);

