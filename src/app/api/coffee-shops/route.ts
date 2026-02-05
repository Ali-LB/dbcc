import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const shops = await prisma.coffeeShop.findMany({
      where: { isActive: true },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(shops);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const shop = await prisma.coffeeShop.create({
      data,
      include: { posts: true }
    });
    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const shop = await prisma.coffeeShop.update({
      where: { id },
      data: rest,
      include: { posts: true }
    });
    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.coffeeShop.update({
      where: { id },
      data: { isActive: false }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 