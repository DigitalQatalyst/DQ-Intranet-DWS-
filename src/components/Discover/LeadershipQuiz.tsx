import React, { useMemo, useState } from "react";
import clsx from "clsx";

type StyleKey = "coach" | "orchestrator" | "connector";

type QuizOption = { id: string; label: string; weight: StyleKey };
type QuizQ = { id: string; title: string; options: QuizOption[] };

const QUIZ: QuizQ[] = [
  {
    id: "q1",
    title: "What energizes you most?",
    options: [
      { id: "q1a", label: "Helping teammates level up", weight: "coach" },
      { id: "q1b", label: "Coordinating multiple moving pieces", weight: "orchestrator" },
      { id: "q1c", label: "Connecting people and ideas", weight: "connector" },
    ],
  },
  {
    id: "q2",
    title: "When a sprint goes off-track, you first...",
    options: [
      { id: "q2a", label: "Coach the squad on root causes", weight: "coach" },
      { id: "q2b", label: "Re-align goals, scope, and owners", weight: "orchestrator" },
      { id: "q2c", label: "Loop in missing voices to unblock", weight: "connector" },
    ],
  },
  {
    id: "q3",
    title: "Your ideal demo showcases...",
    options: [
      { id: "q3a", label: "How people grew through the work", weight: "coach" },
      { id: "q3b", label: "Delivery speed and predictable flow", weight: "orchestrator" },
      { id: "q3c", label: "Cross-team collaboration wins", weight: "connector" },
    ],
  },
  {
    id: "q4",
    title: "Feedback from stakeholders should be...",
    options: [
      { id: "q4a", label: "Turned into coaching moments", weight: "coach" },
      { id: "q4b", label: "Converted into outcome adjustments", weight: "orchestrator" },
      { id: "q4c", label: "Shared widely to align context", weight: "connector" },
    ],
  },
  {
    id: "q5",
    title: "You measure success in...",
    options: [
      { id: "q5a", label: "Growth in capability and confidence", weight: "coach" },
      { id: "q5b", label: "Predictable delivery and clarity", weight: "orchestrator" },
      { id: "q5c", label: "Network strength and engagement", weight: "connector" },
    ],
  },
  {
    id: "q6",
    title: "Given a free afternoon, you would...",
    options: [
      { id: "q6a", label: "Mentor someone on their craft", weight: "coach" },
      { id: "q6b", label: "Design a better operating rhythm", weight: "orchestrator" },
      { id: "q6c", label: "Host a community jam session", weight: "connector" },
    ],
  },
];

const RESULT_MAP: Record<
  StyleKey,
  { title: string; description: string; role: string; path: string }
> = {
  coach: {
    title: "Coach",
    description:
      "You unlock performance by growing people, creating safe spaces, and sharing feedback that sticks.",
    role: "Practice Lead",
    path: "Mentorship pathway",
  },
  orchestrator: {
    title: "Orchestrator",
    description:
      "You thrive on clarity, coordination, and keeping outcomes moving across complex streams of work.",
    role: "Squad / Stream Lead",
    path: "Shadow sprint experience",
  },
  connector: {
    title: "Connector",
    description:
      "You build networks, amplify voices, and keep collaboration vibrating across chapters and locations.",
    role: "Community Lead",
    path: "Lead proximity program",
  },
};

const optionBase =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ring-1 ring-slate-200 whitespace-nowrap";

const LeadershipQuiz: React.FC = () => {
  const [responses, setResponses] = useState<Record<string, StyleKey | null>>(
    Object.fromEntries(QUIZ.map((q) => [q.id, null])),
  );
  const [showResult, setShowResult] = useState(false);

  const allAnswered = useMemo(
    () => QUIZ.every((q) => responses[q.id]),
    [responses],
  );

  const topStyle = useMemo<StyleKey>(() => {
    const scores: Record<StyleKey, number> = {
      coach: 0,
      orchestrator: 0,
      connector: 0,
    };
    Object.values(responses).forEach((weight) => {
      if (weight) {
        scores[weight] += 1;
      }
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return (sorted[0]?.[0] as StyleKey) || "coach";
  }, [responses]);

  const handleSelect = (questionId: string, weight: StyleKey) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: weight,
    }));
    setShowResult(false);
  };

  const handleReveal = () => {
    if (allAnswered) {
      setShowResult(true);
    }
  };

  const result = RESULT_MAP[topStyle];

  return (
    <section
      id="quiz"
      className="bg-gray-50 py-16 md:py-24"
      aria-labelledby="leadership-quiz-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="leadership-quiz-heading"
            className="font-serif text-3xl font-bold tracking-[0.04em] text-[#030F35] sm:text-4xl"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Who Are You as a Leader?
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600 sm:text-lg">
            Answer a few quick questions to discover your leadership style and next step.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-4 snap-x snap-mandatory">
            {QUIZ.map((question, index) => (
              <article
                key={question.id}
                className="min-w-[320px] snap-start rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 transition md:min-w-[560px]"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  <span>Step {index + 1}</span>
                  <span>{responses[question.id] ? "Answered" : "Pending"}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">
                  {question.title}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {question.options.map((option) => {
                    const selected = responses[question.id] === option.weight;
                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => handleSelect(question.id, option.weight)}
                        className={clsx(
                          optionBase,
                          selected
                            ? "bg-[#030F35] text-white ring-transparent"
                            : "bg-white text-slate-700 hover:bg-slate-100",
                        )}
                      >
                        <span className="mr-2 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border border-current">
                          {selected ? (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                          ) : null}
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {index === QUIZ.length - 1 && (
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleReveal}
                      disabled={!allAnswered}
                      className={clsx(
                        "inline-flex items-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white transition",
                        allAnswered ? "hover:bg-[#0a1b4f]" : "opacity-60 cursor-not-allowed",
                      )}
                    >
                      See My Results
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {showResult && (
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 md:p-8">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Your style
                </h3>
                <p className="mt-2 text-2xl font-semibold text-[#030F35]">
                  {result.title}
                </p>
                <p className="mt-3 text-sm text-slate-600">{result.description}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Suggested role
                  </h4>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {result.role}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Suggested path
                  </h4>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {result.path}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#apply"
                    className="inline-flex items-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a1b4f]"
                  >
                    Apply Now
                  </a>
                  <a
                    href="#voices-mentors"
                    className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#030F35] hover:text-[#030F35]"
                  >
                    Find a Mentor
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadershipQuiz;
