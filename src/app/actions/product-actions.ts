"use server";

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  cost?: number;
  stock_quantity: number;
  categoryId: string;
  images: string[];
  isOnSale: boolean;
  salePrice?: number;
  sku?: string;
  brand?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export async function createOrUpdateProduct(
  productId: string | null,
  data: ProductFormValues
) {
  try {
    // Validar que la categoría existe
    const category = await prisma.productCategory.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      return {
        message: "La categoría seleccionada no existe."
      };
    }

    // Preparar los datos para la base de datos
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      cost: data.cost || null,
      salePrice: data.salePrice || null,
      isOnSale: data.isOnSale,
      stock_quantity: data.stock_quantity,
      images: data.images.filter(img => img.trim() !== ''),
      sku: data.sku || null,
      brand: data.brand || null,
      categoryId: data.categoryId,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || null,
    };

    if (productId) {
      // Actualizar producto existente
      await prisma.product.update({
        where: { id: productId },
        data: productData
      });
    } else {
      // Crear nuevo producto
      await prisma.product.create({
        data: productData
      });
    }

    // Revalidar las páginas que muestran productos
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
  } catch (error) {
    console.error('Error saving product:', error);
    return {
      message: "Error al guardar el producto. Por favor, intenta de nuevo."
    };
  }

  // Redirigir después de guardar exitosamente
  redirect('/admin/products');
}

export async function deleteProduct(productId: string) {
  try {
    // Verificar que el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return {
        success: false,
        message: "El producto no existe."
      };
    }

    // Eliminar el producto
    await prisma.product.delete({
      where: { id: productId }
    });

    // Revalidar las páginas que muestran productos
    revalidatePath('/admin/products');
    revalidatePath('/catalog');
    revalidatePath('/');
    
    return {
      success: true,
      message: "Producto eliminado exitosamente."
    };
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      message: "Error al eliminar el producto. Por favor, intenta de nuevo."
    };
  }
}