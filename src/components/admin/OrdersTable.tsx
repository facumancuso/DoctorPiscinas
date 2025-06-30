"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateOrderStatus } from "@/app/actions/admin";

const orderStatuses: Order['status'][] = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado'];

interface OrdersTableProps {
    initialOrders: Order[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(currentOrders =>
        currentOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast({
        title: "Estado actualizado",
        description: `El pedido #${orderId.substring(0,8)} ha sido actualizado a "${newStatus}".`,
      });
      router.refresh();
    } catch (error) {
       toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Enviado':
        return 'default';
      case 'Entregado':
        return 'default';
      case 'Procesando':
        return 'secondary';
      case 'Cancelado':
        return 'destructive';
      case 'Pendiente':
      default:
        return 'outline';
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="hidden md:table-cell">Fecha</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-right">Ganancia</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const orderItems = order.items;
          const orderProfit = orderItems.reduce((sum, item) => {
              const itemPrice = item.price;
              const itemCost = item.cost ?? 0;
              return sum + (itemPrice - itemCost) * item.quantity;
          }, 0);

          return (
          <TableRow key={order.id}>
            <TableCell className="font-medium" onClick={() => handleViewDetails(order.id)}>
              <span className="cursor-pointer hover:underline">#{order.id.substring(0, 8)}...</span>
            </TableCell>
            <TableCell>
              <div>{order.customer_name}</div>
              <div className="text-sm text-muted-foreground">
                {order.customer_phone}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {new Date(order.date).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              ${order.total.toFixed(2)}
            </TableCell>
            <TableCell className="text-right text-green-600">
              ${orderProfit.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleViewDetails(order.id)}>
                    Ver Detalles
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Cambiar Estado</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuLabel>Seleccionar Estado</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {orderStatuses.map(status => (
                          <DropdownMenuItem key={status} onClick={() => handleStatusChange(order.id, status)}>
                              {status}
                          </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
    </Table>
  );
}
