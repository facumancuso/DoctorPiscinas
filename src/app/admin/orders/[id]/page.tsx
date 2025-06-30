import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { CartItem } from '@/lib/types';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderFromDb = await prisma.order.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!orderFromDb) {
    notFound();
  }
  
  const order = { ...orderFromDb, items: orderFromDb.items as CartItem[] };

  const orderItems = order.items;
  const totalCost = orderItems.reduce((sum, item) => sum + (item.cost ?? 0) * item.quantity, 0);
  const totalProfit = order.total - totalCost;

  return (
    <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Detalles del Pedido #{order.id}</h1>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Productos del Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[80px] sm:table-cell">Imagen</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-center">Cantidad</TableHead>
                                    <TableHead className="text-right">Precio Unitario</TableHead>
                                    <TableHead className="text-right">Costo Unitario</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt={item.name}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={item.image}
                                                width="64"
                                                data-ai-hint="product image"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${(item.cost ?? 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen del Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID Pedido</span>
                            <span>#{order.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Fecha</span>
                            <span>{new Date(order.date).toLocaleDateString()}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Estado</span>
                            <Badge>{order.status}</Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total del Pedido</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Costo de Bienes</span>
                            <span>-${totalCost.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Ganancia</span>
                            <span className="text-green-600">${totalProfit.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Información del Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="font-medium">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}