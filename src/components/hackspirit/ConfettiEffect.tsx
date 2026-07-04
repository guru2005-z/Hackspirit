export function ConfettiEffect() {
  const colors = ["#7C3AED", "#06B6D4", "#F59E0B", "#10B981", "#ec4899"];
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            background: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `confetti-fall ${3 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
