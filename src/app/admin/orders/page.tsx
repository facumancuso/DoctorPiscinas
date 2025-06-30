import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/app/actions/admin";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Ver y gestionar pedidos recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable initialOrders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
