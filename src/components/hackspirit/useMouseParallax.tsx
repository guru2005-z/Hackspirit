import { useEffect, useState } from "react";

/**
 * Tracks normalized mouse position (-1..1 on each axis, centered at 0,0)
 * for use in parallax depth effects. Returns {0,0} on touch devices / when
 * the mouse hasn't moved yet, so content starts centered.
 */
export function useMouseParallax(strength = 1) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setPos({ x: x * strength, y: y * strength });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength]);

  return pos;
}
