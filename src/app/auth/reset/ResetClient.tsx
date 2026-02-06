"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ResetClient() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
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
          Reset Password
        </h1>
        {status === "success" ? (
          <div className="text-green-600 mb-4">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                required
                placeholder="Enter new password"
                minLength={6}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
                required
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
            {status === "error" && (
              <div className="text-red-600">{message}</div>
            )}
            <Button type="submit" className="w-full bg-[#7f5539] text-white">
              Reset Password
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
