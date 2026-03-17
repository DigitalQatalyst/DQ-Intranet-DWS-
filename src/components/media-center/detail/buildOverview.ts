import type { NewsItem } from '@/data/media/news';

// Generate a brief 4-paragraph overview for the details page
export const buildOverview = (article: NewsItem & { content?: string }) => {
  const overview: string[] = [];

  const isWFHGuidelines =
    article.id === 'dq-wfh-guidelines' ||
    article.title.toLowerCase().includes('wfh guidelines') ||
    article.title.toLowerCase().includes('work from home');

  if (isWFHGuidelines) {
    return buildWFHOverview(article);
  }

  overview.push(buildIntroParagraph(article));
  addExtractedSections(overview, article);
  fillDefaultParagraphs(overview);

  return overview.slice(0, 4);
};

const buildWFHOverview = (article: NewsItem & { content?: string }): string[] => {
  const overview: string[] = [];

  overview.push(
    'The Work From Home (WFH) Guidelines provide a clear framework for how remote work is requested, approved, executed, and monitored across DQ, ensuring productivity, accountability, and culture remain intact while associates work remotely.'
  );

  overview.push(buildWFHProcessParagraph(article));

  overview.push(
    'Key roles include Associates who submit requests and maintain daily visibility, Line Managers who provide pre-approval and monitor deliverables, HR who provides final approval and ensures policy compliance, and HRA who oversees overall compliance and adherence to guidelines.'
  );

  overview.push(
    'The guidelines are built on principles of transparency, accountability, equity, compliance, collaboration, and data security. Essential tools include DQ Live24 for visibility and communication, DQ Shifts for attendance tracking, and the HR Channel for requests and updates.'
  );

  return overview.slice(0, 4);
};

const buildWFHProcessParagraph = (article: NewsItem & { content?: string }): string => {
  if (!article.content) {
    return 'The process requires associates to submit requests 24 hours in advance, obtain necessary approvals, maintain visibility through DQ Live24, post daily updates, and comply with all monitoring requirements to ensure accountability and productivity.';
  }

  const processSteps = extractWFHProcessSteps(article.content);

  if (processSteps.length > 0) {
    return `The WFH process begins with associates submitting requests at least 24 hours in advance via the HR Channel, including reason, dates, and expected working hours. Line Managers review and provide pre-approval based on operational needs, followed by HR final approval that verifies compliance and notifies all parties. On the WFH day, associates must create a thread in the HR Channel before work starts with daily actions and engagement links, clock in on DQ Shifts, and remain active on DQ Live24 throughout working hours. Associates must follow their day plan, provide regular updates, respond promptly, attend all calls, and at end of day post completed tasks, outstanding items, and blockers in the HR thread. HRA and Line Managers monitor adherence, and failure to post updates or remain active may result in the day being treated as unpaid and can lead to revocation of WFH privileges or performance review.`;
  }

  return 'The process requires associates to submit requests 24 hours in advance via the HR Channel with reason and dates, obtain Line Manager pre-approval and HR final approval, post daily action plans and engagement links before work starts, clock in on DQ Shifts and remain active on DQ Live24, execute work with regular updates and communication, and record deliverables at end of day. Failure to comply may result in unpaid workday treatment and revocation of WFH privileges.';
};

const extractWFHProcessSteps = (content: string): string[] => {
  const processSteps: string[] = [];
  const lines = content.split('\n');
  let inProcessSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.match(/^##+\s+.*[Ww]FH\s+[Pp]rocess/i) || trimmed.match(/^##+\s+.*[Pp]rocess/i)) {
      inProcessSection = true;
      continue;
    }

    if (inProcessSection && trimmed.match(/^##+\s+[^4]/)) {
      break;
    }

    if (inProcessSection && trimmed.match(/^\d+\.\s+/)) {
      const stepText = trimmed.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim();
      if (stepText.length > 20) {
        processSteps.push(stepText);
      }
    }
  }

  return processSteps;
};

