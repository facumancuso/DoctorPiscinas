"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  description: string;
  cta: string;
  cta_link: string;
  image: string;
  isActive: boolean;
  position: string;
}

interface HeroBannerCarouselProps {
  banners: Banner[];
}

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const activeBanners = banners.filter(banner => banner.isActive);

  if (activeBanners.length === 0) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No active banners configured</p>
      </div>
    );
  }

  const bannerSlides = activeBanners.map((banner) => (
    <div key={banner.id} className="relative w-full h-[50vh] md:h-[60vh] text-white">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        sizes="100vw"
        className="object-cover"
        data-ai-hint="pool background"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto h-full flex flex-col items-start justify-center px-4 md:px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-shadow-lg animate-fade-in-up">
            {banner.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-shadow animate-fade-in-up animation-delay-200">
            {banner.description}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 animate-fade-in-up animation-delay-400"
          >
            <Link href={banner.cta_link}>
              {banner.cta} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="relative">
      <Carousel
        items={bannerSlides}
        autoPlay={true}
        autoPlayDelay={6000}
        showDots={true}
        showArrows={true}
        className="w-full"
      />
      
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}