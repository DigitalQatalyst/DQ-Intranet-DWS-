import React from "react";
import { MessageCircle, Eye, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: "amira",
    name: "Amira Khalid",
    role: "Lead Coach • Dubai",
    quote:
      "Becoming a DQ Lead meant learning to steer clarity. The rhythm and toolkit keep our teams confident about where we’re heading next.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "joseph",
    name: "Joseph Mwangi",
    role: "Product Lead • Nairobi",
    quote:
      "The lead pathway gave me mentors who challenged my thinking. Now I help squads translate OKRs into the everyday decisions they make.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "leila",
    name: "Leila Haddad",
    role: "Practice Lead • Riyadh",
    quote:
      "We co-create delivery habits that scale. Coaching 1:1s, shadow sprints, and transparent dashboards keep every voice in sync.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80",
  },
];

const MENTORS = [
  {
    id: "mentor-1",
    name: "Sasha Lopez",
    role: "Delivery Lead • Hybrid work orchestration",
    focus: ["Flow & Visibility", "Retrospectives", "Stakeholder comms"],
    location: "Dubai",
    availability: "Weekly shadow slots",
  },
  {
    id: "mentor-2",
    name: "Omar Rahman",
    role: "Practice Lead • Data & Intelligence",
    focus: ["Insights reporting", "DoR/DoD adoption", "Growth coaching"],
    location: "Nairobi",
    availability: "Bi-weekly group clinics",
  },
  {
    id: "mentor-3",
    name: "Nadine Farah",
    role: "Product Lead • Customer journeys",
    focus: ["Outcome roadmaps", "Story mapping", "Prioritisation"],
    location: "Dubai",
    availability: "Sprint-based pairing",
  },
  {
    id: "mentor-4",
    name: "Leo Fernandes",
    role: "Platform Lead • SecDevOps tooling",
    focus: ["Quality gates", "Risk reviews", "Automation playbooks"],
    location: "Remote • GMT+3",
    availability: "Async feedback windows",
  },
  {
    id: "mentor-5",
    name: "Hawa Leblanc",
    role: "Community Lead • Chapter enablement",
    focus: ["Knowledge sharing", "Showcases", "Mentor pairing"],
    location: "Nairobi",
    availability: "Monthly sync series",
  },
  {
    id: "mentor-6",
    name: "Marcus Patel",
    role: "Program Lead • Transformation streams",
    focus: ["Risk escalations", "Executive comms", "OKR cadence"],
    location: "Riyadh",
    availability: "Shadow sprint seats",
  },
  {
    id: "mentor-7",
    name: "Saanvi Kapoor",
    role: "Operations Lead • Enablement & rituals",
    focus: ["Ceremony design", "Feedback loops", "Lead onboarding"],
    location: "Dubai",
    availability: "Office hours each Thursday",
  },
  {
    id: "mentor-8",
    name: "Jonah Adebayo",
    role: "Experience Lead • Service design",
    focus: ["Journey clarity", "Voice of customer", "Demo storytelling"],
    location: "Remote • GMT+4",
    availability: "Fortnightly deep-dives",
  },
  {
    id: "mentor-9",
    name: "Rania Soliman",
    role: "Culture Lead • People growth",
    focus: ["1:1 coaching", "Recognition habits", "Psychological safety"],
    location: "Dubai",
    availability: "Drop-in coaching pods",
  },
];

const CARD_BASE =
  "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition";

const VoicesMentors: React.FC = () => {
  return (
    <section
      id="voices-mentors"
      className="py-16 md:py-20 pb-20"
      style={{ backgroundColor: "#F9FAFB" }}
      aria-labelledby="voices-mentors-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2
            id="voices-mentors-heading"
            className="font-serif text-[32px] md:text-[40px] font-bold tracking-[0.04em] leading-tight text-[#030F35] mb-3"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Voices &amp; Mentors
          </h2>
          <p
            className="text-sm md:text-base max-w-[720px] mx-auto leading-relaxed"
            style={{ color: "#334266", opacity: 0.85 }}
          >
            Hear from DQ Leads in the field and connect with mentors ready to help you shape
            delivery, collaboration, and growth.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid gap-5 md:grid-cols-3 mb-12">
          {TESTIMONIALS.map((item) => (
            <article key={item.id} className={`${CARD_BASE} p-6 flex flex-col`}>
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-base font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.role}</p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-600">
                <Quote className="h-5 w-5 text-[#FB5535]" aria-hidden="true" />
                <p className="clamp-4">{item.quote}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Mentor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTORS.map((mentor) => (
            <article key={mentor.id} className={`${CARD_BASE} p-6 flex flex-col`}>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                  {mentor.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0] || "")
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-slate-900">{mentor.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 clamp-2">{mentor.role}</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    <span>{mentor.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {mentor.focus.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Availability
              </p>
              <p className="mt-1 text-sm text-slate-600">{mentor.availability}</p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a
                  href="#support"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#131E42] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0F1633]"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Talk to a Lead
                </a>
                <a
                  href="#paths"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#131E42] hover:text-[#131E42]"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Shadow Opportunity
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#support" className="dws-btn-primary inline-flex items-center gap-2">
            Meet All Mentors
          </a>
        </div>
      </div>
    </section>
  );
};

export default VoicesMentors;
