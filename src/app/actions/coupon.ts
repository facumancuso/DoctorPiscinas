'use server';

import { prisma } from '@/lib/prisma';
import type { Coupon } from '@/lib/types';

export async function findCouponByCodeAction(code: string): Promise<Coupon | null> {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });
    return coupon;
  } catch (error) {
    console.error('Error finding coupon:', error);
    return null;
  }
}
