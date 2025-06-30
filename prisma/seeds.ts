import { PrismaClient } from '@prisma/client'
import type { ProductCategory, Product, Order, Banner, ServiceCategory, Service, Coupon, PromotionalSpot } from '../src/lib/types';

const prisma = new PrismaClient()

// Raw data from the old data.ts file
const productCategoriesData: ProductCategory[] = [
  { id: '1', name: 'Químicos para Piscina', slug: 'chemicals', image: 'https://placehold.co/600x400.png', description: 'Mantén el agua de tu piscina reluciente y segura con nuestra amplia gama de químicos. Desde cloro hasta alguicidas, tenemos todo lo que necesitas para un equilibrio de agua perfecto.' },
  { id: '2', name: 'Equipos de Limpieza', slug: 'cleaning', image: 'https://placehold.co/600x400.png', description: 'Consigue una piscina impecable con nuestros equipos de limpieza de primera línea. Compra limpiafondos robóticos, cepillos, redes y más.' },
  { id: '3', name: 'Bombas y Filtros', slug: 'pumps-filters', image: 'https://placehold.co/600x400.png', description: 'El corazón del sistema de tu piscina. Explora nuestra selección de bombas y filtros de alto rendimiento para una circulación y claridad de agua óptimas.' },
  { id: '4', name: 'Juguetes y Flotadores', slug: 'toys-floats', image: 'https://placehold.co/600x400.png', description: '¡La diversión bajo el sol comienza aquí! Descubre una gran selección de juguetes, flotadores y juegos de piscina para toda la familia.' },
];

const productsData: Omit<Product, 'category'> & { categorySlug: string }[] = [
  { id: 'p1', name: 'Tabletas de Cloro', description: 'Tabletas de cloro de alta calidad para mantener tu piscina desinfectada y cristalina. De disolución lenta para efectos duraderos.', price: 4999.00, cost: 2500.00, salePrice: 4499.00, isOnSale: true, stock_quantity: 150, categorySlug: 'chemicals', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'CHEM-CL-TAB-5', brand: 'PoolGuard' },
  { id: 'p2', name: 'Tratamiento de Choque para Piscinas', description: 'Potente tratamiento de choque para eliminar algas, bacterias y otros contaminantes. Restaura la claridad del agua.', price: 2499.00, cost: 1200.00, isOnSale: false, stock_quantity: 200, categorySlug: 'chemicals', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'CHEM-SHOCK-1', brand: 'PoolGuard' },
  { id: 'p3', name: 'Limpiafondos Robótico', description: 'Limpiafondos robótico avanzado que friega suelos, paredes y línea de flotación. Limpieza sin esfuerzo para cualquier forma de piscina.', price: 79999.00, cost: 45000.00, salePrice: 74999.00, isOnSale: true, stock_quantity: 30, categorySlug: 'cleaning', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'CLEAN-ROBOT-X7', brand: 'AquaBot' },
  { id: 'p4', name: 'Pértiga Telescópica para Piscina', description: 'Pértiga de aluminio ajustable para recogehojas, cepillos y aspiradoras. Se extiende hasta 4.8 metros.', price: 3999.00, cost: 1800.00, isOnSale: false, stock_quantity: 100, categorySlug: 'cleaning', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'CLEAN-POLE-16F', brand: 'PoolPro' },
  { id: 'p5', name: 'Bomba de Piscina de Velocidad Variable', description: 'Bomba de bajo consumo que ahorra dinero en las facturas de electricidad. Funcionamiento silencioso y construcción duradera.', price: 120000.00, cost: 70000.00, isOnSale: false, stock_quantity: 25, categorySlug: 'pumps-filters', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'PUMP-VS-150', brand: 'HydroFlow' },
  { id: 'p6', name: 'Sistema de Filtro de Arena', description: 'Filtro de arena de alta capacidad para piscinas elevadas y enterradas. Proporciona una excelente filtración del agua.', price: 45000.00, cost: 28000.00, isOnSale: false, stock_quantity: 40, categorySlug: 'pumps-filters', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'FIL-SAND-24', brand: 'HydroFlow' },
  { id: 'p7', name: 'Flotador de Flamenco Inflable', description: 'Flotador de flamenco gigante y divertido para relajarse con estilo. Hecho de vinilo duradero. Capacidad para hasta dos adultos.', price: 5999.00, cost: 2500.00, salePrice: 4999.00, isOnSale: true, stock_quantity: 80, categorySlug: 'toys-floats', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'TOY-FLOAT-FLM', brand: 'SunSplash' },
  { id: 'p8', name: 'Luces Subacuáticas para Piscina', description: 'Luces LED que cambian de color para transformar tu piscina por la noche. Vienen con un control remoto para una fácil operación.', price: 12999.00, cost: 6500.00, isOnSale: false, stock_quantity: 60, categorySlug: 'toys-floats', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], sku: 'ACC-LED-RGB-2', brand: 'GlowPool' },
];

