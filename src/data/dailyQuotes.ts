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
    role: "NBA Coach & Author",
  },
  {
    id: "2",
    text: "The strength of the team is each individual member. The strength of each member is the team.",
    author: "Phil Jackson",
    role: "NBA Coach & Author",
  },
  {
    id: "3",
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
  },
  {
    id: "4",
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
  },
  {
    id: "5",
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    role: "Management Consultant & Author",
  },
  {
    id: "6",
    text: "Efficiency is doing things right. Effectiveness is doing the right things.",
    author: "Peter Drucker",
    role: "Management Consultant & Author",
  },
  {
    id: "7",
    text: "Leadership is not about being in charge. It is about taking care of those in your charge.",
    author: "Simon Sinek",
    role: "Author & Leadership Expert",
  },
  {
    id: "8",
    text: "Start with why — people don't buy what you do, they buy why you do it.",
    author: "Simon Sinek",
    role: "Author & Leadership Expert",
  },
  {
    id: "9",
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    role: "Theoretical Physicist",
  },
  {
    id: "10",
    text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
    author: "Albert Einstein",
    role: "Theoretical Physicist",
  },
  {
    id: "11",
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    role: "Former President of South Africa",
  },
  {
    id: "12",
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    role: "Former President of South Africa",
  },
  {
    id: "13",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    role: "Author & Humorist",
  },
  {
    id: "14",
    text: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain",
    role: "Author & Humorist",
  },
  {
    id: "15",
    text: "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
    author: "Mark Zuckerberg",
    role: "Co-founder & CEO, Meta",
  },
  {
    id: "16",
    text: "The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
    author: "Mark Zuckerberg",
    role: "Co-founder & CEO, Meta",
  },
  {
    id: "17",
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    role: "Ancient Greek Philosopher",
  },
  {
    id: "18",
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
    role: "Ancient Greek Philosopher",
  },
  {
    id: "19",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    role: "Co-founder, Apple",
  },
  {
    id: "20",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    role: "Author & Humorist",
  },
  {
    id: "21",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    role: "Former Prime Minister of the UK",
  },
  {
    id: "22",
    text: "We make a living by what we get, but we make a life by what we give.",
    author: "Winston Churchill",
    role: "Former Prime Minister of the UK",
  },
  {
    id: "23",
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    role: "Co-founder, The Walt Disney Company",
  },
  {
    id: "24",
    text: "All our dreams can come true, if we have the courage to pursue them.",
    author: "Walt Disney",
    role: "Co-founder, The Walt Disney Company",
  },
  {
    id: "25",
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    role: "Founding Father & Inventor",
  },
  {
    id: "26",
    text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    role: "Founding Father & Inventor",
  },
  {
    id: "27",
    text: "The function of leadership is to produce more leaders, not more followers.",
    author: "Ralph Nader",
    role: "Political Activist & Author",
  },
  {
    id: "28",
    text: "Coming together is a beginning, staying together is progress, and working together is success.",
    author: "Henry Ford",
    role: "Founder, Ford Motor Company",
  },
  {
    id: "29",
    text: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford",
    role: "Founder, Ford Motor Company",
  },
  {
    id: "30",
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    role: "32nd President of the United States",
  },
];

export const getRandomQuote = (): DailyQuote => {
  const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
  return dailyQuotes[randomIndex];
};
