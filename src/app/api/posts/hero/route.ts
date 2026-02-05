import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // First, unset any existing hero post
    await prisma.post.updateMany({
      where: { isHero: true },
      data: { isHero: false },
    });

    // Then set the new hero post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { isHero: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error setting hero post:", error);
    return NextResponse.json(
      { error: "Failed to set hero post" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Unset any existing hero post
    await prisma.post.updateMany({
      where: { isHero: true },
      data: { isHero: false },
    });

    return NextResponse.json({ message: "Hero post unset" });
  } catch (error) {
    console.error("Error unsetting hero post:", error);
    return NextResponse.json(
      { error: "Failed to unset hero post" },
      { status: 500 }
    );
  }
} 