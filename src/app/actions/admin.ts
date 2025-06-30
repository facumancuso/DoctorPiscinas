"use server";

import { prisma } from "@/lib/prisma";
import type { CartItem, Order } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getOrders(): Promise<Order[]> {
    try {
        const ordersFromDb = await prisma.order.findMany({
            orderBy: {
                date: 'desc'
            }
        });
        return ordersFromDb.map(o => ({...o, items: o.items as CartItem[]}));
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath('/admin/orders');
    } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw new Error("Failed to update order status.");
    }
}
