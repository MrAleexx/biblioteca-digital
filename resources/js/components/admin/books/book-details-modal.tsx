// resources/js/components/admin/books/book-details-modal.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Book, BookDetailsModalProps } from '@/types';
import {
    BarChart3,
    BookOpen,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Copyright,
    Download,
    Edit3,
    Eye,
    FileText,
    Globe,
    Shield,
    Star,
    Tag,
    User,
    XCircle,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

// Interfaces para las configuraciones
interface StatusItem {
    label: string;
    value: string;
    icon: React.ComponentType<any>;
    color: string;
    badgeVariant: 'default' | 'secondary' | 'outline';
    customClass?: string;
}

interface AccessItem {
    label: string;
    value: string;
    badgeClass: string;
    isText?: boolean;
}

interface BasicInfoItem {
    icon: React.ComponentType<any>;
    label: string;
    value: string | number; // ← Cambia esta línea
    mono?: boolean;
}

interface StatItem {
    value: number;
    label: string;
    icon: React.ComponentType<any>;
}

/**
 * Modal de detalles completos de libro para administración
 */
export function BookDetailsModal({ book }: BookDetailsModalProps) {
    const [open, setOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const getAuthors = (book: Book) => {
        return (
            book.contributors
                ?.filter((c) => c.contributor_type === 'author')
                .map((c) => c.full_name)
                .join(', ') || 'Sin autor especificado'
        );
    };

    const getBookTypeText = (type: string) => {
        const types = {
            digital: 'Digital',
            physical: 'Físico',
            both: 'Digital y Físico',
        };
        return types[type as keyof typeof types] || type;
    };

    const getAccessLevelText = (level: string) => {
        const levels = {
            free: 'Gratuito',
            premium: 'Premium',
            institutional: 'Institucional',
        };
        return levels[level as keyof typeof levels] || level;
    };

    const getCopyrightText = (status: string) => {
        const statuses = {
            copyrighted: 'Con Copyright',
            public_domain: 'Dominio Público',
            creative_commons: 'Creative Commons',
        };
        return statuses[status as keyof typeof statuses] || status;
    };

    const getStatusConfig = (isActive: boolean) => {
        return isActive
            ? {
                  icon: CheckCircle,
                  color: 'text-success',
                  bgColor: 'bg-success/10',
                  label: 'Activo',
              }
            : {
                  icon: XCircle,
                  color: 'text-destructive',
                  bgColor: 'bg-destructive/10',
                  label: 'Inactivo',
              };
    };

    // Configuración para estado y configuración
    const statusConfig: StatusItem[] = [
        {
            label: 'Estado',
            value: book.is_active ? 'Activo' : 'Inactivo',
            icon: getStatusConfig(book.is_active).icon,
            color: getStatusConfig(book.is_active).color,
            badgeVariant: book.is_active ? 'default' : 'secondary',
        },
        {
            label: 'Destacado',
            value: book.featured ? 'Sí' : 'No',
            icon: Star,
            color: book.featured
                ? 'text-warning fill-warning'
                : 'text-muted-foreground',
            badgeVariant: book.featured ? 'default' : 'outline',
        },
        {
            label: 'Descargable',
            value: book.downloadable ? 'Sí' : 'No',
            icon: book.downloadable ? CheckCircle : XCircle,
            color: book.downloadable ? 'text-success' : 'text-destructive',
            badgeVariant: book.downloadable ? 'default' : 'outline',
        },
        {
            label: 'Tipo',
            value: getBookTypeText(book.book_type),
            icon: BookOpen,
            color: 'text-primary',
            badgeVariant: 'outline',
            customClass:
                'border-primary/20 bg-primary/10 text-primary capitalize',
        },
    ];

    // Configuración para acceso y derechos
    const accessConfig: AccessItem[] = [
        {
            label: 'Nivel de acceso',
            value: getAccessLevelText(book.access_level),
            badgeClass: 'border-secondary/20 bg-secondary/10 text-secondary',
        },
        {
            label: 'Copyright',
            value: getCopyrightText(book.copyright_status),
            badgeClass: 'bg-warning/10 text-warning border-warning/20',
        },
        ...(book.license_type
            ? [
                  {
                      label: 'Licencia',
                      value: book.license_type,
                      badgeClass:
                          'bg-muted text-muted-foreground border-border',
                      isText: true,
                  },
              ]
            : []),
    ];

    // Configuración para información básica
    const basicInfoConfig: BasicInfoItem[] = [
        {
            icon: FileText,
            label: 'ISBN',
            value: book.isbn,
            mono: true,
        },
        {
            icon: Building,
            label: 'Editorial',
            value: book.publisher?.name || 'No especificada',
        },
        {
            icon: BookOpen,
            label: 'Páginas',
            value: book.pages ? `${book.pages} páginas` : 'No especificado',
        },
        {
            icon: Calendar,
            label: 'Año de publicación',
            value: book.publication_year || 'No especificado',
        },
        {
            icon: Globe,
            label: 'Idioma',
            value: book.language?.name || 'No especificado',
        },
        {
            icon: Copyright,
            label: 'Fecha de publicación',
            value: book.published_at
                ? new Date(book.published_at).toLocaleDateString('es-ES')
                : 'No especificado',
        },
    ];

    // Configuración para estadísticas
    const statsConfig: StatItem[] = [
        {
            value: book.total_views,
            label: 'Vistas totales',
            icon: Eye,
        },
        {
            value: book.total_downloads,
            label: 'Descargas totales',
            icon: Download,
        },
        {
            value: book.total_loans || 0,
            label: 'Préstamos totales',
            icon: BookOpen,
        },
        {
            value: book.available_physical_copies || 0,
            label: 'Copias disponibles',
            icon: CheckCircle,
        },
    ];

    /**
     * Manejar la descarga del PDF usando la ruta del controlador
     */
    const handleDownloadPDF = () => {
        if (!book.pdf_file || downloading) return;

        setDownloading(true);

        try {
            // Usar la ruta del controlador Laravel
            const downloadUrl = `/books/${book.id}/download-pdf`;

            // Crear un enlace temporal para la descarga
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            // Simular clic en el enlace
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Opcional: Mostrar mensaje de éxito
            console.log('Iniciando descarga del PDF...');
        } catch (error) {
            console.error('Error al descargar el PDF:', error);

            // Fallback: intentar descargar directamente el archivo
            const pdfUrl = book.pdf_file.startsWith('http')
                ? book.pdf_file
                : `/storage/${book.pdf_file}`;

            window.open(pdfUrl, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    title="Ver detalles completos"
                    className="transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[95vh] w-[1000vw] max-w-[1800px] overflow-y-auto bg-background p-0">
                <DialogHeader className="border-b border-border px-8 py-6">
                    <DialogTitle className="flex items-center gap-4 text-2xl font-bold text-foreground">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                            <div className="text-3xl">{book.title}</div>
                            <div className="mt-2 flex items-center text-lg font-normal text-muted-foreground">
                                <User className="mr-3 h-5 w-5 text-primary" />
                                <span>{getAuthors(book)}</span>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-8 p-8 xl:grid-cols-6">
                    {/* ===== COLUMNA IZQUIERDA: PORTADA Y ESTADO ===== */}
                    <div className="space-y-6 xl:col-span-2">
                        {/* Portada del libro */}
                        <Card className="border-2 border-border transition-colors hover:border-primary/50">
                            <CardContent className="p-6">
                                <div className="group relative">
                                    <img
                                        src={
                                            book.cover_image
                                                ? `/storage/${book.cover_image}`
                                                : 'https://placehold.co/400x550/e2e8f0/64748b?text=Sin+Portada'
                                        }
                                        alt={book.title}
                                        className="w-full rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                'https://placehold.co/400x550/e2e8f0/64748b?text=Sin+Portada';
                                        }}
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estado y configuración */}
                        <Card className="border-border bg-card/50">
                            <CardContent className="space-y-5 p-6">
                                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                                    <Zap className="h-5 w-5 text-primary" />
                                    Estado y Configuración
                                </h3>

                                <div className="space-y-4">
                                    {statusConfig.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-xl bg-muted/30 p-4"
                                        >
                                            <span className="text-base font-medium text-foreground">
                                                {item.label}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <item.icon
                                                    className={`h-5 w-5 ${item.color}`}
                                                />
                                                <Badge
                                                    variant={item.badgeVariant}
                                                    className={
                                                        item.customClass || ''
                                                    }
                                                >
                                                    {item.value}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Acceso y derechos */}
                        <Card className="border-border bg-card/50">
                            <CardContent className="space-y-5 p-6">
                                <h3 className="flex items-center gap-3 text-xl font-semibold text-foreground">
                                    <Shield className="h-5 w-5 text-primary" />
                                    Acceso y Derechos
                                </h3>

                                <div className="space-y-4">
                                    {accessConfig.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between rounded-xl bg-muted/30 p-4"
                                        >
                                            <span className="text-base font-medium text-foreground">
                                                {item.label}
                                            </span>
                                            {item.isText ? (
                                                <span className="rounded-lg bg-muted px-3 py-1 font-mono text-sm text-muted-foreground">
                                                    {item.value}
                                                </span>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className={item.badgeClass}
                                                >
                                                    {item.value}
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ===== COLUMNA DERECHA: INFORMACIÓN DETALLADA ===== */}
                    <div className="space-y-8 xl:col-span-4">
                        {/* Información básica en grid */}
                        <Card className="border-border">
                            <CardContent className="p-8">
                                <h3 className="mb-8 flex items-center gap-4 text-2xl font-semibold text-foreground">
                                    <FileText className="h-6 w-6 text-primary" />
                                    Información Básica
                                </h3>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {basicInfoConfig.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center rounded-2xl bg-muted/30 p-5 transition-colors hover:bg-muted/50"
                                        >
                                            <item.icon className="mr-4 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                            <div className="min-w-0 flex-1">
                                                <div className="text-lg font-medium text-foreground">
                                                    {item.label}
                                                </div>
                                                <div
                                                    className={`text-base text-muted-foreground ${item.mono ? 'font-mono' : ''}`}
                                                >
                                                    {item.value}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Categorías */}
                        {book.categories && book.categories.length > 0 && (
                            <Card className="border-border">
                                <CardContent className="p-8">
                                    <h3 className="mb-6 flex items-center gap-4 text-2xl font-semibold text-foreground">
                                        <Tag className="h-6 w-6 text-primary" />
                                        Categorías
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {book.categories.map((category) => (
                                            <Badge
                                                key={category.id}
                                                variant="secondary"
                                                className="border-primary/20 bg-primary/10 px-4 py-2 text-base text-primary transition-colors hover:bg-primary/20"
                                            >
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Estadísticas de uso */}
                        <Card className="border-border">
                            <CardContent className="p-8">
                                <h3 className="mb-8 flex items-center gap-4 text-2xl font-semibold text-foreground">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                    Estadísticas de Uso
                                </h3>
                                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                                    {statsConfig.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted/30 p-6 text-center transition-all hover:scale-105 hover:border-primary/30"
                                        >
                                            <stat.icon className="mx-auto mb-4 h-8 w-8 text-primary" />
                                            <div className="text-3xl font-bold text-foreground">
                                                {stat.value.toLocaleString()}
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-muted-foreground">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fechas del sistema */}
                        <Card className="border-border">
                            <CardContent className="p-8">
                                <h3 className="mb-6 flex items-center gap-4 text-2xl font-semibold text-foreground">
                                    <Clock className="h-6 w-6 text-primary" />
                                    Información del Sistema
                                </h3>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {[
                                        {
                                            label: 'Creado',
                                            date: book.created_at,
                                        },
                                        {
                                            label: 'Última actualización',
                                            date: book.updated_at,
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl bg-muted/30 p-6"
                                        >
                                            <div className="mb-3 text-lg font-medium text-foreground">
                                                {item.label}
                                            </div>
                                            <div className="text-base text-muted-foreground">
                                                {new Date(
                                                    item.date,
                                                ).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Acciones */}
                        <div className="flex gap-4 border-t border-border pt-8">
                            {book.pdf_file && (
                                <Button
                                    size="lg"
                                    className="hover:bg-primary-dark bg-primary text-primary-foreground transition-colors"
                                    onClick={handleDownloadPDF} // ← CONECTAR EL MANEJADOR
                                    disabled={downloading}
                                >
                                    <Download className="mr-3 h-5 w-5" />
                                    {downloading
                                        ? 'Descargando...'
                                        : 'Descargar PDF'}
                                </Button>
                            )}
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-border transition-colors hover:bg-muted hover:text-foreground"
                                onClick={() => setOpen(false)}
                            >
                                <Edit3 className="mr-3 h-5 w-5" />
                                Cerrar Vista
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
