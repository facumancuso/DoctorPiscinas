
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  return (
    <Card className="flex flex-col overflow-hidden h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/product/${product.id}`} className="flex-grow">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            {product.isOnSale && (
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">Oferta</Badge>
            )}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="pool product"
            />
          </div>
          <div className="p-4">
            <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
            {product.isOnSale && product.salePrice ? (
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-destructive">
                  ${product.salePrice.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-base font-semibold text-primary">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" disabled={product.stock_quantity === 0}>
            <ShoppingCart className="mr-2 h-4 w-4"/>
            Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
