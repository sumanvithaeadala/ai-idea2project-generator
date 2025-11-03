"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";


const SignInWithGoogleButton = () => {
  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/get-project`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google Sign-In Error:", error);
    } else {
      window.location.href = data.url;
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      Login with Google
    </Button>
  );
};

export default SignInWithGoogleButton;
