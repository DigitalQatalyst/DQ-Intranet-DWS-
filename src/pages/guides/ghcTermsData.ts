// GHC Terms Data for Glossary Detail Pages

export interface GHCTermDetail {
  id: string;
  title: string;
  storyIntro: string;
  dimension: string;
  whatItMeansAtDQ: string;
  marketContext?: string;
  howThisIsUsed?: string[];
  whoUsesThis?: string[];
  relatedTerms: string[];
  // Mandatory glossary fields
  knowledgeSystem: 'ghc';
  termOrigin: 'dq-term';
  // Extended fields for The DQ Vision detail page
  heroStoryIntro?: string;
  theWorldWeLiveIn?: string;
  aWorldOfPossibilities?: string;
  ourAspiration?: string;
  ourEnablingBeliefs?: string;
  missionStatement?: string;
  missionExplanation?: string;
  whoThisIsFor?: string[];
  // Core purpose & value summaries (used for lighter UI sections)
  purpose?: string;
  valuePoints?: string[];
}

export const GHC_TERMS_DATA: GHCTermDetail[] = [
  {
    id: 'dq-vision-purpose',
    title: 'The DQ Vision (Purpose)',
    storyIntro: 'Defines why DigitalQatalyst exists and the future we are working to create — grounding every decision, system, and transaction in purpose.',
    dimension: 'vision',
    whatItMeansAtDQ: `That belief is the heartbeat of everything we do.
It unifies hundreds of choices we make daily — in how we work, what we build, and where we focus.

Our why is this:
To perfect life's transactions.

This vision is not powered by guesswork.
It is driven by Digital Blueprints — modular frameworks that guide organisations toward becoming Digital Cognitive Organisations (DCOs).`,
    heroStoryIntro: `"People don't buy what you do, they buy why you do it."
— Simon Sinek.

Every organisation has a mission.
But not every organisation is clear on why it exists.

At DigitalQatalyst, our work is bold, technical, and complex — but it is rooted in something simple:
a belief that the world moves forward when human needs and digital systems are designed to serve one another — intelligently, and consistently.`,
    theWorldWeLiveIn: `We begin with something simple — and almost invisible: a transaction.
A bill paid. A record checked. A form submitted.

These moments are not small.
They are the threads that hold daily life together.

When systems are clear and connected, life moves forward with less resistance.
When they're not, friction appears — delays, confusion, lost trust.

Much of that friction traces back to poorly designed and mal-orchestrated data flows.`,
    aWorldOfPossibilities: `What if organisations could think better?
Learn by design?
Adapt with intent?

This is the heart of our work — enabling organisations that don't just react to change, but anticipate it.

A living system that integrates people and intelligence.
A Digital Cognitive Organisation (DCO).`,
    ourAspiration: `The DQ Vision is:
"To perfect life's transactions."

In an era of data abundance and machine intelligence, organisations must evolve beyond shortcuts and legacy constraints.

The organisations that become DCOs will define the next chapter of the digital economy.`,
    ourEnablingBeliefs: `We believe the orchestration of human and machine intelligence improves lives.

We believe this orchestration is most effective when organisations operate on unified Digital Business Platforms (DBP).

And we believe the organisations that make this transition will shape the future.

These beliefs are not aspirational.
They are our internal compass.`,
    missionStatement: 'To accelerate the realisation of Digital Business Platforms using easy-to-implement blueprints.',
    missionExplanation: 'The mission enables the vision by providing the practical pathway — blueprints that make transformation achievable and repeatable.',
    whoThisIsFor: ['Qatalysts (clarity of purpose)', 'Clients (coherent transformation)', 'Investors (scalable intelligence)'],
    relatedTerms: ['House of Values (HoV)', 'Personas (Identity)', 'Agile TMS', 'Agile Flows', 'Agile 6xD'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term',
    purpose: 'The DQ Vision defines the shared purpose that guides decisions, priorities, and trade-offs across strategy, platforms, and delivery.',
    valuePoints: [
      'Provides a clear "why" for all DQ initiatives',
      'Ensures alignment across diverse teams and projects',
      'Inspires innovation focused on meaningful impact',
      'Attracts talent seeking purpose-driven work'
    ]
  },
  {
    id: 'hov-house-of-value-culture',
    title: 'House of Values (HoV)',
    storyIntro: 'Defines how Qatalysts behave, collaborate, and make decisions every day.',
    dimension: 'hov',
    whatItMeansAtDQ:
      'HoV establishes the cultural backbone of DQ — the values and behaviours that shape trust, accountability, and collaboration.',
    marketContext: 'Organisational culture frameworks help align behavior with values, creating environments where people can deliver their best work.',
    howThisIsUsed: [
      'Set behavioural expectations',
      'Guide collaboration and feedback',
      'Reinforce culture through delivery practices'
    ],
    whoUsesThis: ['All Qatalysts', 'People & Culture', 'Leadership'],
    relatedTerms: ['DQ Vision', 'Personas', 'Agile TMS'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term'
  },
  {
    id: 'persona-identity',
    title: 'Persona (Identity)',
    storyIntro: 'Clarifies who we are in the system and how Qatalysts show up at work.',
    dimension: 'personas',
    whatItMeansAtDQ:
      'Persona defines the shared mindsets, behaviours, and working styles that characterise people at DQ.',
    marketContext: 'Role clarity and identity frameworks help organisations align individual contributions with organisational goals.',
    howThisIsUsed: [
      'Guide hiring and onboarding',
      'Shape team composition',
      'Align role expectations'
    ],
    whoUsesThis: ['People & Talent', 'Team Leads', 'Delivery Managers'],
    relatedTerms: ['House of Values', 'Agile TMS', 'Agile Flows'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term'
  },
  {
    id: 'agile-tms-ways-of-working',
    title: 'Agile TMS (Strategy & Targets)',
    storyIntro: 'Turns strategy into measurable, steerable outcomes.',
    dimension: 'agile-tms',
    whatItMeansAtDQ:
      'Agile TMS connects vision to goals, metrics, and reviews, enabling continuous strategic alignment.',
    marketContext: 'Agile methodologies provide frameworks for iterative delivery, continuous improvement, and adaptive planning.',
    howThisIsUsed: [
      'Define and track strategic goals',
      'Review progress and adjust priorities',
      'Align teams around shared targets'
    ],
    whoUsesThis: ['Leadership', 'PMO', 'Agile Coaches'],
    relatedTerms: ['DQ Vision', 'Agile SoS', 'Agile Flows'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term'
  },
  {
    id: 'agile-sos-governance',
    title: 'Agile SoS (Governance)',
    storyIntro: 'Keeps multiple teams aligned without slowing them down.',
    dimension: 'agile-sos',
    whatItMeansAtDQ: 'Agile SoS defines how teams coordinate, manage dependencies, and govern delivery at scale.',
    marketContext: 'Governance frameworks balance control with agility, ensuring quality and compliance without slowing delivery.',
    howThisIsUsed: [
      'Coordinate across squads',
      'Manage risks and dependencies',
      'Maintain portfolio-level alignment'
    ],
    whoUsesThis: ['Delivery Leads', 'Programme Managers', 'Governance Teams'],
    relatedTerms: ['Agile TMS', 'Agile Flows', 'Agile 6xD'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term'
  },
  {
    id: 'agile-flows-value-streams',
    title: 'Agile Flows (Value Streams)',
    storyIntro: 'Ensures value moves smoothly from idea to outcome.',
    dimension: 'agile-flows',
    whatItMeansAtDQ: 'Agile Flows describe how work flows end-to-end across teams and systems to deliver measurable value.',
    marketContext: 'Value stream thinking helps organisations optimize the journey from idea to customer value, reducing waste and improving speed.',
    howThisIsUsed: [
      'Map and optimise value streams',
      'Reduce hand-offs and delays',
      'Improve time-to-value'
    ],
    whoUsesThis: ['Delivery Teams', 'Product Owners', 'Operations'],
    relatedTerms: ['Agile TMS', 'Agile SoS', 'Agile 6xD'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term'
  },
  {
    id: 'agile-6xd-products',
    title: 'Agile 6xD (Products)',
    storyIntro: 'Standardises how digital products are built and evolved.',
    dimension: 'agile-6xd',
    whatItMeansAtDQ:
      'Agile 6xD defines the lifecycle for discovering, designing, developing, deploying, and improving digital products.',
    marketContext: 'Product development frameworks help organisations build scalable, sustainable digital products that deliver value.',
    howThisIsUsed: [
      'Guide product lifecycle decisions',
      'Align teams on delivery stages',
      'Ensure consistent product practices'
    ],
    whoUsesThis: ['Product Teams', 'Engineers', 'Designers'],
    relatedTerms: ['Agile Flows', 'Agile TMS', 'Digital Business Platforms'],
    knowledgeSystem: 'ghc',
    termOrigin: 'dq-term'
  }
];

