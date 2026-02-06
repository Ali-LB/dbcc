import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewers = await prisma.postReview.findMany({
      where: { postId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(reviewers);
  } catch (error) {
    console.error("Error fetching reviewers:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviewers" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, photoUrl, review } = await request.json();
    
    const reviewer = await prisma.postReview.create({
      data: {
        name,
        photoUrl,
        review,
        postId: id,
      },
    });
    
    return NextResponse.json(reviewer);
  } catch (error) {
    console.error("Error creating reviewer:", error);
    return NextResponse.json(
      { error: "Failed to create reviewer" },
      { status: 500 }
    );
  }
} 
