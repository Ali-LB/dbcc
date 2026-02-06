"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@prisma/client";
import type { CoffeeShop } from "@/components/CoffeeShopMarker";
import { MapControls } from "@/components/MapControls";

type LeafletModule = typeof import("leaflet");

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const CoffeeShopMarker = dynamic(
  () => import("@/components/CoffeeShopMarker").then((mod) => mod.CoffeeShopMarker),
  { ssr: false }
);

export default function MapPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCoffeeShops, setShowCoffeeShops] = useState(true);
  const [showPosts, setShowPosts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);

  useEffect(() => {
    let mounted = true;
    import("leaflet")
      .then((mod) => {
        if (!mounted) return;
        setLeaflet(mod);
      })
      .catch((error) => {
        console.error("Error loading leaflet:", error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/posts?withLocation=true")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch posts");
          return res.json();
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
          return [];
        }),
      fetch("/api/coffee-shops")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch coffee shops");
          return res.json();
        })
        .catch((error) => {
          console.error("Error fetching coffee shops:", error);
          return [];
        }),
    ]).then(([postsData, shopsData]) => {
      console.log("Loaded posts:", postsData.length);
      console.log("Loaded coffee shops:", shopsData.length);
      setPosts(postsData);
      setCoffeeShops(shopsData);
      setLoading(false);
    });
  }, []);

  const createIcon = (imageUrl: string) => {
    if (!leaflet) return undefined;
    return leaflet.divIcon({
      html: `<div style="background: white; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); overflow: hidden; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border: 2px solid #b08968;"><img src='${imageUrl}' style='width: 52px; height: 52px; object-fit: cover; border-radius: 9999px;'/></div>`,
    });
  };

  // Filter coffee shops based on search term
  const filteredCoffeeShops = coffeeShops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center">Loading coffee shops and posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Dearborn Coffee Map
      </h1>
      <p className="text-center mb-8 text-lg">
        Explore coffee shops in Dearborn, MI. Click a coffee icon to see shop
        details and reviews!
      </p>
      <div className="relative w-full h-[70vh] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[42.3223, -83.1763]} // Dearborn, MI
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Coffee Shop Markers */}
          {showCoffeeShops &&
            leaflet &&
            filteredCoffeeShops.map((shop) => (
              <CoffeeShopMarker
                key={shop.placeId ?? `${shop.name}-${shop.latitude}-${shop.longitude}`}
                shop={shop}
              />
            ))}

          {/* Post Markers (for posts not associated with coffee shops) */}
          {showPosts &&
            leaflet &&
            Object.entries(
              posts.reduce((acc: Record<string, Post[]>, post: Post) => {
                if (!post.latitude || !post.longitude) return acc;
                // Check if this post is already shown in a coffee shop marker
                const isShownInShop = filteredCoffeeShops.some((shop) =>
                  shop.posts.some((p) => p.id === post.id)
                );
                if (isShownInShop) return acc;

                const key = `${post.latitude},${post.longitude}`;
                if (!acc[key]) acc[key] = [];
                acc[key].push(post);
                return acc;
              }, {})
            ).map(([key, group]: [string, Post[]]) => {
              group.sort(
                (a: Post, b: Post) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
              const [lat, lng] = key.split(",").map(Number);
              return (
                <Marker
                  key={key}
                  position={[lat, lng]}
                  icon={createIcon(group[0].imageUrl)}
                >
                  <Popup minWidth={260} maxWidth={320}>
                    <div className="flex flex-col gap-4">
                      {group.slice(0, 5).map((post: Post) => (
                        <div
                          key={post.id ?? `${post.title}-${post.createdAt}`}
                          className="flex items-center gap-3 border-b last:border-b-0 pb-2 last:pb-0"
                        >
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-base leading-tight">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                            <Link
                              href={`/posts/${post.id}`}
                              className="text-xs bg-[#b08968] text-[#e6ccb2] px-2 py-1 rounded-full hover:bg-[#a0765b] transition"
                            >
                              View Post
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>

        <MapControls
          showCoffeeShops={showCoffeeShops}
          showPosts={showPosts}
          searchTerm={searchTerm}
          onToggleCoffeeShops={() => setShowCoffeeShops(!showCoffeeShops)}
          onTogglePosts={() => setShowPosts(!showPosts)}
          onSearchChange={setSearchTerm}
          matchingShopsCount={filteredCoffeeShops.length}
        />
      </div>
    </div>
  );
}
