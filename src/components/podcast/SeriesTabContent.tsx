import React from 'react';
import type { NewsItem } from '@/data/media/news';
import { EpisodeListItem } from './EpisodeListItem';

const CheckIcon = () => (
  <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
    <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
    {title}
  </h2>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-[11px] pt-1">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <CheckIcon />
        <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
      </li>
    ))}
  </ul>
);

const OVERVIEW_CONTENT = {
  executionMindset: {
    intro: 'The Execution Mindset Series is designed to build the mindset required to consistently move from intention to execution. It focuses on how work gets done — shifting from discussion, delay, and inconsistency to clarity, ownership, and follow-through.',
    heading: "What You'll Gain",
    items: [
      'Develop a mindset of execution over discussion',
      'Strengthen ownership from task initiation to closure',
      'Improve consistency in delivering results',
      'Build discipline in defining and completing actions',
      'Reduce delays caused by overthinking or lack of clarity',
    ],
  },
  actionSolver: {
    intro: 'The Action Solver Podcast is designed to shift how we respond to problems at work — from discussion and observation to structured action and execution.',
    intro2: 'Each episode tackles real scenarios at DQ, helping you move from passive behaviors to becoming a Practical Solver — someone who thinks clearly, acts early, and follows through.',
    heading: "What You'll Gain",
    items: [
      'Move from talking about problems → solving them',
      'Take action earlier instead of reacting late',
      'Improve decision-making with clarity and intent',
      'Strengthen ownership and follow-through',
    ],
  },
};

const HIGHLIGHTS_CONTENT = {
  executionMindset: {
    intro: 'This episode is designed for associates looking to strengthen their execution and follow-through, especially those who start tasks but struggle to close them. It is also valuable for teams aiming to improve accountability and delivery, as well as anyone looking to build a more consistent execution mindset.',
    heading: 'Approach',
    items: ['Listen Actively', 'Spot the pattern', 'Use the insights on a current task or decision'],
  },
  actionSolver: {
    intro: 'This episode is ideal for associates looking to improve how they approach challenges, especially those who find themselves stuck in discussions without action, waiting for direction, or taking unstructured actions.',
    intro2: 'It is designed for anyone ready to become a more practical and effective problem solver.',
    heading: 'Approach',
    items: ['Listen actively', 'Spot the pattern', 'Use the insight on a current task or decision'],
  },
};

const IMPACT_CONTENT = {
  executionMindset: {
    intro: "Listen to this series when tasks are started but never completed, work slows down due to unclear ownership, or when discussions keep happening but action doesn't follow. It's designed to help you cut through the noise, take control, and build consistency in how you deliver results.",
    heading: 'When to Listen',
    items: ['At the start of your day', 'Before planning your work', 'When reviewing tasks or progress', 'When work feels stuck or delayed'],
  },
  actionSolver: {
    intro: "Listen to this series when tasks are started but never completed, work slows down due to unclear ownership, or when discussions keep happening but action doesn't follow.",
    intro2: "It's designed to help you cut through the noise, take control, and build consistency in how you deliver results.",
    heading: 'When to Listen',
    items: ['At the start of your day', 'Before planning your work', 'When reviewing tasks or progress', 'When work feels stuck or delayed'],
  },
};

interface TabPanelProps {
  isExecutionMindsetSeries: boolean;
  data: {
    executionMindset: { intro: string; intro2?: string; heading: string; items: string[] };
    actionSolver: { intro: string; intro2?: string; heading: string; items: string[] };
  };
}

const TabPanel: React.FC<TabPanelProps> = ({ isExecutionMindsetSeries, data }) => {
  const content = isExecutionMindsetSeries ? data.executionMindset : data.actionSolver;
  return (
    <div className="py-2 max-w-[760px] space-y-6">
      <p className="text-base font-normal leading-[1.75] text-[#475467]">{content.intro}</p>
      {content.intro2 && <p className="text-base font-normal leading-[1.75] text-[#475467]">{content.intro2}</p>}
      <div className="space-y-3">
        <SectionHeading title={content.heading} />
        <BulletList items={content.items} />
      </div>
    </div>
  );
};

