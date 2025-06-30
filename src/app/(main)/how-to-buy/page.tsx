
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Paso 1: Encuentra tu Producto",
    description: "Navega por nuestras categorías o utiliza la barra de búsqueda para encontrar exactamente lo que necesitas. Haz clic en un producto para ver más detalles.",
    image: "https://placehold.co/800x450.png",
    imageHint: "product grid"
  },
  {
    title: "Paso 2: Añádelo al Carrito",
    description: "Una vez que hayas elegido tu producto, haz clic en el botón 'Añadir al Carrito' para guardarlo en tu compra.",
    image: "https://placehold.co/800x450.png",
    imageHint: "product page"
  },
  {
    title: "Paso 3: Revisa tu Carrito",
    description: "Haz clic en el ícono del carrito en la esquina superior derecha para revisar los productos que has seleccionado. Aquí puedes ajustar las cantidades o eliminar productos.",
    image: "https://placehold.co/800x450.png",
    imageHint: "shopping cart"
  },
  {
    title: "Paso 4: Procede al Checkout",
    description: "Cuando estés listo, haz clic en 'Proceder al Checkout'. Completa tu información de contacto y revisa el resumen de tu pedido.",
    image: "https://placehold.co/800x450.png",
    imageHint: "checkout form"
  },
  {
    title: "Paso 5: Confirma tu Pedido",
    description: "Haz clic en 'Realizar Pedido'. Recibirás una confirmación en pantalla con los detalles para el pago y un número de pedido para el seguimiento.",
    image: "https://placehold.co/800x450.png",
    imageHint: "order confirmation"
  },
  {
    title: "Paso 6: Rastrea tu Pedido",
    description: "Una vez confirmado tu pedido, puedes seguir su estado en tiempo real. Ve a la sección 'Rastrear Pedido' e introduce el número de teléfono que usaste en la compra.",
    image: "https://placehold.co/800x450.png",
    imageHint: "order tracking"
  }
];

export default function HowToBuyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">¿Cómo Comprar?</h1>
        <p className="text-muted-foreground mt-2 text-lg">Comprar en Doctor Piscinas San Juan es fácil, rápido y seguro. Sigue estos 6 sencillos pasos.</p>
      </div>

      <div className="space-y-10">
        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary mr-3" />
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </div>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </div>
              <div className="aspect-video relative">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  data-ai-hint={step.imageHint}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold">¡Y listo!</h2>
        <p className="text-muted-foreground mt-2">Así de fácil es tener tu piscina lista para disfrutar. Si tienes alguna duda, no dudes en contactarnos.</p>
      </div>
    </div>
  );
}
