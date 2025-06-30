import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Error fetching banners' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const banner = await prisma.banner.create({ 
      data: {
        title: data.title,
        description: data.description,
        cta: data.cta,
        cta_link: data.cta_link,
        image: data.image,
        isActive: data.isActive ?? true,
        position: data.position || 'hero',
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      }
    });
    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Error creating banner' }, 
      { status: 500 }
    );
  }
}