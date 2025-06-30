'use server';

import { prisma } from '@/lib/prisma';
import type { CartItem, Order } from '@/lib/types';
import { z } from 'zod';
import { nanoid } from 'nanoid';

export async function findOrdersByPhoneAction(phone: string): Promise<Order[]> {
  try {
    const ordersFromDb = await prisma.order.findMany({
      where: {
        customer_phone: phone,
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    return ordersFromDb.map(o => ({...o, items: o.items as CartItem[]})) as Order[];
  } catch (error) {
    console.error('Error finding orders by phone:', error);
    return [];
  }
}

const checkoutSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(10, 'Por favor, introduce un número de teléfono válido'),
  address: z.string().min(5, 'Por favor, introduce una dirección válida'),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CreateOrderInput {
    customerData: CheckoutFormValues;
    cartItems: CartItem[];
    subtotal: number;
    discountAmount: number;
    cartTotal: number;
    appliedCouponCode: string | null;
}

export async function createOrderAction(input: CreateOrderInput): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
        const { customerData, cartItems, cartTotal, appliedCouponCode } = input;

        // Note: Prisma will automatically generate a CUID for the ID.
        // We will use a shorter, more human-readable ID for display purposes if needed,
        // but the database will use its own unique ID.
        // For simplicity, we'll use the auto-generated ID from Prisma.
        const createdOrder = await prisma.order.create({
            data: {
                id: `ord_${nanoid(8)}`, // Create a more friendly order ID
                customer_name: customerData.name,
                customer_phone: customerData.phone,
                total: cartTotal,
                status: 'Pendiente',
                items: cartItems, // Prisma handles JSON conversion
                coupon_code: appliedCouponCode,
                // address and notes would need to be added to the schema if we want to save them
            },
        });

        return { success: true, orderId: createdOrder.id };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, error: 'No se pudo crear el pedido. Inténtalo de nuevo.' };
    }
}
