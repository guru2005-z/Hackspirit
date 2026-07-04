import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function useCountdown(target: Date) {
  const calc = useCallback(() => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(i);
  }, [calc]);
  return t;
}

function Box({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass p-3 sm:p-5 text-center min-w-[70px] sm:min-w-[100px] glow">
      <div
        className="font-display text-3xl sm:text-5xl text-cyan h-10 sm:h-14 flex items-center justify-center"
        style={{ perspective: 400 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="text-xs text-muted mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

export function CountdownTimer({
  target,
  onExpire,
}: {
  target: Date;
  onExpire?: (e: boolean) => void;
}) {
  const c = useCountdown(target);
  useEffect(() => {
    onExpire?.(c.isExpired);
  }, [c.isExpired, onExpire]);
  if (c.isExpired) {
    return (
      <div className="font-display text-2xl text-success animate-pulse-glow inline-block px-6 py-3 rounded-xl border border-success">
        🔓 UNLOCKED
      </div>
    );
  }
  return (
    <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
      <Box value={c.days} label="Days" />
      <Box value={c.hours} label="Hours" />
      <Box value={c.minutes} label="Minutes" />
      <Box value={c.seconds} label="Seconds" />
    </div>
  );
}
