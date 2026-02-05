import { Metadata } from "next";
import { UserDashboard } from "@/components/UserDashboard";

export const metadata: Metadata = {
  title: "My Dashboard - Dearborn Coffee Club",
  description: "View and manage your event RSVPs.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <UserDashboard />
      </div>
    </div>
  );
}
