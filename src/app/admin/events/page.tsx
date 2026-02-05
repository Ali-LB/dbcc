"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  PencilSimple,
  Trash,
  Plus,
  ArrowLeft,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxAttendees?: number;
  isActive: boolean;
  published: boolean;
  rsvps: { id: string }[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxAttendees: "",
    published: false,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = "/api/events";
      const method = editingEvent ? "PUT" : "POST";
      const body = editingEvent
        ? {
            ...formData,
            id: editingEvent.id,
            isActive: editingEvent.isActive,
            maxAttendees: formData.maxAttendees
              ? parseInt(formData.maxAttendees)
              : null,
          }
        : {
            ...formData,
            maxAttendees: formData.maxAttendees
              ? parseInt(formData.maxAttendees)
              : null,
          };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save event");

      await loadEvents();
      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        maxAttendees: "",
        published: false,
      });
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : "",
      published: event.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete event");
      await loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const togglePublished = async (event: Event) => {
    try {
      const res = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          date: event.date,
          maxAttendees: event.maxAttendees,
          published: !event.published,
          isActive: event.isActive,
        }),
      });

      if (!res.ok) throw new Error("Failed to update event");
      await loadEvents();
    } catch (error) {
      console.error("Error updating event:", error);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEvent(null);
            if (!showForm) {
              setFormData({
                title: "",
                description: "",
                location: "",
                date: "",
                maxAttendees: "",
                published: false,
              });
            }
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2" />
              Add Event
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingEvent ? "Edit Event" : "Add New Event"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Attendees
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxAttendees || ""}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttendees: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Leave empty for unlimited"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">Published</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Published events will be visible to users on the Events page
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
                setFormData({
                  title: "",
                  description: "",
                  location: "",
                  date: "",
                  maxAttendees: "",
                  published: false,
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingEvent ? "Update" : "Add"} Event
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="text-[#7f5539]" />
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{event.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(event.date)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => togglePublished(event)}
                  className="p-1 text-gray-600 hover:text-[#7f5539]"
                  title={event.published ? "Unpublish" : "Publish"}
                >
                  {event.published ? <Eye size={20} /> : <EyeSlash size={20} />}
                </button>
                <button
                  onClick={() => handleEdit(event)}
                  className="p-1 text-gray-600 hover:text-[#7f5539]"
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
            <div className="mt-2 text-sm">
              {event.maxAttendees && (
                <p className="text-gray-600">
                  Max attendees: {event.maxAttendees}
                </p>
              )}
              <p className="text-gray-600">RSVPs: {event.rsvps.length}</p>
            </div>
            <div className="mt-2">
              <span
                className={`inline-block text-xs px-2 py-1 rounded ${
                  event.published
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.published ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
