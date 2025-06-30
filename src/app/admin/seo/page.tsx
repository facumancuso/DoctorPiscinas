import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SeoGenerator } from "@/components/admin/SeoGenerator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function AdminSeoPage() {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold">Dashboard de SEO</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Resumen de Optimización SEO</CardTitle>
                    <CardDescription>
                        Esta página centraliza las herramientas y recursos para mejorar la visibilidad de tu sitio en los motores de búsqueda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>He implementado varias mejoras automáticas en todo el sitio:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li><strong>Metadatos Dinámicos:</strong> Cada página de producto, servicio y categoría ahora genera títulos y descripciones únicos para un mejor posicionamiento.</li>
                        <li><strong>Datos Estructurados (Schema):</strong> Los productos ahora tienen schema JSON-LD, lo que ayuda a Google a mostrar "resultados enriquecidos" (como precio y stock) directamente en la búsqueda.</li>
                        <li><strong>Sitemap Automático:</strong> Se genera un `sitemap.xml` con todas tus páginas para que Google pueda descubrirlas fácilmente.</li>
                         <li><strong>Feed para Google Shopping:</strong> Se ha creado un feed de productos para que puedas subirlos a Google Merchant Center.</li>
                    </ul>
                    <div className="flex gap-4 pt-4">
                        <Button asChild variant="outline">
                            <Link href="/sitemap.xml" target="_blank">
                                Ver Sitemap <ExternalLink className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                         <Button asChild variant="outline">
                            <Link href="/api/google-product-feed" target="_blank">
                                Ver Feed de Productos <ExternalLink className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <SeoGenerator/>
        </div>
    )
}
