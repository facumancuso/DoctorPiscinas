
import Link from "next/link";
import { Waves, Facebook, Instagram } from "lucide-react";

// Social media URLs from environment variables
const whatsappNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || '';
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || '#';
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : '#';


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 fill-current"
        {...props}
    >
        <title>WhatsApp</title>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2 22l5.25-1.38c1.41.79 3.02 1.22 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM16.6 14.21c-.28-.14-1.65-.82-1.91-.91s-.45-.14-.64.14c-.19.28-.72.91-.88 1.1s-.33.21-.61.07c-.28-.14-1.18-.44-2.25-1.39S8.96 11.62 8.69 11.3c-.27-.32-.03-.49.12-.64s.28-.32.42-.48c.14-.16.19-.28.28-.46s.05-.37-.02-.51c-.07-.14-.64-1.53-.88-2.08s-.47-.48-.64-.48c-.18 0-.38-.02-.57-.02s-.48.07-.73.35c-.25.28-.96.93-.96 2.27s.98 2.64 1.13 2.82c.14.19 1.96 3.02 4.75 4.22s2.8 1.02 3.75.97c.95-.05 1.65-.68 1.88-1.32s.23-.97.16-1.07c-.07-.12-.25-.19-.52-.34z"/>
    </svg>
);

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-primary" />
            <span className="font-semibold">Doctor Piscinas San Juan</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 text-sm sm:gap-6">
            <Link href="/how-to-buy" className="text-muted-foreground hover:text-foreground">
              Cómo Comprar
            </Link>
            <Link href="/track" className="text-muted-foreground hover:text-foreground">
              Rastrear Pedido
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Términos de Servicio
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Política de Privacidad
            </Link>
          </nav>
          <div className="flex gap-4">
              <Link href={whatsappUrl} aria-label="WhatsApp" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon />
              </Link>
              <Link href={facebookUrl} aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
              </Link>
              <Link href={instagramUrl} aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
              </Link>
          </div>
        </div>
        <div className="border-t my-6" />
        <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Doctor Piscinas San Juan. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
