import React from "react";
import { Link } from "react-router-dom";
import { FadeInUpOnScroll } from "./AnimationUtils";

export type LeadershipStory = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  location: string;
  role: string;
  theme: string;
  href: string;
};

const LEADERSHIP_STORIES: LeadershipStory[] = [
  {
    id: "jennifer",
    title: "From Doubt to Leader",
    description: "I never saw myself as a leader until someone believed in me. Now I'm building that belief in my team.",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    location: "Nairobi",
    role: "Team Lead, Customer Success",
    theme: "Growth",
    href: "/marketplace/leadership-stories/jennifer",
  },
  {
    id: "sarah",
    title: "Speaking Up Changed Everything",
    description: "Leadership found me when I stopped waiting for permission.",
    imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
    location: "Austin",
    role: "Product Lead",
    theme: "Confidence",
    href: "/marketplace/leadership-stories/sarah",
  },
  {
    id: "james",
    title: "Listening Before Leading",
    description: "The best leaders I know listen more than they speak.",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    location: "Chicago",
    role: "Operations Manager",
    theme: "Coaching",
    href: "/marketplace/leadership-stories/james",
  },
  {
    id: "maria",
    title: "Building Trust Through Transparency",
    description: "When I started sharing challenges openly, my team started solving them together.",
    imageSrc: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    location: "Dubai",
    role: "Engineering Lead",
    theme: "Leading Teams",
    href: "/marketplace/leadership-stories/maria",
  },
  {
    id: "5",
    title: "Finding My Voice in Tough Moments",
    description: "When a project started to slip, I had to stop avoiding difficult conversations. Leaning into honest dialogue helped my team reset and move forward together.",
    imageSrc: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80",
    location: "London",
    role: "Delivery Lead",
    theme: "Change & Resilience",
    href: "/leadership-stories/finding-my-voice-in-tough-moments",
  },
  {
    id: "6",
    title: "My First Sprint as a New Lead",
    description: "Stepping into my first leadership role felt overwhelming. Small habits—preparation, 1:1 check-ins, and asking for feedback—helped me grow every sprint.",
    imageSrc: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    location: "Bengaluru",
    role: "Scrum Master",
    theme: "New to Leadership",
    href: "/leadership-stories/my-first-sprint-as-a-new-lead",
  },
];

export const LeadershipStoriesSection: React.FC = () => {
  return (
    <section id="leadership-stories" className="py-16 md:py-20 lg:py-24 bg-white scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
            Voices That Lead
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Real stories of DQ associates growing into leadership.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LEADERSHIP_STORIES.map((story, index) => (
            <FadeInUpOnScroll key={story.id} delay={index * 0.1}>
              <article className="flex flex-col rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={story.imageSrc}
                    alt={story.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
                    {story.location} · {story.role}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3 flex-1">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {story.theme}
                    </span>
                    <Link
                      to={story.href}
                      className="text-xs font-semibold text-orange-500 hover:text-orange-600"
                    >
                      Read full story →
                    </Link>
                  </div>
                </div>
              </article>
            </FadeInUpOnScroll>
          ))}
        </div>

        {/* Section CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link
            to="/marketplace/leadership-stories"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            View all leadership stories
          </Link>
          <Link
            to="/marketplace/leadership-stories/share"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            Share your story
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeadershipStoriesSection;


