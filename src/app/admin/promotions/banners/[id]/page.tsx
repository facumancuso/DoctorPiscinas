import { notFound } from 'next/navigation';
import { BannerForm } from '@/components/admin/BannerForm';
import { prisma } from '@/lib/prisma';

export default async function EditBannerPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  
  const banner = await prisma.banner.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!banner) {
    notFound();
  }

  // Convertir el banner de la base de datos al formato esperado por el formulario
  const formattedBanner = {
    ...banner,
    imageUrl: banner.image, // Para compatibilidad con formularios existentes
    link: banner.cta_link, // Para compatibilidad con formularios existentes
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <BannerForm initialData={formattedBanner} />
    </div>
  );
}