"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/auth-actions";

export default function LogOutPage() {
  return (
    <Button onClick={signout}>
      Log out
    </Button>
  );
}