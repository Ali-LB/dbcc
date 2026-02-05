"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, X } from "@phosphor-icons/react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  isActive: boolean;
}

interface RSVP {
  id: string;
  event: Event;
  createdAt: string;
}

export function UserDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const fetchRSVPs = async () => {
    try {
      const response = await fetch("/api/user/rsvps");
      if (response.ok) {
        const data = await response.json();
        setRsvps(data.rsvps);
      } else {
        setError("Failed to load your RSVPs");
      }
    } catch {
      setError("An error occurred while loading your RSVPs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRSVP = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/rsvp?eventId=${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the RSVP from the local state
        setRsvps((prev) => prev.filter((rsvp) => rsvp.event.id !== eventId));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel RSVP");
      }
    } catch {
      alert("An error occurred while cancelling your RSVP");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading your events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchRSVPs} className="bg-[#7f5539] text-white">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#7f5539] mb-4">My Events</h1>
        <p className="text-lg text-gray-600">Events you&apos;ve RSVPed to</p>
      </div>

      {rsvps.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Calendar size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No events yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven&apos;t RSVPed to any events yet.
          </p>
          <a
            href="/events"
            className="inline-block bg-[#7f5539] text-white py-2 px-6 rounded hover:bg-[#6b4a2f] transition-colors"
          >
            Browse Events
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center text-sm text-blue-600 font-semibold">
                    <Calendar className="mr-1" size={16} />
                    {formatDate(rsvp.event.date)}
                  </div>
                  <button
                    onClick={() => handleCancelRSVP(rsvp.event.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Cancel RSVP"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {rsvp.event.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {rsvp.event.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="mr-1" size={16} />
                  <span>{rsvp.event.location}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    RSVPed on {new Date(rsvp.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
