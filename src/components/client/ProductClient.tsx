"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';


export function ProductClient({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice ?? product.price,
      image: product.images[0],
      cost: product.cost,
    });
    toast({
      title: "Añadido al carrito",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-square relative mb-4 rounded-lg overflow-hidden shadow-lg">
            {product.isOnSale && (
                <Badge variant="destructive" className="absolute top-3 left-3 z-10 text-base">Oferta</Badge>
            )}
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-opacity duration-300"
              data-ai-hint="pool product detail"
              key={selectedImage}
              priority
            />
            {product.images.length > 1 && (
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
            {product.images.map((img, index) => (
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
                  alt={`${product.name} miniatura ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                  data-ai-hint="pool product thumbnail"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          
          {product.isOnSale && product.salePrice ? (
              <div className="flex items-baseline gap-3 mb-4">
                  <p className="text-3xl font-bold text-destructive">${product.salePrice.toFixed(2)}</p>
                  <p className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</p>
              </div>
          ) : (
              <p className="text-2xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
          )}
          
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center gap-4">
            <Button size="lg" onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="w-full sm:w-auto">
                <ShoppingCart className="mr-2 h-5 w-5"/>
              Añadir al Carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
