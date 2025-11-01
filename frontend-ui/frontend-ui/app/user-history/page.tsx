import React from "react";
import UserHistory from "./components/UserHistory";
import { cookies } from "next/headers";
import { User } from "lucide-react";

async function getUserId() {
  const userId = (await cookies()).get("user_uuid")?.value;
  return userId;
}

const UserHistoryPage = async () => {
  const userId = await getUserId();

  return (
    <div className="flex h-svh items-center" suppressHydrationWarning>
      <UserHistory user_uuid={userId} />
    </div>
  );
};

export default UserHistoryPage;