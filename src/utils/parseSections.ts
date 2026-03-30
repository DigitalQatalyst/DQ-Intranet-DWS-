export interface GuideSection {
  id: string;
  title: string;
  content: string;
}

/**
 * Parses a markdown body string into an array of sections based on H1/H2 headings.
 * Extracted from duplicated GuidelinePage implementations to reduce code duplication.
 */
export function parseSections(body: string): GuideSection[] {
  const sections: GuideSection[] = [];
  if (!body) return sections;

  const lines = body.split('\n');
  let currentSection: GuideSection | null = null;

  for (const line of lines) {
    if (line.startsWith('# ') || line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = line.replace(/^#+\s+/, '').trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      currentSection = { id, title, content: '' };
    } else if (currentSection) {
      currentSection.content += `${line}\n`;
    } else {
      currentSection = { id: 'overview', title: 'Overview', content: '' };
      currentSection.content += `${line}\n`;
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}
