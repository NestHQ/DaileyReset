import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell" style={{ paddingBottom: 36 }}>
      <section className="panel fade-slide" style={{ padding: 28 }}>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3.2rem)", lineHeight: 1.05 }}>
          Reset Your Mind in 3 Minutes.
        </h1>
        <p style={{ marginTop: 12, color: "var(--muted)", maxWidth: 680 }}>
          A calm daily loop: Breathing, Reflection, and Intention. Build momentum with streaks,
          then climb the leaderboard with consistency.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <Link className="btn btn-primary" href="/reset">Start Your Reset</Link>
          <Link className="btn btn-secondary" href="/leaderboard">View Leaderboard</Link>
        </div>
      </section>

      <section style={{ marginTop: 18, display: "grid", gap: 12 }}>
        <article className="panel fade-slide" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>How It Works</h2>
          <ol style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.7 }}>
            <li>Breathing: settle your system and slow down.</li>
            <li>Reflection: process energy drains and wins.</li>
            <li>Intention: choose one clear focus for today.</li>
          </ol>
        </article>

        <article className="panel fade-slide" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Why It Works</h2>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
            Your streak rewards consistency, and the leaderboard adds healthy social motivation.
            Daily micro-resets compound into long-term clarity.
          </p>
        </article>
      </section>
    </main>
  );
}
