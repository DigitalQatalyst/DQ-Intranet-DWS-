const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      findFiles(path.join(dir, file), filter, fileList);
    } else if (filter.test(file)) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const srcDir = path.join(__dirname, 'src');
const secureRandomPath = path.join(srcDir, 'utils', 'secureRandom');
const files = findFiles(srcDir, /\.(ts|tsx)$/);

for (const file of files) {
  // skip the utility itself
  if (file === secureRandomPath + '.ts') continue;

  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Math.random()')) {
    // Replace all usages
    content = content.replace(/Math\.random\(\)/g, 'secureRandom()');
    
    // Check if already imported
    if (!content.includes('import { secureRandom }')) {
      // Calculate relative path
      let relPath = path.relative(path.dirname(file), secureRandomPath);
      // Ensure it starts with ./ or ../
      if (!relPath.startsWith('.')) {
        relPath = './' + relPath;
      }
      relPath = relPath.replace(/\\/g, '/'); // normalize for imports
      
      const importStatement = `import { secureRandom } from '${relPath}';\n`;
      content = importStatement + content;
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
}
console.log('Script completed.');
