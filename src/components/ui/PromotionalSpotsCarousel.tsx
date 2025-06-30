"use client";

import { Carousel } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

interface PromotionalSpot {
  id: string;
  title: string;
  description: string;
  type: string;
  value: string;
  isActive: boolean;
  details?: string;
}

interface PromotionalSpotsCarouselProps {
  spots: PromotionalSpot[];
}

export function PromotionalSpotsCarousel({ spots }: PromotionalSpotsCarouselProps) {
  const activeSpots = spots.filter(spot => spot.isActive);

  if (activeSpots.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'discount':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'service':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'announcement':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getValueBadgeColor = (type: string) => {
    switch (type) {
      case 'discount':
        return 'bg-yellow-400 text-red-900 hover:bg-yellow-300';
      case 'service':
        return 'bg-green-400 text-green-900 hover:bg-green-300';
      case 'announcement':
        return 'bg-purple-200 text-purple-900 hover:bg-purple-100';
      default:
        return 'bg-gray-200 text-gray-900 hover:bg-gray-100';
    }
  };

  const spotSlides = activeSpots.map((spot) => (
    <div 
      key={spot.id} 
      className={`${getTypeColor(spot.type)} py-3 px-4 text-white relative overflow-hidden`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg animate-pulse">
              {spot.title}
            </span>
            {spot.value && (
              <Badge 
                className={`${getValueBadgeColor(spot.type)} px-3 py-1 text-sm font-bold animate-bounce`}
              >
                {spot.value}
              </Badge>
            )}
          </div>
          
          {spot.details && (
            <span className="text-sm opacity-90 max-w-md">
              {spot.details}
            </span>
          )}
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine" />
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  ));

  return (
    <section className="relative">
      <Carousel
        items={spotSlides}
        autoPlay={true}
        autoPlayDelay={4000}
        showDots={activeSpots.length > 1}
        showArrows={false}
        className="w-full"
        itemClassName="min-h-[60px]"
      />
    </section>
  );
}
