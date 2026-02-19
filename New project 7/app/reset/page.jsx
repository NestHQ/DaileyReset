"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BreathingCircle } from "@/components/BreathingCircle";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { useResetTimer } from "@/hooks/useResetTimer";
import { supabase } from "@/lib/supabaseClient";
import { recalculateStreak } from "@/utils/streak";

export default function ResetPage() {
  const router = useRouter();
  const { secondsLeft, phase, breathCue, done } = useResetTimer();
  const [reflectionDrain, setReflectionDrain] = useState("");
  const [reflectionWin, setReflectionWin] = useState("");
  const [intention, setIntention] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const mmss = useMemo(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  const phaseTitle =
    phase === "breathing" ? "Breathing" : phase === "reflection" ? "Reflection" : phase === "intention" ? "Intention" : "Complete";

  const completeAndSave = async () => {
    setError("");
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(todayStart.getDate() + 1);

      const { count: todaysCount, error: todayCheckError } = await supabase
        .from("resets")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString())
        .lt("created_at", tomorrowStart.toISOString());

      if (todayCheckError) throw todayCheckError;

      const { data: userRow, error: userRowError } = await supabase
        .from("users")
        .select("id,current_streak,longest_streak,total_resets,last_reset_date,username")
        .eq("id", user.id)
        .maybeSingle();

      if (userRowError) throw userRowError;

      const currentStreak = Number(userRow?.current_streak) || 0;
      const longestStreak = Number(userRow?.longest_streak) || 0;
      const totalResets = Number(userRow?.total_resets) || 0;

      if ((todaysCount || 0) > 0) {
        router.push("/leaderboard");
        return;
      }

      const { data: previousResets, error: previousResetsError } = await supabase
        .from("resets")
        .select("created_at")
        .eq("user_id", user.id)
        .lt("created_at", todayStart.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (previousResetsError) throw previousResetsError;
      const lastResetDate = previousResets?.[0]?.created_at
        ? previousResets[0].created_at.split("T")[0]
        : null;

      const reflection = `Drain: ${reflectionDrain}\nWin: ${reflectionWin}`;
      const { error: insertResetError } = await supabase.from("resets").insert({
        user_id: user.id,
        reflection,
        intention,
        created_at: now.toISOString(),
      });

      if (insertResetError) throw insertResetError;

      const { nextStreak, today } = recalculateStreak({ currentStreak, lastResetDate, now });
      const nextLongest = Math.max(longestStreak, nextStreak);

      const { error: updateUserError } = await supabase.from("users").upsert(
        {
          id: user.id,
          username: userRow?.username || user.email,
          current_streak: nextStreak,
          longest_streak: nextLongest,
          total_resets: totalResets + 1,
          last_reset_date: today,
        },
        { onConflict: "id" }
      );

      if (updateUserError) throw updateUserError;

      setShowConfetti(true);
      setTimeout(() => router.push("/leaderboard"), 900);
    } catch (e) {
      setError("Could not save this reset right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell" style={{ paddingBottom: 32, position: "relative" }}>
      <ConfettiBurst show={showConfetti} />
      <section className="panel fade-slide" style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
        <h1 style={{ margin: 0 }}>3-Minute Reset</h1>
        <p style={{ marginTop: 8, color: "var(--muted)" }}>Phase: {phaseTitle}</p>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <div style={{ fontSize: "clamp(2.4rem, 11vw, 4.1rem)", fontWeight: 700 }}>{mmss}</div>
          {phase === "breathing" && (
            <>
              <BreathingCircle inhale={breathCue.includes("Inhale")} />
              <div style={{ color: "var(--muted)", fontWeight: 600 }}>{breathCue}</div>
            </>
          )}
        </div>

        {!done && phase === "reflection" && (
          <section key="reflection" className="fade-slide" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Reflection</h2>
            <p style={{ color: "var(--muted)" }}>What is draining your energy?</p>
            <textarea value={reflectionDrain} onChange={(e) => setReflectionDrain(e.target.value)} style={inputStyle} />
            <p style={{ color: "var(--muted)", marginTop: 12 }}>What was one small win yesterday?</p>
            <textarea value={reflectionWin} onChange={(e) => setReflectionWin(e.target.value)} style={inputStyle} />
          </section>
        )}

        {!done && phase === "intention" && (
          <section key="intention" className="fade-slide" style={{ marginTop: 20 }}>
            <h2 style={{ marginTop: 0 }}>Intention</h2>
            <p style={{ color: "var(--muted)" }}>What is one clear intention for today?</p>
            <input value={intention} onChange={(e) => setIntention(e.target.value)} style={inputStyle} />
          </section>
        )}

        {done && (
          <section className="fade-slide" style={{ marginTop: 20, textAlign: "center" }}>
            <h2 style={{ marginBottom: 8 }}>Reset Complete.</h2>
            <p style={{ color: "var(--muted)", marginBottom: 12 }}>You showed up today. Keep the streak alive.</p>
            <button className="btn btn-primary" disabled={saving} onClick={completeAndSave}>
              {saving ? "Saving..." : "Finish & Save"}
            </button>
            {error && <p style={{ color: "#c33", marginTop: 10 }}>{error}</p>}
          </section>
        )}
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 12,
  padding: "10px 12px",
  background: "var(--card)",
  color: "var(--text)",
};
