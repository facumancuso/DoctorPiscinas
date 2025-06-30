import { MetadataRoute } from 'next'
import { products, productCategories, services, serviceCategories } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/how-to-buy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
     {
      url: `${SITE_URL}/track`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const productCategoryPages: MetadataRoute.Sitemap = productCategories.map((category) => ({
    url: `${SITE_URL}/catalog/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${SITE_URL}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
  }));

  const serviceCategoryPages: MetadataRoute.Sitemap = serviceCategories.map((category) => ({
    url: `${SITE_URL}/services/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
      url: `${SITE_URL}/service/${service.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
  }));

  return [
    ...staticPages,
    ...productCategoryPages,
    ...productPages,
    ...serviceCategoryPages,
    ...servicePages,
  ];
}
