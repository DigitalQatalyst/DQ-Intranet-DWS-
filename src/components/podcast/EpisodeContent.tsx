import React from 'react';
import { parseBold } from '@/utils/contentParsing';

interface EpisodeContentProps {
  content: string;
}

const FOCUS_HEADING_PATTERNS = [
  'focus of the episode',
  'focus of episode',
  'goal of this episode',
  'goal of episode',
];

function isFocusHeading(text: string): boolean {
  const lower = text.toLowerCase();
  return FOCUS_HEADING_PATTERNS.some((p) => lower.includes(p));
}

function parseEpisodeContent(content: string): JSX.Element[] {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentParagraph: string[] = [];
  let keyCounter = 0;
  let firstHeadingSkipped = false;
  let inFocusSection = false;

  const flushParagraph = () => {
    if (currentParagraph.length === 0) return;
    const paraText = currentParagraph.join(' ').trim();
    if (paraText) {
      elements.push(
        <p key={keyCounter++} className="text-gray-700 text-sm leading-normal mb-2">
          {parseBold(paraText)}
        </p>
      );
    }
    currentParagraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!firstHeadingSkipped && trimmed.match(/^#+\s+/)) {
      firstHeadingSkipped = true;
      continue;
    }

    const headingMatch = trimmed.match(/^(##+)\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();

      if (inFocusSection && !isFocusHeading(headingText)) {
        flushParagraph();
        break;
      }

      if (isFocusHeading(headingText)) {
        flushParagraph();
        inFocusSection = true;
        const titleCase = headingText.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        if (level === 2) {
          elements.push(
            <h3 key={keyCounter++} className="text-lg font-bold text-gray-900 mt-6 mb-4 pl-4 relative">
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent" />
              {titleCase}
            </h3>
          );
        } else {
          elements.push(<h4 key={keyCounter++} className="text-base font-bold text-gray-900 mt-4 mb-3">{titleCase}</h4>);
        }
        continue;
      }

      if (!inFocusSection) continue;
    }

    if (inFocusSection) currentParagraph.push(trimmed);
  }

  if (inFocusSection) flushParagraph();
  return elements;
}

export const EpisodeContent: React.FC<EpisodeContentProps> = ({ content }) => {
  if (!content) return null;
  return <>{parseEpisodeContent(content)}</>;
};
