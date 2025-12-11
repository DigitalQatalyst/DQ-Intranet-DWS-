import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { HomeIcon, ChevronRightIcon, Search } from 'lucide-react'
import { useAuth } from '../../components/Header/context/AuthContext'

interface GlossaryTerm {
  term: string
  definition: string
  letter: string
}

const GLOSSARY_DATA: GlossaryTerm[] = [
  // A
  { term: 'Abacus', definition: 'An enterprise architecture tool used for modeling, simulating, and analyzing complex systems within an organization, supporting digital transformation initiatives.', letter: 'A' },
  { term: 'Agile Methodology', definition: 'An iterative approach to project management and software development that promotes flexibility, collaboration, and customer feedback.', letter: 'A' },
  { term: 'Application Lifecycle Management (ALM)', definition: 'The process of managing the entire lifecycle of an application, from its initial development through deployment, maintenance, and eventual retirement. ALM ensures that applications are effectively managed and aligned with business objectives throughout their lifecycle.', letter: 'A' },
  { term: 'Ardoq', definition: 'A platform for digital transformation and enterprise architecture, facilitating visualization, analysis, and documentation of business processes and systems.', letter: 'A' },
  { term: 'Artificial Intelligence (AI)', definition: 'The simulation of human intelligence processes by machines, particularly computer systems. Key applications include expert systems, natural language processing, speech recognition, and machine vision.', letter: 'A' },
  { term: 'Azure', definition: 'A cloud computing service created by Microsoft, offering a range of cloud services, including computing, analytics, storage, and networking.', letter: 'A' },
  { term: 'Azure DevOps', definition: 'A suite of development tools, services, and capabilities provided by Microsoft Azure for DevOps practices, enabling continuous integration, delivery, and deployment.', letter: 'A' },
  { term: 'Associate Timesheet & Performance (ATP)', definition: 'Refers to the processes involved in the management and performance assessment of software applications within an organization. It includes monitoring, troubleshooting, and optimizing applications to ensure they meet performance standards, run efficiently, and deliver value to the business.', letter: 'A' },
  
  // B
  { term: 'Baseline', definition: 'The initial state or starting point of a system or process used as a reference for measuring progress in a transformation journey.', letter: 'B' },
  { term: 'Best Practice (Digital Maturity Matrix)', definition: 'A set of guidelines or methodologies that represent the most efficient and effective way of achieving digital maturity within an organization, often documented in a Digital Maturity Matrix.', letter: 'B' },
  { term: 'Business Design', definition: 'The process of designing digital business models that align with the organization\'s strategic goals. It involves the creation of innovative business structures that leverage digital technologies to deliver value to customers.', letter: 'B' },
  { term: 'Business Digital Capabilities', definition: 'The organization\'s ability to respond swiftly to changes in the market through business agility. It involves leveraging analytics, insights-driven processes, and operational excellence to maintain a competitive edge.', letter: 'B' },
  { term: 'Business Process Management (BPM)', definition: 'A systematic approach to improving an organization\'s processes, making them more efficient, effective, and adaptable to changes. BPM involves analyzing, designing, implementing, monitoring, and optimizing business processes.', letter: 'B' },
  { term: 'Business Model Innovation', definition: 'The process of designing new business models or adapting existing ones to leverage digital technologies and create new value propositions.', letter: 'B' },
  { term: 'Business Unit (BU)', definition: 'Refers to a distinct segment or department within an organization, focused on specific business operations, products, or services.', letter: 'B' },
  { term: 'Blitz Working Session (BWS)', definition: 'A focused, intense session designed to rapidly tackle specific challenges or goals within a short time frame. The purpose of a BWS is to gather key stakeholders to address a particular issue, brainstorm ideas, and create actionable steps for quick decision-making and execution.', letter: 'B' },
  
  // C
  { term: 'Capability Maturity Model (CMM)', definition: 'A framework used to assess the maturity of an organization\'s processes, particularly in software development and business process management. CMM provides a structured approach to evaluating and improving process maturity.', letter: 'C' },
  { term: 'Change Leadership', definition: 'The practice of leading and managing organizational change efforts, ensuring that the transformation is effectively communicated, adopted, and sustained across the organization.', letter: 'C' },
  { term: 'Change Management', definition: 'A structured approach to transitioning individuals, teams, and organizations from a current state to a desired future state, focusing on managing the human aspects of change to achieve successful outcomes.', letter: 'C' },
  { term: 'Chief Executive Officer (CEO)', definition: 'The highest-ranking executive in the organization. The CEO is responsible for the overall management, strategic direction, and leadership of the company.', letter: 'C' },
  { term: 'Centre of Excellence (CoE)', definition: 'Refers to a team or entity within the organization that provides leadership, best practices, research, support, and training in a specific area of expertise.', letter: 'C' },
  { term: 'Chief Technology Officer (CTO)', definition: 'The executive responsible for overseeing the technological direction and strategy of the organization. The CTO ensures that the company\'s technology systems and infrastructure align with the overall business goals.', letter: 'C' },
  { term: 'Cognitive Computing', definition: 'A subset of AI that involves simulating human thought processes in a computerized model, utilizing self-learning systems that use data mining, pattern recognition, and natural language processing.', letter: 'C' },
  { term: 'Co-creation', definition: 'A collaborative process where organizations and stakeholders, including customers, work together to create value, innovate, and solve problems.', letter: 'C' },
  { term: 'Collaborative Work Structure (CWS)', definition: 'A framework that promotes teamwork and cooperation across different teams or departments within the organization. It\'s designed to improve communication, enhance cross-functional collaboration, and ensure that everyone is aligned toward common goals.', letter: 'C' },
  { term: 'Competence', definition: 'The combination of skills, knowledge, and abilities that an individual possesses, enabling them to perform tasks effectively in a digital environment.', letter: 'C' },
  { term: 'Context', definition: 'The circumstances, background, or environment in which a process or activity occurs, affecting how it is interpreted and understood.', letter: 'C' },
  { term: 'Customer Journey', definition: 'The complete experience a customer has when interacting with a company, from the initial awareness through the purchasing process and beyond. It encompasses all touchpoints and interactions across different channels.', letter: 'C' },
  { term: 'Customer-centricity Management', definition: 'A focus on understanding and managing the customer experience journey through insights, relationships, engagement, and interactions. This involves creating strategies that prioritize the needs and expectations of customers at every touchpoint.', letter: 'C' },
  { term: 'Customer-Centricity', definition: 'A business strategy focused on creating positive experiences for the customer by prioritizing their needs and expectations at every step of the journey.', letter: 'C' },
  { term: 'Customer Relationship Management (CRM)', definition: 'A strategy and technology used to manage and analyze customer interactions and data throughout the customer lifecycle, to improve customer service relationships, aid in customer retention, and drive sales growth.', letter: 'C' },
  
  // D
  { term: 'Data', definition: 'Information that is collected, stored, and analyzed to provide insights and support decision-making within an organization. Data can be structured or unstructured and is a critical asset in digital transformation.', letter: 'D' },
  { term: 'Data Analysis', definition: 'The process of inspecting, cleaning, transforming, and modeling data to discover useful information, inform conclusions, and support decision-making.', letter: 'D' },
  { term: 'Data Modeling', definition: 'The process of creating a data model to define and organize data elements and how they relate to each other. Data modeling is essential for designing databases and ensuring data integrity.', letter: 'D' },
  { term: 'Design Thinking', definition: 'A human-centered approach to innovation that integrates the needs of people, the possibilities of technology, and the requirements for business success. It involves empathy, ideation, prototyping, and testing.', letter: 'D' },
  { term: 'Digital Alibi', definition: 'A justification or reason provided by an organization to demonstrate its engagement with digital transformation, often without significant or meaningful changes.', letter: 'D' },
  { term: 'Digital Business Platform (DBP)', definition: 'The end product of digital transformations, comprising an integrated set of digital tools and technologies that support an organization\'s core operations, data management, and service delivery. It is central to enabling organizations to operate efficiently and deliver value in a digital-first world.', letter: 'D' },
  { term: 'Digital Cognitive Organization (DCO)', definition: 'An organization that fully leverages digital technologies and cognitive capabilities, such as AI, to optimize operations, enhance decision-making, and deliver superior customer experiences.', letter: 'D' },
  { term: 'Digital Competitiveness', definition: 'The ability of an organization to compete effectively in a digital economy, leveraging digital technologies to create value, drive innovation, and maintain a competitive edge.', letter: 'D' },
  { term: 'Digital Destination', definition: 'The end goal or target state that an organization aims to achieve through its digital transformation efforts.', letter: 'D' },
  { term: 'Digital-first Leadership', definition: 'Leadership that prioritizes digital transformation as a core component of organizational strategy. This includes the expectations and commitments of the board, investors, and stakeholders to drive digital initiatives across the organization.', letter: 'D' },
  { term: 'Digital Generalist', definition: 'An individual with a broad understanding of various digital technologies and practices, capable of working across different areas of digital transformation.', letter: 'D' },
  { term: 'Digital Journey', definition: 'The process an organization undergoes to transition from traditional operations to a digitally transformed state. This journey involves adopting new technologies, changing business models, and evolving organizational culture.', letter: 'D' },
  { term: 'Digital Maturity', definition: 'The extent to which an organization has adopted digital technologies, integrated them into its operations, and achieved the desired outcomes. Digital maturity is often assessed using a maturity model or index.', letter: 'D' },
  { term: 'Digital Maturity Index (DMI)', definition: 'A tool used to measure and evaluate the digital maturity of an organization. The DMI provides a framework for assessing the effectiveness of digital transformation efforts and identifying areas for improvement.', letter: 'D' },
  { term: 'Digital Maturity Matrix', definition: 'A framework that provides a structured approach to assessing and improving an organization\'s digital maturity. The matrix typically includes best practices, benchmarks, and stages of maturity.', letter: 'D' },
  { term: 'Digital Mission', definition: 'The overarching purpose or goal of an organization\'s digital transformation efforts. The digital mission guides decision-making and aligns initiatives with the organization\'s strategic objectives.', letter: 'D' },
  { term: 'Digital Position', definition: 'The current state or standing of an organization in its digital transformation journey, including its strengths, weaknesses, opportunities, and challenges.', letter: 'D' },
  { term: 'Digital Potential', definition: 'The capacity of an organization to leverage digital technologies to achieve its goals and objectives. Digital potential is often assessed to determine the feasibility of transformation initiatives.', letter: 'D' },
  { term: 'Digital Strategy', definition: 'A comprehensive plan that includes a shared vision and understanding of digital transformation, ensuring organizational alignment and a clear response to market dynamics. It encompasses the big picture, budget allocation, journey mapping, benchmarking, planning, and roadmap development for digital initiatives.', letter: 'D' },
  { term: 'Digital Transformation 2.0 (DT2.0)', definition: 'An advanced phase of digital transformation characterized by the deep integration of digital technologies into all aspects of an organization, leading to fundamental changes in how the organization operates and delivers value.', letter: 'D' },
  { term: 'Digital Transformation Management Academy (DTMA)', definition: 'An initiative by Digital Qatalyst aimed at providing training and resources for mastering digital transformation strategies and tools.', letter: 'D' },
  { term: 'Digital Transformation Management Books (DTMB)', definition: 'A collection of resources and literature focused on best practices, frameworks, and case studies in digital transformation management.', letter: 'D' },
  { term: 'Digital Transformation Management Framework (DTMF)', definition: 'A structured approach to managing and implementing digital transformation initiatives within an organization, encompassing methodologies, tools, and best practices.', letter: 'D' },
  { term: 'Digital Transformation Management Platform (DTMP)', definition: 'A comprehensive platform that integrates tools, processes, and analytics to support the management and execution of digital transformation initiatives.', letter: 'D' },
  { term: 'Digital Transformation Management Podcast (DTMC)', definition: 'A series of audio episodes providing insights, interviews, and discussions on various aspects of digital transformation.', letter: 'D' },
  { term: 'Digital Transformation Organization for Transformation (DTO4T)', definition: 'A strategic framework or initiative focusing on the comprehensive transformation of organizations through digital means.', letter: 'D' },
  { term: 'Digital Value-Added Service', definition: 'Additional services provided by an organization that enhance the value of its core offerings, often enabled by digital technologies.', letter: 'D' },
  { term: 'Digital Vision', definition: 'The long-term vision or goal that an organization aims to achieve through its digital transformation efforts. The digital vision provides direction and inspiration for the transformation journey.', letter: 'D' },
  { term: 'Digitalization', definition: 'The process of converting analog information into digital form, as well as the adoption of digital technologies to improve business processes, enhance customer experiences, and create new business models.', letter: 'D' },
  { term: 'Direct Touchpoints', definition: 'Points of interaction between a customer and a brand that occur directly through owned channels, such as a company\'s website, mobile app, or physical store.', letter: 'D' },
  { term: 'Discovery Phase', definition: 'The initial phase of a project where research, analysis, and exploration are conducted to understand the current state, identify opportunities, and define the scope of the transformation.', letter: 'D' },
  { term: 'Disruptive Innovation', definition: 'An innovation that creates a new market and value network, eventually disrupting existing markets and displacing established products or services.', letter: 'D' },
  { term: 'Distributed Organizations', definition: 'Organizations that operate across multiple locations, often using digital technologies to coordinate activities, collaborate, and manage operations remotely.', letter: 'D' },
  
  // E
  { term: 'Eight-step Process', definition: 'A change management framework developed by John Kotter that outlines eight critical steps for leading organizational change effectively.', letter: 'E' },
  { term: 'Envision Phase', definition: 'The initial stage in the DT2.0 lifecycle, focuses on setting the vision, goals, and objectives for digital transformation.', letter: 'E' },
  { term: 'Enterprise Resource Planning (ERP)', definition: 'An integrated suite of software applications used by organizations to manage and automate core business processes. This includes areas like finance, human resources, supply chain management, sales, and customer relationship management (CRM).', letter: 'E' },
  
  // F
  { term: 'Framework', definition: 'A structured approach or set of guidelines used to support the implementation and management of digital transformation initiatives.', letter: 'F' },
  { term: 'Feedback Working Session (FWS)', definition: 'A meeting where feedback is collected to assess their effectiveness, identify issues, and discuss improvements to ensure the systems align with business needs.', letter: 'F' },
  
  // G
  { term: 'Golden Honeycomb of Competence (GHC)', definition: 'A conceptual model representing key interconnected competencies within an organization. Each "cell" in the honeycomb represents a specific skill or knowledge area, such as technical skills, business acumen, change management, and innovation, all working together to drive successful digital transformation.', letter: 'G' },
  { term: 'Golden Quadrant Competencies (GQC)', definition: 'A framework that highlights four key competencies that are essential for organizational success, particularly in the context of digital transformation. These competencies are typically grouped into four categories (the "quadrants") and are seen as critical for driving growth, innovation, and adaptability.', letter: 'G' },
  { term: 'Governance', definition: 'The framework of rules, practices, and processes by which an organization is directed and controlled, particularly in the context of data and technology management. Governance ensures that digital transformation initiatives align with the organization\'s strategic objectives and comply with relevant regulations and standards.', letter: 'G' },
  { term: 'Governance, Performance, Risk, and Compliance (GPRC)', definition: 'A framework used to manage and monitor various aspects of an organization\'s operations to ensure that everything is running efficiently, within regulatory boundaries, and according to established governance practices.', letter: 'G' },
  
  // H
  { term: 'High-Level Architecture Design (HLAD)', definition: 'Defines the overall structure and key components of an organization\'s IT systems, aligning with business goals and supporting digital transformation.', letter: 'H' },
  { term: 'House of Value (HoV)', definition: 'A strategic framework used to assess and prioritize the value delivered by an organization\'s initiatives. It typically represents the different layers or elements of value that contribute to an organization\'s goals, such as customer satisfaction, business efficiency, innovation, and profitability.', letter: 'H' },
  
  // I
  { term: 'Incremental Innovation', definition: 'A series of small, continuous improvements made to products, services, or processes over time, rather than major, disruptive changes. Incremental innovation helps organizations stay competitive by enhancing existing offerings and processes.', letter: 'I' },
  { term: 'Indirect Touchpoints', definition: 'Points of interaction between a customer and a brand that occur indirectly through third-party channels, such as social media, reviews, or word-of-mouth.', letter: 'I' },
  { term: 'Internet of Things (IoT)', definition: 'A network of physical devices, vehicles, appliances, and other objects embedded with sensors, software, and connectivity, enabling them to collect and exchange data. IoT is a key component of digital transformation, enabling smarter and more efficient operations.', letter: 'I' },
  
  // L
  { term: 'Launching Phase', definition: 'The stage in a project where a product, service, or initiative is officially introduced to the market or the organization. This phase involves execution, deployment, and initial feedback gathering.', letter: 'L' },
  { term: 'Lean Production', definition: 'A methodology that focuses on minimizing waste and maximizing value in the production process. Lean principles are often applied in digital transformation to improve efficiency and reduce costs.', letter: 'L' },
  { term: 'Lean vs Agile', definition: 'A comparison of two methodologies—Lean focuses on streamlining processes and eliminating waste, while Agile emphasizes flexibility, iterative development, and responsiveness to change. Both methodologies are used in digital transformation to enhance organizational agility and efficiency.', letter: 'L' },
  { term: 'Learning Working Session (LWS)', definition: 'A collaborative session where team members come together to learn, share knowledge, and work through specific challenges or concepts. The goal of a Learning Working Session is to foster skill development, problem-solving, and team engagement in a focused, interactive environment.', letter: 'L' },
  { term: 'Lifetime Value (LTV)', definition: 'The total revenue or profit an organization expects to generate from a customer throughout their relationship. Understanding LTV is crucial for making informed decisions about customer acquisition, retention, and digital marketing strategies.', letter: 'L' },
  { term: 'Low-Level Architecture Design (LLAD)', definition: 'The detailed design of systems and components within an organization\'s architecture, focusing on the implementation specifics such as code, database design, and system integrations.', letter: 'L' },
  
  // M
  { term: 'Machine Learning', definition: 'A subset of AI that involves training algorithms to recognize patterns in data and make predictions or decisions without explicit programming. Machine learning is used in digital transformation to automate processes, improve decision-making, and enhance customer experiences.', letter: 'M' },
  { term: 'Marketing & Communications (MarCom)', definition: 'Refers to the various methods and channels an organization uses to communicate with its target audience, including advertising, public relations, social media, content marketing, and events.', letter: 'M' },
  { term: 'Methodology', definition: 'A systematic, structured approach used to guide the execution of a project or initiative. In digital transformation, methodologies like Agile, Lean, and Six Sigma provide frameworks for planning, implementing, and managing change.', letter: 'M' },
  { term: 'Minimum Viable Product (MVP)', definition: 'A version of a product with just enough features to be usable by early customers, allowing the organization to gather feedback and make improvements before full-scale launch. MVPs are used in digital transformation to test new ideas quickly and cost-effectively.', letter: 'M' },
  { term: 'Mission', definition: 'The core purpose or reason for an organization\'s existence. A mission statement defines what the organization does, who it serves, and how it creates value, guiding strategic decisions and digital transformation efforts.', letter: 'M' },
  
  // N
  { term: 'Net Promoter Score (NPS)', definition: 'A metric used to measure customer loyalty and satisfaction by asking customers how likely they are to recommend a product, service, or company to others. NPS is an important indicator of customer experience and business performance in a digital context.', letter: 'N' },
  
  // O
  { term: 'Objectives and Key Results (OKRs)', definition: 'A goal-setting framework used to define and track objectives and their outcomes. OKRs align teams with strategic goals and measure progress toward achieving them, often used in digital transformation to drive focus and accountability.', letter: 'O' },
  { term: 'Open Source', definition: 'Software that is freely available for use, modification, and distribution. Open-source technologies are often used in digital transformation to reduce costs, increase flexibility, and foster innovation through community collaboration.', letter: 'O' },
  
  // P
  { term: 'Pain Point', definition: 'A specific problem or challenge that customers or employees experience, which can be addressed through digital transformation. Identifying and solving pain points is critical to improving customer experience and operational efficiency.', letter: 'P' },
  { term: 'Personal Working Session (PWS)', definition: 'A focused, individual working session where someone dedicates time to concentrate on a specific task, goal, or project. It\'s a self-driven session where the person works independently to address priorities, solve problems, or complete assigned tasks.', letter: 'P' },
  { term: 'Predictive Analysis', definition: 'The use of data, statistical algorithms, and machine learning techniques to identify the likelihood of future outcomes based on historical data. Predictive analysis is used in digital transformation to forecast trends, optimize operations, and make data-driven decisions.', letter: 'P' },
  { term: 'Prescriptive Analysis', definition: 'The process of using data and analytics to determine the best course of action in a given situation. The prescriptive analysis goes beyond predictive analysis by not only forecasting outcomes but also recommending specific actions to achieve desired results.', letter: 'P' },
  { term: 'Primary Data', definition: 'Data collected directly from the source, such as surveys, interviews, or experiments. In digital transformation, primary data is used to gain insights into customer behavior, market trends, and operational performance.', letter: 'P' },
  { term: 'Process', definition: 'A series of actions or steps taken to achieve a particular goal. In digital transformation, processes are often re-engineered or automated to improve efficiency, quality, and speed.', letter: 'P' },
  { term: 'Process Mapping', definition: 'A visual representation of the steps involved in a process, used to analyze, understand, and improve workflows. Process mapping is a key tool in business process management and digital transformation.', letter: 'P' },
  { term: 'Purpose', definition: 'The underlying reason for an organization\'s existence, often expressed in terms of the impact it seeks to have on the world. A clear sense of purpose guides strategic decisions, including those related to digital transformation.', letter: 'P' },
  
  // Q
  { term: 'Qualitative Analysis', definition: 'The examination of non-numerical data, such as opinions, behaviors, and experiences, to gain insights into underlying reasons, motivations, and patterns. Qualitative analysis is used in digital transformation to understand customer needs and inform decision-making.', letter: 'Q' },
  { term: 'Quantitative Analysis', definition: 'The examination of numerical data to identify patterns, relationships, and trends. Quantitative analysis is often used in digital transformation to measure performance, forecast outcomes, and make data-driven decisions.', letter: 'Q' },
  { term: 'Quality Performance Management System (QPMS)', definition: 'A system used to monitor, evaluate, and improve the quality and performance of processes, products, or services within an organization.', letter: 'Q' },
  { term: 'Quick Wins', definition: 'Small, achievable improvements that can be implemented quickly to generate immediate benefits. Quick wins are used in digital transformation to build momentum, demonstrate progress, and gain support for larger initiatives.', letter: 'Q' },
  
  // S
  { term: 'Scope', definition: 'The boundaries and objectives of a project, defining what will be included and what will be excluded. Clear scope definition is essential in digital transformation to ensure that efforts are focused and aligned with strategic goals.', letter: 'S' },
  { term: 'Scribe', definition: 'An individual responsible for documenting the proceedings of a meeting, workshop, or project. In digital transformation, scribes capture key insights, decisions, and action items to ensure clear communication and accountability.', letter: 'S' },
  { term: 'Seamlessness', definition: 'The quality of being smooth and continuous, without gaps or interruptions. In digital transformation, seamlessness refers to creating a consistent and integrated experience across all touchpoints, both online and offline.', letter: 'S' },
  { term: 'Secondary Data', definition: 'Data that has been collected by someone else for a different purpose, such as industry reports, government publications, or historical records. Secondary data is often used in digital transformation to supplement primary data and provide additional context.', letter: 'S' },
  { term: 'Sense of Urgency', definition: 'The perception that immediate action is necessary to achieve a goal or address a challenge. In digital transformation, creating a sense of urgency is critical for driving change and overcoming resistance.', letter: 'S' },
  { term: 'Service Design', definition: 'The process of planning and organizing a company\'s resources (people, processes, technology) to improve the quality and interaction between the service provider and its customers. Service design is a key aspect of digital transformation, focusing on delivering value through customer-centric solutions.', letter: 'S' },
  { term: 'Service Level Agreement (SLA)', definition: 'A formal contract between a service provider and a client that defines the expected level of service, including specific metrics such as response time, availability, performance standards, and resolution times.', letter: 'S' },
  { term: 'Smart Failures', definition: 'Controlled experiments or initiatives that are designed to test hypotheses and learn from failures. In digital transformation, smart failures are encouraged as a way to innovate, iterate, and improve.', letter: 'S' },
  { term: 'Standard Operating Procedure (SOP)', definition: 'A set of step-by-step instructions compiled by an organization to help employees carry out routine operations efficiently and consistently. SOPs ensure that tasks are performed correctly, consistently, and in compliance with company policies, regulations, and industry standards.', letter: 'S' },
  { term: 'Start and End of Day Updates (SEDUs)', definition: 'Daily reports summarizing tasks planned and completed, helping to track progress and ensure alignment with team goals.', letter: 'S' },
  { term: 'Strategy', definition: 'A long-term plan of action designed to achieve a particular goal or set of objectives. In digital transformation, strategy guides the allocation of resources, prioritization of initiatives, and alignment with business goals.', letter: 'S' },
  { term: 'Structured Data', definition: 'Data that is organized in a predefined format, such as databases or spreadsheets. Structured data is easy to analyze and is commonly used in digital transformation for reporting, analytics, and decision-making.', letter: 'S' },
  { term: 'System of Discipline (SoD)', definition: 'A set of rules, procedures, and processes established to maintain order, accountability, and adherence to organizational policies within a company or institution. It involves clear guidelines for behavior, performance standards, and consequences for non-compliance to ensure consistent and fair treatment of individuals.', letter: 'S' },
  { term: 'System of Governance', definition: 'The framework of rules, practices, and processes used to direct and manage an organization. It defines the roles and responsibilities of various stakeholders (like management, employees, and external parties) and ensures that decisions are made in the best interest of the organization\'s stakeholders, including shareholders, customers, and employees.', letter: 'S' },
  { term: 'System of Governance, Quality, Value, and Discipline (So.GQVD)', definition: 'A framework that ensures effective management by aligning governance, maintaining quality standards, delivering value to stakeholders, and promoting accountability and continuous improvement within an organization.', letter: 'S' },
  { term: 'System of Quality (SOQ)', definition: 'A structured approach used by an organization to ensure that its products, services, and processes consistently meet defined quality standards. It includes quality management practices, policies, procedures, and tools designed to monitor, measure, and improve performance to achieve customer satisfaction and operational excellence.', letter: 'S' },
  { term: 'System of Value (SoV)', definition: 'A framework within an organization that defines the principles, practices, and processes used to create, deliver, and measure value for stakeholders. It focuses on aligning organizational activities with customer needs, ensuring efficiency, innovation, and long-term sustainability while maintaining a focus on delivering measurable benefits to customers, employees, and shareholders.', letter: 'S' },
  
  // T
  { term: 'Transformation Management as a Service (TMaas)', definition: 'A service model that provides organizations with the tools, frameworks, and expertise needed to manage and implement digital transformation initiatives effectively and efficiently.', letter: 'T' },
  
  // U
  { term: 'Unstructured Data', definition: 'Data that does not have a predefined format, such as text, images, videos, and social media posts. Unstructured data is more challenging to analyze but is increasingly important in digital transformation for gaining insights into customer behavior and preferences.', letter: 'U' },
  { term: 'User Experience (UX)', definition: 'The overall experience a person has when interacting with a product, system, or service, particularly in terms of how easy or pleasing it is to use. UX is a critical focus in digital transformation, as it directly impacts customer satisfaction and loyalty.', letter: 'U' },
  { term: 'Urgent Working Session (UWS)', definition: 'A focused, time-sensitive meeting or session convened to address immediate issues or critical tasks that require quick resolution. It is typically used to resolve pressing challenges, make decisions, or ensure that key activities stay on track in a short time frame.', letter: 'U' },
  
  // V
  { term: 'Value Proposition', definition: 'The promise of value to be delivered to the customer, highlighting the benefits and unique aspects of a product or service. A clear value proposition is essential in digital transformation to differentiate offerings and attract customers.', letter: 'V' },
  { term: 'Values', definition: 'The principles and beliefs that guide an organization\'s behavior and decision-making. In digital transformation, aligning initiatives with organizational values ensures consistency and integrity in the pursuit of change.', letter: 'V' },
  { term: 'Vision', definition: 'A long-term aspirational goal that an organization aims to achieve. A compelling vision provides direction and motivation for digital transformation efforts, inspiring stakeholders to work towards a common future.', letter: 'V' },
  
  // W
  { term: 'Weekly Status Update (WSU)', definition: 'A regular report or meeting where teams provide updates on the progress of ongoing projects, highlight completed tasks and outline upcoming goals or challenges. It helps ensure alignment and communication within teams and stakeholders.', letter: 'W' },
]

const GlossaryPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // Related Frameworks data
  const relatedFrameworks = [
    {
      id: "6xd",
      title: "Agile 6×D (Products)",
      description: "DQ's six essential perspectives for designing, building, and delivering digital products.",
      image: "/images/knowledge/6xd.png",
      link: "/knowledge-center/6xd"
    },
    {
      id: "ghc",
      title: "Golden Honeycomb of Competence (GHC)",
      description: "DQ's core competency model that enables associate growth, performance, and digital mastery.",
      image: "/images/knowledge/ghc.png",
      link: "/knowledge-center/ghc"
    }
  ]

  // Glossary Categories data
  const glossaryCategories = [
    {
      title: "Digital Transformation Concepts",
      description: "Core DT2.0 terminology used across DQ's digital operating model.",
      link: "#dt"
    },
    {
      title: "DQ Tools & Platforms",
      description: "Key systems such as Abacus, Ardoq, DBP, DTMP, DTMA used across DQ.",
      link: "#tools"
    },
    {
      title: "Leadership & Change",
      description: "Terms covering change management, leadership behavior, and governance.",
      link: "#leadership"
    },
    {
      title: "Agile & Delivery",
      description: "Terminology related to Agile, delivery, and execution frameworks.",
      link: "#agile"
    },
    {
      title: "Business & Customer Design",
      description: "Business design, journeys, value, and customer-centricity concepts.",
      link: "#business"
    },
    {
      title: "Working Rooms & Operating Rhythm",
      description: "CWS, UWS, PWS, WR, ATP, SEDU and DQ ways of working.",
      link: "#wr"
    }
  ]

  // Get all available letters
  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  
  // Filter terms based on search query
  const filteredTerms = GLOSSARY_DATA.filter(term => {
    const matchesSearch = searchQuery === '' || 
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLetter = selectedLetter === null || term.letter === selectedLetter
    return matchesSearch && matchesLetter
  })

  // Group terms by letter
  const termsByLetter = filteredTerms.reduce((acc, term) => {
    if (!acc[term.letter]) {
      acc[term.letter] = []
    }
    acc[term.letter].push(term)
    return acc
  }, {} as Record<string, GlossaryTerm[]>)

  // Get letters that have content
  const lettersWithContent = Array.from(new Set(GLOSSARY_DATA.map(t => t.letter))).sort()

  // Scroll to letter when clicked
  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter)
    const element = document.getElementById(`letter-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Reset to show all when search is cleared
  useEffect(() => {
    if (searchQuery === '') {
      setSelectedLetter(null)
    }
  }, [searchQuery])

  return (
    <div className="min-h-screen flex flex-col bg-white guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/guides?tab=resources" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Resources
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">Glossary</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Main Title - Centered */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The DQ Glossary
          </h1>
          <p className="text-base text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Read our comprehensive collection of terms explaining various Digital Transformation 2.0 (DT2.0) and Internet Marketing concepts in our DQ Glossary!
          </p>
        </div>

        {/* Related Frameworks Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {relatedFrameworks.map(item => (
            <div 
              key={item.id}
              className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              <img src={item.image} alt={item.title} className="w-full h-[160px] object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <button className="mt-4 w-full bg-[#0A1433] text-white py-2.5 rounded-xl text-sm hover:bg-[#0A1433]/90">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Glossary Category Cards */}
        <div className="mt-14">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Glossary Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {glossaryCategories.map(cat => (
              <div
                key={cat.title}
                className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md cursor-pointer transition"
                onClick={() => {
                  const element = document.querySelector(cat.link)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)]"
            />
          </div>
        </div>

        {/* Category Section Headers with Anchors */}
        <div className="bg-white">
          <div id="dt" className="scroll-mt-20 mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Digital Transformation Concepts</h2>
            <p className="text-gray-600 mb-6">Core DT2.0 terminology used across DQ's digital operating model.</p>
          </div>
          <div id="tools" className="scroll-mt-20 mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">DQ Tools & Platforms</h2>
            <p className="text-gray-600 mb-6">Key systems such as Abacus, Ardoq, DBP, DTMP, DTMA used across DQ.</p>
          </div>
          <div id="leadership" className="scroll-mt-20 mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Leadership & Change</h2>
            <p className="text-gray-600 mb-6">Terms covering change management, leadership behavior, and governance.</p>
          </div>
          <div id="agile" className="scroll-mt-20 mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agile & Delivery</h2>
            <p className="text-gray-600 mb-6">Terminology related to Agile, delivery, and execution frameworks.</p>
          </div>
          <div id="business" className="scroll-mt-20 mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business & Customer Design</h2>
            <p className="text-gray-600 mb-6">Business design, journeys, value, and customer-centricity concepts.</p>
          </div>
          <div id="wr" className="scroll-mt-20 mt-14">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Working Rooms & Operating Rhythm</h2>
            <p className="text-gray-600 mb-6">CWS, UWS, PWS, WR, ATP, SEDU and DQ ways of working.</p>
          </div>
        </div>

        {/* Alphabetical Navigation - Theme colors */}
        <div className="mb-8 mt-8 flex flex-wrap justify-center gap-2">
          {allLetters.map(letter => {
            const hasContent = lettersWithContent.includes(letter)
            const isActive = selectedLetter === letter
            return (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className={`w-10 h-10 border border-gray-800 text-gray-900 font-medium text-sm transition-colors ${
                  hasContent || isActive
                    ? 'bg-[var(--guidelines-primary-surface)] hover:bg-[var(--guidelines-primary)] hover:text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>

        {/* Glossary Terms - White background, no cards */}
        <div className="bg-white">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No terms found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTerms.map((term, index) => {
                // Check if this is the first term of a new letter to add section anchor
                const isFirstOfLetter = index === 0 || filteredTerms[index - 1].letter !== term.letter
                const letterId = `letter-${term.letter}`
                
                return (
                  <React.Fragment key={`${term.letter}-${index}`}>
                    {isFirstOfLetter && (
                      <div id={letterId} className="scroll-mt-20">
                        <h2 className="text-2xl font-semibold text-gray-900 mt-14 mb-4">
                          {term.letter}
                        </h2>
                      </div>
                    )}
                    <div className="bg-slate-50 rounded-lg border border-gray-200 shadow-sm p-6">
                      {/* Term Title - Theme color, bold */}
                      <h3 className="text-lg font-bold text-[var(--guidelines-primary)] mb-3">
                        {term.term}
                      </h3>
                      {/* Definition - Regular text with proper spacing */}
                      <p className="text-base text-gray-700 leading-relaxed space-y-3">
                        {term.definition}
                      </p>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GlossaryPage
