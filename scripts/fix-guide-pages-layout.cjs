/**
 * Script to fix the layout of guide detail pages
 * Removes padding between hero and tabs, fixes background colors
 */

const fs = require('fs');
const path = require('path');

const pagesToUpdate = [
  { slug: 'dq-vision', folder: 'dq-vision' },
  { slug: 'dq-hov', folder: 'dq-hov' },
  { slug: 'dq-persona', folder: 'dq-persona' },
  { slug: 'dq-agile-tms', folder: 'dq-agile-tms' },
  { slug: 'dq-agile-sos', folder: 'dq-agile-sos' },
  { slug: 'dq-agile-flows', folder: 'dq-agile-flows' },
  { slug: 'dq-agile-6xd', folder: 'dq-agile-6xd' }
];

pagesToUpdate.forEach(({ folder }) => {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'strategy', folder, 'GuidelinePage.tsx');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the main section structure
    const oldPattern = `      <main className="flex-1">
        <div className="px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">`;
    
    const newPattern = `      <main className="flex-1 bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">`;
    
    if (content.includes(oldPattern)) {
      content = content.replace(oldPattern, newPattern);
      
      // Fix the tab content wrapper
      const oldTabContent = `                  {/* Tab Content */}
                  <div className="p-6 md:p-8">`;
      
      const newTabContent = `            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 gap-8">
              <div className="lg:col-span-3">`;
      
      content = content.replace(oldTabContent, newTabContent);
      
      // Fix closing tags
      const oldClosing = `                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>`;
      
      const newClosing = `              </div>
            </div>
          </div>
        </div>
      </main>`;
      
      content = content.replace(oldClosing, newClosing);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${folder}/GuidelinePage.tsx`);
    } else {
      console.log(`⚠️  Pattern not found in: ${folder}/GuidelinePage.tsx`);
    }
  } catch (error) {
    console.error(`❌ Failed to update ${folder}/GuidelinePage.tsx:`, error.message);
  }
});

console.log('\n✨ Layout fixes applied to all guide pages!');
console.log('\nChanges made:');
console.log('1. Removed padding between hero section and tabs');
console.log('2. Tabs now span full width with white background');
console.log('3. Content area has light gray background');
console.log('4. Removed rounded corners from tab container');
console.log('5. Added proper spacing for content cards');
