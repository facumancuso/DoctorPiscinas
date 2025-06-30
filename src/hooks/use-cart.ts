
"use client";

import { useContext } from 'react';
import { CartContext, type CartContextType } from '@/components/CartProvider';
import { findCouponByCodeAction } from '@/app/actions/coupon';

export const useCart = (): CartContextType & {
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
} => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const coupon = await findCouponByCodeAction(code);

    if (!coupon) {
      context.setAppliedCoupon(null);
      return { success: false, message: 'El cupón no es válido.' };
    }
    
    context.setAppliedCoupon(coupon);
    return { success: true, message: '¡Cupón aplicado con éxito!' };
  };

  return { ...context, applyCoupon };
};
