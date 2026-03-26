import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Literal \n sequence used in DB content strings
const NL = String.raw`\n`;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('📝 Starting complete migration of Associate Owned Asset Guidelines...\n');
console.log('This will store ALL content from the hardcoded component into the database.\n');

// Run the migration
async function migrate() {
  try {
    const { data: existing } = await supabase
      .from('guides')
      .select('id')
      .eq('slug', 'dq-associate-owned-asset-guidelines')
      .maybeSingle();

    const contentJson = JSON.stringify({
      sections: [
        {
          id: "context",
          title: "1. Context",
          order: 1,
          type: "text",
          content: `The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, reducing asset management costs, and improving the accountability of devices used for company work. As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate the risk of asset theft by departing associates, while ensuring secure management and compliance with company standards. Through flexible options such as BYOD, FYOD and HYOD, DQ empowers associates to manage their own devices, fostering a more efficient and scalable approach to device management.${NL}${NL}In this context, the \`Company\` refers to DQ whereas \`Devices\` refers to laptops.`
        },
        {
          id: "overview",
          title: "2. Overview",
          order: 2,
          type: "text",
          content: `The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for transitioning to an associate-owned device model at DQ. This initiative aims to:${NL}${NL}<ul class='list-disc pl-6 space-y-2'><li>Mitigate Asset Theft.</li><li>Promote Accountability.</li><li>Support Seamless Transitions.</li><li>Optimize Operational Efficiency.</li></ul>`
        },
        {
          id: "purpose-scope",
          title: "3. Purpose and Scope",
          order: 3,
          type: "text",
          content: "<div class='space-y-6'><div><h3 class='text-xl font-semibold text-gray-900 mb-3'>3.1 Purpose</h3><p>The purpose of the Associate Owned Asset Guidelines is to transition to an associate-owned device model at DQ, aimed at mitigating asset theft by departing associates while ensuring accountability, and proper maintenance of devices used for work. These guidelines empower associates with flexible options to use and manage their personal work devices.</p></div><div><h3 class='text-xl font-semibold text-gray-900 mb-3'>3.2 Scope</h3><p class='mb-3'>These guidelines apply to all DQ Associates. They cover the use of personal devices for all company-related work and include procedures for the BYOD, FYOD and HYOD programs.</p><p>The scope also involves clear responsibilities for device acquisition, maintenance, and reporting.</p></div></div>"
        },
        {
          id: "core-components",
          title: "4. Core Components",
          order: 4,
          type: "table",
          description: "The Guidelines comprises of three core programs designed to assist associates during the transition:",
          table: {
            title: "Core Components",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Program", accessor: "program" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                program: "BYOD (Bring Your Own Device)",
                description: "Associates are required to bring their personal devices, including headsets, to work. The devices must meet the minimum technical specifications set by DQ."
              },
              {
                number: "02",
                program: "FYOD (Finance Your Own Device)",
                description: "Associates can apply for the FYOD program to purchase a company's device, with the cost deducted from their monthly salary. The purchase is subject to approval by the company"
              },
              {
                number: "03",
                program: "HYOD (Hold Your Own Device)",
                description: "In emergency cases where a personal device is temporarily unavailable, associates may 'Hold Their Own Device' by borrowing a company device."
              }
            ]
          }
        },
        {
          id: "roles-responsibilities",
          title: "5. Roles and Responsibilities",
          order: 5,
          type: "text",
          content: "To ensure the successful implementation and management of these guidelines, responsibilities are outlined as follows:"
        },
        {
          id: "byod",
          title: "5.1 BYOD (Bring Your Own Device)",
          order: 6,
          type: "text",
          content: "Associates in the Bring Your Own Device (BYOD) program are required to use their personal devices, including headsets, for work. These devices must meet the minimum technical standards set by the company."
        },
        {
          id: "byod-procedure",
          title: "5.1.1 Procedure:",
          order: 7,
          type: "table",
          description: "This procedure outlines key steps associates must follow when using their own devices at work under the BYOD program.",
          table: {
            title: "BYOD Procedure",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Key Steps", accessor: "step" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                step: "Device Specifications",
                description: "Associates must ensure their personal devices meet the minimum technical specifications set by DQ, as outlined by the IT team."
              },
              {
                number: "02",
                step: "Device maintenance",
                description: "Associates are responsible for ongoing maintenance of their personal devices."
              },
              {
                number: "03",
                step: "Reporting Issues",
                description: "Associates must report any laptop malfunctions, damage or loss to Admin and IT within 24hours. This is crucial for preventing work disruptions and ensuring a temporary laptop can be issued under the HYOD program."
              }
            ]
          }
        },
        {
          id: "byod-responsibilities",
          title: "5.1.2 Responsibilities:",
          order: 8,
          type: "table",
          description: "Outlined below are shared responsibilities for various departments in DQ to ensure the BYOD program runs smoothly and securely.",
          table: {
            title: "BYOD Responsibilities",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Role", accessor: "role" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                role: "Associate",
                description: `**Responsible for the acquisition, maintenance, and repair of personal devices used for work.** Associates must ensure that their personal laptops devices meet the minimum technical specifications set by DQ.${NL}${NL}**Strictly adhere to all aspects of the guidelines.**${NL}${NL}**Promptly report any laptop malfunction, damage, or loss to the Admin and IT departments within 24 hours** to ensure continued productivity through the issuance of a temporary DQ device under the HYOD program.${NL}${NL}**Associates must delete all company data from their devices during off-boarding.**`
              },
              {
                number: "02",
                role: "Admin",
                description: `**Monitor and enforce compliance with the guidelines**, ensuring associates adhere to the guidelines for personal device usage.${NL}${NL}**Act as the first point of contact for any issues or disputes** related to the BYOD program.${NL}${NL}**Maintain accurate records** for associates under the BYOD program.`
              },
              {
                number: "03",
                role: "IT",
                description: "Support will only be limited to troubleshooting devices."
              },
              {
                number: "04",
                role: "HR",
                description: "**Inform new joiners during the on-boarding process** on the two device programs available at DQ: BYOD and FYOD. Ensure that they also communicate the minimum specifications that all BYOD devices must meet."
              }
            ]
          }
        },
        {
          id: "fyod",
          title: "5.2 FYOD (Finance Your Own Device)",
          order: 9,
          type: "text",
          content: "The Finance Your Own Device (FYOD) program allows associates to buy a company device, with the cost being deducted from their salary through agreed upon monthly installments over a maximum period of three months."
        },
        {
          id: "fyod-procedure",
          title: "5.2.1 Procedure:",
          order: 10,
          type: "table",
          description: "This procedure outlines key steps that associates must follow when acquiring and maintaining devices under the FYOD program.",
          table: {
            title: "FYOD Procedure",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Key Steps", accessor: "step" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                step: "Application Submission",
                description: "Associates must complete and submit a Commitment Form to the Admin. This form must be completed once issued with a device."
              },
              {
                number: "02",
                step: "Approval Process",
                description: "Admin will review and approve requests within 48 hours. This will then be communicated to Finance. Upon approval by Finance, Admin will communicate the approval to the associate."
              },
              {
                number: "03",
                step: "Device Selection",
                description: "An associate will select a maximum of one device."
              },
              {
                number: "04",
                step: "Salary Deductions",
                description: "The original cost of the device will be deducted from an associate's salary through agreed upon monthly installments over a maximum period of three months."
              },
              {
                number: "05",
                step: "Ownership Transfer",
                description: "Until payments and deductions are completed, the device remains the property of DQ and must be left at the office on a daily basis by 5:00PM."
              }
            ]
          }
        },
        {
          id: "fyod-responsibilities",
          title: "5.2.2 Responsibilities:",
          order: 11,
          type: "table",
          description: "Outlined below are shared responsibilities for various departments in DQ to ensure the FYOD program runs smoothly and securely.",
          table: {
            title: "FYOD Responsibilities",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Role", accessor: "role" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                role: "Associate",
                description: `**Associates must complete and submit a Commitment Form to Admin.**${NL}${NL}**Once approved, an associate will pick a device of their choosing** and ensure they sign the Commitment Form.${NL}${NL}**Associates are responsible for company devices**, and DQ will not be liable for any damage caused by negligence. Maintenance will only cover system malfunctions, and a temporary device will be provided to the associate during that time.${NL}${NL}**Associates must return the devices to Admin daily by 5PM** until all final deductions have been completed.${NL}${NL}**Associates must delete all company data from their devices during off-boarding.**`
              },
              {
                number: "02",
                role: "Admin",
                description: `**Review and approve FYOD applications** based on their compliance with DQ standards.${NL}${NL}**Assist associates with completing the FYOD process** and ensure they are informed about the program.${NL}${NL}**Ensure associates fill in and sign the Commitment Form** upon issuance of the device.${NL}${NL}**Ensure DQ owned devices are locked daily after 5:00PM.**${NL}${NL}**Ensure associates return company devices daily by 5.00PM** until all payments are complete.`
              },
              {
                number: "03",
                role: "IT",
                description: "**Diagnose device issues** and only provide support for troubleshooting and system malfunctions."
              },
              {
                number: "04",
                role: "Finance",
                description: "**Manage the financial aspects of the program** by processing monthly salary deductions."
              }
            ]
          }
        },
        {
          id: "hyod",
          title: "5.2.3 HYOD (Hold Your Own Device)",
          order: 12,
          type: "text",
          content: "The 'Hold Your Own Device' (HYOD) program allows associates to temporarily borrow a company device in emergency situations when their personal device is unavailable."
        },
        {
          id: "hyod-procedure",
          title: "5.2.4 Procedure:",
          order: 13,
          type: "table",
          description: "This procedure outlines key steps for associates to follow while using company devices for work under the HYOD program",
          table: {
            title: "HYOD Procedure",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Key Steps", accessor: "step" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                step: "Emergency Reporting",
                description: "Associates must report any laptop malfunctions, damage or loss to Admin and IT within 24hours. This is crucial to avoid work disruptions and for the issuance of a temporary laptop under the HYOD program."
              },
              {
                number: "02",
                step: "Assessment and Approval",
                description: "IT will assess the emergency and approve the issuance of a company device."
              },
              {
                number: "03",
                step: "Device Issuance",
                description: "Associates must sign a Commitment Form for the issued company device."
              },
              {
                number: "04",
                step: "Device Usage",
                description: "Associates will receive a company device for temporary use while their personal device is being repaired or replaced. The company device will be available for a maximum of five days and must be returned to the Admin department by 5:00 PM each day."
              },
              {
                number: "05",
                step: "Device Return",
                description: "The company device must be returned to Admin, who will then hand it over to the IT team for inspection to ensure it is in good working condition. If the device is returned with damage, the associate will be responsible for the repair costs, which will be automatically deducted from their salary."
              }
            ]
          }
        },
        {
          id: "hyod-responsibilities",
          title: "5.2.5 Responsibilities",
          order: 14,
          type: "table",
          description: "Outlined below are shared responsibilities for various departments in DQ to ensure the HYOD program runs smoothly and securely.",
          table: {
            title: "HYOD Responsibilities",
            columns: [
              { header: "#", accessor: "number" },
              { header: "Role", accessor: "role" },
              { header: "Description", accessor: "description" }
            ],
            data: [
              {
                number: "01",
                role: "Associate",
                description: `**Immediately report device failure or loss to Admin within 24hours** to ensure continued productivity by issuance of a temporary company device.${NL}${NL}**Sign a Commitment Form for the company device.**${NL}${NL}**Return the company device by 5.00 PM and confirm its return with Admin.** All company devices must be returned in good working condition`
              },
              {
                number: "02",
                role: "Admin",
                description: `**Maintain records of company devices issued** and ensure compliance with the HYOD program.${NL}${NL}**Coordinate with IT** to ensure associates are issued company devices and that associates return the devices in good working condition`
              },
              {
                number: "03",
                role: "IT",
                description: `**Assess the emergency and approve the issuance of a company laptop** if necessary.${NL}${NL}**Diagnose device issues**, assist with troubleshooting and system malfunctions only.${NL}${NL}**Inspect the company device upon return.**`
              },
              {
                number: "04",
                role: "Finance",
                description: "**Process salary deductions for damaged company devices.**"
              }
            ]
          }
        },
        {
          id: "guiding-principles",
          title: "6. Guiding Principles and Controls",
          order: 15,
          type: "text",
          content: "<ul class='list-disc pl-6 space-y-2'><li><strong>Transparency:</strong> The process is designed to be transparent, auditable, and continuously improving to avoid errors and ensure adherence to best practices.</li><li><strong>Ownership:</strong> Devices acquired through the FYOD program become the property of the associate once payments are completed.</li><li><strong>Compliance:</strong> Failure to comply with the device guidelines will result in financial penalties via salary deductions.</li></ul>"
        },
        {
          id: "tools-resources",
          title: "7. Tools and Resources",
          order: 16,
          type: "text",
          content: "<ul class='list-disc pl-6 space-y-2'><li><strong>Asset Management System (Tracker):</strong> To track the status and condition of all laptop devices under the BYOD, FYOD, and HYOD programs.</li><li><strong>Commitment Form:</strong> For FYOD and HYOD programs.</li><li><strong>Minimum Devices Specifications.</strong></li></ul>"
        },
        {
          id: "kpis",
          title: "8. Key Performance Indicators (KPIs)",
          order: 17,
          type: "text",
          content: "<ul class='list-disc pl-6 space-y-2'><li>Number of FYOD applications submitted and approved.</li><li>Number of HYOD company devices issued and returned.</li><li>Percentage of associates' personal devices meeting the minimum technical specifications.</li><li>Number of security incidents related to personal devices.</li><li>Number of reduced theft cases.</li></ul>"
        },
        {
          id: "review-schedule",
          title: "9. Review and Update Schedule",
          order: 18,
          type: "text",
          content: "<ul class='list-disc pl-6 space-y-2'><li><strong>Quarterly:</strong> The guidelines will be reviewed every three months to ensure they remain aligned with operational needs.</li><li><strong>Ad-Hoc Optimization:</strong> The guidelines can be optimized at any time if a need for optimization is identified.</li></ul>"
        }
      ]
    });

    if (existing) {
      const { error } = await supabase
        .from('guides')
        .update({
          body: contentJson,
          last_updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
      console.log('✅ Updated existing guide');
      console.log(`   Guide ID: ${existing.id}`);
    } else {
      const { data, error } = await supabase
        .from('guides')
        .insert({
          slug: 'dq-associate-owned-asset-guidelines',
          title: 'DQ Ops | Associate Owned Asset Guidelines',
          summary: 'Guidelines for transitioning to an associate-owned device model at DQ, including BYOD, FYOD, and HYOD programs to mitigate asset theft, promote accountability, and optimize operational efficiency.',
          domain: 'Guidelines',
          guide_type: 'Guideline',
          status: 'Approved',
          body: contentJson,
          last_updated_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      console.log('✅ Created new guide');
      console.log(`   Guide ID: ${data.id}`);
    }

    console.log('\n✅ Migration complete!');
    console.log('\nNext steps:');
    console.log('1. Backup the old component');
    console.log('2. Replace with the new database-driven component');
    console.log('3. Test the page');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

migrate();
