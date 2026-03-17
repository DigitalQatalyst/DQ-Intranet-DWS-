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

elements.forEach((slug) => {
  const filePath = path.join(__dirname, '..', 'src', 'pages', 'strategy', slug, 'GuidelinePage.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace named import with default import
  content = content.replace(
    /import \{ MarkdownRenderer \} from ['"]\.\.\/\.\.\/\.\.\/components\/guides\/MarkdownRenderer['"]/g,
    "import MarkdownRenderer from '../../../components/guides/MarkdownRenderer'"
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed import in ${filePath}`);
});

console.log('\n✅ All imports fixed successfully!');

