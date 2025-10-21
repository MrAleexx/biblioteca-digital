import { Eye, BookOpen, Calendar, FileText, Globe, Building2, Tag, Users, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// ===== INTERFACES DE TIPOS =====

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Publisher {
    id: number;
    name: string;
    country?: string;
}

interface Language {
    code: string;
    name: string;
}

interface Contributor {
    id: number;
    full_name: string;
    contributor_type: string;
}

interface Book {
    id: number;
    title: string;
    isbn: string;
    publication_year?: number;
    pages: number;
    cover_image?: string;
    is_active: boolean;
    featured: boolean;
    book_type: string;
    access_level: string;
    copyright_status: string;
    total_views: number;
    total_downloads: number;
    total_loans?: number;
    publisher?: Publisher;
    language?: Language;
    categories?: Category[];
    contributors?: Contributor[];
}

interface BookDetailsModalProps {
    book: Book;
}

// ===== DICCIONARIOS DE TRADUCCIÓN =====

/**
 * Traduce tipos de contribuidores al español
 */
const contributorTypeNames: Record<string, string> = {
    author: 'Autor',
    editor: 'Editor',
    translator: 'Traductor',
    illustrator: 'Ilustrador',
    other: 'Colaborador',
};

/**
 * Traduce tipos de libro al español
 */
const bookTypeNames: Record<string, string> = {
    digital: 'Digital',
    physical: 'Físico',
    both: 'Digital y Físico',
};

/**
 * Define labels y variantes de badges para niveles de acceso
 */
const accessLevelNames: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    free: { label: 'Acceso Gratuito', variant: 'default' },
    premium: { label: 'Premium', variant: 'secondary' },
    institutional: { label: 'Institucional', variant: 'outline' },
};

/**
 * Traduce estados de copyright al español
 */
const copyrightNames: Record<string, string> = {
    copyrighted: 'Con derechos de autor',
    public_domain: 'Dominio público',
    creative_commons: 'Creative Commons',
};

/**
 * Modal de Detalles del Libro
 * 
 * Muestra información completa del libro en un dialog modal:
 * - Portada e información básica
 * - Autores y colaboradores
 * - Editorial, idioma, año
 * - Categorías
 * - Estadísticas (vistas, descargas)
 * - Estado y tipo de acceso
 * 
 * @param book Objeto libro con todas sus relaciones
 */
export function BookDetailsModal({ book }: BookDetailsModalProps) {
    /**
     * URL de la portada con fallback a placeholder
     */
    const coverImageUrl = book.cover_image 
        ? `/storage/${book.cover_image}` 
        : 'https://placehold.co/300x400/e2e8f0/64748b?text=Sin+Portada';

    /**
     * Extraer solo autores de la lista de contribuidores
     */
    const getAuthors = () => {
        return book.contributors
            ?.filter(c => c.contributor_type === 'author')
            .map(c => c.full_name) || [];
    };

    /**
     * Extraer colaboradores que NO son autores (editores, traductores, ilustradores)
     */
    const getOtherContributors = () => {
        return book.contributors
            ?.filter(c => c.contributor_type !== 'author') || [];
    };

    return (
        <Dialog>
            {/* Botón trigger: ícono de ojo */}
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            
            {/* Contenido del modal */}
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
                    <DialogDescription>
                        {getAuthors().join(', ') || 'Sin autor especificado'}
                    </DialogDescription>
                </DialogHeader>

                {/* ScrollArea para contenido largo sin desbordar pantalla */}
                <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
                    <div className="space-y-6">
                        {/* ===== SECCIÓN PRINCIPAL: PORTADA + INFO BÁSICA ===== */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Columna izquierda: Portada y badges */}
                            <div className="md:col-span-1">
                                <img
                                    src={coverImageUrl}
                                    alt={book.title}
                                    className="w-full rounded-lg shadow-lg"
                                    onError={(e) => {
                                        // Fallback si imagen no carga
                                        e.currentTarget.src = 'https://placehold.co/300x400/e2e8f0/64748b?text=Sin+Portada';
                                    }}
                                />
                                
                                {/* Badges de estado y destacado */}
                                <div className="mt-4 space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant={book.is_active ? "default" : "secondary"}>
                                            {book.is_active ? '✓ Activo' : '✕ Inactivo'}
                                        </Badge>
                                        {book.featured && (
                                            <Badge className="bg-amber-500 hover:bg-amber-600">
                                                ⭐ Destacado
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    {/* Badge de nivel de acceso (free, premium, institutional) */}
                                    <Badge variant={accessLevelNames[book.access_level]?.variant || 'outline'}>
                                        {accessLevelNames[book.access_level]?.label || book.access_level}
                                    </Badge>
                                </div>
                            </div>

                            {/* Columna derecha: Información detallada */}
                            <div className="md:col-span-2 space-y-4">
                                {/* ===== GRID DE METADATA ===== */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* ISBN */}
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">ISBN</p>
                                            <p className="text-sm font-mono">{book.isbn}</p>
                                        </div>
                                    </div>

                                    {/* Año de publicación (opcional) */}
                                    {book.publication_year && (
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Año de publicación</p>
                                                <p className="text-sm">{book.publication_year}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Número de páginas */}
                                    <div className="flex items-start gap-2">
                                        <BookOpen className="h-4 w-4 mt-1 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Páginas</p>
                                            <p className="text-sm">{book.pages} páginas</p>
                                        </div>
                                    </div>

                                    {/* Editorial (opcional) */}
                                    {book.publisher && (
                                        <div className="flex items-start gap-2">
                                            <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Editorial</p>
                                                <p className="text-sm">{book.publisher.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Idioma (opcional) */}
                                    {book.language && (
                                        <div className="flex items-start gap-2">
                                            <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground">Idioma</p>
                                                <p className="text-sm">{book.language.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tipo de libro (digital, físico, ambos) */}
                                    <div className="flex items-start gap-2">
                                        <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                                            <p className="text-sm">{bookTypeNames[book.book_type] || book.book_type}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* ===== CATEGORÍAS ===== */}
                                {book.categories && book.categories.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-semibold">Categorías</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {book.categories.map((category) => (
                                                <Badge key={category.id} variant="outline">
                                                    {category.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ===== OTROS CONTRIBUYENTES ===== */}
                                {/* Muestra editores, traductores, ilustradores (todos excepto autores) */}
                                {getOtherContributors().length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-semibold">Otros contribuyentes</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {getOtherContributors().map((contributor) => (
                                                <Badge key={contributor.id} variant="secondary">
                                                    {contributor.full_name} ({contributorTypeNames[contributor.contributor_type] || contributor.contributor_type})
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* ===== ESTADÍSTICAS DE USO ===== */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-semibold">Estadísticas de uso</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Vistas totales */}
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-2xl font-bold text-foreground">{book.total_views}</p>
                                    <p className="text-xs text-muted-foreground">👁️ Visualizaciones</p>
                                </div>
                                {/* Descargas totales */}
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <p className="text-2xl font-bold text-foreground">{book.total_downloads}</p>
                                    <p className="text-xs text-muted-foreground">⬇️ Descargas</p>
                                </div>
                                {/* Préstamos (solo si el libro los soporta) */}
                                {book.total_loans !== undefined && (
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-2xl font-bold text-foreground">{book.total_loans}</p>
                                        <p className="text-xs text-muted-foreground">📚 Préstamos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* ===== INFORMACIÓN LEGAL ===== */}
                        <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Derechos de autor</p>
                            <p className="text-sm">{copyrightNames[book.copyright_status] || book.copyright_status}</p>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
