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

const DQ_PRODUCTS_BODY = `# DQ Products

<div class="feature-box">

## DQ: A Product-led Organisation

DQ is transitioning from a service-oriented organization to a product-led organization. Our portfolio includes platforms designed to manage data and analytics, accelerate AI-driven transformation, provide flexible transformation solutions, deliver specialized training, and ensure governance compliance.

Together, these products ensure holistic transformation success, enhancing agility, scalability, and compliance in your organization.

</div>

<div class="feature-box">

## 1. DTMP

**Digital Transformation Management Platform**

DTMP is a unified platform that enables organisations to plan, track, and manage digital transformation with clarity. It integrates portfolios, analytics, workflows, and compliance into a single system, giving leaders end-to-end visibility and enabling teams to execute transformation with speed and precision.

</div>

<div class="feature-box">

## 2. DTMI

**Digital Transformation Management Insights**

DTMI is a curated insights and intelligence platform that distils the most relevant thinking in digital transformation. It provides structured analysis, thought leadership, and actionable perspectives that help organisations stay ahead of market shifts and make informed strategic decisions.

</div>

<div class="feature-box">

## 3. DTO4T

**Digital Twin of Organisation for Transformation**

DTO4T is an AI-powered diagnostic engine that creates a digital twin of an organisation. It evaluates maturity, reveals gaps, recommends targeted improvements, and automates transformation documentation — enabling leaders to make precise, data-driven transformation decisions.

</div>

<div class="feature-box">

## 4. DTMA

**Digital Transformation Management Academy**

DTMA is a capability-building academy designed for the digital age. It delivers structured, role-specific learning and practical skills development, ensuring individuals and teams are fully equipped to design, deliver, and sustain digital transformation.

</div>

<div class="feature-box">

## 5. DTMB

**Digital Transformation Management Book**

DTMB is a comprehensive thought-leadership product that simplifies the complexity of digital transformation. It provides clear models, frameworks, and strategic perspectives that guide organizations in building future-ready operating systems and evolving into Digital Cognitive Organizations (DCOs).

</div>

<div class="feature-box">

## 6. TMaaS

**Transformation Management Service as a Service**

TMaaS is a low-cost, architecture-led marketplace for digital transformation initiatives using AI-powered, ready-to-launch blueprints — accelerating impact, reducing cost, and ensuring scalability.

</div>`;

async function updateDQProductsContent() {
  console.log('📝 Updating DQ Products content...\n');

  const slug = 'dq-products';

  // Find the guide
  const { data: existing, error: findError } = await supabase
    .from('guides')
    .select('id, slug, title')
    .eq('slug', slug)
    .maybeSingle();

  if (findError) {
    console.error('❌ Error finding guide:', findError.message);
    process.exit(1);
  }

  if (!existing) {
    console.error('❌ DQ Products guide not found');
    process.exit(1);
  }

  // Update the guide
  const { error: updateError } = await supabase
    .from('guides')
    .update({
      body: DQ_PRODUCTS_BODY,
      last_updated_at: new Date().toISOString()
    })
    .eq('id', existing.id);

  if (updateError) {
    console.error('❌ Error updating guide:', updateError.message);
    process.exit(1);
  }

  console.log('✅ Successfully updated DQ Products content!');
  console.log(`   Guide is now available at: /marketplace/guides/${slug}`);
}

updateDQProductsContent().catch(console.error);

