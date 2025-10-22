// resources/js/pages/admin/categories/create.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';

// Breadcrumbs para navegación
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gestión de Categorías', href: '/categories' },
    { title: 'Nueva Categoría', href: '/categories/create' },
];

interface Props {
    parent_categories: Category[];
}

/**
 * Página para crear una nueva categoría
 * 
 * @param props Props con las categorías padre disponibles
 */
export default function CategoryCreate({ parent_categories }: Props) {
    // Hook useForm de Inertia para manejar el estado del formulario
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        parent_id: '',
        sort_order: 0,
        is_active: true,
        meta_title: '',
        meta_description: '',
    });

    /**
     * Manejar el envío del formulario
     * Envía una petición POST al endpoint de store
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categories', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Categoría" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Nueva Categoría</h1>
                        <p className="text-muted-foreground mt-1">
                            Completa el formulario para añadir una nueva categoría al sistema.
                        </p>
                    </div>
                    <Link href="/categories">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al listado
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalles de la Categoría</CardTitle>
                        <CardDescription>
                            Los campos marcados con (*) son obligatorios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Fila 1: Nombre y Categoría Padre */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Nombre de la Categoría (*)
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <label htmlFor="parent_id" className="block text-sm font-medium mb-1">
                                        Categoría Padre (Opcional)
                                    </label>
                                    <Select
                                        value={data.parent_id}
                                        onValueChange={(value) => setData('parent_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría padre" />
                                        </SelectTrigger>
                                            <SelectContent>
                                                {/* ✅ CORREGIDO: Usar "null" en lugar de string vacío */}
                                                <SelectItem value="null">
                                                    Ninguna (Categoría Principal)
                                                </SelectItem>
                                                {parent_categories.map((category) => (
                                                    <SelectItem 
                                                        key={category.id} 
                                                        value={category.id.toString()} // ✅ Convertir a string
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                    </Select>
                                    <InputError message={errors.parent_id} className="mt-2" />
                                </div>
                            </div>

                            {/* Fila 2: Descripción */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">
                                    Descripción (Opcional)
                                </label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Fila 3: Orden y Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="sort_order" className="block text-sm font-medium mb-1">
                                        Orden de Clasificación (Opcional)
                                    </label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', Number(e.target.value))}
                                        className={errors.sort_order ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.sort_order} className="mt-2" />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', Boolean(checked))}
                                    />
                                    <label
                                        htmlFor="is_active"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Categoría Activa
                                    </label>
                                    <InputError message={errors.is_active} className="mt-2" />
                                </div>
                            </div>
                            
                            {/* Sección SEO (Opcional) */}
                            <div className="space-y-4 border-t pt-6">
                                <h3 className="text-lg font-medium">Optimización SEO (Opcional)</h3>
                                <div>
                                    <label htmlFor="meta_title" className="block text-sm font-medium mb-1">
                                        Meta Título
                                    </label>
                                    <Input
                                        id="meta_title"
                                        type="text"
                                        value={data.meta_title}
                                        onChange={(e) => setData('meta_title', e.target.value)}
                                        className={errors.meta_title ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.meta_title} className="mt-2" />
                                </div>
                                <div>
                                    <label htmlFor="meta_description" className="block text-sm font-medium mb-1">
                                        Meta Descripción
                                    </label>
                                    <Textarea
                                        id="meta_description"
                                        value={data.meta_description}
                                        onChange={(e) => setData('meta_description', e.target.value)}
                                        className={errors.meta_description ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.meta_description} className="mt-2" />
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link href="/categories">
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Guardar Categoría'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
