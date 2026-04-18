"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
}

export function ForgotPasswordForm({ onBackToSignIn }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    if (step !== "code") return;

    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timeLeft]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setTimeLeft(30);
    setStep("code");
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (timeLeft <= 0) {
      setError("Invalid code. Try again");
      return;
    }
  };

  const handleResend = useCallback(() => {
    setError("");
    setCode("");
    setTimeLeft(30);
  }, []);

  if (step === "email") {
    return (
      <form onSubmit={handleSendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recovery-email">Email</Label>
          <Input
            id="recovery-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Send recovery link
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmitCode} className="space-y-4">
      <div className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded p-2">
        Recovery code sent to <span className="font-medium">{email}</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recovery-code">Recovery code</Label>
        <Input
          id="recovery-code"
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>

      <div className="text-sm text-neutral-500">
        {timeLeft > 0 ? (
          <>Code expires in: 0:{timeLeft.toString().padStart(2, "0")}</>
        ) : (
          <span className="text-red-500">Code expired.{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal text-sm"
              onClick={handleResend}
            >
              Resend code
            </Button>
          </span>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
