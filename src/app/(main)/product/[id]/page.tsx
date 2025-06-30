import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ProductClient } from '@/components/client/ProductClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const productFromDb = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!productFromDb) {
    return {
      title: "Producto no encontrado",
    }
  }
  
  const product = { ...productFromDb, images: productFromDb.images as string[] };
  const title = product.metaTitle || `${product.name} - Doctor Piscinas San Juan`;
  const description = product.metaDescription || product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.images[0],
          width: 600,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]],
    },
  }
}

async function getProductData(id: string) {
    const productWithCategory = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!productWithCategory) {
        notFound();
    }
    const { images, ...rest } = productWithCategory;
    return { ...rest, images: images as string[] };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
      priceCurrency: 'ARS',
      price: product.salePrice ?? product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
  
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
          name: product.category?.name || 'Catálogo',
          item: `/catalog/${product.category?.slug || 'all'}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
        },
      ],
    };

  return (
    <>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}