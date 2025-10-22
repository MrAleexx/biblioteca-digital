// resources/js/pages/books/index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem,type Book,type Category,type BookStats,type PaginatedBooks} from '@/types';
import { Head, router, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    BookOpen, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight,
    ToggleLeft, ToggleRight, Star, Plus 
} from 'lucide-react';
import { useState } from 'react';
import { BookDetailsModal } from '../../components/admin/books/book-details-modal';

// Breadcrumbs para navegación
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gestión de Libros', href: '/books' },
];

interface Props {
    books: PaginatedBooks;
    categories: Category[];
    stats: BookStats;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

/**
 * Página de Gestión de Libros
 * 
 * Funcionalidades:
 * - Listar libros con paginación (10 por página)
 * - Búsqueda por título o ISBN
 * - Filtro por categoría
 * - Filtro por estado (activo/inactivo)
 * - Ver detalles en modal
 * - Botones de acción (editar, eliminar, toggle status/featured)
 * 
 * @param props Props con libros, categorías, stats y filtros actuales
 */
export default function BooksIndex({ books, categories, stats, filters }: Props) {
    // Estado local de filtros (sincronizado con props)
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    /**
     * Aplicar filtros de búsqueda
     * Envía petición GET con parámetros solo si tienen valor
     */
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (selectedStatus) params.status = selectedStatus;
        
        // preserveState: mantiene inputs, preserveScroll: no hace scroll al top
        router.get('/books', params, { preserveState: true, preserveScroll: true });
    };

