import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@prisma/client";
import { PinnedSection } from "@/components/PinnedSection";
import { HeroPost } from "@/components/HeroPost";
import { BuyMeACoffee } from "@/components/BuyMeACoffee";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;

const getHeroPost = unstable_cache(
  async () => {
    return prisma.post.findFirst({
      where: { published: true, isHero: true },
    });
  },
  ["hero-post"],
  { tags: ["posts", "hero"] }
);

const getLatestPosts = unstable_cache(
  async (excludeId?: string) => {
    return prisma.post.findMany({
      where: {
        published: true,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  },
  ["latest-posts"],
  { tags: ["posts"] }
);

export default async function Home() {
  // Fetch hero post
  const heroPost = await getHeroPost();

  // Fetch latest posts (excluding hero post)
  const latestPosts = await getLatestPosts(heroPost?.id);

  const pinnedPosts = latestPosts.slice(0, 3);
  const remainingPosts = latestPosts.slice(3);

  return (
    <>
      <div className="space-y-12">
        {heroPost && <HeroPost post={heroPost} />}

        <section className="text-center py-16 bg-gray-100 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Welcome to My Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A place to share my thoughts, reviews, and experiences with the
            world.
          </p>
        </section>

        <PinnedSection posts={pinnedPosts} />

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <Link
              href="/posts"
              className="text-[#e6ccb2] hover:text-[#9c6644] font-medium"
            >
              View all posts →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post: Post) => (
              <article
                key={post.id}
                className="bg-[#3b2516] border-transparent rounded-lg overflow-hidden"
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
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-[#e6ccb2] mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#e6ccb2]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-[#e6ccb2] hover:text-[#9c6644] font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {remainingPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#e6ccb2]">No additional posts available.</p>
            </div>
          )}
        </section>
      </div>

      <BuyMeACoffee />
    </>
  );
}
