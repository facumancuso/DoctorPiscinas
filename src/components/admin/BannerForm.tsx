"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import type { Banner } from "@/lib/types";
import { ArrowLeft, Save, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

const bannerSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  image: z.string().url("Debe ser una URL válida."),
  cta: z.string().min(1, "El texto del botón es requerido."),
  cta_link: z.string().min(1, "El enlace es requerido."),
  position: z.enum(["hero", "sidebar", "footer", "content"]),
  isActive: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: Banner | null;
}

export function BannerForm({ initialData }: BannerFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: initialData?.image || initialData?.imageUrl || "",
      cta: initialData?.cta || "",
      cta_link: initialData?.cta_link || initialData?.link || "",
      position: initialData?.position || "hero",
      isActive: initialData?.isActive || false,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const onSubmit = async (data: BannerFormValues) => {
    try {
      // Validación del enlace
      if (!data.cta_link.startsWith('/') && !data.cta_link.startsWith('http')) {
        toast({
          title: "Error de validación",
          description: "El enlace debe ser una URL válida (http/https) o una ruta interna (/).",
          variant: "destructive"
        });
        return;
      }

      // Aquí normalmente enviarías a una API
      console.log('Datos del banner:', data);
      
      toast({
        title: isEditMode ? "Banner Actualizado" : "Banner Creado",
        description: `El banner "${data.title}" ha sido guardado exitosamente.`,
      });
      
      router.push('/admin/promotions');
      router.refresh();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({ 
        title: "Error", 
        description: "Error al guardar el banner. Por favor, intenta de nuevo.", 
        variant: "destructive" 
      });
    }
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'hero': return 'Principal';
      case 'sidebar': return 'Lateral';
      case 'footer': return 'Pie de página';
      case 'content': return 'Contenido';
      default: return position;
    }
  };

  const getPositionDescription = (position: string) => {
    switch (position) {
      case 'hero': return 'Banner principal en la página de inicio';
      case 'sidebar': return 'Banner lateral en páginas de contenido';
      case 'footer': return 'Banner en el pie de página';
      case 'content': return 'Banner integrado en el contenido';
      default: return 'Posición personalizada';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/promotions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Editar Banner" : "Crear Nuevo Banner"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Modifica los detalles del banner publicitario" : "Configura un nuevo banner publicitario para tu sitio web"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Detalles principales del banner publicitario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título del Banner</FormLabel>
                        <FormControl>
                          <Input placeholder="¡Chapuzón de Verano!" {...field} />
                        </FormControl>
                        <FormDescription>
                          Título principal que aparecerá en el banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Disfruta al máximo tu piscina con nuestros productos premium..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Descripción detallada que aparecerá en el banner
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de Imagen</FormLabel>
                        <FormControl>
                          <Input placeholder="https://ejemplo.com/banner.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Imagen del banner (recomendado: 1200x400px o mayor)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto del Botón</FormLabel>
                          <FormControl>
                            <Input placeholder="Ver Productos" {...field} />
                          </FormControl>
                          <FormDescription>
                            Texto que aparecerá en el botón de acción
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cta_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enlace del Botón</FormLabel>
                          <FormControl>
                            <Input placeholder="/productos o https://ejemplo.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL interna (/ruta) o externa (https://)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posición del Banner</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una posición" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hero">Principal (Hero)</SelectItem>
                            <SelectItem value="sidebar">Lateral (Sidebar)</SelectItem>
                            <SelectItem value="footer">Pie de página</SelectItem>
                            <SelectItem value="content">Contenido</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Dónde aparecerá el banner en el sitio web
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO y Metadatos</CardTitle>
                  <CardDescription>
                    Optimización para motores de búsqueda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título SEO para el banner..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Título optimizado para SEO (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descripción SEO para el banner..." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Descripción optimizada para SEO (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estado y Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Estado Activo</FormLabel>
                          <FormDescription>
                            Activa o desactiva este banner
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Información de la posición seleccionada */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Posición Seleccionada</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        form.watch('position') === 'hero' ? 'bg-purple-100 text-purple-800' :
                        form.watch('position') === 'sidebar' ? 'bg-blue-100 text-blue-800' :
                        form.watch('position') === 'footer' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getPositionLabel(form.watch('position'))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getPositionDescription(form.watch('position'))}
                    </p>
                  </div>

                  {/* Vista previa del enlace */}
                  {form.watch('cta_link') && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Enlace de Destino</h4>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-mono break-all">
                          {form.watch('cta_link')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {form.watch('cta_link').startsWith('/') ? 'Enlace interno' : 'Enlace externo'}
                      </p>
                    </div>
                  )}

                  {/* Vista previa de la imagen */}
                  {form.watch('image') && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Vista Previa</h4>
                      <div className="border rounded-lg p-2">
                        <img 
                          src={form.watch('image')} 
                          alt="Vista previa del banner" 
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/1200x400/cccccc/ffffff?text=Error+de+Imagen";
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Vista previa del banner (aspecto aproximado)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información del CTA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-blue-900">
                          {form.watch('cta') || 'Texto del botón'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700">
                        Así aparecerá el botón en el banner
                      </p>
                    </div>
                    
                    {form.watch('cta_link') && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Destino:</span> {form.watch('cta_link')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="button" variant="secondary" asChild>
              <Link href="/admin/promotions">
                <Eye className="h-4 w-4 mr-2" />
                Ver Lista
              </Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {form.formState.isSubmitting ? "Guardando..." : "Guardar Banner"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}