const buildIntroParagraph = (article: NewsItem & { content?: string }): string => {
  const introFromExcerpt = buildIntroFromExcerpt(article.excerpt);
  if (introFromExcerpt) return introFromExcerpt;

  const introFromContent = buildIntroFromContent(article.content);
  if (introFromContent) return introFromContent;

  return 'This announcement provides important information and updates that will impact our organization.';
};

const buildIntroFromExcerpt = (excerpt?: string): string => {
  if (!excerpt || excerpt.length <= 30) return '';
  return ensureSentenceEnding(excerpt);
};

const buildIntroFromContent = (content?: string): string => {
  if (!content) return '';
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.match(/^#+\s+/)) continue;
    if (trimmed.match(/^[-*\d.]\s+/)) continue;
    if (trimmed.match(/^➜\s+/)) continue;

    const cleanLine = trimmed.replace(/\*\*/g, '').replace(/\*/g, '');
    if (cleanLine.length > 50) {
      return ensureSentenceEnding(cleanLine);
    }
  }

  return '';
};

const addExtractedSections = (overview: string[], article: NewsItem & { content?: string }): void => {
  if (!article.content) return;
  const extractedSections = extractContentSections(article.content);

  for (const section of extractedSections) {
    if (overview.length >= 4) break;

    const cleanSection = ensureSentenceEnding(section.trim());
    if (cleanSection.length <= 50) continue;
    if (overview.some(p => p.includes(cleanSection.substring(0, 30)))) continue;

    overview.push(cleanSection);
  }
};

const extractContentSections = (content: string): string[] => {
  const lines = content.split('\n');
  const extractedSections: string[] = [];
  let currentSection = '';

  const flushSection = () => {
    if (currentSection && currentSection.trim().length > 80) {
      extractedSections.push(currentSection.trim());
    }
    currentSection = '';
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushSection();
      continue;
    }

    const headingMatch = trimmed.match(/^##+\s+(.+)$/);
    if (headingMatch) {
      flushSection();
      const headingText = headingMatch[1].trim().replace(/\*\*/g, '').replace(/\*/g, '');
      currentSection = headingText + ': ';
      continue;
    }

    const listMatch = trimmed.match(/^[-*\d.]\s+/) || trimmed.match(/^➜\s+/);
    if (listMatch) {
      const listContent = trimmed.replace(/^[-*\d.]\s+/, '').replace(/^➜\s+/, '').trim();
      const cleanContent = listContent.replace(/\*\*/g, '').replace(/\*/g, '');
      if (cleanContent.length > 30) {
        currentSection = appendSentence(currentSection, cleanContent);
      }
      continue;
    }

    if (!trimmed.match(/^#+\s+/)) {
      const cleanText = trimmed.replace(/\*\*/g, '').replace(/\*/g, '').trim();
      if (cleanText.length > 30) {
        currentSection = appendText(currentSection, cleanText);
      }
    }
  }

  flushSection();
  return extractedSections;
};

const appendSentence = (current: string, sentence: string): string => {
  if (!current) return sentence + '. ';
  return current + sentence + '. ';
};

const appendText = (current: string, text: string): string => {
  if (!current) return text + ' ';
  return current + text + ' ';
};

const ensureSentenceEnding = (text: string): string => {
  if (!text.match(/[.!?]$/)) {
    return text + '.';
  }
  return text;
};

const fillDefaultParagraphs = (overview: string[]): void => {
  const defaultParagraphs = [
    'These guidelines and procedures are designed to ensure consistency, fairness, and operational excellence across all teams and departments.',
    'Implementation of these updates will begin immediately, and we encourage all associates to familiarize themselves with the new requirements.',
    'For questions or clarifications regarding this announcement, please reach out to the relevant contact person listed above or your department lead.'
  ];

  while (overview.length < 4) {
    const defaultIndex = overview.length - 1;
    if (defaultIndex < defaultParagraphs.length) {
      overview.push(defaultParagraphs[defaultIndex]);
      continue;
    }

    overview.push('We encourage all associates to review the details carefully and reach out with any questions or concerns.');
    break;
  }
};
