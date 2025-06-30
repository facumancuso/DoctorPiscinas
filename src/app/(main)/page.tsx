import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroBannerCarousel } from '@/components/ui/HeroBannerCarousel';
import { PromotionalSpotsCarousel } from '@/components/ui/PromotionalSpotsCarousel';
import { prisma } from '@/lib/prisma';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const [heroBanners, productCategories, promotionalSpots] = await Promise.all([
    // Obtener todos los banners activos
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.productCategory.findMany(),
    // Obtener spots promocionales activos
    prisma.promotionalSpot.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div>
      {/* Promotional Spots Carousel */}
      <PromotionalSpotsCarousel spots={promotionalSpots} />

      {/* Hero Banner Carousel */}
      <HeroBannerCarousel banners={heroBanners} />

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Comprar por Categoría</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category) => (
              <Link href={`/catalog/${category.slug}`} key={category.id}>
                <Card className="group overflow-hidden relative h-64 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint="pool category"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <CardContent className="relative h-full flex items-center justify-center p-4">
                    <h3 className="text-2xl font-bold text-white text-center text-shadow">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}