    /**
     * Limpiar todos los filtros y recargar lista completa
     */
    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedStatus('');
        router.get('/books', {}, { preserveState: true, preserveScroll: true });
    };

    /**
     * Cambiar filtro de categoría
     * Aplica automáticamente sin necesidad de botón "Buscar"
     */
    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (value) params.category = value;
        if (selectedStatus) params.status = selectedStatus;
        
        router.get('/books', params, { preserveState: true, preserveScroll: true });
    };

    /**
     * Cambiar filtro de estado (activo/inactivo)
     * Aplica automáticamente sin necesidad de botón "Buscar"
     */
    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (value) params.status = value;
        
        router.get('/books', params, { preserveState: true, preserveScroll: true });
    };

    /**
     * Obtener lista de autores de un libro
     * Filtra contribuidores de tipo 'author'
     */
    const getAuthors = (book: Book) => {
        return book.contributors
            ?.filter(c => c.contributor_type === 'author')
            .map(c => c.full_name)
            .join(', ') || 'Sin autor';
    };

    /**
     * Alternar estado activo/inactivo de un libro
     */
    const handleToggleStatus = (book: Book) => {
        if (confirm(`¿Estás seguro de que quieres ${book.is_active ? 'desactivar' : 'activar'} "${book.title}"?`)) {
            router.post(`/books/${book.id}/toggle-status`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    // Recargar la página para reflejar los cambios
                    router.reload({ only: ['books'] });
                }
            });
        }
    };

    /**
     * Alternar estado destacado de un libro
     */
    const handleToggleFeatured = (book: Book) => {
        router.post(`/books/${book.id}/toggle-featured`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Recargar la página para reflejar los cambios
                router.reload({ only: ['books'] });
            }
        });
    };

    /**
     * Eliminar un libro con confirmación
     */
    const handleDelete = (book: Book) => {
        if (confirm(`¿Estás seguro de que quieres eliminar "${book.title}"? Esta acción no se puede deshacer.`)) {
            router.delete(`/books/${book.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Recargar la página para reflejar los cambios
                    router.reload({ only: ['books', 'stats'] });
                }
            });
        }
    };

    /**
     * Navegar a página de edición
     */
    const handleEdit = (book: Book) => {
        router.get(`/books/${book.id}/edit`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Libros" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* ===== HEADER CON ESTADÍSTICAS ===== */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Libros</h1>
                        {/* Estadísticas rápidas del servidor */}
                        <p className="text-muted-foreground mt-1">
                            {stats.total_books} libros en total • {stats.active_books} activos • {stats.featured_books} destacados
                        </p>
                    </div>
                    {/* BOTÓN ACTUALIZADO - Usando Link de Inertia */}
                    <Link href="/books/create">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Libro
                        </Button>
                    </Link>
                </div>

                {/* ===== CARD PRINCIPAL CON TABLA ===== */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Catálogo Completo</CardTitle>
                                {/* Info de paginación: "Mostrando 1-10 de 25 libros" */}
                                <CardDescription>
                                    Mostrando {books.from} - {books.to} de {books.total} libros
                                </CardDescription>
                            </div>
                        </div>

                        {/* ===== SECCIÓN DE FILTROS ===== */}
                        <div className="mt-4 space-y-4">
                            {/* Búsqueda por texto: título o ISBN */}
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Buscar por título o ISBN..."
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

                            {/* Filtros por categoría y estado */}
                            <div className="flex gap-2 flex-wrap">
                                {/* Select de categorías (cambia automáticamente) */}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm min-w-[200px] bg-background"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                {/* Select de estado activo/inactivo (cambia automáticamente) */}
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm min-w-[150px] bg-background"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="1">Activos</option>
                                    <option value="0">Inactivos</option>
                                </select>

                                {/* Botón limpiar filtros (solo visible si hay filtros activos) */}
                                {(search || selectedCategory || selectedStatus) && (
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* ===== TABLA DE LIBROS ===== */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Portada</th>
                                        <th className="text-left py-3 px-4 font-medium">Título</th>
                                        <th className="text-left py-3 px-4 font-medium">Autor(es)</th>
                                        <th className="text-left py-3 px-4 font-medium">ISBN</th>
                                        <th className="text-left py-3 px-4 font-medium">Editorial</th>
                                        <th className="text-left py-3 px-4 font-medium">Estado</th>
                                        <th className="text-left py-3 px-4 font-medium">Estadísticas</th>
                                        <th className="text-right py-3 px-4 font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mensaje cuando no hay resultados */}
                                    {books.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-8 text-muted-foreground">
                                                No se encontraron libros
                                            </td>
                                        </tr>
                                    ) : (
                                        /* Mapeo de libros */
                                        books.data.map((book) => (
                                            <tr key={book.id} className="border-b hover:bg-muted/50">
                                                {/* Columna: Imagen de portada */}
                                                <td className="py-3 px-4">
                                                    <img 
                                                        src={book.cover_image ? `/storage/${book.cover_image}` : 'https://placehold.co/120x160/e2e8f0/64748b?text=Sin+Portada'} 
                                                        alt={book.title}
                                                        className="w-12 h-16 object-cover rounded shadow-sm"
                                                        onError={(e) => {
                                                            // Fallback si la imagen no carga
                                                            e.currentTarget.src = 'https://placehold.co/120x160/e2e8f0/64748b?text=Sin+Portada';
                                                        }}
                                                    />
                                                </td>
                                                {/* Columna: Título + categorías */}
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">{book.title}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {book.categories?.map(c => c.name).join(', ')}
                                                    </div>
                                                </td>
                                                {/* Columna: Autores (helper getAuthors) */}
                                                <td className="py-3 px-4 text-sm">
                                                    {getAuthors(book)}
                                                </td>
                                                {/* Columna: ISBN con fuente monospace */}
                                                <td className="py-3 px-4 text-sm font-mono">
                                                    {book.isbn}
                                                </td>
                                                {/* Columna: Editorial */}
                                                <td className="py-3 px-4 text-sm">
                                                    {book.publisher?.name || '-'}
                                                </td>
                                                {/* Columna: Badges de estado */}
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-1">
                                                        <Badge variant={book.is_active ? "default" : "secondary"}>
                                                            {book.is_active ? 'Activo' : 'Inactivo'}
                                                        </Badge>
                                                        {book.featured && (
                                                            <Badge variant="outline">Destacado</Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* Columna: Estadísticas (vistas y descargas) */}
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="text-xs">
                                                        <div>👁️ {book.total_views}</div>
                                                        <div>⬇️ {book.total_downloads}</div>
                                                    </div>
                                                </td>
                                                {/* Columna: Botones de acción */}
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Modal de detalles */}
                                                        <BookDetailsModal book={book} />
                                                        
                                                        {/* Botón editar */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleEdit(book)}
                                                            title="Editar libro"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        
                                                        {/* Botón alternar estado */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleToggleStatus(book)}
                                                            title={book.is_active ? 'Desactivar libro' : 'Activar libro'}
                                                        >
                                                            {book.is_active ? (
                                                                <ToggleRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </Button>
                                                        
                                                        {/* Botón destacar */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleToggleFeatured(book)}
                                                            title={book.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                                                        >
                                                            <Star className={`h-4 w-4 ${book.featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                                                        </Button>
                                                        
                                                        {/* Botón eliminar */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            onClick={() => handleDelete(book)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            title="Eliminar libro"
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
                        {books.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                {/* Info de página actual */}
                                <div className="text-sm text-muted-foreground">
                                    Página {books.current_page} de {books.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {/* Botón Anterior */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={books.current_page === 1}
                                        onClick={() => {
                                            const prevLink = books.links.find(link => link.label.includes('Previous'));
                                            if (prevLink?.url) router.get(prevLink.url);
                                        }}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Anterior
                                    </Button>
                                    
                                    {/* Botones de números de página */}
                                    <div className="flex gap-1">
                                        {books.links
                                            // Filtra solo los números, excluye "Previous" y "Next"
                                            .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                                            .map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    // Laravel devuelve HTML en label (1, 2, 3, ...)
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                    </div>

                                    {/* Botón Siguiente */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={books.current_page === books.last_page}
                                        onClick={() => {
                                            const nextLink = books.links.find(link => link.label.includes('Next'));
                                            if (nextLink?.url) router.get(nextLink.url);
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