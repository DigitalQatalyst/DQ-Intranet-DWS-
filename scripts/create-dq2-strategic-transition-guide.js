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

const DQ2_TRANSITION_SUMMARY = `Explore DigitalQatalyst's bold journey to lead the $20 trillion global digital economy by 2030. Our phased strategy empowers businesses to transition into Digital Cognitive Organizations (DCOs), leveraging cutting-edge technology, seamless operations, and personalized solutions to achieve global competitiveness.`;

const DQ2_TRANSITION_BODY = `# DQ2.0 Strategic Transition

Explore DigitalQatalyst's bold journey to lead the $20 trillion global digital economy by 2030. Our phased strategy empowers businesses to transition into Digital Cognitive Organizations (DCOs), leveraging cutting-edge technology, seamless operations, and personalized solutions to achieve global competitiveness. Through structured growth and innovation, DQ2.0 is shaping the future of digital transformation.

## 2021 – Phase 00: Dare 2 Venture

**Significance:** This foundational year marked the transition from DQ1.0 to DQ2.0, where the groundwork for global ambitions was established.

**Primary Focus:** Laying the foundation for DQ2.0's global ambitions by transitioning from an academic advisory boutique to a global digital transformation provider.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Early Product Partners (RAI) |
| KRI 02 | Product Impact | Messaging Impact with DTMF and SPL |
| KRI 03 | Squad | Volume Ramp-Up for Small Organizations |

## 2022 – Phase 01: Probe 2 Pinpoint

**Significance:** This year focused on refining strategies and diagnosing opportunities to align products with market needs.

**Primary Focus:** Refining DQ2.0's strategies by diagnosing key opportunities for growth and identifying client needs.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Early Product Deals (iPL + SPL) |
| KRI 02 | Product Impact | Enhanced Product Messaging using DTMF |
| KRI 03 | Squad | Steady Ramp-Down to concentrate resources |

## 2023 – Phase 02: Shock 2 Repell

**Significance:** Critical for preparing for scalability, this phase focused on resolving inefficiencies and restructuring the product portfolio.

**Primary Focus:** Preparing for large-scale operations by resolving inefficiencies and structuring DQ2.0's product portfolio.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Established Boundaries (SPL + DFSA) |
| KRI 02 | Product Impact | Structured Portfolio of Eight Core Products |
| KRI 03 | Squad | Accelerated Clean-Up with Base Squads |

## 2024 – Phase 03: Explore 2 Rebuild

**Significance:** Positioned DQ2.0 for market penetration by unveiling key products and delivering value through high-quality tools.

**Primary Focus:** Positioning DQ2.0 for market penetration through the introduction of key products and robust foundational tools.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Products Unveiled (DFSA + SAIB) |
| KRI 02 | Product Impact | Portfolio End Value through Deploy Tools |
| KRI 03 | Squad | Quality Missionaries to ensure high-quality delivery |

## 2025 – Phase 04: Cement 2 Rebuild

**Significance:** Strengthened market trust by focusing on delivering refined products to key clients.

**Primary Focus:** Building market trust with refined products and gaining the confidence of strategic clients.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Trusted Accounts (10x) |
| KRI 02 | Product Impact | Refined Feature Adoption |
| KRI 03 | Squad | Elite Missionaries for bespoke delivery |

## 2026 – Phase 05: Open 2 Scale

**Significance:** This phase began scaling operations globally by onboarding 80 accounts, supported by rapid feature deployment.

**Primary Focus:** Expanding DQ2.0's footprint globally by scaling up to 80 accounts.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Scaled Accounts (80x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2027 – Phase 06: Clone 2 Expand

**Significance:** Continued global expansion, focusing on scaling to 400 accounts while ensuring quality delivery.

**Primary Focus:** Pursuing aggressive global expansion to grow the client base to 400 accounts.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Scaled Accounts (400x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2028 – Phase 07: Polish 2 Appeal

**Significance:** Enhanced global appeal by refining offerings and targeting 2,000 accounts.

**Primary Focus:** Refining products and services to enhance global appeal and competitiveness.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Scaled Accounts (2000x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2029 – Phase 08: Sell 2 Recognize

**Significance:** Solidified global recognition as a digital transformation leader, supported by rapid feature deployment and a strong client base.

**Primary Focus:** Achieving global recognition as a leader in digital transformation with a significant client base.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Scaled Accounts (4000x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |

## 2030 – Phase 09: Sell 2 Exit

**Significance:** Positioned DQ2.0 for strategic exit opportunities or partnerships, having scaled to 10,000 accounts.

**Primary Focus:** Finalizing DQ2.0's long-term strategy by maximizing value through strategic exits or partnerships.

| KRI | Focus Area | Description |
|-----|------------|-------------|
| KRI 01 | Clients | Scaled Accounts (10000x) |
| KRI 02 | Product Impact | Quick Feature Deployment |
| KRI 03 | Squad | Volume Ramp-Up for Large Organizations |`;

function getUniqueImage(guideId, title) {
  const hash = createHash('md5').update(`${guideId}-${title}`).digest('hex');
  const hashNum = parseInt(hash.substring(0, 8), 16);
  const photoIds = [
    '1552664730-d307ca884978', '1522071820081-009f0129c71c', '1551288049-bebda4e38f71',
    '1454165804606-c3d57bc86b40', '1460925895917-afdab827c52f', '1556742049-0cfed4f6a45d',
    '1557800636-23f87b1063e4', '1521737854947-0b219b6c2c94', '1553877522-25bcdc54f2de',
    '1507003211169-0a1dd7228fbb', '1516321318469-88ce825ef878', '1556761175-597af40f565e',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function createDQ2StrategicTransitionGuide() {
  console.log('📝 Creating DQ2.0 Strategic Transition guide...\n');

  // Check if it already exists
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .ilike('title', '%DQ2.0%Strategic%Transition%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  DQ2.0 Strategic Transition guide already exists:');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'DQ2.0 Strategic Transition');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'DQ2.0 Strategic Transition',
        summary: DQ2_TRANSITION_SUMMARY,
        body: DQ2_TRANSITION_BODY,
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
      console.log(`✅ Successfully updated DQ2.0 Strategic Transition guide!`);
    }
    return;
  }

  // Create new guide
  const slug = 'dq2-strategic-transition';
  const title = 'DQ2.0 Strategic Transition';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: DQ2_TRANSITION_SUMMARY,
    body: DQ2_TRANSITION_BODY,
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
    console.log('✅ Successfully created DQ2.0 Strategic Transition guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: journey`);
    console.log(`   Guide Type: Journey`);
  }
}

createDQ2StrategicTransitionGuide().catch(console.error);

