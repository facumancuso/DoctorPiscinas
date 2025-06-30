import Link from 'next/link';
import type { ProductCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdsenseBanner } from '@/components/AdsenseBanner';

export function CategorySidebar({ currentSlug, categories }: { currentSlug: string, categories: ProductCategory[] }) {
  return (
    <aside className="lg:col-span-1 sticky top-24 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Categorías</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    <li>
                        <Link
                            href="/catalog/all"
                            className={cn(
                                "block p-3 rounded-lg transition-colors text-foreground/80 font-medium",
                                currentSlug === 'all'
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary"
                            )}
                        >
                            Todos los Productos
                        </Link>
                    </li>
                    {categories.map((cat) => (
                    <li key={cat.id}>
                        <Link
                        href={`/catalog/${cat.slug}`}
                        className={cn(
                            "block p-3 rounded-lg transition-colors text-foreground/80 font-medium",
                            currentSlug === cat.slug
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                        )}
                        >
                        {cat.name}
                        </Link>
                    </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        <AdsenseBanner />
    </aside>
  );
}
