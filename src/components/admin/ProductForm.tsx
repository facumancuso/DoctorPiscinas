
"use client"

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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import type { Product, ProductCategory } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { createOrUpdateProduct } from "@/app/actions/product-actions";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  price: z.coerce.number().min(0.01, "El precio debe ser mayor que cero."),
  cost: z.coerce.number().min(0, "El costo no puede ser negativo.").optional(),
  stock_quantity: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  categoryId: z.string().min(1, "Debes seleccionar una categoría."),
  images: z.array(z.string().url("Debe ser una URL válida.")).min(1, "Se requiere al menos una imagen."),
  isOnSale: z.boolean().default(false),
  salePrice: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.number().positive("El precio de oferta debe ser positivo.").optional()
  ),
  sku: z.string().optional(),
  brand: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
}).refine(data => {
    if (data.isOnSale) {
        return data.salePrice !== undefined && data.salePrice < data.price;
    }
    return true;
}, {
    message: "Si está en oferta, el precio de oferta es requerido y debe ser menor al precio regular.",
    path: ["salePrice"],
}).refine(data => {
    if (data.cost && data.cost > data.price) {
      return false;
    }
    return true;
}, {
    message: "El costo debe ser menor que el precio regular.",
    path: ["cost"],
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  categories: ProductCategory[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      cost: initialData?.cost || 0,
      stock_quantity: initialData?.stock_quantity || 0,
      categoryId: initialData?.categoryId || "",
      images: initialData?.images && initialData.images.length > 0 ? initialData.images : [""],
      isOnSale: initialData?.isOnSale || false,
      salePrice: initialData?.salePrice ?? undefined,
      sku: initialData?.sku || "",
      brand: initialData?.brand || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      metaKeywords: initialData?.metaKeywords || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const onSubmit = async (data: ProductFormValues) => {
    const result = await createOrUpdateProduct(initialData?.id || null, data);

    if (result?.errors) {
      console.error(result.errors);
      toast({ title: "Error", description: "Por favor, corrige los errores del formulario.", variant: "destructive" });
      return;
    }

    if (result?.message) {
      toast({ title: "Error", description: result.message, variant: "destructive" });
      return;
    }

    toast({
      title: isEditMode ? "Producto Actualizado" : "Producto Creado",
      description: `El producto "${data.name}" ha sido guardado exitosamente.`,
    });
    
    // The action will redirect, so no need to push here.
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Editar Producto" : "Crear Nuevo Producto"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Tabletas de Cloro" {...field} />
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
                    <Textarea placeholder="Describe el producto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                        <Input placeholder="PROD-001" {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                        <Input placeholder="Doctor Piscinas San Juan" {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Regular</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="4999.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Costo del Producto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="2500.00" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.valueAsNumber)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad en Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="isOnSale"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">En oferta</FormLabel>
                                <CardDescription>
                                    Marcar si este producto tiene un precio de oferta.
                                </CardDescription>
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
                <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Precio de Oferta</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="3999.00"
                            {...field}
                            disabled={!form.watch("isOnSale")}
                            value={field.value ?? ""}
                            onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
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
            <FormItem>
              <FormLabel>Imágenes del Producto</FormLabel>
              <CardDescription>Añade una o más URLs de imágenes para el producto.</CardDescription>
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
                                <Input placeholder="ej: cloro, tabletas, mantenimiento piscina" {...field} value={field.value ?? ''} />
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
              {form.formState.isSubmitting ? "Guardando..." : "Guardar Producto"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
