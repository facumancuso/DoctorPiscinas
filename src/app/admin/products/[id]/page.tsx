import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [productFromDb, categories] = await Promise.all([
      prisma.product.findUnique({ where: { id: resolvedParams.id } }),
      prisma.productCategory.findMany()
  ]);

  if (!productFromDb) {
    notFound();
  }

  const product = { ...productFromDb, images: productFromDb.images as string[] };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}