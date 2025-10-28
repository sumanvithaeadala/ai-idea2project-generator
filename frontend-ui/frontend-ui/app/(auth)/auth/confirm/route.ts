import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  console.log("Received confirmation request...")

  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()
    console.log("Verifying OTP...")
    const { error } = await (await supabase).auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirectTo.pathname = '/email-confirmed';
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
    else{
      if(error.message.includes("Email link is invalid or has expired")){
        console.log("Email confirmation link invalid or expired.");
        redirect("/send-confirm-email-again");
      }
      console.log("Error during confirmation: " + error.message);
    }
  }

  console.log("Confirmation failed...");
  console.log( " details:"+ JSON.stringify(token_hash)+" "+JSON.stringify(type)+ " "+JSON.stringify(next));
  console.log("Redirecting to error page...");

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}