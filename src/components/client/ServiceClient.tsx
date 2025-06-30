"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Service } from '@/lib/types';


export function ServiceClient({ service }: { service: Service }) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? service.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
      setSelectedImage((prev) => (prev === service.images.length - 1 ? 0 : prev + 1));
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || '5491122334455';
  const message = `Hola, estoy interesado/a en cotizar el servicio de "${service.name}". ¿Podrían darme más información?`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-square relative mb-4 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={service.images[selectedImage]}
              alt={service.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              data-ai-hint="pool service detail"
              priority
            />
            {service.images.length > 1 && (
                <>
                    <Button onClick={handlePrev} variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button onClick={handleNext} variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50">
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {service.images.map((img, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square relative rounded-md overflow-hidden cursor-pointer ring-2 ring-transparent transition-all",
                  selectedImage === index && "ring-primary ring-offset-2"
                )}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={img}
                  alt={`${service.name} miniatura ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  data-ai-hint="pool service thumbnail"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{service.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">{service.price_display}</p>
          <p className="text-muted-foreground mb-6">{service.description}</p>
          <div className="flex items-center gap-4">
            <Button size="lg" asChild>
                <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-5 w-5"/>
                    Contactar para Cotizar
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
