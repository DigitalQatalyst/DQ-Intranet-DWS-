import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const elements = [
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd',
];

const updatedParsingCode = `  // Parse markdown body into sections
  const parseSections = (body: string) => {
    const sections: { id: string; title: string; content: string }[] = []
    if (!body) return sections
    
    const lines = body.split('\\n')
    let currentSection: { id: string; title: string; content: string } | null = null
    
    for (const line of lines) {
      // Check for level 1 or level 2 headings
      if (line.startsWith('# ') || line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        const title = line.replace(/^#+\\s+/, '').trim()
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        currentSection = { id, title, content: '' }
      } else if (currentSection) {
        currentSection.content += line + '\\n'
      } else {
        // If we have content before any heading, create a default section
        if (!currentSection) {
          currentSection = { id: 'overview', title: 'Overview', content: '' }
        }
        currentSection.content += line + '\\n'
      }
    }
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections
  }

  const sections = guide?.body ? parseSections(guide.body) : []
  const navSections = sections.filter(s => s.title !== 'Learn More').map(s => ({ id: s.id, label: s.title }))`;

const updatedRenderCode = `            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {sections.length === 0 ? (
                <div className="text-gray-600">No content available.</div>
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
  
  // Replace the parseSections function
  const parseSectionsRegex = /  \/\/ Parse markdown body into sections[\s\S]*?const navSections = sections\.map\(s => \(\{ id: s\.id, label: s\.title \}\)\)/;
  content = content.replace(parseSectionsRegex, updatedParsingCode);
  
  // Replace the render section
  const renderRegex = /            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">[\s\S]*?              \}\)\}/;
  content = content.replace(renderRegex, updatedRenderCode);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${filePath}`);
});

console.log('\n✅ All pages updated successfully!');