interface EpisodesTabProps {
  filteredAndSortedEpisodes: NewsItem[];
  episodeNumberMap: Map<string, number>;
  sortBy: 'latest' | 'most-listened';
  expandedEpisode: string | null;
  hoveredEpisode: string | null;
  savedEpisodes: Set<string>;
  shareSuccess: string | null;
  episodeDurations: Map<string, number>;
  searchQuery: string;
  searchResults: NewsItem[];
  isCurrentlyPlaying: (id: string) => boolean;
  isPlaying: boolean;
  onSetSearchQuery: (q: string) => void;
  onSelectFromSearch: (id: string) => void;
  onPlay: (episode: NewsItem, e: React.MouseEvent) => void;
  onExpand: (id: string, e: React.MouseEvent) => void;
  onShare: (episode: NewsItem, e: React.MouseEvent) => void;
  onDownload: (episode: NewsItem, e: React.MouseEvent) => void;
  onSave: (episode: NewsItem, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
}

const EpisodesTab: React.FC<EpisodesTabProps> = ({
  filteredAndSortedEpisodes, episodeNumberMap, sortBy, expandedEpisode, hoveredEpisode,
  savedEpisodes, shareSuccess, episodeDurations, searchQuery, searchResults,
  isCurrentlyPlaying, isPlaying,
  onSetSearchQuery, onSelectFromSearch, onPlay, onExpand, onShare, onDownload, onSave, onHover,
}) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-900">All Episodes</h2>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSetSearchQuery(e.target.value)}
            placeholder="Search episodes"
            className="w-48 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f2055]"
          />
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-48 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => onSelectFromSearch(result.id)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900 line-clamp-1">{result.title}</span>
                  <span className="text-xs text-gray-500">EP {episodeNumberMap.get(result.id)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="space-y-0 relative">
      {filteredAndSortedEpisodes.map((episode, index) => {
        const episodeNumber = episodeNumberMap.get(episode.id) ?? (sortBy === 'latest' ? filteredAndSortedEpisodes.length - index : index + 1);
        return (
          <EpisodeListItem
            key={episode.id}
            episode={episode}
            episodeNumber={episodeNumber}
            isCurrentlyPlaying={isCurrentlyPlaying(episode.id)}
            isPlaying={isPlaying}
            isExpanded={expandedEpisode === episode.id}
            isHovered={hoveredEpisode === episode.id}
            hoveredEpisode={hoveredEpisode}
            savedEpisodes={savedEpisodes}
            shareSuccess={shareSuccess}
            episodeDurations={episodeDurations}
            onPlay={onPlay}
            onExpand={onExpand}
            onShare={onShare}
            onDownload={onDownload}
            onSave={onSave}
            onHover={onHover}
          />
        );
      })}
    </div>
  </>
);

interface SeriesTabContentProps {
  activeTab: 'overview' | 'highlights' | 'impact' | 'episodes';
  isExecutionMindsetSeries: boolean;
  episodesTabProps: EpisodesTabProps;
}

export const SeriesTabContent: React.FC<SeriesTabContentProps> = ({
  activeTab, isExecutionMindsetSeries, episodesTabProps,
}) => (
  <>
    {activeTab === 'overview' && <TabPanel isExecutionMindsetSeries={isExecutionMindsetSeries} data={OVERVIEW_CONTENT} />}
    {activeTab === 'highlights' && <TabPanel isExecutionMindsetSeries={isExecutionMindsetSeries} data={HIGHLIGHTS_CONTENT} />}
    {activeTab === 'impact' && <TabPanel isExecutionMindsetSeries={isExecutionMindsetSeries} data={IMPACT_CONTENT} />}
    {activeTab === 'episodes' && <EpisodesTab {...episodesTabProps} />}
  </>
);
