import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl">¡Gracias por tu compra!</CardTitle>
          <CardDescription>
            Tu pedido ha sido realizado con éxito. Por favor, completa la transferencia bancaria para finalizar.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="font-semibold text-lg">ID del Pedido: #{resolvedParams.id}</p>
          <p className="text-muted-foreground mt-2">
            Puedes seguir el estado de tu pedido usando tu número de teléfono en nuestra página de seguimiento.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Seguir Comprando</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/track">Rastrear Pedido</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}