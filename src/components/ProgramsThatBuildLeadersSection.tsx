import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";
import {
  LEADS_DEVELOPMENT_PROGRAM_URL,
  LEADERSHIP_BOOTCAMP_URL,
  MENTORSHIP_CIRCLES_URL,
  LEARNING_CENTER_LEADERSHIP_PROGRAMS_URL,
} from "../constants/leadspaceLinks";

type Program = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  duration: string;
  location: string;
  highlights: string;
  ctaLabel: string;
  href: string;
};

const PROGRAMS: Program[] = [
  {
    id: "leads-development",
    title: "Leads Development Program",
    description: "A 12-week structured journey combining learning, mentorship, and real-world application.",
    imageSrc: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    duration: "12 weeks",
    location: "Nairobi, Kenya",
    highlights: "Weekly workshops, 1:1 mentoring, capstone project.",
    ctaLabel: "Apply Now",
    href: LEADS_DEVELOPMENT_PROGRAM_URL,
  },
  {
    id: "leadership-bootcamp",
    title: "Leadership Bootcamp",
    description: "An immersive 2-day onboarding experience to align new leaders with DQ's values and vision.",
    imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    duration: "2 days",
    location: "Dubai, UAE",
    highlights: "Vision alignment, team exercises, peer networking.",
    ctaLabel: "Register for Bootcamp",
    href: LEADERSHIP_BOOTCAMP_URL,
  },
  {
    id: "mentorship-circles",
    title: "Mentorship Circles",
    description: "Peer-led growth groups connecting aspiring and established leaders for shared learning and accountability.",
    imageSrc: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    duration: "Ongoing",
    location: "Hybrid · Global",
    highlights: "Monthly sessions, shared learning, guest mentors.",
    ctaLabel: "Join a Circle",
    href: MENTORSHIP_CIRCLES_URL,
  },
];

export const ProgramsThatBuildLeadersSection: React.FC = () => {
  return (
    <section id="programs-that-build-leaders" className="py-16 md:py-20 lg:py-24 bg-slate-50 scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
            Programs That Build Leaders
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Turn curiosity into capability through structured learning journeys, bootcamps, and mentoring circles.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program, index) => (
            <FadeInUpOnScroll key={program.id} delay={index * 0.1}>
              <article className="flex flex-col h-full rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={program.imageSrc}
                    alt={program.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    {program.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3">
                    {program.description}
                  </p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-700 mb-4">
                    <div>
                      <dt className="font-semibold">Duration</dt>
                      <dd>{program.duration}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Location</dt>
                      <dd>{program.location}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="font-semibold">Highlights</dt>
                      <dd>{program.highlights}</dd>
                    </div>
                  </dl>
                  <Link
                    to={program.href}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition mt-auto"
                  >
                    {program.ctaLabel} →
                  </Link>
                </div>
              </article>
            </FadeInUpOnScroll>
          ))}
        </div>

        {/* Section CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            to={LEARNING_CENTER_LEADERSHIP_PROGRAMS_URL}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            aria-label="Explore Learning Center"
          >
            Explore Learning Center
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsThatBuildLeadersSection;

