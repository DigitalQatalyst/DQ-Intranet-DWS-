export interface Perspective {
  id: number;
  title: string;
  tag: string;
  subtitle: string;
  question: string;
  description: string;
  imageSrc: string;
  illustration:
    | 'economy'
    | 'cognitive'
    | 'platforms'
    | 'transformation'
    | 'workspace'
    | 'accelerators';
}

export const perspectives: Perspective[] = [
  {
    id: 1,
    title: "Digital Economy",
    tag: "Digital Economy",
    subtitle: "DQ Workspace · Real scenario",
    question: "Why does change become unavoidable?",
    description:
      "Grounds transformation in real market forces, customer behaviour, and value shifts — so execution is driven by reality, not assumptions.",
    imageSrc: "https://image2url.com/r2/default/images/1770035368667-bfe10133-4bed-44c7-aefa-c6fed9c807f5.webp",
    illustration: "economy"
  },
  {
    id: 2,
    title: "Digital Cognitive Organisation",
    tag: "Digital Cognitive Organisation",
    subtitle: "DQ Workspace · Real scenario",
    question: "What must organisations become to execute continuously?",
    description:
      "Defines the adaptive enterprise — able to sense, decide, and respond across people, systems, and decisions.",
    imageSrc: "https://image2url.com/r2/default/images/1770021175279-eacca42a-60ed-4c4d-9d14-e724a3e76cd6.png",
    illustration: "cognitive"
  },
  {
    id: 3,
    title: "Digital Business Platforms",
    tag: "Digital Business Platforms",
    subtitle: "DQ Workspace · Real scenario",
    question: "What must be built so execution doesn’t slow down?",
    description:
      "Creates modular, integrated foundations that keep delivery scalable, resilient, and executable over time.",
    imageSrc: "https://image2url.com/r2/default/images/1770021424913-1f4da872-0e43-488d-b842-a0e724f6c2c4.png",
    illustration: "platforms"
  },
  {
    id: 4,
    title: "Digital Transformation 2.0",
    tag: "Digital Transformation 2.0",
    subtitle: "DQ Workspace · Real scenario",
    question: "How do we stop pilots from stalling?",
    description:
      "Turns transformation into a governed execution discipline — not a one-off initiative.",
    imageSrc: "https://image2url.com/r2/default/images/1770034932697-4c5808eb-ce02-4b4f-bb98-d02e0c693303.png",
    illustration: "transformation"
  },
  {
    id: 5,
    title: "Digital Worker & Workspace",
    tag: "Digital Worker & Workspace",
    subtitle: "DQ Workspace · Real scenario",
    question: "Who delivers change and how do they work daily?",
    description:
      "Redesigns roles, skills, and environments so execution becomes normal work, not extra effort.",
    imageSrc: "https://image2url.com/r2/default/images/1770021849077-fe5f09ea-4467-4e4c-b1da-a46420d40712.png",
    illustration: "workspace"
  },
  {
    id: 6,
    title: "Digital Accelerators",
    tag: "Digital Accelerators",
    subtitle: "DQ Workspace · Real scenario",
    question: "When does value actually show up?",
    description:
      "Compresses time-to-value and converts execution momentum into measurable outcomes.",
    imageSrc: "https://image2url.com/r2/default/images/1770025109470-b2166816-791e-4ee2-be27-3d57e1e1de96.png",
    illustration: "accelerators"
  }
];
