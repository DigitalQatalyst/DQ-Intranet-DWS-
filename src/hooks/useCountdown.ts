import { useEffect, useState } from "react";

export type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const COUNTDOWN_INTERVAL = 1000;
const DAYS_IN_MS = 24 * 60 * 60 * 1000;

function formatCountdownPart(value: number) {
  return value.toString().padStart(2, "0");
}

function calculateCountdown(target: Date): CountdownParts {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  }

  const days = Math.floor(diff / DAYS_IN_MS);
  const hours = Math.floor((diff % DAYS_IN_MS) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  return {
    days: formatCountdownPart(days),
    hours: formatCountdownPart(hours),
    minutes: formatCountdownPart(minutes),
    seconds: formatCountdownPart(seconds),
  };
}

export function useCountdown(target: Date) {
  const [parts, setParts] = useState<CountdownParts>(() => calculateCountdown(target));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setParts(calculateCountdown(target));
    }, COUNTDOWN_INTERVAL);

    return () => window.clearInterval(interval);
  }, [target]);

  return parts;
}
