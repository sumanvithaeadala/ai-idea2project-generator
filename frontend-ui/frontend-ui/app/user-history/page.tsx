"use client";
import UserHistory from "@/app/user-history/components/UserHistory";

export default function UserHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-start">
      <div className="w-full">
        <UserHistory />
      </div>
    </div>
  );
}