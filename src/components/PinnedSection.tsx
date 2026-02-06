"use client";
import Link from "next/link";
import type { Post } from "@prisma/client";

interface PinnedSectionProps {
  posts: Post[];
}

export function PinnedSection({ posts }: PinnedSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="pinned-section">
      <div className="pinned-posts global-special">
        <h2>
          <span>Don&apos;t miss it</span>
        </h2>

        {posts.slice(0, 3).map((post, index) => (
          <article key={post.id} className={`item-${index + 1}`}>
            <h3>
              <Link href={`/posts/${post.id}`} className="global-underline">
                {post.title}
              </Link>
            </h3>
            <div className="global-meta">
              <span>Admin</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
