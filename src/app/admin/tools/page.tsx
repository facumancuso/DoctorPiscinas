"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const restoreSchema = z.object({
  backupFile: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, "Se requiere un archivo.")
    .refine((files) => files?.[0]?.name.endsWith('.ts'), "El archivo debe ser de tipo .ts."),
});

export default function AdminToolsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof restoreSchema>>({
    resolver: zodResolver(restoreSchema),
    defaultValues: {
      backupFile: undefined,
    }
  });

  const fileRef = form.register("backupFile");

  const handleRestore = async (data: z.infer<typeof restoreSchema>) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("backupFile", data.backupFile[0]);

    try {
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Algo salió mal.');
      }

      toast({
        title: '¡Restauración Exitosa!',
        description: 'Tus datos han sido restaurados. La página se recargará para aplicar los cambios.',
      });
      
      setTimeout(() => window.location.reload(), 3000);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error en la Restauración',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Herramientas y Seguridad</h1>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Crear Copia de Seguridad
            </CardTitle>
            <CardDescription>
              Descarga una copia de seguridad del archivo que contiene los datos de tu tienda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Esta acción descargará el archivo <code>data.ts</code>. Guarda este archivo en un lugar seguro. Esto <strong>no</strong> incluye imágenes ni el código fuente de la aplicación.
            </p>
            <Button asChild>
              <Link href="/api/admin/backup">
                <Download className="mr-2 h-4 w-4" />
                Descargar Copia de Seguridad
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restaurar desde Copia de Seguridad
            </CardTitle>
            <CardDescription>
              Sube un archivo de respaldo para restaurar los datos de tu tienda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>¡Atención!</AlertTitle>
              <AlertDescription>
                Esta acción sobrescribirá <strong>todos los datos actuales</strong> de la tienda. Usa esta función con extrema precaución.
              </AlertDescription>
            </Alert>
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormField
                  control={form.control}
                  name="backupFile"
                  render={() => (
                    <FormItem>
                      <FormLabel>Archivo de respaldo (data.ts)</FormLabel>
                      <FormControl>
                        <Input type="file" accept=".ts" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button type="button" className="w-full" disabled={isLoading || !form.formState.isValid}>
                        {isLoading ? 'Restaurando...' : 'Restaurar Datos'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto reemplazará permanentemente los datos actuales de tu tienda (productos, pedidos, etc.) con el contenido del archivo que estás subiendo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={form.handleSubmit(handleRestore)} disabled={isLoading}>
                        Sí, restaurar datos
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
