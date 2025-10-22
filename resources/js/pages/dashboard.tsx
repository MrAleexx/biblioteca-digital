import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FolderOpen,
    FolderTree,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'librarian' | 'user';
}

interface Stats {
    total_books: number;
    active_books: number;
    featured_books: number;
    total_users: number;
    active_users: number;
    total_categories: number;
    total_publishers: number;
}

interface Props {
    user: User;
    stats?: Stats;
}

export default function Dashboard({ user, stats }: Props) {
    const isAdminOrLibrarian =
        user.role === 'admin' || user.role === 'librarian';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Bienvenido, {user.name}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {isAdminOrLibrarian
                            ? 'Resumen general de la Biblioteca Digital'
                            : 'Tu biblioteca digital personalizada'}
                    </p>
                </div>

                {isAdminOrLibrarian && stats && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Libros
                                    </CardTitle>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.total_books}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.active_books} activos
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Usuarios
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.total_users}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stats.active_users} activos
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Categorías
                                    </CardTitle>
                                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.total_categories}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Organizadas
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Editoriales
                                    </CardTitle>
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stats.total_publishers}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Registradas
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <h2 className="mb-4 text-xl font-semibold">
                                Módulos del Sistema
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Link href="/books">
                                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                                        <CardHeader>
                                            <BookOpen className="mb-2 h-8 w-8 text-primary" />
                                            <CardTitle>
                                                Gestión de Libros
                                            </CardTitle>
                                            <CardDescription>
                                                Ver, crear, editar y gestionar
                                                el catálogo completo
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button className="w-full">
                                                Abrir Módulo →
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                                <Link href="/categories">
                                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                                        <CardHeader>
                                            <FolderTree className="mb-2 h-8 w-8 text-primary" />
                                            <CardTitle>
                                                Gestión de Categorías
                                            </CardTitle>
                                            <CardDescription>
                                                Organizar categorías principales
                                                y secundarias del catálogo
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button className="w-full">
                                                Abrir Módulo →
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
