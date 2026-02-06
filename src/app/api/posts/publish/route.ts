import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
 
export async function POST(req: NextRequest) {
  const { id, published } = await req.json();
  const post = await prisma.post.update({ where: { id }, data: { published } });
  revalidateTag('posts');
  revalidateTag(`post:${id}`);
  return NextResponse.json(post);
}
