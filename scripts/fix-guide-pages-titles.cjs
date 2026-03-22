/**
 * Script to add section titles and fix alignment in guide detail pages
 * Adds "Overview", "Explore Story Book", and "Course" titles
 * Removes centering to align with tabs
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
    let updated = false;
    
    // Fix Overview tab - add title and remove centering
    const overviewOld = `                {activeTab === 'overview' && (
                  <div className="max-w-5xl mx-auto space-y-10">
                    {/* Main Description */}`;
    
    const overviewNew = `                {activeTab === 'overview' && (
                  <div className="space-y-10">
                    {/* Overview Title */}
                    <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
                    
                    {/* Main Description */}`;
    
    if (content.includes(overviewOld)) {
      content = content.replace(overviewOld, overviewNew);
      updated = true;
    }
    
    // Fix Storybook tab - add title and remove GuidelineSection wrapper
    const storybookOld = `                {activeTab === 'storybook' && (
                  <GuidelineSection id="storybook" title="Explore Story Book">
                    <div className="max-w-5xl mx-auto space-y-10">
                      {/* Storybook Description */}`;
    
    const storybookNew = `                {activeTab === 'storybook' && (
                  <div className="space-y-10">
                    {/* Explore Story Book Title */}
                    <h2 className="text-xl font-semibold text-gray-900">Explore Story Book</h2>
                    
                    {/* Storybook Description */}`;
    
    if (content.includes(storybookOld)) {
      content = content.replace(storybookOld, storybookNew);
      updated = true;
    }
    
    // Fix Storybook closing tags
    const storybookCloseOld = `                    </div>
                  </GuidelineSection>
                )}`;
    
    const storybookCloseNew = `                    </div>
                  </div>
                )}`;
    
    if (content.includes(storybookCloseOld)) {
      content = content.replace(storybookCloseOld, storybookCloseNew);
      updated = true;
    }
    
    // Fix Course tab - add title
    const courseOld = `                {activeTab === 'course' && (
                  <GuidelineSection id="course" title="Course - Learning Center">
                    <div className="space-y-8">`;
    
    const courseNew = `                {activeTab === 'course' && (
                  <div className="space-y-6">
                    {/* Course Title */}
                    <h2 className="text-xl font-semibold text-gray-900">Course</h2>
                    
                    <div className="space-y-8">`;
    
    if (content.includes(courseOld)) {
      content = content.replace(courseOld, courseNew);
      updated = true;
    }
    
    // Fix Course closing tags
    const courseCloseOld = `                    </div>
                  </GuidelineSection>
                )}`;
    
    const courseCloseNew = `                    </div>
                  </div>
                )}`;
    
    // Only replace if not already replaced by storybook fix
    const occurrences = (content.match(/GuidelineSection/g) || []).length;
    if (occurrences > 0 && content.includes(courseCloseOld)) {
      content = content.replace(courseCloseOld, courseCloseNew);
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${folder}/GuidelinePage.tsx`);
    } else {
      console.log(`⚠️  No changes needed: ${folder}/GuidelinePage.tsx`);
    }
  } catch (error) {
    console.error(`❌ Failed to update ${folder}/GuidelinePage.tsx:`, error.message);
  }
});

console.log('\n✨ Section titles added to all guide pages!');
console.log('\nChanges made:');
console.log('1. Added "Overview" title to Overview tab');
console.log('2. Added "Explore Story Book" title to Storybook tab');
console.log('3. Added "Course" title to Course tab');
console.log('4. Removed centering (mx-auto) for left alignment');
console.log('5. Removed GuidelineSection wrapper for consistent styling');
