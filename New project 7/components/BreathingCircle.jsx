"use client";

export function BreathingCircle({ inhale }) {
  return (
    <div style={{ display: "grid", placeItems: "center", marginBottom: 18 }}>
      <div
        style={{
          width: 190,
          height: 190,
          borderRadius: "50%",
          border: "1px solid var(--line)",
          background: "linear-gradient(135deg, rgba(47,111,244,0.14), rgba(30,168,131,0.14))",
          transform: inhale ? "scale(1.08)" : "scale(0.92)",
          transition: "transform 3.8s ease-in-out",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ fontWeight: 700, color: "var(--muted)" }}>{inhale ? "Inhale..." : "Exhale..."}</div>
      </div>
    </div>
  );
}
