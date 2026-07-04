import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState("");
  const full = "CODE. CREATE. ELEVATE.";

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 70);
    const exit = setTimeout(onDone, 2800);
    return () => {
      clearInterval(t);
      clearTimeout(exit);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: "-100vh" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.6,
          }}
        />
      ))}
      <motion.h1
        className="font-display font-black gradient-text animate-glitch"
        style={{ fontSize: "clamp(48px, 10vw, 80px)", perspective: 800 }}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        HACKSPIRIT
      </motion.h1>
      <p className="font-display text-cyan mt-4 tracking-[0.3em] text-sm sm:text-base h-6">
        {typed}
        <span className="animate-pulse">|</span>
      </p>
      <motion.p
        className="text-muted mt-6 text-xs sm:text-sm tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        IEEE Student Branch | NBKRIST
      </motion.p>
    </motion.div>
  );
}
