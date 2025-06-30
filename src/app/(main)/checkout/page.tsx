"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { Banknote, Clipboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createOrderAction } from '@/app/actions/order';

const checkoutSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'Por favor, introduce un número de teléfono válido'),
  address: z.string().min(5, 'Por favor, introduce una dirección válida'),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, discountAmount, cartTotal, appliedCoupon, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only redirect if we are on the client and the cart is confirmed to be empty.
    if (isClient && cartItems.length === 0) {
      router.replace('/cart');
    }
  }, [cartItems, isClient, router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: '¡Copiado!',
        description: 'El CBU/Alias ha sido copiado al portapapapeles.',
      });
    });
  };

  // Don't render the form until we're on the client and the cart is not empty.
  if (!isClient || cartItems.length === 0) {
    return null; // or a loading spinner
  }

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    const result = await createOrderAction({
      customerData: values,
      cartItems,
      subtotal,
      discountAmount,
      cartTotal,
      appliedCouponCode: appliedCoupon?.code || null,
    });

    if (!result.success || !result.orderId) {
      toast({
        title: 'Error al crear pedido',
        description: result.error || 'Hubo un problema al procesar tu pedido.',
        variant: 'destructive',
      });
      return;
    }

    const orderId = result.orderId;

    // Construct WhatsApp message
    const itemsText = cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n');
    let message = `*¡Nuevo Pedido!* - #${orderId}\n\n`;
    message += `*Cliente:* ${values.name}\n`;
    message += `*Teléfono:* ${values.phone}\n`;
    message += `*Domicilio:* ${values.address}\n\n`;
    if (values.notes) {
      message += `*Notas:* ${values.notes}\n\n`;
    }
    message += `*Productos:*\n${itemsText}\n\n`;
    message += `*Subtotal:* $${subtotal.toFixed(2)}\n`;
    if (appliedCoupon) {
      message += `*Descuento (${appliedCoupon.code}):* -$${discountAmount.toFixed(2)}\n`;
    }
    message += `*Total:* $${cartTotal.toFixed(2)}\n\n`;
    message += `Por favor, confirmar recepción del pedido.`;

    const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || '5491122334455';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: '¡Pedido Realizado!',
      description: 'Se está abriendo WhatsApp para que confirmes tu pedido.',
    });
    
    clearCart();
    router.push(`/order-confirmation/${orderId}`);
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Teléfono</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="11 2345 6789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domicilio de Entrega</FormLabel>
                        <FormControl>
                          <Input placeholder="Av. Siempre Viva 742" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas Adicionales</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Ej: Dejar en portería, entregar entre las 14 y 18 hs." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" size="lg">Confirmar por WhatsApp</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Banknote className="h-6 w-6"/>
                    Información de Pago
                </CardTitle>
              <CardDescription>Por favor, completa tu pago mediante transferencia bancaria utilizando los siguientes datos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                    <p><strong>Banco:</strong></p>
                    <p>Banco Paraíso</p>
                </div>
                 <div className="flex justify-between items-center">
                    <p><strong>Titular:</strong></p>
                    <p>Doctor Piscinas San Juan</p>
                </div>
              <div className="flex justify-between items-center">
                <p><strong>CBU:</strong></p>
                <div className="flex items-center gap-2">
                    <p className="font-mono bg-muted px-2 py-1 rounded">1234567890</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy('1234567890')} aria-label="Copiar CBU">
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p><strong>Alias:</strong></p>
                <div className="flex items-center gap-2">
                    <p className="font-mono bg-muted px-2 py-1 rounded">facundomancuso.mp</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy('facundomancuso.mp')} aria-label="Copiar Alias">
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
              </div>
               <div className="flex justify-between items-center">
                    <p><strong>Referencia:</strong></p>
                    <p>Usa tu número de teléfono</p>
                </div>
            </CardContent>
          </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="divide-y">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between items-center py-2">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Cant: {item.quantity}</p>
                                </div>
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t pt-4 mt-4 space-y-2">
                        <div className="flex justify-between">
                            <p>Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <p>Descuento ({appliedCoupon?.code})</p>
                                <p>-${discountAmount.toFixed(2)}</p>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${cartTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
