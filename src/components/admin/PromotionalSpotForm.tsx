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
import type { PromotionalSpot } from "@/lib/types";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

const spotSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  type: z.enum(["discount", "service", "announcement"]),
  value: z.string().min(1, "El valor es requerido."),
  image: z.string().url("Debe ser una URL válida."),
  details: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string(),
  endDate: z.string(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type SpotFormValues = z.infer<typeof spotSchema>;

interface PromotionalSpotFormProps {
  initialData?: PromotionalSpot | null;
}

export function PromotionalSpotForm({ initialData }: PromotionalSpotFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<SpotFormValues>({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "discount",
      value: initialData?.value || "",
      image: initialData?.image || "",
      details: initialData?.details || "",
      isActive: initialData?.isActive || false,
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  const onSubmit = async (data: SpotFormValues) => {
    try {
      // Validación de fechas
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      if (endDate <= startDate) {
        toast({
          title: "Error de validación",
          description: "La fecha de fin debe ser posterior a la fecha de inicio.",
          variant: "destructive"
        });
        return;
      }

      // Aquí normalmente enviarías a una API
      console.log('Datos del spot:', data);
      
      toast({
        title: isEditMode ? "Spot Actualizado" : "Spot Creado",
        description: `El spot promocional "${data.title}" ha sido guardado exitosamente.`,
      });
      
      router.push('/admin/promotions');
      router.refresh();
    } catch (error) {
      console.error('Error saving spot:', error);
      toast({ 
        title: "Error", 
        description: "Error al guardar el spot. Por favor, intenta de nuevo.", 
        variant: "destructive" 
      });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'discount': return 'Descuento';
      case 'service': return 'Servicio';
      case 'announcement': return 'Anuncio';
      default: return type;
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
            {isEditMode ? "Editar Spot Promocional" : "Crear Nuevo Spot Promocional"}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Modifica los detalles del spot promocional" : "Configura un nuevo espacio promocional para tu sitio web"}
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
                    Detalles principales del spot promocional
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título</FormLabel>
                          <FormControl>
                            <Input placeholder="¡Oferta Especial de Verano!" {...field} />
                          </FormControl>
                          <FormDescription>
                            Título principal que aparecerá en el spot
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Promoción</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="discount">Descuento</SelectItem>
                              <SelectItem value="service">Servicio</SelectItem>
                              <SelectItem value="announcement">Anuncio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Categoría del spot promocional
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe la promoción de manera atractiva..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Descripción detallada de la promoción
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Promocional</FormLabel>
                          <FormControl>
                            <Input placeholder="20% OFF, GRATIS, NUEVO..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Valor o etiqueta destacada
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
                            <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Imagen representativa del spot
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detalles Adicionales</FormLabel>
                        <FormControl>
                          <Input placeholder="Términos y condiciones, información adicional..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Información complementaria o condiciones
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Fechas</CardTitle>
                  <CardDescription>
                    Define el período de vigencia del spot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Inicio</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Cuándo comienza la promoción
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Fin</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Cuándo termina la promoción
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                          <Input placeholder="Título SEO para el spot..." {...field} />
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
                            placeholder="Descripción SEO para el spot..." 
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
                            Activa o desactiva este spot promocional
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

                  {/* Información del tipo seleccionado */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Tipo Seleccionado</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        form.watch('type') === 'discount' ? 'bg-green-100 text-green-800' :
                        form.watch('type') === 'service' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {getTypeLabel(form.watch('type'))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {form.watch('type') === 'discount' && 'Promociones con descuentos y ofertas especiales'}
                      {form.watch('type') === 'service' && 'Servicios gratuitos o promocionales'}
                      {form.watch('type') === 'announcement' && 'Anuncios generales y novedades'}
                    </p>
                  </div>

                  {/* Vista previa de la imagen */}
                  {form.watch('image') && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Vista Previa</h4>
                      <div className="border rounded-lg p-2">
                        <img 
                          src={form.watch('image')} 
                          alt="Vista previa" 
                          className="w-full h-32 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/400x200/cccccc/ffffff?text=Error+de+Imagen";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información de Fechas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inicio:</span>
                      <span className="font-medium">
                        {form.watch('startDate') ? new Date(form.watch('startDate')).toLocaleDateString('es-ES') : 'No definido'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="font-medium">
                        {form.watch('endDate') ? new Date(form.watch('endDate')).toLocaleDateString('es-ES') : 'No definido'}
                      </span>
                    </div>
                    {form.watch('startDate') && form.watch('endDate') && (
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="font-medium">
                          {Math.ceil((new Date(form.watch('endDate')).getTime() - new Date(form.watch('startDate')).getTime()) / (1000 * 60 * 60 * 24))} días
                        </span>
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
              {form.formState.isSubmitting ? "Guardando..." : "Guardar Spot"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}