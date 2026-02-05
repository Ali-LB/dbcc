"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
      setMessage(data.message);
    } else {
      setStatus("error");
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#7f5539] mb-6">
          Forgot Password
        </h1>
        {status === "success" ? (
          <div className="text-green-600 mb-4">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                required
                placeholder="Enter your email"
              />
            </div>
            {status === "error" && (
              <div className="text-red-600">{message}</div>
            )}
            <Button type="submit" className="w-full bg-[#7f5539] text-white">
              Send Reset Link
            </Button>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="/auth/signin" className="text-[#7f5539] hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
