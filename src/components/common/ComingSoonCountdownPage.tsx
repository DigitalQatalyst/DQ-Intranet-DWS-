import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ComingSoonCountdownPageProps {
  title?: string;
  description?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getEndOfDecember = (): Date => {
  const now = new Date();
  const year = now.getFullYear();
  return new Date(year, 11, 31, 23, 59, 59);
};

const calculateTimeLeft = (target: Date): TimeLeft => {
  const difference = target.getTime() - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const ComingSoonCountdownPage: React.FC<ComingSoonCountdownPageProps> = ({
  title = "Coming Soon",
  description = "We're building something exciting. Stay tuned.",
}) => {
  const targetDate = getEndOfDecember();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute w-40 h-24 bg-[#F3F4F6] rounded-full top-16 left-10" />
        <div className="absolute w-36 h-36 bg-[#F3F4F6] rounded-full top-28 right-32" />
        <div className="absolute w-32 h-20 bg-[#F3F4F6] rounded-full bottom-24 left-1/4" />
        <div className="absolute w-24 h-24 bg-[#F3F4F6] rounded-full bottom-10 right-10" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#101848]">
          {title}
        </h1>

        <p className="text-[#101848]/70 mb-8">{description}</p>

        <div className="flex justify-center gap-3 mb-8">
          {[
            { label: "DAYS", value: days },
            { label: "HOURS", value: hours },
            { label: "MINUTES", value: minutes },
            { label: "SECONDS", value: seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-[#101848]/15 shadow-sm rounded-lg px-4 py-3 min-w-[72px]"
            >
              <div className="text-2xl font-bold text-[#101848]">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-medium text-[#101848]/60 tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-[#FB5535]" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3478F6] text-white text-sm font-medium shadow-md hover:bg-[#275ECC] transition-colors"
        >
          &larr; Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoonCountdownPage;
