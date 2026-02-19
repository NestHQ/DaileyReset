import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="page-shell" style={{ paddingBottom: 36 }}>
      <section className="panel fade-slide" style={{ padding: 28, textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ margin: 0 }}>Payment Successful</h1>
        <p style={{ color: "var(--muted)", marginTop: 10 }}>
          Your plan is active. Continue to your dashboard.
        </p>
        <div style={{ marginTop: 16 }}>
          <Link className="btn btn-primary" href="/dashboard">Go to Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
