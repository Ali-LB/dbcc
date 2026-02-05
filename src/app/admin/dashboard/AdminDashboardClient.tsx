"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Post, CoffeeShop, PostReview } from "@/generated/prisma";
import Link from "next/link";
import {
  Article,
  Coffee,
  Plus,
  X,
  User,
  Users,
  Calendar,
} from "@phosphor-icons/react";
import { AdminUserManagement } from "@/components/AdminUserManagement";

type CloudinaryUploadResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
};

async function uploadToCloudinary(file: File): Promise<string> {
  const url = `https://api.cloudinary.com/v1_1/dwxu28mrd/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "dbcoffeeclub");
  const res = await fetch(url, { method: "POST", body: formData });
  const data: CloudinaryUploadResponse = await res.json();
  return data.secure_url;
}

type PostForm = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  imageFile?: File;
  score?: number | string;
  finalThoughts?: string;
  keywords?: string;
  category?: string;
  address?: string;
  coffeeShopId?: string;
  reviewers?: Array<{
    name: string;
    photoUrl: string;
    review: string;
  }>;
};

export default function AdminDashboardClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [form, setForm] = useState<PostForm>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");

  useEffect(() => {
    loadCoffeeShops();
  }, []);

  const loadCoffeeShops = async () => {
    try {
      const res = await fetch("/api/coffee-shops");
      if (!res.ok) throw new Error("Failed to fetch coffee shops");
      const data = await res.json();
      setCoffeeShops(data);
    } catch (error) {
      console.error("Error loading coffee shops:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, imageFile: e.target.files?.[0] });
  };

  const addReviewer = () => {
    const currentReviewers = form.reviewers || [];
    setForm({
      ...form,
      reviewers: [...currentReviewers, { name: "", photoUrl: "", review: "" }],
    });
  };

  const removeReviewer = (index: number) => {
    const currentReviewers = form.reviewers || [];
    const updatedReviewers = currentReviewers.filter((_, i) => i !== index);
    setForm({ ...form, reviewers: updatedReviewers });
  };

  const updateReviewer = (index: number, field: string, value: string) => {
    const currentReviewers = form.reviewers || [];
    const updatedReviewers = currentReviewers.map((reviewer, i) =>
      i === index ? { ...reviewer, [field]: value } : reviewer
    );
    setForm({ ...form, reviewers: updatedReviewers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = form.imageUrl;
    if (form.imageFile) {
      imageUrl = await uploadToCloudinary(form.imageFile);
    }
    if (!imageUrl) {
      setLoading(false);
      alert("Image URL is required. Please provide an image or image URL.");
      return;
    }
    let latitude = null;
    let longitude = null;
    if (form.address && form.address.trim() !== "") {
      // Geocode address using Nominatim
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            form.address
          )}`
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          latitude = parseFloat(geoData[0].lat);
          longitude = parseFloat(geoData[0].lon);
        }
      } catch (err) {
        // If geocoding fails, just leave as null
        console.error("Geocoding error:", err);
      }
    }
    const rest = { ...form };
    delete rest.imageFile;
    const payload = {
      ...rest,
      imageUrl,
      score: Number(form.score),
      latitude,
      longitude,
      coffeeShopId: form.coffeeShopId || null,
    };
    const res = await fetch("/api/posts", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
    });
    const data = await res.json();
    console.log("API response after post creation:", data);
    if (editingId) {
      setPosts(posts.map((p) => (p.id === editingId ? data : p)));
      setEditingId(null);
    } else {
      setPosts([data, ...posts]);
    }
    setForm({});
    setLoading(false);
  };

  const handleEdit = async (post: Post) => {
    setEditingId(post.id);

    // Fetch reviewers for this post
    let reviewers = [];
    try {
      const res = await fetch(`/api/posts/${post.id}/reviewers`);
      if (res.ok) {
        const reviewersData = await res.json();
        reviewers = reviewersData.map((r: PostReview) => ({
          name: r.name,
          photoUrl: r.photoUrl || "",
          review: r.review,
        }));
      }
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }

    setForm({
      ...post,
      keywords: post.keywords ?? "",
      category: post.category ?? "",
      address: post.address ?? "",
      coffeeShopId: post.coffeeShopId ?? "",
      reviewers,
    });
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPosts(posts.filter((p) => p.id !== id));
    setLoading(false);
  };

  const handleTogglePublish = async (post: Post) => {
    setLoading(true);
    const res = await fetch("/api/posts/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    const data = await res.json();
    setPosts(posts.map((p) => (p.id === post.id ? data : p)));
    setLoading(false);
  };

  const handleSetHero = async (post: Post) => {
    setLoading(true);
    try {
      await fetch("/api/posts/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      // Update all posts to reflect the new hero status
      setPosts(
        posts.map((p) => ({
          ...p,
          isHero: p.id === post.id ? true : false,
        }))
      );
    } catch (error) {
      console.error("Error setting hero post:", error);
    }
    setLoading(false);
  };

  const handleUnsetHero = async () => {
    setLoading(true);
    try {
      await fetch("/api/posts/hero", {
        method: "DELETE",
      });
      // Update all posts to remove hero status
      setPosts(posts.map((p) => ({ ...p, isHero: false })));
    } catch (error) {
      console.error("Error unsetting hero post:", error);
    }
    setLoading(false);
  };

  console.log(
    "Post IDs in AdminDashboardClient:",
    posts.map((p) => p.id)
  );

  // Group posts by category
  const postsByCategory = posts.reduce((acc, post) => {
    const cat = post.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#7f5539] mb-6">
        Admin Dashboard
      </h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "posts"
              ? "border-[#7f5539] text-white"
              : "border-transparent text-gray-300 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Article size={16} />
            Posts Management
          </div>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-[#7f5539] text-white"
              : "border-transparent text-gray-300 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={16} />
            User Management
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" ? (
        <div className="space-y-6 text-gray-500">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Create/Edit Post</h2>
            <input
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border rounded px-2 py-1"
              required
            />
            <input
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border rounded px-2 py-1"
              required
            />
            <textarea
              name="content"
              value={form.content || ""}
              onChange={handleChange}
              placeholder="Content"
              rows={6}
              className="w-full border rounded px-2 py-1"
              required
            />
            <input
              name="imageUrl"
              value={form.imageUrl || ""}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="w-full border rounded px-2 py-1"
            />
            <input
              name="score"
              type="number"
              min="1"
              max="10"
              value={form.score || ""}
              onChange={handleChange}
              placeholder="Score (1-10)"
              className="w-full border rounded px-2 py-1"
              required
            />
            <input
              name="keywords"
              value={form.keywords || ""}
              onChange={handleChange}
              placeholder="Keywords (comma-separated)"
              className="w-full border rounded px-2 py-1"
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Reviewers</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addReviewer}
                  className="flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Reviewer
                </Button>
              </div>
              {(form.reviewers || []).map((reviewer, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User size={20} />
                      <span className="font-medium">Reviewer {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeReviewer(index)}
                      className="flex items-center gap-1"
                    >
                      <X size={16} />
                      Remove
                    </Button>
                  </div>

                  <input
                    type="text"
                    value={reviewer.name}
                    onChange={(e) =>
                      updateReviewer(index, "name", e.target.value)
                    }
                    placeholder="Reviewer Name"
                    className="w-full border rounded px-2 py-1"
                  />

                  <input
                    type="text"
                    value={reviewer.photoUrl}
                    onChange={(e) =>
                      updateReviewer(index, "photoUrl", e.target.value)
                    }
                    placeholder="Photo URL (optional)"
                    className="w-full border rounded px-2 py-1"
                  />

                  <textarea
                    value={reviewer.review}
                    onChange={(e) =>
                      updateReviewer(index, "review", e.target.value)
                    }
                    placeholder="Review text"
                    rows={3}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>

            <input
              name="finalThoughts"
              value={form.finalThoughts || ""}
              onChange={handleChange}
              placeholder="Final Thoughts"
              className="w-full border rounded px-2 py-1"
              required
            />
            <input
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border rounded px-2 py-1"
              required
            />
            <select
              name="coffeeShopId"
              value={form.coffeeShopId || ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select Coffee Shop (Optional)</option>
              {coffeeShops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
            <input
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Street Address (e.g. 123 Main St, Dearborn, MI)"
              className="w-full border rounded px-2 py-1"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {editingId ? "Update" : "Create"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setForm({});
                }}
              >
                Cancel
              </Button>
            )}
          </form>
          <h2 className="text-xl font-semibold mb-2">All Posts</h2>
          <div className="space-y-4">
            {Object.entries(postsByCategory).map(([category, catPosts]) => (
              <div
                key={category}
                className="border border-[#e6ccb2]/30 rounded-lg"
              >
                <button
                  className="w-full text-left px-4 py-3 bg-[#a98467] text-[#e6ccb2] font-bold rounded-t-lg focus:outline-none focus:ring"
                  onClick={() =>
                    setOpenCategories((prev) => ({
                      ...prev,
                      [category]: !prev[category],
                    }))
                  }
                >
                  {category}{" "}
                  <span className="ml-2 text-xs text-[#e6ccb2]/70">
                    ({catPosts.length})
                  </span>
                </button>
                {openCategories[category] && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {catPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-[#a98467] text-[#e6ccb2] border border-[#e6ccb2]/20 rounded-lg shadow-md flex flex-col p-4 gap-3"
                      >
                        <div className="flex flex-col gap-1 mb-2">
                          <div className="font-bold text-lg line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-[#e6ccb2]/80 line-clamp-2">
                            {post.description}
                          </div>
                          <div className="text-xs text-[#e6ccb2]/60">
                            Score: {post.score} | Published:{" "}
                            {post.published ? "Yes" : "No"} | Hero:{" "}
                            {post.isHero ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          <Button
                            variant="secondary"
                            onClick={() => handleEdit(post)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleTogglePublish(post)}
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </Button>
                          {post.isHero ? (
                            <Button variant="outline" onClick={handleUnsetHero}>
                              Unset Hero
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => handleSetHero(post)}
                            >
                              Set as Hero
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 border text-gray-100 border-[#e6ccb2]/30 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Manage Posts</h3>
            <Link
              href="/admin/posts"
              className="flex items-center gap-2 p-3 hover:bg-amber-500 rounded-lg"
            >
              <Article size={24} />
              <span>Manage Posts</span>
            </Link>
            <Link
              href="/admin/coffee-shops"
              className="flex items-center gap-2 p-3 hover:bg-amber-500 rounded-lg"
            >
              <Coffee size={24} />
              <span>Manage Coffee Shops</span>
            </Link>
            <Link
              href="/admin/events"
              className="flex items-center gap-2 p-3 hover:bg-amber-500 rounded-lg"
            >
              <Calendar size={24} />
              <span>Manage Events</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          <AdminUserManagement />
        </div>
      )}
    </div>
  );
}
