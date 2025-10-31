import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth-actions";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import LogOutPage from "@/app/(auth)/logout/LogOutPage";

export function LoginForm() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 w-full">
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
      <Card className="mx-auto max-w-sm w-full shadow-2xl rounded-2xl border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline text-blue-500 hover:text-blue-700 transition">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                />
              </div>
              <Button type="submit" formAction={login} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow hover:from-blue-600 hover:to-purple-600 transition">
                Login
              </Button>
              <div className="flex items-center my-2">
                <span className="flex-1 border-t border-gray-200" />
                <span className="mx-2 text-gray-400 text-xs">or</span>
                <span className="flex-1 border-t border-gray-200" />
              </div>
              <SignInWithGoogleButton />
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-blue-600 hover:text-blue-800 transition">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}