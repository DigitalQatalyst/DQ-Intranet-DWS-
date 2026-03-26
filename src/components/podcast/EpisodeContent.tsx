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

type ParseState = {
  elements: JSX.Element[];
  currentParagraph: string[];
  keyCounter: number;
};

function toTitleCase(text: string): string {
  return text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function flushParagraph(state: ParseState): void {
  if (state.currentParagraph.length === 0) return;
  const paraText = state.currentParagraph.join(' ').trim();
  if (paraText) {
    state.elements.push(
      <p key={state.keyCounter++} className="text-gray-700 text-sm leading-normal mb-2">
        {parseBold(paraText)}
      </p>
    );
  }
  state.currentParagraph = [];
}

function renderFocusHeading(level: number, headingText: string, key: number): JSX.Element {
  const titleCase = toTitleCase(headingText);
  if (level === 2) {
    return (
      <h3 key={key} className="text-lg font-bold text-gray-900 mt-6 mb-4 pl-4 relative">
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1A2E6E] via-[#1A2E6E]/80 to-transparent" />
        {titleCase}
      </h3>
    );
  }
  return <h4 key={key} className="text-base font-bold text-gray-900 mt-4 mb-3">{titleCase}</h4>;
}

type HeadingAction = 'continue' | 'break';

function handleHeadingLine(
  headingMatch: RegExpMatchArray,
  inFocusSection: boolean,
  state: ParseState
): { action: HeadingAction; inFocusSection: boolean } {
  const level = headingMatch[1].length;
  const headingText = headingMatch[2].trim();

  if (inFocusSection && !isFocusHeading(headingText)) {
    flushParagraph(state);
    return { action: 'break', inFocusSection };
  }

  if (isFocusHeading(headingText)) {
    flushParagraph(state);
    state.elements.push(renderFocusHeading(level, headingText, state.keyCounter++));
    return { action: 'continue', inFocusSection: true };
  }

  return { action: 'continue', inFocusSection };
}

function parseEpisodeContent(content: string): JSX.Element[] {
  const lines = content.split('\n');
  const state: ParseState = { elements: [], currentParagraph: [], keyCounter: 0 };
  let firstHeadingSkipped = false;
  let inFocusSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!firstHeadingSkipped && trimmed.match(/^#+\s+/)) {
      firstHeadingSkipped = true;
      continue;
    }

    const headingMatch = trimmed.match(/^(##+)\s+(.+)$/);
    if (headingMatch) {
      const { action, inFocusSection: newFocus } = handleHeadingLine(headingMatch, inFocusSection, state);
      inFocusSection = newFocus;
      if (action === 'break') break;
      continue;
    }

    if (inFocusSection) state.currentParagraph.push(trimmed);
  }

  if (inFocusSection) flushParagraph(state);
  return state.elements;
}

export const EpisodeContent: React.FC<EpisodeContentProps> = ({ content }) => {
  if (!content) return null;
  return <>{parseEpisodeContent(content)}</>;
};
