import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function IntroAnimation({
  onPlayBGM,
  onDone,
}: {
  onPlayBGM: () => void;
  onDone: () => void;
}) {
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const full = "CODE. CREATE. ELEVATE.";

  useEffect(() => {
    if (!started) return;

    // Start typing after 1.2s when the eyes are fully open
    const startTyping = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setTyped(full.slice(0, i));
        if (i >= full.length) clearInterval(t);
      }, 75);
      return () => clearInterval(t);
    }, 1200);

    // End intro animation after 4.4 seconds
    const exit = setTimeout(onDone, 4400);

    return () => {
      clearTimeout(startTyping);
      clearTimeout(exit);
    };
  }, [started, onDone]);

  if (!started) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none">
        {/* Star particles */}
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-cyan/40 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Splash Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 }}
          className="text-center z-10 px-4 flex flex-col items-center"
        >
          <div className="flex justify-center mb-6">
            <img
              src="/college-logo.png"
              className="h-16 w-auto opacity-70 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              alt="IEEE SB Logo"
            />
          </div>

          <h1 className="font-display font-black gradient-text tracking-widest text-4xl sm:text-6xl mb-2 animate-pulse">
            HACKSPIRIT
          </h1>
          <p className="text-muted text-xs sm:text-sm tracking-[0.3em] uppercase mb-12">
            IEEE Student Branch | NBKRIST
          </p>

          <button
            onClick={() => {
              onPlayBGM();
              setStarted(true);
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet/20 to-cyan/20 border-2 border-cyan/40 rounded-xl text-white font-display text-sm tracking-widest hover:border-cyan hover:bg-gradient-to-r hover:from-violet/40 hover:to-cyan/40 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]"
          >
            <span>INITIALIZE EXPERIENCE</span>
            <span className="text-cyan group-hover:scale-125 transition-transform duration-300">🔊</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      initial={{ y: 0 }}
      exit={{ y: "-100vh" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} // smooth sliding transition
    >
      {/* Background Star Particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-cyan animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.4 + 0.2,
          }}
        />
      ))}

      {/* Menacing Glowing Eyes SVG */}
      <div className="relative flex items-center justify-center w-full max-w-[400px] h-[150px]">
        {/* Glow behind the eyes */}
        <motion.div
          className="absolute w-[280px] h-[80px] bg-red/10 rounded-full blur-[40px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.4, 0.2, 0.4, 0.4, 0.2, 0.4, 0.3, 0] }}
          transition={{
            times: [0, 0.12, 0.45, 0.47, 0.49, 0.75, 0.77, 0.79, 0.9, 1.0],
            duration: 4.0,
            ease: "easeInOut",
          }}
        />

        <svg
          viewBox="0 0 400 120"
          className="w-[260px] sm:w-[360px] h-auto z-10 pointer-events-none drop-shadow-[0_0_8px_rgba(239,68,68,0.75)]"
        >
          <motion.g
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: [0, 1, 1, 0.1, 1, 1, 0.1, 1, 1, 0],
              opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0.8, 0],
            }}
            transition={{
              times: [0, 0.12, 0.45, 0.47, 0.49, 0.75, 0.77, 0.79, 0.9, 1.0],
              duration: 4.0,
              ease: "easeInOut",
            }}
            style={{ originY: 0.5, originX: 0.5 }}
          >
            {/* Left Eye */}
            <path
              d="M 60 40 Q 130 35, 175 75 Q 120 70, 60 40 Z"
              fill="#ffffff"
              style={{
                filter: "drop-shadow(0 0 3px rgba(255,255,255,1)) drop-shadow(0 0 10px rgba(6,182,212,0.8))",
              }}
            />
            {/* Right Eye */}
            <path
              d="M 340 40 Q 270 35, 225 75 Q 280 70, 340 40 Z"
              fill="#ffffff"
              style={{
                filter: "drop-shadow(0 0 3px rgba(255,255,255,1)) drop-shadow(0 0 10px rgba(6,182,212,0.8))",
              }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Branding Header */}
      <motion.h1
        className="font-display font-black gradient-text animate-glitch mt-6 tracking-wider"
        style={{ fontSize: "clamp(44px, 8vw, 76px)", perspective: 800 }}
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      >
        HACKSPIRIT
      </motion.h1>

      {/* Sub-text typewriter */}
      <p className="font-display text-cyan mt-3 tracking-[0.3em] text-xs sm:text-sm h-6">
        {typed}
        <span className="animate-pulse">|</span>
      </p>

      {/* Organizer footnote */}
      <motion.p
        className="text-muted mt-5 text-xs tracking-widest opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        IEEE Student Branch | NBKRIST
      </motion.p>
    </motion.div>
  );
}
