import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    BookOpen, Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Gestión de Libros',
        href: '/books',
    },
];

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Book {
    id: number;
    title: string;
    isbn: string;
    cover_image: string;
    is_active: boolean;
    featured: boolean;
    total_views: number;
    total_downloads: number;
    created_at: string;
    publisher?: { name: string };
    language?: { name: string };
    categories?: Category[];
    contributors?: Array<{ full_name: string; contributor_type: string }>;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedBooks {
    data: Book[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Stats {
    total_books: number;
    active_books: number;
    featured_books: number;
}

interface Props {
    books: PaginatedBooks;
    categories: Category[];
    stats: Stats;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function BooksIndex({ books, categories, stats, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (selectedStatus) params.status = selectedStatus;
        
        router.get('/books', params, { preserveState: true, preserveScroll: true });
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedStatus('');
        router.get('/books', {}, { preserveState: true, preserveScroll: true });
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (value) params.category = value;
        if (selectedStatus) params.status = selectedStatus;
        
        router.get('/books', params, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (value) params.status = value;
        
        router.get('/books', params, { preserveState: true, preserveScroll: true });
    };

    const getAuthors = (book: Book) => {
        return book.contributors
            ?.filter(c => c.contributor_type === 'author')
            .map(c => c.full_name)
            .join(', ') || 'Sin autor';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Libros" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header con estadísticas rápidas */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Libros</h1>
                        <p className="text-muted-foreground mt-1">
                            {stats.total_books} libros en total • {stats.active_books} activos • {stats.featured_books} destacados
                        </p>
                    </div>
                    <Button>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Agregar Libro
                    </Button>
                </div>

                {/* Tabla de Libros */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Catálogo Completo</CardTitle>
                                <CardDescription>
                                    Mostrando {books.from} - {books.to} de {books.total} libros
                                </CardDescription>
                            </div>
                        </div>

                        {/* Filtros */}
                        <div className="mt-4 space-y-4">
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

                            <div className="flex gap-2 flex-wrap">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm min-w-[200px]"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories?.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="border rounded-md px-3 py-2 text-sm min-w-[150px]"
                                >
                                    <option value="">Todos los estados</option>
                                    <option value="1">Activos</option>
                                    <option value="0">Inactivos</option>
                                </select>

                                {(search || selectedCategory || selectedStatus) && (
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Tabla */}
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
                                    {books.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-8 text-muted-foreground">
                                                No se encontraron libros
                                            </td>
                                        </tr>
                                    ) : (
                                        books.data.map((book) => (
                                            <tr key={book.id} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4">
                                                    <img 
                                                        src={book.cover_image ? `/storage/${book.cover_image}` : 'https://placehold.co/120x160/e2e8f0/64748b?text=Sin+Portada'} 
                                                        alt={book.title}
                                                        className="w-12 h-16 object-cover rounded shadow-sm"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://placehold.co/120x160/e2e8f0/64748b?text=Sin+Portada';
                                                        }}
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">{book.title}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {book.categories?.map(c => c.name).join(', ')}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    {getAuthors(book)}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-mono">
                                                    {book.isbn}
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    {book.publisher?.name || '-'}
                                                </td>
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
                                                <td className="py-3 px-4 text-sm">
                                                    <div className="text-xs">
                                                        <div>👁️ {book.total_views}</div>
                                                        <div>⬇️ {book.total_downloads}</div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="sm" variant="outline">
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

                        {/* Paginación Mejorada */}
                        {books.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between border-t pt-4">
                                <div className="text-sm text-muted-foreground">
                                    Página {books.current_page} de {books.last_page}
                                </div>
                                <div className="flex gap-2">
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
                                    
                                    {/* Números de página */}
                                    <div className="flex gap-1">
                                        {books.links
                                            .filter(link => !link.label.includes('Previous') && !link.label.includes('Next'))
                                            .map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                    </div>

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
