import { Metadata } from "next";
import { UserRegistration } from "@/components/UserRegistration";

export const metadata: Metadata = {
  title: "Register - Dearborn Coffee Club",
  description:
    "Create a new account to RSVP to events and join the coffee community.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <UserRegistration />
      </div>
    </div>
  );
}
