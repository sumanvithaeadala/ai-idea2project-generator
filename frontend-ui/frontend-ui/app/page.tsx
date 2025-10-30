import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import Image from "next/image";
import { LoginForm } from "./(auth)/login/components/LoginForm";

export default function Home() {
  return (
      <LoginForm />
  );
}