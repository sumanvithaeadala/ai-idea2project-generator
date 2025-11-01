"use client";

import { useState } from "react";
import { sendMagicLink } from "@/lib/auth-actions";

export default function SendConfirmMailAgainPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await sendMagicLink(email);
      setSent(true);
    } catch (err: any) {
      setError("Failed to send confirmation email. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 w-full py-40">
      <h1
        className="text-4xl font-extrabold mb-8 drop-shadow-lg"
        style={{
          fontFamily: "'Lucida Handwriting', 'Lucida Handwriting Italic', 'Comic Sans MS', cursive, sans-serif",
          letterSpacing: "2px",
          textShadow: "2px 2px 8px #aaa, 0 0 2px #000"
        }}
      >
        Idea2Project Genie
      </h1>
      <form
        onSubmit={handleSend}
        className="bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col gap-4 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Resend Confirmation Email</h2>
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="border rounded px-4 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={sent}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded font-semibold disabled:opacity-60"
          disabled={sent}
        >
          {sent ? "Confirmation Email Sent!" : "Send Confirmation Email"}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}