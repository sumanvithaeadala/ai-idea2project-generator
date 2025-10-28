import React from "react";
import { SignUpForm } from "./components/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="flex h-svh items-center" suppressHydrationWarning>
      <SignUpForm />
    </div>
  )
}

export default SignUpPage;