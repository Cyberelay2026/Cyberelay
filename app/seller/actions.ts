"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error?: string; success?: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function textField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function passwordField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function login(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = textField(formData, "email").toLowerCase();
  const password = passwordField(formData, "password");

  if (!emailPattern.test(email) || !password) {
    return { error: "Enter a valid email address and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error:
        error.code === "email_not_confirmed"
          ? "Confirm your email address before signing in."
          : "The email address or password is incorrect.",
    };
  }

  redirect("/seller");
}

export async function signup(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const displayName = textField(formData, "displayName");
  const email = textField(formData, "email").toLowerCase();
  const password = passwordField(formData, "password");
  const confirmPassword = passwordField(formData, "confirmPassword");

  if (displayName.length < 2 || displayName.length > 80) {
    return { error: "Display name must be between 2 and 80 characters." };
  }
  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must contain at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Password and confirm password must match." };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      ...(origin
        ? { emailRedirectTo: `${origin}/auth/confirm?next=/seller` }
        : {}),
    },
  });

  if (error) {
    return { error: "We could not create your account. Please try again." };
  }
  if (data.session) {
    redirect("/seller");
  }

  return {
    success:
      "Account created. Check your email and follow the confirmation link before signing in.",
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/seller/login");
}
