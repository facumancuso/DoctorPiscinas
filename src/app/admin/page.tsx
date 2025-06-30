import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/lib/types";

export default async function AdminDashboardPage() {
    const ordersFromDb = await prisma.order.findMany();
    const products = await prisma.product.findMany();

    const orders = ordersFromDb.map(o => ({...o, items: o.items as CartItem[]}));

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const totalCost = orders.reduce((sum, order) => {
        const orderItems = order.items;
        const orderCost = orderItems.reduce((itemSum: number, item: CartItem) => {
            return itemSum + (item.cost ?? 0) * item.quantity;
        }, 0);
        return sum + orderCost;
    }, 0);

    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    const totalOrders = orders.length;
    const productsInStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString('es-AR', {minimumFractionDigits: 2})}</div>
                        <p className="text-xs text-muted-foreground">de {totalOrders} pedidos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString('es-AR', {minimumFractionDigits: 2})}</div>
                        <p className="text-xs text-muted-foreground">Margen de ganancia del {profitMargin.toFixed(1)}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">pedidos en total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos en Stock</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsInStock}</div>
                        <p className="text-xs text-muted-foreground">Total de productos disponibles</p>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>¡Bienvenido a tu Panel de Administración!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Aquí puedes gestionar tus productos, pedidos y más. Usa la barra lateral para navegar por las diferentes secciones.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
