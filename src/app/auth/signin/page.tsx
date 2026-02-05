"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      const isAdmin =
        session.user && "role" in session.user && session.user.role === "ADMIN";
      router.push(isAdmin ? "/admin/dashboard" : "/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (res?.ok) {
      // The useEffect will handle the redirect based on role
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-[#7f5539] mb-6">
            Sign In
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539]"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#7f5539] text-white">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/auth/register" className="text-[#7f5539] hover:underline">
              Don&apos;t have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
