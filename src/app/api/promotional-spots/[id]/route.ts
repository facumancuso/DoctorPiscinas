import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spot = await prisma.promotionalSpot.findUnique({
      where: { id }
    });
    
    if (!spot) {
      return NextResponse.json(
        { error: 'Promotional spot not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error fetching promotional spot:', error);
    return NextResponse.json(
      { error: 'Error fetching promotional spot' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData: any = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.image !== undefined) updateData.image = data.image;
    if (data.details !== undefined) updateData.details = data.details;
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;
    
    const spot = await prisma.promotionalSpot.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error updating promotional spot:', error);
    return NextResponse.json(
      { error: 'Error updating promotional spot' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.promotionalSpot.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting promotional spot:', error);
    return NextResponse.json(
      { error: 'Error deleting promotional spot' }, 
      { status: 500 }
    );
  }
}