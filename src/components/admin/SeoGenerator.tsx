"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const seoSchema = z.object({
  pageContent: z
    .string()
    .min(50, "El contenido de la página debe tener al menos 50 caracteres."),
  pageType: z.enum(["productListing", "productDetail"]),
});

type SeoFormValues = z.infer<typeof seoSchema>;

interface SeoResult {
  metaTitle: string;
  metaDescription: string;
}

export function SeoGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoResult | null>(null);

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      pageContent: "",
      pageType: "productDetail",
    },
  });

  // Función simple para generar meta título y descripción manualmente
  const generateSeoMetadataManual = (data: SeoFormValues): SeoResult => {
    // Extraemos las primeras 60 caracteres para título
    const cleanContent = data.pageContent.replace(/\s+/g, " ").trim();
    const metaTitle =
      data.pageType === "productDetail"
        ? `Compra el mejor producto - ${cleanContent.slice(0, 50)}`
        : `Listado de productos - ${cleanContent.slice(0, 50)}`;

    // Para descripción, tomamos hasta 160 caracteres
    const metaDescription = cleanContent.slice(0, 157) + (cleanContent.length > 157 ? "..." : "");

    return { metaTitle, metaDescription };
  };

  const onSubmit = async (data: SeoFormValues) => {
    setLoading(true);
    setResult(null);
    try {
      // Aquí llamamos a la función manual
      const seoResult = generateSeoMetadataManual(data);
      // Simulamos pequeña demora para UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      setResult(seoResult);
    } catch (error) {
      console.error("Falló la generación de metadatos SEO:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Optimizador de SEO Manual</CardTitle>
          <CardDescription>
            Genera meta títulos y descripciones amigables para SEO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pageContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido de la Página</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Pega aquí el contenido principal de tu página de producto o listado..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Página</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de página" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="productDetail">Detalle de Producto</SelectItem>
                        <SelectItem value="productListing">Listado de Productos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadatos Generados</CardTitle>
          <CardDescription>
            Revisa las sugerencias generadas a continuación.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Meta Título</h3>
                <p className="p-3 bg-muted rounded-md text-sm">{result.metaTitle}</p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {result.metaTitle.length} / 60 caracteres
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Meta Descripción</h3>
                <p className="p-3 bg-muted rounded-md text-sm">{result.metaDescription}</p>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {result.metaDescription.length} / 160 caracteres
                </p>
              </div>
            </div>
          )}
          {!loading && !result && (
            <div className="text-center text-muted-foreground py-10">
              <p>Tus datos de SEO generados aparecerán aquí.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
