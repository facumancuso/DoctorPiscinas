import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Service, ServiceCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await prisma.serviceCategory.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!category) {
    return {
      title: "Categoría de servicio no encontrada",
    }
  }

  const title = `Servicios de ${category.name}`;
  const description = category.description || `Encuentra los mejores servicios de ${category.name} para tu piscina en Doctor Piscinas San Juan.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [category.image],
    },
  }
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="flex flex-col overflow-hidden h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/service/${service.id}`} className="flex-grow">
        <CardContent className="p-0">
          <div className="aspect-video relative">
            <Image
              src={service.images[0]}
              alt={service.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="pool service"
            />
          </div>
          <div className="p-4">
            <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2 h-20 overflow-hidden text-ellipsis">{service.description}</p>
            <p className="text-base font-semibold text-primary">
              {service.price_display}
            </p>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/service/${service.id}`}>
            <Phone className="mr-2 h-4 w-4"/>
            Ver Detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export async function generateStaticParams() {
  const categories = await prisma.serviceCategory.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categoryWithServices = await prisma.serviceCategory.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
        services: true
    }
  });
  
  if (!categoryWithServices) {
    notFound();
  }

  const { services: servicesFromDb, ...category } = categoryWithServices;
  const services = servicesFromDb.map(s => ({ ...s, images: s.images as string[] }));
  
  const allCategories = await prisma.serviceCategory.findMany();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        <aside className="lg:col-span-1 sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle>Categorías de Servicios</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {allCategories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                            href={`/services/${cat.slug}`}
                            className={cn(
                                "block p-3 rounded-lg transition-colors text-foreground/80 font-medium",
                                category.slug === cat.slug
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary"
                            )}
                            >
                            {cat.name}
                            </Link>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </aside>

        <main className="lg:col-span-3">
            <div className="mb-8 p-6 bg-card rounded-xl shadow-sm">
                <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
                {category.description && <p className="text-muted-foreground">{category.description}</p>}
            </div>
          
            {services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service as Service} />
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No se encontraron servicios</h2>
                    <p className="mt-2 text-muted-foreground">No hay servicios disponibles en la categoría "{category.name}" en este momento.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}