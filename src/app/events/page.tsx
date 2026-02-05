"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "@phosphor-icons/react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxAttendees?: number;
  isActive: boolean;
  rsvps: { id: string }[];
  hasRSVPed?: boolean;
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error("Failed to fetch events");
      }
    } catch {
      console.error("Error fetching events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVP = async (eventId: string) => {
    if (!session) {
      // Redirect to sign in
      window.location.href = "/auth/signin";
      return;
    }

    setRsvpLoading(eventId);
    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (response.ok) {
        // Update the event to show RSVP success
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? { ...event, rsvps: [...event.rsvps, { id: "temp" }] }
              : event
          )
        );
        alert("RSVP successful!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to RSVP");
      }
    } catch {
      alert("An error occurred while RSVPing");
    } finally {
      setRsvpLoading(null);
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

  const isEventFull = (event: Event) => {
    return event.maxAttendees
      ? event.rsvps.length >= event.maxAttendees
      : false;
  };

  const hasUserRSVPed = (event: Event) => {
    return !!event.hasRSVPed;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#7f5539] mb-4">Events</h1>
        <p className="text-lg text-gray-600">
          Join us for coffee tastings, meetups, and community gatherings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center text-sm text-blue-600 font-semibold mb-2">
                <Calendar className="mr-1" size={16} />
                {formatDate(event.date)}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {event.title}
              </h3>

              <p className="text-gray-600 mb-4">{event.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin className="mr-1" size={16} />
                <span>{event.location}</span>
              </div>

              {event.maxAttendees && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="mr-1" size={16} />
                  <span>
                    {event.rsvps.length} / {event.maxAttendees} attendees
                  </span>
                </div>
              )}

              {!session ? (
                <Button
                  onClick={() => handleRSVP(event.id)}
                  className="w-full bg-[#7f5539] text-white py-2 px-4 rounded hover:bg-[#6b4a2f] transition-colors"
                >
                  Sign in to RSVP
                </Button>
              ) : hasUserRSVPed(event) ? (
                <div className="text-center">
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-2 rounded">
                    ✓ RSVP Confirmed
                  </span>
                </div>
              ) : isEventFull(event) ? (
                <div className="text-center">
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-2 rounded">
                    Event Full
                  </span>
                </div>
              ) : (
                <Button
                  onClick={() => handleRSVP(event.id)}
                  disabled={rsvpLoading === event.id}
                  className="w-full bg-[#7f5539] text-white py-2 px-4 rounded hover:bg-[#6b4a2f] transition-colors disabled:opacity-50"
                >
                  {rsvpLoading === event.id ? "RSVPing..." : "RSVP Now"}
                </Button>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center col-span-full">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Events Scheduled
            </h3>
            <p className="text-gray-500">
              Check back soon for upcoming coffee community events!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
