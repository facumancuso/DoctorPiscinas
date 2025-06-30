import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ServiceClient } from '@/components/client/ServiceClient';
import { Service } from '@/lib/types';


export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const serviceFromDb = await prisma.service.findUnique({
    where: { id: params.id },
  });

  if (!serviceFromDb) {
    return {
      title: "Servicio no encontrado",
    }
  }

  const service = { ...serviceFromDb, images: serviceFromDb.images as string[] };
  const title = service.metaTitle || `${service.name} - Doctor Piscinas San Juan`;
  const description = service.metaDescription || service.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: service.images[0],
          width: 600,
          height: 600,
          alt: service.name,
        },
      ],
    },
  }
}

async function getServiceData(id: string) {
    const serviceFromDb = await prisma.service.findUnique({
        where: { id },
    });
    if (!serviceFromDb) {
        notFound();
    }
    const { images, ...rest } = serviceFromDb;
    return { ...rest, images: images as string[] };
}


export default async function ServicePage({ params }: { params: { id: string } }) {
    const service = await getServiceData(params.id);
    return <ServiceClient service={service as Service} />
}
