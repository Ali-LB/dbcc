"use client";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@prisma/client";

interface HeroPostProps {
  post: Post;
}

export function HeroPost({ post }: HeroPostProps) {
  const timeAgo = getTimeAgo(post.createdAt);
  const readingTime = calculateReadingTime(post.content);

  return (
    <section className="bg-[#7f5539] text-[#e6ccb2] px-4 md:px-16 lg:px-32 py-10 md:py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Text content FIRST */}
        <div className="flex flex-col items-start justify-center relative z-10">
          <p className="text-base md:text-lg text-[#e6ccb2]/80 mb-3">
            {timeAgo} by Admin — {readingTime} min read
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4 leading-tight text-[#e6ccb2]">
            <Link
              href={`/posts/${post.id}`}
              className="hover:text-white transition-colors duration-200"
            >
              {post.title}
            </Link>
          </h1>
          <p className="text-[#e6ccb2]/90 text-2xl md:text-3xl mb-4 max-w-2xl">
            {post.description}
          </p>
          {post.keywords && (
            <p className="text-lg md:text-xl text-[#e6ccb2]/70 tracking-widest">
              {post.keywords.split(",").map((keyword, index) => (
                <span key={index} className="mr-2">
                  #{keyword.trim()}
                </span>
              ))}
            </p>
          )}
        </div>
        {/* Image with grid pop effect SECOND */}
        <div className="flex justify-center md:justify-end relative">
          <div className="relative flex items-center justify-center p-5 md:p-10 bg-[radial-gradient(#e6ccb2_1px,transparent_1px)] bg-[size:22px_22px] rounded-xl w-[240px] h-[240px] md:w-[380px] md:h-[380px]">
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)" }}
            />
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={240}
              height={240}
              className="rounded-lg object-cover w-[200px] h-[200px] md:w-[320px] md:h-[320px] relative z-10"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
