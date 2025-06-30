import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/components/CartProvider";
import { Analytics } from "@/components/Analytics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Doctor Piscinas San Juan",
    template: "%s | Doctor Piscinas San Juan",
  },
  description: "Tu tienda única para todo lo que necesitas para tu piscina. Productos de alta calidad, equipos y servicios profesionales.",
  openGraph: {
    title: "Doctor Piscinas San Juan",
    description: "Tu tienda única para todo lo que necesitas para tu piscina.",
    url: SITE_URL,
    siteName: "Doctor Piscinas San Juan",
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Doctor Piscinas San Juan",
    description: "Tu tienda única para todo lo que necesitas para tu piscina.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full">
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
