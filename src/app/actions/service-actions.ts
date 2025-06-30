"use server";

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface ServiceFormValues {
  name: string;
  description: string;
  price_display: string;
  categoryId: string;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export async function createOrUpdateService(
  serviceId: string | null,
  data: ServiceFormValues
) {
  try {
    // Validar que la categoría existe
    const category = await prisma.serviceCategory.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      return {
        message: "La categoría seleccionada no existe."
      };
    }

    // Preparar los datos para la base de datos
    const serviceData = {
      name: data.name,
      description: data.description,
      price_display: data.price_display,
      images: data.images.filter(img => img.trim() !== ''),
      categoryId: data.categoryId,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || null,
    };

    if (serviceId) {
      // Actualizar servicio existente
      await prisma.service.update({
        where: { id: serviceId },
        data: serviceData
      });
    } else {
      // Crear nuevo servicio
      await prisma.service.create({
        data: serviceData
      });
    }

    // Revalidar las páginas que muestran servicios
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    
  } catch (error) {
    console.error('Error saving service:', error);
    return {
      message: "Error al guardar el servicio. Por favor, intenta de nuevo."
    };
  }

  // Redirigir después de guardar exitosamente
  redirect('/admin/services');
}

export async function deleteService(serviceId: string) {
  try {
    // Verificar que el servicio existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return {
        success: false,
        message: "El servicio no existe."
      };
    }

    // Eliminar el servicio
    await prisma.service.delete({
      where: { id: serviceId }
    });

    // Revalidar las páginas que muestran servicios
    revalidatePath('/admin/services');
    revalidatePath('/services');
    revalidatePath('/');
    
    return {
      success: true,
      message: "Servicio eliminado exitosamente."
    };
    
  } catch (error) {
    console.error('Error deleting service:', error);
    return {
      success: false,
      message: "Error al eliminar el servicio. Por favor, intenta de nuevo."
    };
  }
}