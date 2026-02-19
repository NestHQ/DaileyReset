"use client";

export function ConfettiBurst({ show }) {
  if (!show) return null;

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 26 }).map((_, i) => {
        const left = (i * 17) % 100;
        const delay = (i % 6) * 0.08;
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-8%",
              left: `${left}%`,
              width: 8,
              height: 14,
              borderRadius: 3,
              background: i % 2 ? "var(--accent)" : "var(--accent-2)",
              animation: `drop 1.2s ease ${delay}s forwards`,
            }}
          />
        );
      })}
      <style>{`@keyframes drop{to{transform:translateY(120vh) rotate(360deg);opacity:0}}`}</style>
    </div>
  );
}
