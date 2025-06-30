import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [serviceFromDb, categories] = await Promise.all([
      prisma.service.findUnique({ where: { id: resolvedParams.id } }),
      prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } })
  ]);

  if (!serviceFromDb) {
    notFound();
  }
  
  const service = { ...serviceFromDb, images: serviceFromDb.images as string[] };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ServiceForm initialData={service} categories={categories} />
    </div>
  );
}