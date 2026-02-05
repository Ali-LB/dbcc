import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  if (!q) return NextResponse.json([]);

  // Fetch all posts and filter in JS for case-insensitive match (SQLite limitation)
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      keywords: {
        not: null,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const filtered = posts.filter(post =>
    post.keywords?.toLowerCase().includes(q)
  ).slice(0, 10);
  return NextResponse.json(filtered);
} 