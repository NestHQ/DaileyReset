"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUserStreak() {
  const [streak, setStreak] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user || !active) return;

      setEmail(user.email || "");
      const { data } = await supabase
        .from("users")
        .select("current_streak")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;
      setStreak(Number(data?.current_streak) || 0);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return { streak, email };
}
