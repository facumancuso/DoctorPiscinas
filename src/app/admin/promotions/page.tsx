"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PromotionalSpot, Banner } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPromotionsPage() {
    const [spots, setSpots] = useState<PromotionalSpot[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Cargar datos desde la API
    useEffect(() => {
        const loadData = async () => {
            try {
                const [spotsRes, bannersRes] = await Promise.all([
                    fetch('/api/promotional-spots'),
                    fetch('/api/banners')
                ]);

                if (spotsRes.ok && bannersRes.ok) {
                    const spotsData = await spotsRes.json();
                    const bannersData = await bannersRes.json();
                    
                    setSpots(spotsData);
                    setBanners(bannersData);
                } else {
                    throw new Error('Error loading data from API');
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast({
                    title: "Error",
                    description: "No se pudieron cargar los datos.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [toast]);

    const handleSpotToggle = async (spotId: string, active: boolean) => {
        try {
            const response = await fetch(`/api/promotional-spots/${spotId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: active })
            });

            if (response.ok) {
                setSpots(currentSpots =>
                    currentSpots.map(spot =>
                        spot.id === spotId ? { ...spot, isActive: active } : spot
                    )
                );
                toast({
                    title: "Estado actualizado",
                    description: `El espacio promocional ha sido ${active ? 'activado' : 'desactivado'}.`,
                });
            } else {
                throw new Error('Error updating spot');
            }
        } catch (error) {
            console.error('Error updating spot:', error);
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado del espacio promocional.",
                variant: "destructive"
            });
        }
    };

    const handleBannerToggle = async (bannerId: string, active: boolean) => {
        try {
            const response = await fetch(`/api/banners/${bannerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: active })
            });

            if (response.ok) {
                setBanners(currentBanners =>
                    currentBanners.map(banner =>
                        banner.id === bannerId ? { ...banner, isActive: active } : banner
                    )
                );
                toast({
                    title: "Estado actualizado",
                    description: `El banner ha sido ${active ? 'activado' : 'desactivado'}.`,
                });
            } else {
                throw new Error('Error updating banner');
            }
        } catch (error) {
            console.error('Error updating banner:', error);
            toast({
                title: "Error",
                description: "No se pudo actualizar el estado del banner.",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Cargando promociones...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Promociones y Publicidad</h1>
                    <p className="text-muted-foreground">Gestiona espacios promocionales y banners publicitarios</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/admin/promotions/spots/new">
                            <PlusCircle className="mr-2 h-4 w-4"/>Nuevo Spot
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/promotions/banners/new">
                            <PlusCircle className="mr-2 h-4 w-4"/>Nuevo Banner
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="spots" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="spots">Espacios Promocionales ({spots.length})</TabsTrigger>
                    <TabsTrigger value="banners">Banners ({banners.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="spots">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Espacios Promocionales</CardTitle>
                                    <CardDescription>Gestiona los mensajes promocionales del sitio.</CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/promotions/spots/new">
                                        <PlusCircle className="mr-2 h-4 w-4"/>Añadir Espacio
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {spots.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    <p>No hay espacios promocionales configurados</p>
                                    <Button asChild className="mt-4">
                                        <Link href="/admin/promotions/spots/new">
                                            <PlusCircle className="mr-2 h-4 w-4"/>Crear primer espacio
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                spots.map(spot => (
                                    <div key={spot.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Image 
                                                src={spot.image || "https://placehold.co/400x200/0066cc/ffffff?text=Promo"} 
                                                alt={spot.title} 
                                                width={120} 
                                                height={60} 
                                                className="rounded-md object-cover aspect-video" 
                                                data-ai-hint="promotion"
                                            />
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg">{spot.title}</h3>
                                                <p className="text-sm text-muted-foreground">{spot.details || spot.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                        spot.type === 'discount' ? 'bg-green-100 text-green-800' :
                                                        spot.type === 'service' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {spot.type === 'discount' ? 'Descuento' : 
                                                         spot.type === 'service' ? 'Servicio' : 'Anuncio'}
                                                    </span>
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        {spot.value}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        spot.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {spot.isActive ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/promotions/spots/${spot.id}`}>Editar</Link>
                                            </Button>
                                            <Switch
                                                checked={spot.isActive || false}
                                                onCheckedChange={(checked) => handleSpotToggle(spot.id, checked)}
                                                aria-label={`Activar espacio: ${spot.title}`}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="banners">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Banners</CardTitle>
                                    <CardDescription>Gestiona los banners publicitarios del sitio.</CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/promotions/banners/new">
                                        <PlusCircle className="mr-2 h-4 w-4"/>Añadir Banner
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {banners.length === 0 ? (
                                <div className="text-center p-8 text-muted-foreground">
                                    <p>No hay banners configurados</p>
                                    <Button asChild className="mt-4">
                                        <Link href="/admin/promotions/banners/new">
                                            <PlusCircle className="mr-2 h-4 w-4"/>Crear primer banner
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                banners.map(banner => (
                                    <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <Image 
                                                src={banner.image} 
                                                alt={banner.title} 
                                                width={180} 
                                                height={72} 
                                                className="rounded-md object-cover aspect-[2.5/1]" 
                                                data-ai-hint="banner ad"
                                            />
                                            <div className="space-y-1">
                                                <h3 className="font-semibold text-lg">{banner.title}</h3>
                                                <p className="text-sm text-muted-foreground">{banner.description}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                        banner.position === 'hero' ? 'bg-purple-100 text-purple-800' :
                                                        banner.position === 'sidebar' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {banner.position === 'hero' ? 'Principal' : 
                                                         banner.position === 'sidebar' ? 'Lateral' : 
                                                         banner.position === 'footer' ? 'Pie' : banner.position}
                                                    </span>
                                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {banner.cta || 'Ver más'}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {banner.isActive ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/admin/promotions/banners/${banner.id}`}>Editar</Link>
                                            </Button>
                                            <Switch
                                                checked={banner.isActive || false}
                                                onCheckedChange={(checked) => handleBannerToggle(banner.id, checked)}
                                                aria-label={`Activar banner: ${banner.title}`}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}