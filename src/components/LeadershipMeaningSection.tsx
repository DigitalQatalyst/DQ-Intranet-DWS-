import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, Zap, ArrowRight } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";
import { KNOWLEDGE_CENTER_LEADERSHIP_GUIDES_URL } from "../constants/leadspaceLinks";

type LeadershipValueCard = {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  href: string;
};

const LEADERSHIP_VALUES: LeadershipValueCard[] = [
  {
    key: "curiosity",
    icon: <TrendingUp size={24} />,
    title: "Curiosity",
    description: "Ask questions, explore new ideas, and stay open to learning.",
    leftLabel: "Focus",
    leftValue: "Learning mindset",
    rightLabel: "Practice",
    rightValue: "Questions & experiments",
    href: "/knowledge-center/leadership-articles?tag=curiosity",
  },
  {
    key: "empathy",
    icon: <Users size={24} />,
    title: "Empathy",
    description: "Understand others, build trust, and lead with compassion.",
    leftLabel: "Focus",
    leftValue: "Trust & connection",
    rightLabel: "Practice",
    rightValue: "Listening & feedback",
    href: "/knowledge-center/leadership-articles?tag=empathy",
  },
  {
    key: "courage",
    icon: <Zap size={24} />,
    title: "Courage",
    description: "Take risks, make decisions, and stand by your values.",
    leftLabel: "Focus",
    leftValue: "Bold decisions",
    rightLabel: "Practice",
    rightValue: "Action & ownership",
    href: "/knowledge-center/leadership-articles?tag=courage",
  },
];

export const LeadershipMeaningSection: React.FC = () => {
  return (
    <section id="leadership-meaning" className="py-16 md:py-20 lg:py-24 bg-slate-50 scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
            What Leadership Means at DQ
          </h2>
          <p className="text-sm md:text-base max-w-2xl mx-auto text-slate-600">
            At DQ, leadership isn't about titles or hierarchy—it's about influence, impact, and intention. Every associate has the potential to lead, whether that's leading a project, leading a conversation, or leading by example.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {LEADERSHIP_VALUES.map((card) => (
            <FadeInUpOnScroll key={card.key}>
              <article className="h-full rounded-2xl bg-white border border-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.05)] p-6 flex flex-col">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4 flex-1">
                  {card.description}
                </p>
                <dl className="space-y-1 text-sm">
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-800">{card.leftLabel}:</dt>
                    <dd className="text-slate-600">{card.leftValue}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-800">{card.rightLabel}:</dt>
                    <dd className="text-slate-600">{card.rightValue}</dd>
                  </div>
                </dl>
              </article>
            </FadeInUpOnScroll>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to={KNOWLEDGE_CENTER_LEADERSHIP_GUIDES_URL}
            className="inline-flex items-center px-6 py-3 rounded-full text-white text-sm font-semibold transition"
            style={{
              background: '#FF6B4D',
              boxShadow: '0 4px 12px rgba(255, 107, 77, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF5A3A';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 107, 77, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FF6B4D';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 77, 0.4)';
            }}
            aria-label="Explore Knowledge Center"
          >
            Explore Knowledge Center
            <span className="ml-2 text-lg leading-none">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeadershipMeaningSection;

