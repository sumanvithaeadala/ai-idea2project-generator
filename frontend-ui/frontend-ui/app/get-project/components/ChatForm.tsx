"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import UserHistory from "@/app/user-history/components/UserHistory";
import LogOutPage from "@/app/(auth)/logout/LogOutPage";

type Message = {
  role: "user" | "assistant";
  content: string | React.ReactNode;
};

export default function ChatForm({user_uuid}: {user_uuid?: string}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi, Please enter your idea" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: (
        <span>Thinking<DotLoader /></span>
      ) },
    ]);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/generate_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_prompt: input,
          recursion_limit: 100,
          user_uuid: user_uuid,
        }),
      });

      const data = await response.json();

      let assistantContent: string | React.ReactNode;
      if (data?.signed_url) {
        assistantContent = (
          <span>
            Here is your generated project:{" "}
            <a
              href={data.signed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              project.zip
            </a>
          </span>
        );
      } else{
        assistantContent = "Sorry, something went wrong. Could you please try again after some time?";
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: assistantContent as any },
      ]);
    } catch (error) {
      console.log("Error fetching response:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex h-[100dvh] w-full bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100">
    <div className="w-1/4">
      <UserHistory user_uuid={user_uuid} />
    </div>
    <div className="flex flex-col h-full w-3/4 border rounded-lg shadow-md bg-gradient-to-br from-blue-50 to-purple-100 w-full">
      <header className="w-full py-4 px-1 border-b bg-gradient-to-br from-blue-50 to-purple-100 shadow-sm rounded-t-lg">
        <h1
          className="text-3xl font-extrabold px-30"
          style={{
            fontFamily: "'Lucida Handwriting', 'Lucida Handwriting Italic', 'Comic Sans MS', cursive, sans-serif",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px #888, 0 0 2px #000"
          }}
        >
          Idea2Project Genie
        </h1>
        <div className="absolute top-4 right-4">
          <LogOutPage />
        </div>
      </header>

      <ScrollArea className="flex-1 px-4 py-6 overflow-auto">
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-xl max-w-[80%] text-base shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold"
                    : "bg-white border text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSend}
        className="w-full max-w-3xl mx-auto px-4 py-4 border-t bg-gradient-to-br from-blue-50 to-purple-200 shadow-sm flex gap-2 sticky bottom-0"
        style={{ zIndex: 10 }}
      >
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full px-4 py-2 border-2 border-blue-200 bg-white/90 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
          autoFocus
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={!input.trim() || loading}
          size="icon"
          className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  </div>
);
}

function DotLoader() {
  return (
    <span className="inline-flex gap-0.5 align-baseline">
      <span className="animate-bounce [animation-delay:-0.32s] align-baseline" style={{ fontSize: "1.3em" }}>.</span>
      <span className="animate-bounce [animation-delay:-0.16s] align-baseline" style={{ fontSize: "1.3em" }}>.</span>
      <span className="animate-bounce align-baseline" style={{ fontSize: "1.3em" }}>.</span>
    </span>
  );
}