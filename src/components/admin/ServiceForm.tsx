"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Service, ServiceCategory } from "@/lib/types";
import { Trash2 } from "lucide-react";

const serviceSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  price_display: z.string().min(1, "El precio es requerido."),
  categoryId: z.string().min(1, "Debes seleccionar una categoría."),
  images: z.array(z.string().url("Debe ser una URL válida.")).min(1, "Se requiere al menos una imagen."),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: Service | null;
  categories: ServiceCategory[];
}

export function ServiceForm({ initialData, categories }: ServiceFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price_display: initialData?.price_display || "",
      categoryId: initialData?.categoryId || "",
      images: initialData?.images && initialData.images.length > 0 ? initialData.images : [""],
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const url = isEditMode 
        ? `/api/admin/services/${initialData?.id}`
        : '/api/admin/services';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: isEditMode ? "Servicio Actualizado" : "Servicio Creado",
          description: `El servicio "${data.name}" ha sido guardado exitosamente.`,
        });
        router.push('/admin/services');
        router.refresh();
      } else {
        const error = await response.text();
        console.error('Error saving service:', error);
        toast({ 
          title: "Error", 
          description: "Error al guardar el servicio. Por favor, intenta de nuevo.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast({ 
        title: "Error", 
        description: "Error al guardar el servicio. Por favor, intenta de nuevo.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Editar Servicio" : "Crear Nuevo Servicio"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Servicio</FormLabel>
                  <FormControl>
                    <Input placeholder="Mantenimiento de Piscina" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Describe el servicio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price_display"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input placeholder="Desde $5000/mes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Imágenes del Servicio</FormLabel>
              <CardDescription>Añade una o más URLs de imágenes para el servicio.</CardDescription>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder="https://placehold.co/600x600.png" {...field} />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append("")}
              >
                Añadir Imagen
              </Button>
            </FormItem>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Configuración SEO</CardTitle>
            <CardDescription>Opcional: Mejora la visibilidad en los motores de búsqueda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Un título conciso para SEO (máx 60 caracteres)" {...field} value={field.value ?? ''} />
                  </FormControl>
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
                    <Textarea placeholder="Una descripción atractiva para los resultados de búsqueda (máx 160 caracteres)." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palabras Clave (separadas por comas)</FormLabel>
                  <FormControl>
                    <Input placeholder="ej: mantenimiento, limpieza, piscina" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Guardando..." : "Guardar Servicio"}
          </Button>
        </div>
      </form>
    </Form>
  );
}