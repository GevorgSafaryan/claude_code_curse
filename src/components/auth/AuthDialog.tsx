"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "signin" | "signup";
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultMode = "signin",
}: AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot-password">(defaultMode);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin"
              ? "Welcome back"
              : mode === "signup"
                ? "Create an account"
                : "Recover password"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to your account to continue"
              : mode === "signup"
                ? "Sign up to start creating AI-powered React components"
                : "Enter your email to receive a recovery code"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {mode === "signin" ? (
            <SignInForm
              onSuccess={handleSuccess}
              onForgotPassword={() => setMode("forgot-password")}
            />
          ) : mode === "signup" ? (
            <SignUpForm onSuccess={handleSuccess} />
          ) : (
            <ForgotPasswordForm onBackToSignIn={() => setMode("signin")} />
          )}
        </div>

        <div className="mt-4 text-center text-sm">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setMode("signup")}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              {mode === "signup" ? "Already have an account?" : "Remember your password?"}{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setMode("signin")}
              >
                Sign in
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
