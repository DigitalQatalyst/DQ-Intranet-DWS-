import React, { useState } from "react";

const CARD_BASE =
  "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition";

type StoryForm = {
  name: string;
  role: string;
  story: string;
};

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    name: "Farah Al Mansoori",
    role: "Squad Lead • Dubai",
    quote:
      "Coaching a new Delivery Lead through their first shadow sprint reminded me that clarity beats speed. We shipped on time because we paused to realign.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: "testimonial-2",
    name: "Kelvin Otieno",
    role: "Practice Lead • Nairobi",
    quote:
      "We tightened our DoR/DoD playbook and defects dropped 30%. The best part? Seeing the squad celebrate the craft win in our retro.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80",
  },
];

const MAX_STORY_LENGTH = 400;

const LeadershipStories: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<StoryForm>({ name: "", role: "", story: "" });
  const [feedback, setFeedback] = useState<string | null>(null);

  const remaining = MAX_STORY_LENGTH - form.story.length;

  const handleChange = (field: keyof StoryForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = field === "story" ? event.target.value.slice(0, MAX_STORY_LENGTH) : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setFeedback(null);
    };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.story.trim()) {
      setFeedback("Please complete every field before submitting.");
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      // Placeholder request — replace with actual endpoint when ready
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log("Submitted story", form); // eslint-disable-line no-console
      setFeedback("Thanks! Your story has been received.");
      setForm({ name: "", role: "", story: "" });
    } catch (error) {
      setFeedback("Something went wrong. Please try again shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="stories"
      className="py-16 md:py-20"
      style={{ backgroundColor: "#F9FAFB" }}
      aria-labelledby="stories-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="stories-heading"
            className="font-serif text-[32px] md:text-[40px] font-bold tracking-[0.04em] text-[#030F35]"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Voices That Lead
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-sm md:text-base text-slate-600">
            Share your leadership moments and learn from others.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {TESTIMONIALS.map((item) => (
            <article key={item.id} className={`${CARD_BASE} p-6 flex flex-col gap-4`}>
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
              <p className="text-sm leading-6 text-slate-600">“{item.quote}”</p>
            </article>
          ))}
        </div>

        <div className={`${CARD_BASE} p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6`}>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Share Your Story</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Capture a moment that showcases how you lead — we’ll review and highlight selected stories in the DQ community.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-xl bg-[#030F35] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a1b4f]"
          >
            Share Your Story
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 id="story-modal-title" className="text-xl font-semibold text-slate-900">
                  Share Your Story
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  We’ll spotlight selected stories to inspire the next wave of DQ Leads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close story form"
              >
                ✕
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="story-name" className="text-sm font-medium text-slate-700">
                  Your name
                </label>
                <input
                  id="story-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#030F35]/20"
                  placeholder="Amira Khalid"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="story-role" className="text-sm font-medium text-slate-700">
                  Role / Squad / Location
                </label>
                <input
                  id="story-role"
                  name="role"
                  type="text"
                  value={form.role}
                  onChange={handleChange("role")}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#030F35]/20"
                  placeholder="Practice Lead • Nairobi"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="story-text" className="text-sm font-medium text-slate-700">
                  Story (max {MAX_STORY_LENGTH} characters)
                </label>
                <textarea
                  id="story-text"
                  name="story"
                  value={form.story}
                  onChange={handleChange("story")}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#030F35]/20"
                  placeholder="Tell us about a recent leadership moment…"
                  maxLength={MAX_STORY_LENGTH}
                  required
                />
                <div className={remaining < 40 ? "text-xs font-medium text-[#FB5535]" : "text-xs text-slate-500"}>
                  {remaining} characters left
                </div>
              </div>

              {feedback && (
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {feedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={
                    submitting
                      ? "inline-flex items-center rounded-lg bg-[#030F35]/70 px-4 py-2 text-sm font-semibold text-white"
                      : "inline-flex items-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a1b4f]"
                  }
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Submit Story"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeadershipStories;
