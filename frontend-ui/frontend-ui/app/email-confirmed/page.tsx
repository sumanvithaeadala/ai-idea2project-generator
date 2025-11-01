import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, ArrowUpIcon } from "lucide-react";
import Link from "next/link"

export default function ConfirmEmailPage() {
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
            <div className="w-full max-w-xl px-6">
                <Alert>
                    <CheckCircle2Icon />
                    <AlertTitle>Email is confirmed</AlertTitle>
                    <AlertDescription>
                        Your email has been confirmed. You can now log in.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-wrap items-center gap-10 md:flex-row justify-center mt-6">
                    <Link href="/login">
                        <Button variant="outline">Return back to Login</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}