"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { AuthActionState } from "@/app/seller/actions";

type AuthFormProps = {
  mode: "login" | "signup";
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
};

function SubmitButton({ mode }: { mode: AuthFormProps["mode"] }) {
  const { pending } = useFormStatus();
  const label = mode === "login" ? "Log in" : "Create seller account";
  return (
    <button className="button auth-submit" type="submit" disabled={pending}>
      {pending ? "Please wait…" : label}
    </button>
  );
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});
  const isSignup = mode === "signup";

  return (
    <form className="auth-form" action={formAction}>
      {isSignup && (
        <label>
          Display name
          <input
            name="displayName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
          />
        </label>
      )}
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 8 : undefined}
          required
        />
      </label>
      {isSignup && (
        <label>
          Confirm password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
      )}
      {state.error && (
        <p className="auth-message auth-error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="auth-message auth-success" role="status">
          {state.success}
        </p>
      )}
      <SubmitButton mode={mode} />
      <p className="auth-switch">
        {isSignup ? "Already have an account?" : "New to Cyberelay?"}{" "}
        <Link href={isSignup ? "/seller/login" : "/seller/signup"}>
          {isSignup ? "Log in" : "Create a seller account"}
        </Link>
      </p>
    </form>
  );
}
