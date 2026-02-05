"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RegistrationFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function UserRegistration() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Registration successful! Please check your email to confirm your account.",
        });
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Registration failed",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#7f5539] mb-6 text-center">
        Create Account
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            minLength={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
            placeholder="Enter your last name"
          />
        </div>

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
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            minLength={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
            placeholder="Choose a username (min 4 characters)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Username must be at least 4 characters and contain only letters,
            numbers, underscores, and hyphens
          </p>
        </div>

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
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
            placeholder="your.email@example.com"
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
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
            placeholder="At least 6 characters"
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
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7f5539] focus:border-transparent"
            placeholder="Confirm your password"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#7f5539] text-white py-2 px-4 rounded hover:bg-[#6b4a2f] transition-colors disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>
          Already have an account?{" "}
          <a href="/auth/signin" className="text-[#7f5539] hover:underline">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
