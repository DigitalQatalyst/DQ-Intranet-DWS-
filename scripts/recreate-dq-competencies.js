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

const DQ_COMPETENCIES_SUMMARY = `Discover DQ's core competencies—Agile, Culture, Technical, and Framework—that empower organizations to innovate, adapt, and thrive in the digital economy.`;

const DQ_COMPETENCIES_BODY = `# DQ Competencies

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
- **DQ Product Architecture:** Transformation playbooks, blueprints, and tools that help organizations evolve into Digital Cognitive Organisations`;

function getWorkingImage(guideId, title) {
  // Use a known working Unsplash photo ID
  // This is a business/team collaboration image that should work
  const photoId = '1522071820081-009f0129c71c'; // Team collaboration image
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const uniqueParam = hash.substring(0, 8);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function recreateDQCompetencies() {
  console.log('🔄 Deleting and recreating DQ Competencies with working image...\n');

  // Find and delete existing DQ Competencies
  const { data: existing, error: findError } = await supabase
    .from('guides')
    .select('id, title')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies');

  if (findError) {
    console.error('❌ Error finding guide:', findError);
    return;
  }

  if (existing && existing.length > 0) {
    console.log(`Found ${existing.length} existing DQ Competencies guide(s) to delete:\n`);
    
    for (const guide of existing) {
      console.log(`Deleting "${guide.title}" (ID: ${guide.id})...`);
      
      const { error: deleteError } = await supabase
        .from('guides')
        .delete()
        .eq('id', guide.id);

      if (deleteError) {
        console.error(`   ❌ Error: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Deleted successfully`);
      }
    }
  } else {
    console.log('No existing DQ Competencies found to delete.');
  }

  // Create new guide with working image
  console.log(`\n📝 Creating new DQ Competencies guide...\n`);
  
  const slug = 'dq-competencies';
  const title = 'DQ Competencies';
  const tempId = `temp-${Date.now()}`;
  const imageUrl = getWorkingImage(tempId, title);

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

  console.log(`Guide details:`);
  console.log(`   Title: ${newGuide.title}`);
  console.log(`   Domain: ${newGuide.domain}`);
  console.log(`   Sub-Domain: ${newGuide.sub_domain}`);
  console.log(`   Image URL: ${imageUrl}`);
  console.log(`   Image Photo ID: 1522071820081-009f0129c71c (known working image)`);

  const { data, error } = await supabase
    .from('guides')
    .insert(newGuide)
    .select();

  if (error) {
    console.error('❌ Error creating guide:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log(`\n✅ Successfully created DQ Competencies guide!`);
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Image URL: ${data[0].hero_image_url}`);
    
    // Update with correct unique parameter using the actual ID
    const actualId = data[0].id;
    const finalImageUrl = getWorkingImage(actualId, title);
    
    console.log(`\n🔄 Updating image URL with actual guide ID...`);
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        hero_image_url: finalImageUrl,
        last_updated_at: new Date().toISOString()
      })
      .eq('id', actualId);

    if (updateError) {
      console.error(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Image URL updated: ${finalImageUrl}`);
    }
  }

  // Final verification
  console.log(`\n📊 Final verification:\n`);
  const { data: verify } = await supabase
    .from('guides')
    .select('id, title, hero_image_url')
    .eq('status', 'Approved')
    .eq('title', 'DQ Competencies')
    .single();

  if (verify) {
    console.log(`✅ DQ Competencies guide exists`);
    console.log(`   ID: ${verify.id}`);
    console.log(`   Image URL: ${verify.hero_image_url}`);
    console.log(`   Image is valid: ${verify.hero_image_url?.startsWith('http') ? '✅' : '❌'}`);
    console.log(`   Uses working photo ID: ${verify.hero_image_url?.includes('1522071820081-009f0129c71c') ? '✅' : '❌'}`);
  }
}

recreateDQCompetencies().catch(console.error);

