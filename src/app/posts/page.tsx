import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@prisma/client";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gray-100 rounded-lg">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        <p className="mt-4 text-xl">Explore our latest articles and reviews</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: Post) => (
          <article
            key={post.id}
            className="bg-[#3b2516] border-transparent rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-[#e6ccb2] mb-4 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#ede0d4]">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-[#ede0d4] hover:text-[#9c6644] font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts available yet.</p>
        </div>
      )}
    </div>
  );
}
