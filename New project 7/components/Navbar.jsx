"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTheme } from "@/hooks/useTheme";
import { useUserStreak } from "@/hooks/useUserStreak";

export function Navbar() {
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();
  const { streak, email } = useUserStreak();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="page-shell" style={{ padding: "16px 0" }}>
      <nav className="panel" style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <Link href="/" style={{ fontWeight: 700 }}>Daily Reset</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span className="btn btn-secondary" style={{ padding: "8px 12px", cursor: "default" }}>🔥 {streak} day streak</span>
          <Link className="btn btn-secondary" href="/leaderboard">Leaderboard</Link>
          <button className="btn btn-secondary" type="button" onClick={toggleTheme}>
            {darkMode ? "Light" : "Dark"}
          </button>
          {email && (
            <button className="btn btn-secondary" type="button" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
