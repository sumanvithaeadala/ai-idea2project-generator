import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, Link } from "lucide-react";

export default function ErrorPage() {
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
          <AlertDescription>
            An unexpected error has occurred. Please try logging in again.
          </AlertDescription>
        </Alert>
      </div>
    </div>
    )
}
  