const serviceCategoriesData: ServiceCategory[] = [
    { id: 's1', name: 'Mantenimiento de Piscinas', slug: 'maintenance', image: 'https://placehold.co/600x400.png', description: 'Servicios profesionales de mantenimiento para que tu piscina esté siempre lista para disfrutar. Ofrecemos planes semanales, quincenales y mensuales.' },
    { id: 's2', name: 'Reparación de Equipos', slug: 'repairs', image: 'https://placehold.co/600x400.png', description: '¿Bomba ruidosa? ¿Filtro con fugas? Nuestros técnicos expertos pueden diagnosticar y reparar todo tipo de equipos de piscina.' },
    { id: 's3', name: 'Instalación y Mejoras', slug: 'installations', image: 'https://placehold.co/600x400.png', description: 'Moderniza tu piscina con nuevos equipos. Instalamos bombas de velocidad variable, sistemas de cloración salina, calentadores y más.' },
];

const servicesData: Omit<Service, 'category'> & { categorySlug: string }[] = [
    { id: 'serv1', name: 'Servicio de Mantenimiento Semanal', description: 'Nuestro plan más popular. Incluye limpieza, cepillado, balance de químicos y revisión de equipos todas las semanas.', categorySlug: 'maintenance', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], price_display: 'Desde $7500/semana' },
    { id: 'serv2', name: 'Apertura de Piscina de Temporada', description: 'Preparamos tu piscina para la temporada de verano. Incluye quitar la cubierta, limpieza inicial, arranque de equipos y tratamiento químico inicial.', categorySlug: 'maintenance', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], price_display: 'Desde $35000' },
    { id: 'serv3', name: 'Diagnóstico y Reparación de Bombas', description: 'Un técnico cualificado visitará tu domicilio para diagnosticar el problema con tu bomba y proporcionar un presupuesto para la reparación.', categorySlug: 'repairs', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], price_display: 'Tarifa de diagnóstico de $9900' },
    { id: 'serv4', name: 'Instalación de Calentador de Piscina', description: 'Extiende tu temporada de natación con un calentador de piscina de alta eficiencia. Ofrecemos instalación completa para modelos de gas y eléctricos.', categorySlug: 'installations', images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'], price_display: 'Solicitar presupuesto' },
];

// Updated banners data with new schema
const bannersData = [
  { 
    title: '¡Chapuzón de Verano!', 
    description: 'Hasta un 30% de descuento en todos los juguetes y flotadores de piscina. ¡Sumérgete en los ahorros hoy!', 
    cta: 'Comprar Ahora', 
    cta_link: '/catalog/toys-floats', 
    image: 'https://placehold.co/1200x400/0066cc/ffffff?text=Chapuzon+Verano', 
    isActive: true,
    position: 'hero',
    metaTitle: 'Ofertas de Verano en Juguetes para Piscina | Doctor Piscinas San Juan', 
    metaDescription: 'Aprovecha hasta un 30% de descuento en flotadores, juegos y más. ¡Compra ahora y prepárate para la diversión!' 
  },
  {
    title: 'Mantenimiento Profesional',
    description: 'Servicios especializados para mantener tu piscina perfecta todo el año',
    cta: 'Ver Servicios',
    cta_link: '/services',
    image: 'https://placehold.co/1200x400/28a745/ffffff?text=Mantenimiento+Pro',
    isActive: true,
    position: 'sidebar',
    metaTitle: 'Servicios de Mantenimiento - Doctor Piscinas San Juan',
    metaDescription: 'Servicios profesionales de mantenimiento para piscinas'
  }
];

