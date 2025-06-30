"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Waves, LayoutDashboard, ShoppingCart, Package, Megaphone, Search, Home, LogOut, Wrench, Folder, Shield } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Productos", icon: Package },
    { href: "/admin/services", label: "Servicios", icon: Wrench },
    { href: "/admin/categories", label: "Categorías", icon: Folder },
    { href: "/admin/orders", label: "Pedidos", icon: ShoppingCart },
    { href: "/admin/promotions", label: "Promociones", icon: Megaphone },
    { href: "/admin/seo", label: "SEO", icon: Search },
    { href: "/admin/tools", label: "Herramientas", icon: Shield },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Waves className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">Doctor Piscinas San Juan</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{children: "Volver al Sitio"}}>
                    <Link href="/">
                        <Home/>
                        <span>Volver al Sitio</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{children: "Cerrar Sesión"}}>
                    <LogOut />
                    <span>Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
