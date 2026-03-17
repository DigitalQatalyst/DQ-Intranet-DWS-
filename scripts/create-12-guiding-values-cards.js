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

// The 12 Guiding Values with their details
const GUIDING_VALUES = [
  // Mantra 01: Self-Development
  {
    slug: 'dq-competencies-emotional-intelligence',
    title: 'Emotional Intelligence',
    mantra: 'Self-Development',
    mantraNumber: 1,
    description: 'We remain calm, aware, and accountable under pressure.',
    body: `# Emotional Intelligence

Emotional Intelligence is a core guiding value within DQ's House of Values, part of the **Self-Development Mantra**.

## What It Means

At DQ, Emotional Intelligence means we remain **calm, aware, and accountable under pressure**. It's about recognizing and managing our emotions, understanding the emotions of others, and using this awareness to guide our thinking and behavior.

## Why It Matters

In a fast-paced digital transformation environment, pressure is constant. Emotional Intelligence helps us:
- **Stay Calm**: Maintain composure when facing challenges or tight deadlines
- **Stay Aware**: Recognize our emotional state and its impact on our work
- **Stay Accountable**: Take responsibility for our reactions and responses

## How We Practice It

- We pause before reacting to understand our emotional state
- We actively listen to understand others' perspectives and feelings
- We manage stress constructively rather than letting it control us
- We create space for others to express concerns and emotions
- We use emotional awareness to make better decisions

## Connection to DQ Competencies

Emotional Intelligence is foundational to the **Self-Development Mantra**, which reinforces that growth is not passive—it's a daily responsibility. This value helps us grow ourselves and others through every experience.

## Learn More

For a comprehensive understanding of how Emotional Intelligence fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-growth-mindset',
    title: 'Growth Mindset',
    mantra: 'Self-Development',
    mantraNumber: 1,
    description: 'We use feedback and failure to drive personal and collective evolution.',
    body: `# Growth Mindset

Growth Mindset is a core guiding value within DQ's House of Values, part of the **Self-Development Mantra**.

## What It Means

At DQ, Growth Mindset means we use **feedback and failure to drive personal and collective evolution**. We believe that abilities and intelligence can be developed through dedication, hard work, and learning from experiences.

## Why It Matters

In a rapidly changing digital landscape, the ability to learn and adapt is essential. Growth Mindset helps us:
- **Embrace Challenges**: See obstacles as opportunities to grow
- **Learn from Failure**: Use setbacks as valuable learning experiences
- **Value Effort**: Recognize that effort is the path to mastery
- **Accept Feedback**: Welcome constructive criticism as a tool for improvement

## How We Practice It

- We actively seek feedback from peers, leaders, and clients
- We view mistakes as learning opportunities, not failures
- We celebrate the process of learning, not just outcomes
- We continuously seek new skills and knowledge
- We help others develop their potential

## Connection to DQ Competencies

Growth Mindset is foundational to the **Self-Development Mantra**, which reinforces that growth is not passive—it's a daily responsibility. This value helps us grow ourselves and others through every experience.

## Learn More

For a comprehensive understanding of how Growth Mindset fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  // Mantra 02: Lean Working
  {
    slug: 'dq-competencies-purpose',
    title: 'Purpose',
    mantra: 'Lean Working',
    mantraNumber: 2,
    description: 'We stay connected to why the work matters.',
    body: `# Purpose

Purpose is a core guiding value within DQ's House of Values, part of the **Lean Working Mantra**.

## What It Means

At DQ, Purpose means we **stay connected to why the work matters**. Every task, project, and initiative is anchored in understanding the "why" behind what we do—the impact it creates and the value it delivers.

## Why It Matters

Purpose provides direction, motivation, and clarity. It helps us:
- **Stay Focused**: Align our efforts with meaningful outcomes
- **Make Better Decisions**: Choose actions that serve the greater goal
- **Maintain Motivation**: Find meaning even in challenging work
- **Create Impact**: Ensure our work contributes to something larger

## How We Practice It

- We start every project by clarifying its purpose and desired impact
- We regularly remind ourselves and our teams why our work matters
- We connect daily tasks to larger organizational goals
- We make decisions based on purpose, not just convenience
- We communicate the "why" behind our actions

## Connection to DQ Competencies

Purpose is part of the **Lean Working Mantra**, which emphasizes clarity, efficiency, and prompt outcomes. This value helps us pursue clarity, efficiency, and prompt outcomes in everything we do.

## Learn More

For a comprehensive understanding of how Purpose fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-perceptive',
    title: 'Perceptive',
    mantra: 'Lean Working',
    mantraNumber: 2,
    description: 'We anticipate needs and make thoughtful choices.',
    body: `# Perceptive

Perceptive is a core guiding value within DQ's House of Values, part of the **Lean Working Mantra**.

## What It Means

At DQ, Perceptive means we **anticipate needs and make thoughtful choices**. We pay attention to patterns, signals, and context to understand what's needed before it's explicitly asked.

## Why It Matters

Being perceptive helps us:
- **Prevent Problems**: Identify issues before they escalate
- **Add Value**: Provide solutions before they're requested
- **Work Efficiently**: Understand context to make better decisions
- **Build Trust**: Show that we're engaged and thoughtful

## How We Practice It

- We observe patterns and trends in our work and industry
- We listen actively to understand underlying needs
- We ask clarifying questions to fully understand context
- We think ahead about potential challenges and opportunities
- We make decisions based on comprehensive understanding

## Connection to DQ Competencies

Perceptive is part of the **Lean Working Mantra**, which emphasizes clarity, efficiency, and prompt outcomes. This value helps us pursue clarity, efficiency, and prompt outcomes in everything we do.

## Learn More

For a comprehensive understanding of how Perceptive fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-proactive',
    title: 'Proactive',
    mantra: 'Lean Working',
    mantraNumber: 2,
    description: 'We take initiative and move things forward.',
    body: `# Proactive

Proactive is a core guiding value within DQ's House of Values, part of the **Lean Working Mantra**.

## What It Means

At DQ, Proactive means we **take initiative and move things forward**. We don't wait to be told what to do—we identify opportunities, address challenges, and drive progress.

## Why It Matters

Being proactive helps us:
- **Create Momentum**: Keep projects and initiatives moving forward
- **Solve Problems Early**: Address issues before they become critical
- **Add Value**: Contribute beyond our defined responsibilities
- **Build Leadership**: Demonstrate ownership and initiative

## How We Practice It

- We identify and act on opportunities without waiting for direction
- We address potential problems before they escalate
- We take ownership of outcomes, not just tasks
- We communicate proactively about progress and challenges
- We help others move forward by removing blockers

## Connection to DQ Competencies

Proactive is part of the **Lean Working Mantra**, which emphasizes clarity, efficiency, and prompt outcomes. This value helps us pursue clarity, efficiency, and prompt outcomes in everything we do.

## Learn More

For a comprehensive understanding of how Proactive fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-perseverance',
    title: 'Perseverance',
    mantra: 'Lean Working',
    mantraNumber: 2,
    description: 'We push through setbacks with focus.',
    body: `# Perseverance

Perseverance is a core guiding value within DQ's House of Values, part of the **Lean Working Mantra**.

## What It Means

At DQ, Perseverance means we **push through setbacks with focus**. We maintain commitment and determination even when facing obstacles, challenges, or failures.

## Why It Matters

Perseverance helps us:
- **Overcome Obstacles**: Persist through challenges that would stop others
- **Achieve Goals**: Stay committed to outcomes despite setbacks
- **Build Resilience**: Develop the capacity to bounce back from difficulties
- **Deliver Results**: Ensure we complete what we start

## How We Practice It

- We maintain focus on goals even when facing obstacles
- We adapt our approach when needed, but don't give up on outcomes
- We learn from setbacks and use them to improve
- We support others in persisting through challenges
- We celebrate persistence and resilience

## Connection to DQ Competencies

Perseverance is part of the **Lean Working Mantra**, which emphasizes clarity, efficiency, and prompt outcomes. This value helps us pursue clarity, efficiency, and prompt outcomes in everything we do.

## Learn More

For a comprehensive understanding of how Perseverance fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-precision',
    title: 'Precision',
    mantra: 'Lean Working',
    mantraNumber: 2,
    description: 'We sweat the details that drive performance.',
    body: `# Precision

Precision is a core guiding value within DQ's House of Values, part of the **Lean Working Mantra**.

## What It Means

At DQ, Precision means we **sweat the details that drive performance**. We pay attention to accuracy, quality, and excellence in everything we do.

## Why It Matters

Precision helps us:
- **Deliver Quality**: Ensure our work meets high standards
- **Build Trust**: Demonstrate attention to detail and care
- **Avoid Errors**: Prevent mistakes that could cause problems
- **Create Excellence**: Go beyond "good enough" to achieve excellence

## How We Practice It

- We pay attention to details that impact quality and performance
- We verify our work for accuracy and completeness
- We set high standards and hold ourselves accountable
- We continuously improve our processes and outputs
- We take pride in delivering precise, high-quality work

## Connection to DQ Competencies

Precision is part of the **Lean Working Mantra**, which emphasizes clarity, efficiency, and prompt outcomes. This value helps us pursue clarity, efficiency, and prompt outcomes in everything we do.

## Learn More

For a comprehensive understanding of how Precision fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  // Mantra 03: Value Co-Creation
  {
    slug: 'dq-competencies-customer',
    title: 'Customer',
    mantra: 'Value Co-Creation',
    mantraNumber: 3,
    description: 'We design with empathy for those we serve.',
    body: `# Customer

Customer is a core guiding value within DQ's House of Values, part of the **Value Co-Creation Mantra**.

## What It Means

At DQ, Customer means we **design with empathy for those we serve**. We put ourselves in our customers' shoes, understand their needs, challenges, and aspirations, and create solutions that truly serve them.

## Why It Matters

Customer focus helps us:
- **Create Value**: Deliver solutions that truly meet customer needs
- **Build Relationships**: Develop trust and loyalty through understanding
- **Drive Innovation**: Identify opportunities by understanding customer pain points
- **Achieve Impact**: Ensure our work creates meaningful value for customers

## How We Practice It

- We actively listen to understand customer needs and challenges
- We design solutions with the customer experience in mind
- We seek feedback and incorporate it into our work
- We advocate for customers in our decision-making
- We measure success by customer value and satisfaction

## Connection to DQ Competencies

Customer is part of the **Value Co-Creation Mantra**, which emphasizes partnering with others to create greater impact together. This value helps us partner with others to create greater impact together.

## Learn More

For a comprehensive understanding of how Customer fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-learning',
    title: 'Learning',
    mantra: 'Value Co-Creation',
    mantraNumber: 3,
    description: 'We remain open, curious, and teachable.',
    body: `# Learning

Learning is a core guiding value within DQ's House of Values, part of the **Value Co-Creation Mantra**.

## What It Means

At DQ, Learning means we **remain open, curious, and teachable**. We continuously seek knowledge, embrace new ideas, and adapt based on what we discover.

## Why It Matters

Learning helps us:
- **Stay Relevant**: Keep up with rapidly changing technology and practices
- **Improve Performance**: Continuously enhance our skills and capabilities
- **Innovate**: Discover new approaches and solutions
- **Grow**: Develop personally and professionally

## How We Practice It

- We actively seek new knowledge and skills
- We ask questions and challenge assumptions
- We learn from successes and failures
- We share knowledge with others
- We remain humble and open to being wrong

## Connection to DQ Competencies

Learning is part of the **Value Co-Creation Mantra**, which emphasizes partnering with others to create greater impact together. This value helps us partner with others to create greater impact together.

## Learn More

For a comprehensive understanding of how Learning fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228fbb?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-collaboration',
    title: 'Collaboration',
    mantra: 'Value Co-Creation',
    mantraNumber: 3,
    description: 'We work as one, not in silos.',
    body: `# Collaboration

Collaboration is a core guiding value within DQ's House of Values, part of the **Value Co-Creation Mantra**.

## What It Means

At DQ, Collaboration means we **work as one, not in silos**. We break down barriers, share knowledge, and combine our strengths to achieve more together than we could alone.

## Why It Matters

Collaboration helps us:
- **Achieve More**: Combine diverse skills and perspectives for better outcomes
- **Solve Complex Problems**: Leverage collective intelligence
- **Build Relationships**: Strengthen connections across teams and functions
- **Create Synergy**: Generate outcomes greater than the sum of parts

## How We Practice It

- We actively seek input and perspectives from others
- We share information and knowledge freely
- We work across teams and functions without barriers
- We support each other's success
- We celebrate collective achievements

## Connection to DQ Competencies

Collaboration is part of the **Value Co-Creation Mantra**, which emphasizes partnering with others to create greater impact together. This value helps us partner with others to create greater impact together.

## Learn More

For a comprehensive understanding of how Collaboration fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-responsibility',
    title: 'Responsibility',
    mantra: 'Value Co-Creation',
    mantraNumber: 3,
    description: 'We own our decisions and their consequences.',
    body: `# Responsibility

Responsibility is a core guiding value within DQ's House of Values, part of the **Value Co-Creation Mantra**.

## What It Means

At DQ, Responsibility means we **own our decisions and their consequences**. We take accountability for our actions, choices, and their outcomes—both positive and negative.

## Why It Matters

Responsibility helps us:
- **Build Trust**: Demonstrate reliability and accountability
- **Learn and Grow**: Take ownership enables us to learn from outcomes
- **Create Clarity**: Clear ownership prevents confusion and gaps
- **Drive Results**: Accountability ensures commitments are met

## How We Practice It

- We take ownership of our commitments and outcomes
- We acknowledge mistakes and learn from them
- We don't blame others or make excuses
- We follow through on our promises
- We hold ourselves accountable to high standards

## Connection to DQ Competencies

Responsibility is part of the **Value Co-Creation Mantra**, which emphasizes partnering with others to create greater impact together. This value helps us partner with others to create greater impact together.

## Learn More

For a comprehensive understanding of how Responsibility fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    slug: 'dq-competencies-trust',
    title: 'Trust',
    mantra: 'Value Co-Creation',
    mantraNumber: 3,
    description: 'We build it through honesty, clarity, and consistency.',
    body: `# Trust

Trust is a core guiding value within DQ's House of Values, part of the **Value Co-Creation Mantra**.

## What It Means

At DQ, Trust means we **build it through honesty, clarity, and consistency**. Trust is the foundation of all our relationships—with colleagues, clients, and partners.

## Why It Matters

Trust helps us:
- **Enable Collaboration**: Trust allows us to work effectively together
- **Move Faster**: Trust eliminates the need for excessive oversight
- **Build Relationships**: Trust is the foundation of strong partnerships
- **Create Safety**: Trust enables open communication and risk-taking

## How We Practice It

- We communicate honestly and transparently
- We follow through on our commitments
- We are consistent in our words and actions
- We give others the benefit of the doubt
- We address issues directly and constructively

## Connection to DQ Competencies

Trust is part of the **Value Co-Creation Mantra**, which emphasizes partnering with others to create greater impact together. This value helps us partner with others to create greater impact together.

## Learn More

For a comprehensive understanding of how Trust fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`,
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

async function create12GuidingValuesCards() {
  console.log('📝 Creating 12 Guiding Values service cards...\n');

  for (const value of GUIDING_VALUES) {
    console.log(`📋 Processing: ${value.title} (${value.mantra})`);

    // Check if it already exists
    const { data: existing } = await supabase
      .from('guides')
      .select('id, title, slug')
      .eq('slug', value.slug)
      .maybeSingle();

    if (existing) {
      console.log(`⚠️  Already exists: ${existing.title} (ID: ${existing.id})`);
      console.log(`   Updating...\n`);
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          title: value.title,
          summary: `${value.title}: ${value.description} Part of DQ's House of Values, Mantra ${value.mantraNumber} (${value.mantra}).`,
          body: value.body,
          domain: 'Strategy',
          sub_domain: 'competencies',
          guide_type: null,
          unit: 'Stories',
          location: 'DXB',
          hero_image_url: value.imageUrl,
          status: 'Approved',
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`❌ Error updating: ${updateError.message}\n`);
      } else {
        console.log(`✅ Updated: ${value.title}\n`);
      }
      continue;
    }

    // Create new guide
    const newGuide = {
      title: value.title,
      slug: value.slug,
      summary: `${value.title}: ${value.description} Part of DQ's House of Values, Mantra ${value.mantraNumber} (${value.mantra}).`,
      body: value.body,
      domain: 'Strategy',
      sub_domain: 'competencies',
      guide_type: null,
      unit: 'Stories',
      location: 'DXB',
      hero_image_url: value.imageUrl,
      status: 'Approved'
    };

    const { data, error } = await supabase
      .from('guides')
      .insert(newGuide)
      .select();

    if (error) {
      console.error(`❌ Error creating ${value.title}:`, error.message);
      console.log('');
      continue;
    }

    if (data && data.length > 0) {
      console.log(`✅ Created: ${value.title}`);
      console.log(`   ID: ${data[0].id}`);
      console.log(`   Slug: ${data[0].slug}`);
      console.log(`   Available at: /marketplace/guides/${data[0].slug}\n`);
    }
  }

  console.log('✅ Done! All 12 Guiding Values cards created/updated.');
  console.log('\n📝 Summary:');
  console.log('   Mantra 01 (Self-Development): 2 values');
  console.log('   Mantra 02 (Lean Working): 5 values');
  console.log('   Mantra 03 (Value Co-Creation): 5 values');
  console.log('   Total: 12 Guiding Values');
}

create12GuidingValuesCards().catch(console.error);



