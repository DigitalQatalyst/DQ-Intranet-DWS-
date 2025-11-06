import React from "react";

const CARD_BASE =
  "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition";

type MediaItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "media-1",
    title: "Designing a Lead Shadow Sprint",
    excerpt:
      "How the DQ shadow sprint helps future leads learn by doing, with rituals that build trust and clarity from day one.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    id: "media-2",
    title: "From Coach to Practice Lead",
    excerpt:
      "A playbook for growing people-first leadership habits, including 1:1 frameworks and recognition loops used across squads.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
  {
    id: "media-3",
    title: "Operating Rhythm Reset",
    excerpt:
      "Why Leads audit stand-ups, reviews, and dashboards every quarter — and the toolkit we pair them with to stay ahead.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    href: "#",
  },
];

const LeadershipMedia: React.FC = () => {
  return (
    <section
      id="media"
      className="py-16 md:py-20"
      style={{ backgroundColor: "#F9FAFB" }}
      aria-labelledby="media-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="media-heading"
            className="font-serif text-[32px] md:text-[40px] font-bold tracking-[0.04em] text-[#030F35]"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Ideas That Move
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-sm md:text-base text-slate-600">
            Articles and resources on leading at DQ. Videos and podcasts coming soon.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {MEDIA_ITEMS.map((item) => (
            <article key={item.id} className={`${CARD_BASE} overflow-hidden`}> 
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                  {item.excerpt}
                </p>
                <a
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#030F35] transition hover:text-[#0a1b4f]"
                >
                  Read in Media Marketplace
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M7.5 5.5l5 4.5-5 4.5" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipMedia;
