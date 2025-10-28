import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link"

export default function ConfirmEmailPage() {
    return (
        <div className="flex min-h-screen items-start justify-center">
            <div className="w-full max-w-xl px-6 mt-[150px]">
                <Alert>
                    <CheckCircle2Icon />
                    <AlertTitle>Email Confirmation Required</AlertTitle>
                    <AlertDescription>
                        Your email link is invalid or has expired. Please signup again to receive a new confirmation email.
                    </AlertDescription>
                </Alert>
                <div className="flex flex-wrap items-center gap-10 md:flex-row justify-center mt-6">
                    <Link href="/signup">
                        <Button variant="outline">SignUp</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}