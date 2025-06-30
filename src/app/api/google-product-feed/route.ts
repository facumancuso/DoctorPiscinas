import { prisma } from '@/lib/prisma';
import { XMLBuilder } from 'fast-xml-parser';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET() {
  const productsFromDb = await prisma.product.findMany();
  const products = productsFromDb.map(p => ({...p, images: p.images as string[]}))

  const feedItems = products.map((product) => ({
    'g:id': product.id,
    'g:title': product.name,
    'g:description': product.description,
    'g:link': `${SITE_URL}/product/${product.id}`,
    'g:image_link': product.images[0],
    'g:availability': product.stock_quantity > 0 ? 'in stock' : 'out of stock',
    'g:price': `${(product.salePrice ?? product.price).toFixed(2)} ARS`,
    'g:brand': product.brand || 'Doctor Piscinas San Juan',
    'g:condition': 'new',
    'g:gtin': '', // You would put UPC/EAN here if available
    'g:mpn': product.sku,
  }));

  const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    suppressEmptyNode: true,
  });

  const feedObject = {
    rss: {
      '@_version': '2.0',
      '@_xmlns:g': 'http://base.google.com/ns/1.0',
      channel: {
        title: 'Doctor Piscinas San Juan - Feed de Productos',
        link: SITE_URL,
        description: 'Feed de productos para Google Merchant Center',
        item: feedItems,
      },
    },
  };

  const xmlContent = builder.build(feedObject);

  return new Response(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