// Updated promotional spots data with new schema
const promotionalSpotsData = [
  { 
    title: 'Envío Gratis en Pedidos Superiores a $50000', 
    description: 'Aprovecha el envío gratuito en todos tus pedidos',
    type: 'service',
    value: 'GRATIS',
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
    image: 'https://placehold.co/400x200/28a745/ffffff?text=Envio+Gratis',
    details: 'Oferta por tiempo limitado. Se aplican términos y condiciones.',
    metaTitle: 'Envío Gratis en Doctor Piscinas San Juan', 
    metaDescription: 'Obtén envío gratis en todos los pedidos superiores a $50.000. Compra ahora químicos, equipos y accesorios para tu piscina.' 
  },
  { 
    title: '¡Nuevos Limpiafondos Robóticos en Stock!', 
    description: 'Descubre los últimos modelos de limpiafondos robóticos',
    type: 'announcement',
    value: 'NUEVO',
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
    image: 'https://placehold.co/400x200/6c5ce7/ffffff?text=Robots+Nuevos',
    details: 'Echa un vistazo a los últimos modelos para una piscina impecable.',
    metaTitle: 'Nuevos Limpiafondos Robóticos | Doctor Piscinas San Juan', 
    metaDescription: 'Descubre los últimos limpiafondos robóticos para una limpieza de piscina sin esfuerzo. ¡Compra ahora!' 
  },
  {
    title: '¡Oferta Especial de Temporada!',
    description: '25% de descuento en químicos para piscina',
    type: 'discount',
    value: '25% OFF',
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    image: 'https://placehold.co/400x200/ff6b35/ffffff?text=Oferta+Quimicos',
    details: 'Descuento válido en toda la línea de productos químicos.',
    metaTitle: 'Oferta Especial en Químicos - Doctor Piscinas San Juan',
    metaDescription: 'Aprovecha 25% de descuento en todos los químicos para piscina'
  }
];

const couponsData: Coupon[] = [
    { code: 'DESCUENTO10', type: 'percentage', discount: 10 },
    { code: 'AHORRA5000', type: 'fixed', discount: 5000 },
];

async function main() {
    console.log('Start seeding ...');

    // Clean up existing data
    await prisma.product.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.service.deleteMany();
    await prisma.serviceCategory.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.promotionalSpot.deleteMany();
    await prisma.coupon.deleteMany();
    console.log('Cleaned up previous data.');

    // Seed Product Categories
    const createdProductCategories = await Promise.all(
        productCategoriesData.map(cat => 
            prisma.productCategory.create({
                data: {
                    name: cat.name,
                    slug: cat.slug,
                    image: cat.image,
                    description: cat.description,
                }
            })
        )
    );
    console.log(`Seeded ${createdProductCategories.length} product categories.`);

    const productCategoryMap = new Map(createdProductCategories.map(cat => [cat.slug, cat.id]));

    // Seed Products
    for (const product of productsData) {
        const categoryId = productCategoryMap.get(product.categorySlug);
        if (categoryId) {
            await prisma.product.create({
                data: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    cost: product.cost,
                    salePrice: product.salePrice,
                    isOnSale: product.isOnSale,
                    stock_quantity: product.stock_quantity,
                    images: product.images,
                    sku: product.sku,
                    brand: product.brand,
                    categoryId: categoryId,
                }
            });
        }
    }
    console.log(`Seeded ${productsData.length} products.`);

    // Seed Service Categories
    const createdServiceCategories = await Promise.all(
        serviceCategoriesData.map(cat =>
            prisma.serviceCategory.create({
                data: {
                    name: cat.name,
                    slug: cat.slug,
                    image: cat.image,
                    description: cat.description,
                }
            })
        )
    );
    console.log(`Seeded ${createdServiceCategories.length} service categories.`);

    const serviceCategoryMap = new Map(createdServiceCategories.map(cat => [cat.slug, cat.id]));

    // Seed Services
    for (const service of servicesData) {
        const categoryId = serviceCategoryMap.get(service.categorySlug);
        if (categoryId) {
            await prisma.service.create({
                data: {
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    images: service.images,
                    price_display: service.price_display,
                    categoryId: categoryId,
                }
            });
        }
    }
    console.log(`Seeded ${servicesData.length} services.`);

    // Seed Banners
    await prisma.banner.createMany({ data: bannersData });
    console.log(`Seeded ${bannersData.length} banners.`);

    // Seed Promotional Spots
    await prisma.promotionalSpot.createMany({ data: promotionalSpotsData });
    console.log(`Seeded ${promotionalSpotsData.length} promotional spots.`);
    
    // Seed Coupons
    await prisma.coupon.createMany({ data: couponsData });
    console.log(`Seeded ${couponsData.length} coupons.`);

    console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });