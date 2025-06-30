"use client"

import Script from "next/script"

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

interface AdsenseBannerProps {
  adSlot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AdsenseBanner({ 
  adSlot = "YOUR_AD_SLOT_ID",
  format = "auto",
  responsive = true,
  className = "",
  style = { display: 'block' }
}: AdsenseBannerProps) {
  
  // Si no hay client ID configurado, mostrar placeholder
  if (!ADSENSE_CLIENT_ID) {
    return (
      <div className={`text-center bg-muted/50 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20 ${className}`}>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Espacio Publicitario</p>
          <p className="text-xs text-muted-foreground/70">
            Configure NEXT_PUBLIC_ADSENSE_CLIENT_ID en las variables de entorno
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Script de AdSense - solo se carga una vez */}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      
      {/* Bloque de anuncio */}
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
      
      {/* Inicialización del anuncio */}
      <Script id={`adsense-init-${adSlot}`} strategy="afterInteractive">
        {`
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error('AdSense error:', e);
          }
        `}
      </Script>
    </div>
  )
}

// Componente para anuncios responsivos
export function ResponsiveAdsenseBanner({ 
  adSlot,
  className = "my-4"
}: {
  adSlot: string;
  className?: string;
}) {
  return (
    <AdsenseBanner
      adSlot={adSlot}
      format="auto"
      responsive={true}
      className={className}
    />
  )
}

// Componente para anuncios rectangulares
export function RectangleAdsenseBanner({ 
  adSlot,
  className = "my-4"
}: {
  adSlot: string;
  className?: string;
}) {
  return (
    <AdsenseBanner
      adSlot={adSlot}
      format="rectangle"
      responsive={false}
      className={className}
      style={{ display: 'inline-block', width: '300px', height: '250px' }}
    />
  )
}

// Componente para anuncios horizontales
export function HorizontalAdsenseBanner({ 
  adSlot,
  className = "my-4"
}: {
  adSlot: string;
  className?: string;
}) {
  return (
    <AdsenseBanner
      adSlot={adSlot}
      format="horizontal"
      responsive={true}
      className={className}
      style={{ display: 'block', textAlign: 'center' }}
    />
  )
}