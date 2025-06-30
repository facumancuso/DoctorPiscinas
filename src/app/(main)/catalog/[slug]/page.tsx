import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { ProductCategory } from '@/lib/types';
import { AdsenseBanner } from '@/components/AdsenseBanner';
import { CategorySidebar } from '@/components/server/CategorySidebar';
import { CategoryContent } from '@/components/client/CategoryContent';
import { Metadata } from 'next';

async function getCategoryData(slug: string) {
  const allProductCategories = await prisma.productCategory.findMany();

  if (slug === 'all') {
    const productsFromDb = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    });
    const products = productsFromDb.map(p => ({ ...p, images: p.images as string[] }));

    return {
      category: {
        id: 'all',
        name: 'Todos los Productos',
        description: 'Explora nuestra colección completa de productos para tu piscina.',
        slug: 'all',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      products,
      productCategories: allProductCategories,
      isAllProducts: true,
    };
  }

  const categoryWithProducts = await prisma.productCategory.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!categoryWithProducts) {
    notFound();
  }
  
  const { products: productsFromDb, ...category } = categoryWithProducts;
  const products = productsFromDb.map(p => ({ ...p, images: p.images as string[] }));

  return {
    category,
    products,
    productCategories: allProductCategories,
    isAllProducts: false,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { category } = await getCategoryData(resolvedParams.slug);

  return {
    title: `${category.name} | Doctor Piscinas San Juan`,
    description: category.description || `Explora nuestra colección de ${category.name.toLowerCase()}`,
    openGraph: {
      title: `${category.name} | Doctor Piscinas San Juan`,
      description: category.description || `Explora nuestra colección de ${category.name.toLowerCase()}`,
      images: category.image ? [category.image] : [],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { category, products, productCategories } = await getCategoryData(resolvedParams.slug);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: '/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
      },
    ],
  };

  return (
    <>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <CategorySidebar currentSlug={resolvedParams.slug} categories={productCategories as ProductCategory[]} />
          <main className="lg:col-span-3">
             <CategoryContent
                categoryName={category.name}
                categoryDescription={category.description}
                initialProducts={products}
              />
          </main>
        </div>
      </div>
    </>
  );
}