// resources/js/pages/admin/categories/index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Category, type CategoryStats } from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    FolderTree, Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight,
    ToggleLeft, ToggleRight, FolderOpen
} from 'lucide-react';
import { useState } from 'react';

// Breadcrumbs para navegación
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gestión de Categorías', href: '/categories' },
];

interface Props {
    categories: {
        data: Category[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
    parent_categories: Category[];
    stats: CategoryStats;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

/**
 * Página de Gestión de Categorías
 * 
 * Funcionalidades:
 * - Listar categorías con paginación
 * - Búsqueda por nombre o descripción
 * - Filtro por tipo (principal/secundaria)
 * - Filtro por estado (activo/inactivo)
 * - Botones de acción (editar, eliminar, toggle status)
 * 
 * @param props Props con categorías, categorías padre, stats y filtros actuales
 */
export default function CategoriesIndex({ categories, parent_categories, stats, filters }: Props) {
    // Estado local de filtros (sincronizado con props)
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    /**
     * Aplicar filtros de búsqueda
     * Envía petición GET con parámetros solo si tienen valor
     */
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedType) params.type = selectedType;
        if (selectedStatus) params.status = selectedStatus;
        
        // preserveState: mantiene inputs, preserveScroll: no hace scroll al top
        router.get('/categories', params, { preserveState: true, preserveScroll: true });
    };

    /**
     * Limpiar todos los filtros y recargar lista completa
     */
    const handleClearFilters = () => {
        setSearch('');
        setSelectedType('');
        setSelectedStatus('');
        router.get('/categories', {}, { preserveState: true, preserveScroll: true });
    };

    /**
     * Cambiar filtro de tipo (principal/secundaria)
     * Aplica automáticamente sin necesidad de botón "Buscar"
     */
    const handleTypeChange = (value: string) => {
        setSelectedType(value);
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (value) params.type = value;
        if (selectedStatus) params.status = selectedStatus;
        
        router.get('/categories', params, { preserveState: true, preserveScroll: true });
    };

    /**
     * Cambiar filtro de estado (activo/inactivo)
     * Aplica automáticamente sin necesidad de botón "Buscar"
     */
    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedType) params.type = selectedType;
        if (value) params.status = value;
        
        router.get('/categories', params, { preserveState: true, preserveScroll: true });
    };

    /**
     * Obtener tipo de categoría (Principal/Subcategoría)
     */
    const getCategoryType = (category: Category) => {
        return category.parent_id ? 'Subcategoría' : 'Categoría Principal';
    };

    /**
     * Obtener nombre de la categoría padre
     */
    const getParentName = (category: Category) => {
        return category.parent?.name || '-';
    };

    /**
     * Alternar estado activo/inactivo de una categoría
     */
    const handleToggleStatus = (category: Category) => {
        if (confirm(`¿Estás seguro de que quieres ${category.is_active ? 'desactivar' : 'activar'} "${category.name}"?`)) {
            router.post(`/categories/${category.id}/toggle-status`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    // Recargar la página para reflejar los cambios
                    router.reload({ only: ['categories'] });
                }
            });
        }
    };

    /**
     * Eliminar una categoría con confirmación
     */
    const handleDelete = (category: Category) => {
        if (confirm(`¿Estás seguro de que quieres eliminar "${category.name}"? Esta acción no se puede deshacer.`)) {
            router.delete(`/categories/${category.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Recargar la página para reflejar los cambios
                    router.reload({ only: ['categories', 'stats'] });
                }
            });
        }
    };

    /**
     * Navegar a página de edición
     */
    const handleEdit = (category: Category) => {
        router.get(`/categories/${category.id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Categorías" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* ===== HEADER CON ESTADÍSTICAS ===== */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Categorías</h1>
                        {/* Estadísticas rápidas del servidor */}
                        <p className="text-muted-foreground mt-1">
                            {stats.total_categories} categorías en total • {stats.parent_categories} principales • {stats.child_categories} secundarias
                        </p>
                    </div>
                    {/* BOTÓN NUEVA CATEGORÍA */}
                    <Link href="/categories/create">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Categoría
                        </Button>
                    </Link>
                </div>

                {/* ===== CARD PRINCIPAL CON TABLA ===== */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Catálogo de Categorías</CardTitle>
                                {/* Info de paginación: "Mostrando 1-10 de 25 categorías" */}
                                <CardDescription>
                                    Mostrando {categories.from} - {categories.to} de {categories.total} categorías
                                </CardDescription>
                            </div>
                        </div>

                        {/* ===== SECCIÓN DE FILTROS ===== */}
                        <div className="mt-4 space-y-4">
                            {/* Búsqueda por texto: nombre o descripción */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Buscar por nombre o descripción..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <Button type="submit">
                                    <Search className="h-4 w-4 mr-2" />
                                    Buscar
                                </Button>
                            </form>

                            {/* Filtros por tipo y estado */}
                            <div className="flex gap-2 flex-wrap">
                                {/* Select de tipo (cambia automáticamente) */}
                                <select
                                    value={selectedType}
                                    onChange={(e) => handleTypeChange(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm min-w-[200px] bg-background"
                                >
                                    <option value="">Todos los tipos</option>
                                    <option value="parent">Categorías Principales</option>
                                    <option value="child">Subcategorías</option>
                                </select>

                                {/* Select de estado activo/inactivo (cambia automáticamente) */}
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm min-w-[150px] bg-background"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="1">Activas</option>
                                    <option value="0">Inactivas</option>
                                </select>

                                {/* Botón limpiar filtros (solo visible si hay filtros activos) */}
                                {(search || selectedType || selectedStatus) && (
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* ===== TABLA DE CATEGORÍAS ===== */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Nombre</th>
                                        <th className="text-left py-3 px-4 font-medium">Tipo</th>
                                        <th className="text-left py-3 px-4 font-medium">Categoría Padre</th>
                                        <th className="text-left py-3 px-4 font-medium">Descripción</th>
                                        <th className="text-left py-3 px-4 font-medium">Orden</th>
                                        <th className="text-left py-3 px-4 font-medium">Estado</th>
                                        <th className="text-right py-3 px-4 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mensaje cuando no hay resultados */}
                                    {categories.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No se encontraron categorías
                                            </td>
                                        </tr>
                                    ) : (
                                        /* Mapeo de categorías */
                                        categories.data.map((category) => (
                                            <tr key={category.id} className="border-b hover:bg-muted/50">
                                                {/* Columna: Nombre + slug */}
                                                <td className="py-3 px-4">
                                                    <div className="font-medium flex items-center gap-2">
                                                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                                        {category.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {category.slug}
                                                    </div>
                                                </td>
                                                {/* Columna: Tipo de categoría */}
                                                <td className="py-3 px-4">
                                                    <Badge variant={category.parent_id ? "outline" : "default"}>
                                                        {getCategoryType(category)}
                                                    </Badge>
                                                </td>
                                                {/* Columna: Categoría padre */}
                                                <td className="py-3 px-4 text-sm">
                                                    {getParentName(category)}
                                                </td>
                                                {/* Columna: Descripción */}
                                                <td className="py-3 px-4 text-sm">
                                                    {category.description || '-'}
                                                </td>
                                                {/* Columna: Orden */}
                                                <td className="py-3 px-4 text-sm">
                                                    {category.sort_order}
                                                </td>
                                                {/* Columna: Badge de estado */}
                                                <td className="py-3 px-4">
                                                    <Badge variant={category.is_active ? "default" : "secondary"}>
                                                        {category.is_active ? 'Activa' : 'Inactiva'}
                                                    </Badge>
                                                </td>
                                                {/* Columna: Botones de acción */}
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Botón editar */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleEdit(category)}
                                                            title="Editar categoría"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        
                                                        {/* Botón alternar estado */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleToggleStatus(category)}
                                                            title={category.is_active ? 'Desactivar categoría' : 'Activar categoría'}
                                                        >
                                                            {category.is_active ? (
                                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        
                                                        {/* Botón eliminar */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleDelete(category)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            title="Eliminar categoría"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ===== PAGINACIÓN ===== */}
                        {/* Solo visible si hay más de 1 página */}
                        {categories.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                {/* Info de página actual */}
                                <div className="text-sm text-muted-foreground">
                                    Página {categories.current_page} de {categories.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {/* Botón Anterior */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={categories.current_page === 1}
                                        onClick={() => {
                                            const prevLink = categories.links.find(link => link.label.includes('Previous'));
                                            if (prevLink?.url) {
                                                const url = prevLink.url.replace('/categories', '/categories');
                                                router.get(url);
                                            }
                                        }}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Anterior
                                    </Button>
                                    
                                    {/* Botones de números de página */}
                                    <div className="flex gap-1">
                                        {categories.links
                                            // Filtra solo los números, excluye "Previous" y "Next"
                                            .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                                            .map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            const url = link.url.replace('/categories', '/categories');
                                                            router.get(url);
                                                        }
                                                    }}
                                                    // Laravel devuelve HTML en label (1, 2, 3, ...)
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                    </div>

                                    {/* Botón Siguiente */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={categories.current_page === categories.last_page}
                                        onClick={() => {
                                            const nextLink = categories.links.find(link => link.label.includes('Next'));
                                            if (nextLink?.url) {
                                                const url = nextLink.url.replace('/categories', '/categories');
                                                router.get(url);
                                            }
                                        }}
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}