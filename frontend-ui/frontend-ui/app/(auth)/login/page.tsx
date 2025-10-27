import React from "react"; 
import { LoginForm } from "./components/LoginForm"

const LoginPage = () => {
    return (
        <div className = "flex h-svh items-center" suppressHydrationWarning>
            <LoginForm />
        </div>
    )
}

export default LoginPage