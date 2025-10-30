import React from "react";
import ChatForm from "./components/ChatForm";
import { cookies } from "next/headers";

async function getUserId() {
  const userId = (await cookies()).get("user_uuid")?.value;
  return userId;
}

const ChatPage = async () => {
  const userId = await getUserId();

  return (
    <div className="flex h-svh items-center" suppressHydrationWarning>
      <ChatForm user_uuid={userId} />
    </div>
  );
};

export default ChatPage;