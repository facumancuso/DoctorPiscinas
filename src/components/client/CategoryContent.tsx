"use client";

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CategoryContent({ categoryName, categoryDescription, initialProducts }: { categoryName: string, categoryDescription: string | null | undefined, initialProducts: Product[] }) {
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const filteredProducts = initialProducts.filter(product => {
    if (showOffersOnly) {
      return product.isOnSale;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (page: number) => {
      if (page > 0 && page <= totalPages) {
          setCurrentPage(page);
      }
  };

  return (
    <>
        <div className="mb-8 p-6 bg-card rounded-xl shadow-sm">
            <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
            {categoryDescription && <p className="text-muted-foreground">{categoryDescription}</p>}
             <Card className="mt-4">
                <CardHeader className="p-4">
                    <CardTitle className="text-base">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="offers-only" className="font-medium">Mostrar solo ofertas</Label>
                        <Switch 
                            id="offers-only" 
                            checked={showOffersOnly}
                            onCheckedChange={setShowOffersOnly}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
      
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </>
        ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">No se encontraron productos</h2>
                <p className="mt-2 text-muted-foreground">Intenta ajustar tus filtros o revisa más tarde.</p>
            </div>
        )}
    </>
  );
}
