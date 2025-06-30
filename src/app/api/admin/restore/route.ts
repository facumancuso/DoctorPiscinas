import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('backupFile') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se ha subido ningún archivo.' }, { status: 400 });
    }

    if (!file.name.endsWith('.ts')) {
        return NextResponse.json({ error: 'Tipo de archivo inválido. Por favor, sube un archivo .ts.' }, { status: 400 });
    }

    const fileContents = await file.text();

    // Validación básica para comprobar si se parece al archivo data.ts
    if (!fileContents.includes('export const products: Product[]') || !fileContents.includes('export const services: Service[]')) {
        return NextResponse.json({ error: 'El archivo subido no parece ser un archivo de respaldo válido.' }, { status: 400 });
    }

    const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');
    
    // Sobrescribir el archivo data.ts existente
    await fs.writeFile(dataFilePath, fileContents, 'utf8');

    return NextResponse.json({ message: 'Respaldo restaurado con éxito.' }, { status: 200 });

  } catch (error) {
    console.error('Falló la restauración:', error);
    return NextResponse.json({ error: 'Falló la restauración del respaldo.' }, { status: 500 });
  }
}
