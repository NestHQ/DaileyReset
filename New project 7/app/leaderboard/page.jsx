"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function badge(longestStreak) {
  if (longestStreak >= 30) return "🚀 Unstoppable";
  if (longestStreak >= 7) return "🔥 On Fire";
  return "";
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user?.id || "");

      const { data, error: usersError } = await supabase
        .from("users")
        .select("id,username,current_streak,longest_streak,total_resets")
        .order("longest_streak", { ascending: false })
        .order("total_resets", { ascending: false });

      if (usersError) throw usersError;
      setRows(data || []);
    } catch {
      setError("Could not load leaderboard right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel("users-leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => {
        load();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const rankedRows = useMemo(() => rows.map((row, i) => ({ ...row, rank: i + 1 })), [rows]);

  return (
    <main className="page-shell" style={{ paddingBottom: 28 }}>
      <section className="panel fade-slide" style={{ padding: 22 }}>
        <h1 style={{ margin: 0 }}>Leaderboard</h1>
        <p style={{ marginTop: 8, color: "var(--muted)" }}>Longest streak first, then total resets.</p>

        {loading && <p style={{ color: "var(--muted)" }}>Loading leaderboard...</p>}
        {error && <p style={{ color: "#c33" }}>{error}</p>}

        {!loading && !error && (
          <div style={{ overflowX: "auto", marginTop: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Rank</Th>
                  <Th>Username</Th>
                  <Th>Current</Th>
                  <Th>Longest</Th>
                  <Th>Total</Th>
                  <Th>Badge</Th>
                </tr>
              </thead>
              <tbody>
                {rankedRows.map((row) => {
                  const isCurrent = row.id === currentUserId;
                  return (
                    <tr key={row.id || row.rank} style={{ background: isCurrent ? "rgba(47,111,244,0.12)" : "transparent" }}>
                      <Td>#{row.rank}</Td>
                      <Td>{row.username || "Anonymous"}</Td>
                      <Td>{row.current_streak || 0}</Td>
                      <Td>{row.longest_streak || 0}</Td>
                      <Td>{row.total_resets || 0}</Td>
                      <Td>{badge(Number(row.longest_streak) || 0)}</Td>
                    </tr>
                  );
                })}
                {rankedRows.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 14, color: "var(--muted)" }}>
                      No resets completed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Th({ children }) {
  return <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid var(--line)", color: "var(--muted)" }}>{children}</th>;
}

function Td({ children }) {
  return <td style={{ padding: 10, borderBottom: "1px solid var(--line)" }}>{children}</td>;
}
