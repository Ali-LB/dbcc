import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

type ReviewerData = {
  name: string;
  photoUrl: string;
  review: string;
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { reviewers, ...postData } = data;
    
    // Create the post first
    const post = await prisma.post.create({ data: postData });
    
    // Create reviewers if provided
    if (reviewers && reviewers.length > 0) {
      await prisma.postReview.createMany({
        data: reviewers.map((reviewer: ReviewerData) => ({
          name: reviewer.name,
          photoUrl: reviewer.photoUrl,
          review: reviewer.review,
          postId: post.id,
        })),
      });
    }
    
    revalidateTag('posts');
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, reviewers, ...postData } = data;
    
    // Update the post
    const post = await prisma.post.update({ where: { id }, data: postData });
    
    // Handle reviewers
    if (reviewers !== undefined) {
      // Delete existing reviewers
      await prisma.postReview.deleteMany({
        where: { postId: id },
      });
      
      // Create new reviewers if provided
      if (reviewers && reviewers.length > 0) {
        await prisma.postReview.createMany({
          data: reviewers.map((reviewer: ReviewerData) => ({
            name: reviewer.name,
            photoUrl: reviewer.photoUrl,
            review: reviewer.review,
            postId: id,
          })),
        });
      }
    }
    
    revalidateTag('posts');
    revalidateTag(`post:${id}`);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.post.delete({ where: { id } });
    revalidateTag('posts');
    revalidateTag(`post:${id}`);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const withLocation = req.nextUrl.searchParams.get("withLocation");
    const where = withLocation
      ? { latitude: { not: null }, longitude: { not: null } }
      : undefined;
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 
