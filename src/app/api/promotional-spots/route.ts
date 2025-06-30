import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const spots = await prisma.promotionalSpot.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching promotional spots:', error);
    return NextResponse.json(
      { error: 'Error fetching promotional spots' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const spot = await prisma.promotionalSpot.create({ 
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        value: data.value,
        isActive: data.isActive ?? true,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        image: data.image,
        details: data.details,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      }
    });
    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error creating promotional spot:', error);
    return NextResponse.json(
      { error: 'Error creating promotional spot' }, 
      { status: 500 }
    );
  }
}