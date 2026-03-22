import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const elements = [
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd',
];

const updatedRenderCode = `            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {sections.length === 0 ? (
                guide?.body ? (
                  <GuidelineSection id="overview" title="Overview">
                    <MarkdownRenderer body={guide.body} />
                  </GuidelineSection>
                ) : (
                  <div className="text-gray-600">No content available.</div>
                )
              ) : (
                sections.map((section, index) => {
                  // Skip "Learn More" section - we'll add it manually
                  if (section.title === 'Learn More') return null
                  
                  return (
                    <GuidelineSection key={section.id} id={section.id} title={section.title}>
                      <MarkdownRenderer body={section.content.trim()} />
                    </GuidelineSection>
                  )
                })
              )}`;

elements.forEach((slug) => {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'strategy', slug, 'GuidelinePage.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the render section
  const renderRegex = /            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">[\s\S]*?              \}\)\}/;
  content = content.replace(renderRegex, updatedRenderCode);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${filePath}`);
});

console.log('\n✅ All pages updated successfully!');

