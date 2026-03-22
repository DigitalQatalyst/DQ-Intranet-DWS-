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

// Updated content with proper markdown headings for each value
const UPDATED_CONTENT = {
  'dq-competencies-emotional-intelligence': {
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

For a comprehensive understanding of how Emotional Intelligence fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-growth-mindset': {
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

For a comprehensive understanding of how Growth Mindset fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-purpose': {
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

For a comprehensive understanding of how Purpose fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-perceptive': {
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

For a comprehensive understanding of how Perceptive fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-proactive': {
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

For a comprehensive understanding of how Proactive fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-perseverance': {
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

For a comprehensive understanding of how Perseverance fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-precision': {
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

For a comprehensive understanding of how Precision fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-customer': {
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

For a comprehensive understanding of how Customer fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-learning': {
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

For a comprehensive understanding of how Learning fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-collaboration': {
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

For a comprehensive understanding of how Collaboration fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-responsibility': {
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

For a comprehensive understanding of how Responsibility fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  },
  'dq-competencies-trust': {
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

For a comprehensive understanding of how Trust fits into the complete organizational framework, explore the [DQ Competencies (HoV)](/marketplace/guides/dq-competencies) and the [DQ Golden Honeycomb of Competencies (GHC)](/marketplace/guides/dq-ghc).`
  }
};

async function updateContentFormat() {
  console.log('📝 Updating 12 Guiding Values content to follow proper markdown format...\n');

  for (const [slug, content] of Object.entries(UPDATED_CONTENT)) {
    console.log(`📋 Updating: ${slug}`);

    const { error } = await supabase
      .from('guides')
      .update({
        body: content.body,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('id, title');

    if (error) {
      console.error(`❌ Error updating ${slug}:`, error.message);
    } else {
      console.log(`✅ Updated: ${slug}\n`);
    }
  }

  console.log('✅ Done! All 12 cards now have properly formatted markdown content.');
}

updateContentFormat().catch(console.error);



