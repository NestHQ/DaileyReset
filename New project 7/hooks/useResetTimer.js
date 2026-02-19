"use client";

import { useEffect, useMemo, useState } from "react";

const TOTAL_SECONDS = 180;

export function useResetTimer() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [running, secondsLeft]);

  const phase = useMemo(() => {
    if (secondsLeft > 120) return "breathing";
    if (secondsLeft > 60) return "reflection";
    if (secondsLeft > 0) return "intention";
    return "complete";
  }, [secondsLeft]);

  const breathCue = useMemo(() => {
    const elapsed = TOTAL_SECONDS - secondsLeft;
    return Math.floor(elapsed / 4) % 2 === 0 ? "Inhale..." : "Exhale...";
  }, [secondsLeft]);

  const reset = () => {
    setSecondsLeft(TOTAL_SECONDS);
    setRunning(true);
  };

  return {
    secondsLeft,
    phase,
    running,
    setRunning,
    breathCue,
    reset,
    done: secondsLeft === 0,
  };
}
