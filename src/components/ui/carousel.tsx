"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  itemClassName?: string;
}

export function Carousel({
  items,
  autoPlay = true,
  autoPlayDelay = 5000,
  showDots = true,
  showArrows = true,
  className,
  itemClassName,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Marcar que el componente está montado (solo cliente)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play solo si está montado y no está en hover
  useEffect(() => {
    if (!autoPlay || isHovered || items.length <= 1 || !isMounted) return;

    const interval = setInterval(nextSlide, autoPlayDelay);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, isHovered, nextSlide, items.length, isMounted]);

  // Navegación con teclado
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isMounted]);

  if (items.length === 0) return null;

  // Renderizado simplificado en SSR: solo primer slide para evitar desincronización
  if (!isMounted) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className={cn("w-full flex-shrink-0", itemClassName)}>{items[0]}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor principal */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className={cn("w-full flex-shrink-0", itemClassName)}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Flechas de navegación */}
      {showArrows && items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicadores de puntos */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentIndex === index
                  ? "bg-white scale-110 shadow-lg"
                  : "bg-white/60 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Barra de progreso animada */}
      {autoPlay && !isHovered && items.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div
            className="progress-bar"
            style={{ animationDuration: `${autoPlayDelay}ms` }}
            key={currentIndex} // reinicia animación en cada slide
          />
        </div>
      )}
    </div>
  );
}
