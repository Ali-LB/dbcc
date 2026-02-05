import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
 
export async function POST(req: NextRequest) {
  const { id, published } = await req.json();
  const post = await prisma.post.update({ where: { id }, data: { published } });
  return NextResponse.json(post);
} 