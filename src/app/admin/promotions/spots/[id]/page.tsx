import { notFound } from 'next/navigation';
import { PromotionalSpotForm } from '@/components/admin/PromotionalSpotForm';
import { prisma } from '@/lib/prisma';

export default async function EditPromotionalSpotPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  
  const spot = await prisma.promotionalSpot.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!spot) {
    notFound();
  }

  // Convertir el spot de la base de datos al formato esperado por el formulario
  const formattedSpot = {
    ...spot,
    startDate: spot.startDate.toISOString(),
    endDate: spot.endDate.toISOString(),
    active: spot.isActive, // Para compatibilidad con formularios existentes
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PromotionalSpotForm initialData={formattedSpot} />
    </div>
  );
}