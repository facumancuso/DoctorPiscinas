// src/lib/data.ts

// Categorías de productos (por ejemplo, químicos, accesorios, equipos)
export const productCategories = [
  { slug: "quimicos" },       // Productos químicos para piscinas
  { slug: "accesorios" },     // Accesorios para piscinas
  { slug: "equipos" },        // Equipos y maquinaria
];

// Productos disponibles
export const products = [
  { id: "cloro-1kg", name: "Cloro Granulado 1kg" },
  { id: "ph-minus", name: "Reductor de pH" },
  { id: "filtro-arena", name: "Filtro de Arena para Piscinas" },
  { id: "robot-limpieza", name: "Robot Limpiafondos Automático" },
];

// Categorías de servicios (mantenimiento, reparación, instalación)
export const serviceCategories = [
  { slug: "mantenimiento" },
  { slug: "reparacion" },
  { slug: "instalacion" },
];

// Servicios ofrecidos
export const services = [
  { id: "mantenimiento-general", name: "Mantenimiento General de Piscinas" },
  { id: "reparacion-fugas", name: "Reparación de Fugas y Goteras" },
  { id: "instalacion-sistemas", name: "Instalación de Sistemas de Filtrado" },
  { id: "tratamiento-agua", name: "Tratamiento y Análisis de Agua" },
];
