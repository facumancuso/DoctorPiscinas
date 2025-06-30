
"use client";

import Link from "next/link";
import { ShoppingCart, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "./ui/badge";

export default function Header() {
  const { cartCount } = useCart();
  const firstServiceCategorySlug = 'maintenance'; // Hardcoded for now as data is fetched on the page

  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Waves className="h-6 w-6" />
          <span>Doctor Piscinas San Juan</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">Inicio</Link>
          <Link href="/catalog/all" className="text-foreground/80 hover:text-foreground transition-colors">Productos</Link>
          <Link href={`/services/${firstServiceCategorySlug}`} className="text-foreground/80 hover:text-foreground transition-colors">Servicios</Link>
          <Link href="/track" className="text-foreground/80 hover:text-foreground transition-colors">Rastrear Orden</Link>
          <Link href="/admin" className="text-foreground/80 hover:text-foreground transition-colors">Admin</Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button asChild variant="ghost" size="icon">
              <Link href="/cart" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-0 right-0 h-5 w-5 -translate-y-1/2 translate-x-1/2 flex items-center justify-center rounded-full p-0 text-xs"
              >
                {cartCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
