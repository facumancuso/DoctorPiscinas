import { deleteSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        await deleteSession();
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'An internal error occurred' }, { status: 500 });
    }
}
