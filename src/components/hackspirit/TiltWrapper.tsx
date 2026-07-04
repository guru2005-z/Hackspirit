import { useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

interface TiltWrapperProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // degrees
  glare?: boolean;
  scale?: number;
}

/**
 * Wraps any card in a subtle 3D mouse-tilt + glare effect.
 * Uses its own transform layer (independent from any parent framer-motion
 * transform), so it's safe to nest inside motion.div fade-in wrappers.
 */
export function TiltWrapper({
  children,
  className = "",
  maxTilt = 10,
  glare = true,
  scale = 1.02,
}: TiltWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    transition: "transform 0.4s ease",
  });
  const [glareStyle, setGlareStyle] = useState<CSSProperties>({ opacity: 0 });

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - py) * maxTilt * 2;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`,
      transition: "transform 0.05s linear",
    });
    if (glare) {
      setGlareStyle({
        opacity: 0.12,
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.9), transparent 60%)`,
        transition: "opacity 0.15s ease",
      });
    }
  };

  const onMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
      transition: "transform 0.4s ease",
    });
    setGlareStyle({ opacity: 0, transition: "opacity 0.4s ease" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...style, willChange: "transform", position: "relative" }}
      className={className}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={glareStyle}
        />
      )}
    </div>
  );
}
