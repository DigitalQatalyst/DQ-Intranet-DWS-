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

const DQ_PRODUCTS_SUMMARY = `DQ is transitioning from being a service-oriented organisation to a product-led organisation. Our portfolio includes platforms like DTMP, DTO4T, TMaaS, DTMA, and DGPRC, ensuring holistic transformation success.`;

const DQ_PRODUCTS_BODY = `# DQ Products: Overview

## DQ: A Product-led Organisation

DQ is transitioning from being a service-oriented organisation to a product-led organisation. Our portfolio includes platforms like DTMP for managing data and analytics, DTO4T for AI-driven acceleration, and TMaaS for flexible transformation solutions. We also provide a Digital Transformation Management Academy and a governance-focused DGPRC platform, ensuring holistic transformation success. Explore our frameworks to enhance agility, scalability, and compliance in your organization. Together, let's shape the future of digital excellence.

## 1. DTMP

Digital Transformation Management Platform (DTMP) creates a seamless digital ecosystem with a centralized platform to manage data, processes, and analytics.

| Feature | Description |
|---------|-------------|
| Data Storage | Robust and scalable data storage to keep your organization's data secure and accessible. |
| Analytics | Leverage AI for generating advanced insights and driving informed decision-making. |

## 2. DTO4T

Digital Twin of Organization for Transformation (DTO4T) is an AI-driven platform for accelerating digital transformation by creating digital twins of organizations.

| Feature | Description |
|---------|-------------|
| AI-Driven Acceleration | Speeds up transformations through automated processes. |
| Agile Approach | Enables flexible workflows for scaling at pace. |
| Digital Blueprint | Provides a roadmap for seamless digital transformation. |

## 3. TMaaS

Transformation Management as a Service (TMaaS) is flexible, on-demand service empowering organizations to manage digital transformation with expert assistance at scalable costs.

| Feature | Description |
|---------|-------------|
| Customization Options | Tailored solutions for unique business needs. |
| AI-Powered Assistance | Automated workflows for efficiency and precision. |
| Subscription Models | Flexible pricing to scale based on usage. |

## 4. DTMA

Digital Transformation Management Academy (DTMA) is designed to upskill teams with tailored training built-in to become digital leaders with expertise, certifications, and innovative tools.

| Feature | Description |
|---------|-------------|
| Specialized Training | Programs tailored for every level of expertise. |
| AI Integration | Integration of cutting-edge tools for enhanced learning. |

## 5. D2GPRC

Data-Driven Governance, Performance, Risk, and Compliance (DGPRC) is a data-driven product that empowers governance, risk, and compliance management for smart decision-making.

| Feature | Description |
|---------|-------------|
| RegTech | Advanced compliance processes and reporting tools. |
| AI-Powered DataTech | Data-driven insights for proactive risk management. |
| Governance | Align organizational policies with data-driven decisions. |`;

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
    '1553877522-25bcdc54f2de', '1507003211169-0a1dd7228fbb',
  ];
  const photoId = photoIds[hashNum % photoIds.length];
  const uniqueParam = hash.substring(0, 6);
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=400&fit=crop&q=80&u=${uniqueParam}`;
}

async function updateDQProductsOverview() {
  console.log('📝 Updating/Creating DQ Products: Overview guide...\n');

  // Check if it already exists (check for variations)
  const { data: existing } = await supabase
    .from('guides')
    .select('id, title')
    .or('title.ilike.%DQ Products%,title.ilike.%Products Overview%')
    .eq('status', 'Approved');

  if (existing && existing.length > 0) {
    console.log('⚠️  Found existing guide(s):');
    existing.forEach(g => console.log(`   - ${g.title} (ID: ${g.id})`));
    console.log('\nUpdating existing guide...');
    
    const guideId = existing[0].id;
    const imageUrl = getUniqueImage(guideId, 'DQ Products Overview');
    
    const { error: updateError } = await supabase
      .from('guides')
      .update({
        title: 'DQ Products: Overview',
        summary: DQ_PRODUCTS_SUMMARY,
        body: DQ_PRODUCTS_BODY,
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
      console.log(`✅ Successfully updated DQ Products: Overview guide!`);
      console.log(`   ID: ${guideId}`);
    }
    return;
  }

  // Create new guide
  const slug = 'dq-products-overview';
  const title = 'DQ Products: Overview';
  const guideId = `temp-${Date.now()}`;
  const imageUrl = getUniqueImage(guideId, title);

  const newGuide = {
    title: title,
    slug: slug,
    summary: DQ_PRODUCTS_SUMMARY,
    body: DQ_PRODUCTS_BODY,
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
    console.log('✅ Successfully created DQ Products: Overview guide!');
    console.log(`   ID: ${data[0].id}`);
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Domain: Strategy`);
    console.log(`   Sub-Domain: ghc`);
    console.log(`   Guide Type: Framework`);
  }
}

updateDQProductsOverview().catch(console.error);

