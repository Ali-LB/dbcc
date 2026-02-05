"use client";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/generated/prisma";

export interface CoffeeShop {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
  posts: Post[];
}

// Create a custom icon using Phosphor's Coffee icon
const createCoffeeIcon = () => {
  const iconHtml = `
    <div style="
      background: #7f5539;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #e6ccb2;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#e6ccb2" viewBox="0 0 256 256">
        <path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H32a8,8,0,0,1,0-16H56.49a96.59,96.59,0,0,1-27-40.09A40,40,0,0,1-8,128v-8a40,40,0,0,1,40-40H208A40,40,0,0,1,248,120Zm-16,8a24,24,0,0,0-24-24H32a24,24,0,0,0-24,24v8a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24Zm-24,88H32a80.09,80.09,0,0,0,176,0Z"></path>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "coffee-shop-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export function CoffeeShopMarker({ shop }: { shop: CoffeeShop }) {
  return (
    <Marker
      position={[shop.latitude, shop.longitude]}
      icon={createCoffeeIcon()}
    >
      <Popup minWidth={300} maxWidth={350}>
        <div className="flex flex-col gap-4">
          <div className="border-b pb-2">
            <h3 className="font-bold text-lg text-[#7f5539]">{shop.name}</h3>
            <p className="text-sm text-gray-600">{shop.address}</p>
          </div>

          {shop.posts.length > 0 ? (
            <>
              <h4 className="font-semibold text-sm text-[#7f5539]">
                Latest Reviews
              </h4>
              <div className="space-y-3">
                {shop.posts.slice(0, 5).map((post: Post) => (
                  <div
                    key={post.id}
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
                        View Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">No reviews yet</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
