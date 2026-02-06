import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const reviewers = await prisma.postReview.findMany({
    where: { postId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ post, reviewers });
}
