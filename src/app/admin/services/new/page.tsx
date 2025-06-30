import { prisma } from '@/lib/prisma';
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function NewServicePage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ServiceForm categories={categories} />
    </div>
  );
}