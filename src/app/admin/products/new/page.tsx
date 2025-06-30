import { prisma } from '@/lib/prisma';
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ProductForm categories={categories} />
    </div>
  );
}