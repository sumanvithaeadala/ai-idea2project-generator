import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, ArrowUpIcon } from "lucide-react";
import Link from "next/link"

export default function ConfirmEmailPage() {
    return (
        <div className="flex min-h-screen items-start justify-center">
            <div className="w-full max-w-xl px-6 mt-[150px]">
                <Alert>
                    <CheckCircle2Icon />
                    <AlertTitle>Email Confirmation Required</AlertTitle>
                    <AlertDescription>
                        your email has not been confirmed. Please check your inbox and click on the confirmation link we sent you.
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