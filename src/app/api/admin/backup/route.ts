import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');

    const date = new Date().toISOString().split('T')[0];
    const fileName = `pool-paradise-backup-${date}.ts`;

    const headers = new Headers();
    headers.set('Content-Type', 'application/typescript; charset=utf-8');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    return new Response(fileContents, { headers });

  } catch (error) {
    console.error('Backup failed:', error);
    return NextResponse.json({ error: 'Failed to create backup.' }, { status: 500 });
  }
}
