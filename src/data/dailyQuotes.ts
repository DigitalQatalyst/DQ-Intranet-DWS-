export interface DailyQuote {
  id: string;
  text: string;
  author: string;
  role: string;
  avatar?: string;
}

export const dailyQuotes: DailyQuote[] = [
  {
    id: "1",
    text: "Excellence is not a singular act but a habit. You are what you repeatedly do.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "2",
    text: "The strength of the team is each individual member. The strength of each member is the team.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "3",
    text: "Good teams become great ones when the members trust each other enough to surrender the 'me' for the 'we'.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "4",
    text: "Always keep an open mind and a compassionate heart.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "5",
    text: "The key to success is not the will to win, but the will to prepare to win.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "6",
    text: "Wisdom is always an overmatch for strength.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "7",
    text: "The sign of a great player is not how much he scores, but how much he lifts his teammates' performance.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
  {
    id: "8",
    text: "Approach the game with no preset agendas and you'll probably come away surprised at your overall efforts.",
    author: "Phil Jackson",
    role: "Thought Leader",
  },
];

export const getRandomQuote = (): DailyQuote => {
  const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
  return dailyQuotes[randomIndex];
};
