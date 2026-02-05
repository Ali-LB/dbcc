"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coffee,
  PencilSimple,
  Trash,
  Plus,
  MagnifyingGlass,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { CoffeeShopWithPosts } from "@/types/coffee-shop";

interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

export default function CoffeeShopsPage() {
  const [shops, setShops] = useState<CoffeeShopWithPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState<CoffeeShopWithPosts | null>(
    null
  );
  const [geocoding, setGeocoding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    website: "",
    phoneNumber: "",
    hours: "",
  });

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const res = await fetch("/api/coffee-shops");
      if (!res.ok) throw new Error("Failed to fetch coffee shops");
      const data = await res.json();
      setShops(data);
    } catch (error) {
      console.error("Error loading coffee shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const geocodeAddress = async (address: string) => {
    try {
      setGeocoding(true);
      const query = encodeURIComponent(address + ", Dearborn, Michigan");
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        {
          headers: {
            "User-Agent": "Dearborn Coffee Club/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }

      const results = (await response.json()) as GeocodingResult[];

      if (results.length === 0) {
        throw new Error("No results found for this address");
      }

      const result = results[0];
      setFormData((prev) => ({
        ...prev,
        latitude: result.lat,
        longitude: result.lon,
        address: result.display_name.split(", Dearborn")[0], // Clean up the address
      }));
    } catch (error) {
      console.error("Error geocoding address:", error);
      alert(
        "Failed to find coordinates for this address. Please try again or enter coordinates manually."
      );
    } finally {
      setGeocoding(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setFormData((prev) => ({ ...prev, address: newAddress }));
  };

  const handleAddressBlur = () => {
    if (formData.address.trim()) {
      geocodeAddress(formData.address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = "/api/coffee-shops";
      const method = editingShop ? "PUT" : "POST";
      const body = editingShop ? { ...formData, id: editingShop.id } : formData;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (!res.ok) throw new Error("Failed to save coffee shop");

      await loadShops();
      setShowForm(false);
      setEditingShop(null);
      setFormData({
        name: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        imageUrl: "",
        website: "",
        phoneNumber: "",
        hours: "",
      });
    } catch (error) {
      console.error("Error saving coffee shop:", error);
    }
  };

  const handleEdit = (shop: CoffeeShopWithPosts) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      description: shop.description || "",
      address: shop.address,
      latitude: shop.latitude.toString(),
      longitude: shop.longitude.toString(),
      imageUrl: shop.imageUrl || "",
      website: shop.website || "",
      phoneNumber: shop.phoneNumber || "",
      hours: shop.hours || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coffee shop?")) return;

    try {
      const res = await fetch("/api/coffee-shops", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete coffee shop");
      await loadShops();
    } catch (error) {
      console.error("Error deleting coffee shop:", error);
    }
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
        <h1 className="text-2xl font-bold mb-4">Coffee Shops</h1>
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
        <h1 className="text-2xl font-bold">Coffee Shops</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingShop(null);
            setFormData({
              name: "",
              description: "",
              address: "",
              latitude: "",
              longitude: "",
              imageUrl: "",
              website: "",
              phoneNumber: "",
              hours: "",
            });
          }}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2" />
              Add Coffee Shop
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
            {editingShop ? "Edit Coffee Shop" : "Add New Coffee Shop"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Address *
                {geocoding && (
                  <span className="ml-2 text-xs text-gray-500">
                    <MagnifyingGlass
                      className="inline-block animate-spin mr-1"
                      size={12}
                    />
                    Finding coordinates...
                  </span>
                )}
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={handleAddressChange}
                onBlur={handleAddressBlur}
                placeholder="Enter address and we'll find the coordinates"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Will be filled automatically"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Will be filled automatically"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hours</label>
              <input
                type="text"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., Mon-Fri: 7am-8pm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setEditingShop(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingShop ? "Update" : "Add"} Coffee Shop
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coffee className="text-[#7f5539]" />
                  {shop.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{shop.address}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(shop)}
                  className="p-1 text-gray-600 hover:text-[#7f5539]"
                >
                  <PencilSimple size={20} />
                </button>
                <button
                  onClick={() => handleDelete(shop.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash size={20} />
                </button>
              </div>
            </div>
            {shop.description && (
              <p className="text-sm text-gray-600 mt-2">{shop.description}</p>
            )}
            <div className="mt-2 text-sm">
              {shop.website && (
                <a
                  href={shop.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7f5539] hover:underline block"
                >
                  Visit Website
                </a>
              )}
              {shop.phoneNumber && (
                <p className="text-gray-600">Phone: {shop.phoneNumber}</p>
              )}
              {shop.hours && (
                <p className="text-gray-600">Hours: {shop.hours}</p>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {shop.posts?.length || 0}{" "}
              {(shop.posts?.length || 0) === 1 ? "review" : "reviews"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
