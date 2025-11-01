"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await (await supabase).auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
    } catch (err: any) {
      setError("Failed to reset password. Try again.");
    }
  };

  if (code) {
    return (
      <div className="min-h-screen flex flex-col items-start bg-gradient-to-br from-blue-50 to-purple-100 px-4 w-full pt-10">
        <h1
          className="text-4xl font-extrabold mb-8 drop-shadow-lg mt-10 ml-4"
          style={{
            fontFamily: "'Lucida Handwriting', 'Lucida Handwriting Italic', 'Comic Sans MS', cursive, sans-serif",
            letterSpacing: "2px",
            textShadow: "2px 2px 8px #aaa, 0 0 2px #000"
          }}
        >
          Idea2Project Genie
        </h1>
        <form
          onSubmit={handleReset}
          className="bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col gap-4 max-w-md w-full ml-4"
        >
          <h2 className="text-2xl font-bold text-center mb-2">Set New Password</h2>
          <input
            type="password"
            required
            placeholder="Enter new password"
            className="border rounded px-4 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={done}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded font-semibold disabled:opacity-60"
            disabled={done}
          >
            {done ? "Password Reset!" : "Set Password"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    );
  }
  return null;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}