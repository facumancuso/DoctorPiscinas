"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, cartTotal, discountAmount, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const result = await applyCoupon(couponCode);
    toast({
        title: result.success ? 'Éxito' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
    });
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast({
        title: 'Cupón eliminado',
        description: 'El descuento ha sido eliminado de tu pedido.',
    });
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Tu Carrito</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground"/>
          <h2 className="mt-6 text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mt-2 text-muted-foreground">Parece que todavía no has añadido nada a tu carrito.</p>
          <Button asChild className="mt-6">
            <Link href="/">Empezar a Comprar</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
                <CardContent className="p-0">
                    <ul className="divide-y">
                        {cartItems.map(item => (
                        <li key={item.id} className="flex items-center p-4">
                            <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                            data-ai-hint="product image"
                            />
                            <div className="ml-4 flex-grow">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                                className="w-16 h-9"
                                aria-label="Cantidad"
                            />
                            <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)} aria-label="Eliminar producto">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Button variant="outline" onClick={clearCart} className="mt-4">
                Vaciar Carrito
            </Button>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {!appliedCoupon ? (
                  <div className="flex gap-2 mb-4">
                      <Input
                          placeholder="Código de cupón"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button onClick={handleApplyCoupon}>Aplicar</Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-muted text-muted-foreground p-3 rounded-md mb-4">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4"/>
                        <span className="text-sm font-semibold">Cupón aplicado: {appliedCoupon.code}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemoveCoupon}>Quitar</Button>
                  </div>
                )}
                
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                        <span>Descuento</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between mb-2">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceder al Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
