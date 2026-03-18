import React from 'react';

/**
 * Parse bold text (**text**) into JSX elements
 */
export const parseBold = (text: string): (string | JSX.Element)[] => {
  if (!text) return [''];
  const parts: (string | JSX.Element)[] = [];
  const regex = /\*\*([^*\n]+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(<strong key={key++}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

