import { notFound } from "next/navigation";
import Image from "next/image";
import { headers } from "next/headers";

export const revalidate = 3600;

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${proto}://${host}` : "";

  const res = await fetch(`${baseUrl}/api/posts/${id}`, {
    next: { tags: [`post:${id}`] },
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const post = data.post;

  if (!post || !post.published) {
    notFound();
  }

  // Fetch reviewers for this post
  const reviewers = data.reviewers ?? [];

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center gap-4 text-[#ede0d4]">
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
          <span>•</span>
          <span>Score: {post.score}/10</span>
        </div>
        <p className="text-xl text-[#e6ccb2]">{post.description}</p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Reviewers Section */}
      {reviewers.length > 0 && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-6">What Others Say</h2>
          <div className="grid gap-6">
            {reviewers.map((reviewer) => (
              <div
                key={reviewer.id}
                className="bg-[#3b2516] rounded-lg p-6 border border-[#e6ccb2]/20"
              >
                <div className="flex items-start gap-4 mb-4">
                  {reviewer.photoUrl ? (
                    <Image
                      src={reviewer.photoUrl}
                      alt={reviewer.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-[#e6ccb2] rounded-full flex items-center justify-center">
                      <span className="text-[#3b2516] font-bold text-lg">
                        {reviewer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-[#e6ccb2]">
                      {reviewer.name}
                    </h3>
                  </div>
                </div>
                <p className="text-[#e6ccb2]/90 leading-relaxed">
                  &ldquo;{reviewer.review}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Final Thoughts</h2>
        <p className="text-[#e6ccb2]">{post.finalThoughts}</p>
      </div>
    </article>
  );
}
