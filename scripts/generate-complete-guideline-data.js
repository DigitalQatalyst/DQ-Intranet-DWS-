import fs from 'node:fs';

// Literal \n sequence used in DB content strings
const NL = String.raw`\n`;

// Complete guideline data structure
const guidelineData = {
  slug: "dq-associate-owned-asset-guidelines",
  title: "DQ Ops | Associate Owned Asset Guidelines",
  summary: "Guidelines for transitioning to an associate-owned device model at DQ, including BYOD, FYOD, and HYOD programs to mitigate asset theft, promote accountability, and optimize operational efficiency.",
  sections: []
};

// Add all sections
guidelineData.sections.push(
  {
    id: "context",
    title: "1. Context",
    order: 1,
    type: "text",
    content: "The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.\\n\\nIn this context, the `Company` refers to DQ whereas `Devices` refers to laptops."
  },
  {
    id: "overview",
    title: "2. Overview",
    order: 2,
    type: "text",
    content: "The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for transitioning to an associate-owned device model at DQ. This initiative aims to:\\n\\n- Mitigate Asset Theft.\\n- Promote Accountability.\\n- Support Seamless Transitions.\\n- Optimize Operational Efficiency." // NOSONAR
  },
  {
    id: "purpose-scope",
    title: "3. Purpose and Scope",
    order: 3,
    type: "text",
    content: `### 3.1 Purpose${NL}${NL}The purpose of the Associate Owned Asset Guidelines is to transition to an associate-owned device model at DQ, aimed at mitigating asset theft by departing associates while ensuring accountability, and proper maintenance of devices used for work. These guidelines empower associates with flexible options to use and manage their personal work devices.${NL}${NL}### 3.2 Scope${NL}${NL}These guidelines apply to all DQ Associates. They cover the use of personal devices for all company-related work and include procedures for the BYOD, FYOD and HYOD programs.${NL}${NL}The scope also involves clear responsibilities for device acquisition, maintenance, and reporting.`
  }
);

// Save to file — paths are compile-time constants, not user input
fs.mkdirSync('./scripts/guideline-data', { recursive: true });
fs.writeFileSync('./scripts/guideline-data/associate-owned-asset-complete.json', JSON.stringify(guidelineData, null, 2));

console.log('✅ Generated complete guideline data at: ./scripts/guideline-data/associate-owned-asset-complete.json');
console.log(`📊 Total sections: ${guidelineData.sections.length}`);
