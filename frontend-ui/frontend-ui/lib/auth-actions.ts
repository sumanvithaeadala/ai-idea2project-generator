"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const userdata = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } =  await (await supabase).auth.signInWithPassword(userdata);

  if (data && data.user) {
    console.log("User logged in:", data.user.id);
    (await cookies()).set("user_uuid", data.user.id, { httpOnly: true, path: "/" });
  }

  if (error) {
    if(error.message.includes("Email not confirmed")) {
      redirect("/need-confirm-email");
    }
    if(error.message.includes("Invalid login credentials")) {
      console.log("Invalid login credentials provided. Redirecting to signup page.");
      redirect("/signup");
    }
    console.log(error.message);
    redirect("/error");
  }
  else{
    if(data.user.email_confirmed_at === null) {
      console.log("Email not confirmed for user:", data.user.email);
      redirect("/need-confirm-email");
    }
  }
   console.log("Login successful");
  // revalidatePath("/", "layout");
  redirect("/get-project");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: `${firstName + " " + lastName}`,
        email: formData.get("email") as string,
      },
    },
  };

  const { error } = await (await supabase).auth.signUp(data);

  if (error) {
    redirect("/error");
  }
  redirect("/need-confirm-email");
}

export async function signout() {
  const supabase = createClient();
  const { error } =await (await supabase).auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }
  redirect("/login");
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } =await (await supabase).auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: process.env.NEXT_PUBLIC_URL+"/get-project", // or your chat page
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  console.log("url value is: ",data.url);
  redirect(data.url);
}

export async function sendMagicLink(email: string) {
  const supabase = createClient();
  const { error } = await (await supabase).auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_URL + "/get-project", // or your desired redirect
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }
  redirect("/need-confirm-email");
}
