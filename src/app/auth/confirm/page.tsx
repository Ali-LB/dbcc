"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No token provided.");
      return;
    }
    fetch(`/api/auth/confirm?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Invalid or expired token.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        {status === "pending" && (
          <div className="text-lg text-gray-600">Confirming your email...</div>
        )}
        {status === "success" && (
          <>
            <div className="text-green-600 text-xl font-bold mb-4">
              Success!
            </div>
            <div className="mb-6">{message}</div>
            <a href="/auth/signin">
              <Button className="bg-[#7f5539] text-white">Sign In</Button>
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-red-600 text-xl font-bold mb-4">Error</div>
            <div className="mb-6">{message}</div>
            <a href="/auth/register">
              <Button className="bg-[#7f5539] text-white">Register</Button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
