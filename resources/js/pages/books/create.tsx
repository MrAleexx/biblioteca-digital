// resources/js/pages/Books/Create.tsx
import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
    BookOpen, Plus, Upload, X, Users, Tag, Building, Globe, 
    Calendar, FileText, Download, Shield, Copyright, Zap,
    ArrowLeft, Save
} from 'lucide-react';

interface Contributor {
    full_name: string;
    contributor_type: string;
    email?: string;
    sequence_number: number;
}

interface CreateProps {
    publishers: Array<{ id: number; name: string }>;
    languages: Array<{ code: string; name: string }>;
    categories: Array<{ id: number; name: string }>;
}

// Define el tipo para los campos del formulario
type FormFields = 
    | 'title' | 'isbn' | 'publisher_id' | 'language_code' | 'publication_year' 
    | 'pages' | 'book_type' | 'access_level' | 'copyright_status' | 'license_type' 
    | 'description' | 'is_active' | 'featured' | 'downloadable' | 'categories' 
    | 'contributors' | 'cover_image' | 'pdf_file'
    | `contributors.${number}.full_name`
    | `contributors.${number}.contributor_type`
    | `contributors.${number}.sequence_number`;

export default function Create({ publishers, languages, categories }: CreateProps) {
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [contributors, setContributors] = useState<Contributor[]>([
        { full_name: '', contributor_type: 'author', sequence_number: 1 }
    ]);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        isbn: '',
        publisher_id: '',
        language_code: 'es',
        publication_year: '',
        pages: '',
        book_type: 'digital',
        access_level: 'free',
        copyright_status: 'copyrighted',
        license_type: '',
        description: '',
        is_active: true,
        featured: false,
        downloadable: true,
        categories: [] as number[],
        contributors: [] as Contributor[],
        cover_image: null as File | null,
        pdf_file: null as File | null,
    });

    // Corregido: usa el tipo FormFields para el parámetro field
    const handleInputChange = (field: FormFields, value: any) => {
        setData(field, value);
    };

    const handleCategoryToggle = (categoryId: number) => {
        const newCategories = selectedCategories.includes(categoryId)
            ? selectedCategories.filter(id => id !== categoryId)
            : [...selectedCategories, categoryId];
        
        setSelectedCategories(newCategories);
        setData('categories' as FormFields, newCategories);
    };

    const handleContributorChange = (index: number, field: 'full_name' | 'contributor_type' | 'sequence_number', value: string) => {
        const updatedContributors = [...contributors];
        updatedContributors[index] = {
            ...updatedContributors[index],
            [field]: field === 'sequence_number' ? parseInt(value) : value
        };
        setContributors(updatedContributors);
        setData('contributors' as FormFields, updatedContributors);
    };

    const addContributor = () => {
        const newContributors = [
            ...contributors,
            { full_name: '', contributor_type: 'author', sequence_number: contributors.length + 1 }
        ];
        setContributors(newContributors);
        setData('contributors' as FormFields, newContributors);
    };

    const removeContributor = (index: number) => {
        if (contributors.length > 1) {
            const newContributors = contributors.filter((_, i) => i !== index);
            setContributors(newContributors);
            setData('contributors' as FormFields, newContributors);
        }
    };

    const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setCoverImage(file);
            setData('cover_image' as FormFields, file);
        }
    };

    const handlePdfFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPdfFile(file);
            setData('pdf_file' as FormFields, file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/books');
    };

    return (
        <AppLayout>
            <Head title="Agregar Nuevo Libro" />

            {/* Header */}
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Agregar Nuevo Libro</h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Complete la información del libro para agregarlo al catálogo
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                        {/* Columna Izquierda: Información Básica */}
                        <div className="space-y-6 xl:col-span-2">
                            {/* Información Básica */}
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-foreground">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Información Básica
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Título *</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                                                placeholder="Ingrese el título del libro"
                                                required
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-destructive">{errors.title}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="isbn">ISBN *</Label>
                                            <Input
                                                id="isbn"
                                                value={data.isbn}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('isbn', e.target.value)}
                                                placeholder="Ej: 978-8497592208"
                                                required
                                            />
                                            {errors.isbn && (
                                                <p className="text-sm text-destructive">{errors.isbn}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="publisher_id">Editorial *</Label>
                                            <Select
                                                value={data.publisher_id}
                                                onValueChange={(value: string) => handleInputChange('publisher_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione una editorial" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {publishers.map((publisher) => (
                                                        <SelectItem key={publisher.id} value={publisher.id.toString()}>
                                                            {publisher.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.publisher_id && (
                                                <p className="text-sm text-destructive">{errors.publisher_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="language_code">Idioma *</Label>
                                            <Select
                                                value={data.language_code}
                                                onValueChange={(value: string) => handleInputChange('language_code', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un idioma" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((language) => (
                                                        <SelectItem key={language.code} value={language.code}>
                                                            {language.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.language_code && (
                                                <p className="text-sm text-destructive">{errors.language_code}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="publication_year">Año de Publicación</Label>
                                            <Input
                                                id="publication_year"
                                                type="number"
                                                value={data.publication_year}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('publication_year', e.target.value)}
                                                placeholder="Ej: 2024"
                                                min="1000"
                                                max={new Date().getFullYear() + 1}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pages">Número de Páginas</Label>
                                            <Input
                                                id="pages"
                                                type="number"
                                                value={data.pages}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('pages', e.target.value)}
                                                placeholder="Ej: 350"
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                                            placeholder="Ingrese una descripción del libro..."
                                            rows={4}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ... resto del código igual pero con tipos corregidos ... */}
                        </div>

                        {/* Columna Derecha: Configuración y Archivos */}
                        <div className="space-y-6">
                            {/* Configuración del Libro */}
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-foreground">
                                        <Zap className="h-5 w-5 text-primary" />
                                        Configuración
                                    </h3>

                                    <div className="space-y-6">
                                        {/* ... otros selects ... */}

                                        {/* Switches de shadcn/ui */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="is_active" className="cursor-pointer">
                                                    Libro Activo
                                                </Label>
                                                <Switch
                                                    id="is_active"
                                                    checked={data.is_active}
                                                    onCheckedChange={(checked: boolean) => handleInputChange('is_active', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="featured" className="cursor-pointer">
                                                    Destacado
                                                </Label>
                                                <Switch
                                                    id="featured"
                                                    checked={data.featured}
                                                    onCheckedChange={(checked: boolean) => handleInputChange('featured', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="downloadable" className="cursor-pointer">
                                                    Descargable
                                                </Label>
                                                <Switch
                                                    id="downloadable"
                                                    checked={data.downloadable}
                                                    onCheckedChange={(checked: boolean) => handleInputChange('downloadable', checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Archivos */}
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold text-foreground">
                                        <Upload className="h-5 w-5 text-primary" />
                                        Archivos
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cover_image">Portada del Libro</Label>
                                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                                                <Input
                                                    id="cover_image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCoverImageChange}
                                                    className="hidden"
                                                />
                                                <Label htmlFor="cover_image" className="cursor-pointer">
                                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                    <div className="text-sm text-muted-foreground">
                                                        {coverImage ? coverImage.name : 'Haga clic para subir portada'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        PNG, JPG, WEBP (max. 2MB)
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pdf_file">Archivo PDF</Label>
                                            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                                                <Input
                                                    id="pdf_file"
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handlePdfFileChange}
                                                    className="hidden"
                                                />
                                                <Label htmlFor="pdf_file" className="cursor-pointer">
                                                    <Download className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                                    <div className="text-sm text-muted-foreground">
                                                        {pdfFile ? pdfFile.name : 'Haga clic para subir PDF'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        PDF (max. 50MB)
                                                    </div>
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Acciones */}
                            <Card className="border-border">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <Button 
                                            type="submit" 
                                            className="w-full bg-primary hover:bg-primary/90"
                                            disabled={processing}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Creando...' : 'Crear Libro'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => window.history.back()}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}