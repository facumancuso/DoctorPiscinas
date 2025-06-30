
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Order, CartItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { findOrdersByPhoneAction } from '@/app/actions/order';

const trackOrderSchema = z.object({
  phone: z.string().min(10, 'Por favor, introduce un número de teléfono válido'),
});


export default function TrackOrderPage() {
  const [foundOrders, setFoundOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof trackOrderSchema>>({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { phone: '' },
  });

  async function onSubmit(values: z.infer<typeof trackOrderSchema>) {
    setIsLoading(true);
    setSearched(true);
    const matchingOrders = await findOrdersByPhoneAction(values.phone);
    setFoundOrders(matchingOrders);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Rastrear tu Pedido</h1>
        <p className="text-muted-foreground text-center mb-8">
          Introduce el número de teléfono que usaste en el checkout para ver el estado de tu pedido.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Introduce tu número de teléfono" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Buscando...' : 'Rastrear'}
            </Button>
          </form>
        </Form>
      </div>

      {searched && (
        <div className="max-w-4xl mx-auto mt-12">
          {isLoading ? (
            <p className="text-center">Buscando pedidos...</p>
          ) : foundOrders.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Se encontraron {foundOrders.length} pedido(s)</h2>
              {foundOrders.map(order => {
                const orderItems = order.items as CartItem[];
                return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Pedido #{order.id}</CardTitle>
                            <CardDescription>Fecha: {new Date(order.date).toLocaleDateString()}</CardDescription>
                        </div>
                        <Badge>{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul>
                        {orderItems.map((item, index) => (
                            <li key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div className="flex items-center gap-4">
                                    <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint="product image"/>
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Cant: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right font-bold text-lg mt-4">
                        Total: ${order.total.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-12">No se encontraron pedidos para este número de teléfono.</p>
          )}
        </div>
      )}
    </div>
  );
}
