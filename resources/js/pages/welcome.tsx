import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    BookOpen, Search, Users, Shield, ArrowRight,
    Star, Library, BookMarked, Zap, Globe,
    Clock, Eye, BookText, ChevronRight, Play
} from 'lucide-react';
import { SharedData } from '@/types';
import { dashboard, login, register } from '@/routes';
import { useState, useEffect } from 'react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean; }) {
    const { auth } = usePage<SharedData>().props;
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    const opacity = useTransform(scrollY, [0, 100], [1, 0]);
    const scale = useTransform(scrollY, [0, 100], [1, 0.95]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Animaciones definidas directamente aquí
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6 }
    };

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
    };

    const features = [
        {
            icon: <BookOpen className="h-12 w-12" />,
            title: 'Catálogo Digital Completo',
            description: 'Más de 10,000 libros organizados por categorías, autores y temas. Encuentra exactamente lo que buscas.',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: <Search className="h-12 w-12" />,
            title: 'Búsqueda Inteligente',
            description: 'Búsqueda semántica que entiende lo que quieres leer. Filtros avanzados por género, año y rating.',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: <Users className="h-12 w-12" />,
            title: 'Comunidad Activa',
            description: 'Únete a clubes de lectura, comparte reseñas y conecta con otros amantes de los libros.',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: <Zap className="h-12 w-12" />,
            title: 'Acceso Instantáneo',
            description: 'Lee desde cualquier dispositivo, sin descargas. Sincroniza tu progreso automáticamente.',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Libros Digitales', icon: <BookMarked className="h-6 w-6" /> },
        { number: '5,000+', label: 'Lectores Activos', icon: <Users className="h-6 w-6" /> },
        { number: '50+', label: 'Categorías', icon: <BookText className="h-6 w-6" /> },
        { number: '24/7', label: 'Disponible', icon: <Clock className="h-6 w-6" /> }
    ];

    const testimonials = [
        {
            name: "María González",
            role: "Lectora Avid",
            content: "He leído más libros en 3 meses que en todo el año pasado. La experiencia es increíble.",
            avatar: "MG",
            rating: 5
        },
        {
            name: "Carlos Rodríguez",
            role: "Estudiante Universitario",
            content: "Perfecto para mis estudios. Encuentro material académico que no hay en ninguna otra parte.",
            avatar: "CR",
            rating: 5
        },
        {
            name: "Ana Martínez",
            role: "Escritora",
            content: "Como escritora, la biblioteca me inspira y me mantiene actualizada con nuevas publicaciones.",
            avatar: "AM",
            rating: 5
        }
    ];


    return (
        <>
            <Head title="Biblioteca Digital - Descubre el Mundo de la Lectura">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-blue-900/20">
                
                {/* Header */}
                <motion.header 
                    style={{ opacity }}
                    className="fixed top-0 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-700/50 z-50"
                >
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center justify-between">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="relative">
                                    <Library className="h-8 w-8 text-primary" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Biblioteca<span className="font-light">Digital</span>
                                </span>
                            </motion.div>

                            <nav className="hidden md:flex items-center space-x-8">
                                {['Características', 'Estadísticas', 'Testimonios', 'Precios'].map((item) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase()}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors font-medium"
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                            </nav>

                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-4"
                            >
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group"
                                    >
                                        <span>Mi Biblioteca</span>
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors font-medium"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group font-medium"
                                            >
                                                <span>Probar Gratis</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.header>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="container mx-auto px-4 relative">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                variants={fadeInUp}
                                initial="initial"
                                animate="animate"
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                                    >
                                        <Zap className="h-4 w-4" />
                                        <span>+10,000 libros disponibles</span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                                    >
                                        Descubre el{' '}
                                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                            placer
                                        </span>{' '}
                                        de leer
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed"
                                    >
                                        Accede a una vasta colección de libros digitales, conecta con otros lectores 
                                        y transforma tu experiencia de lectura en nuestra biblioteca digital moderna.
                                    </motion.p>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-col sm:flex-row gap-4"
                                >
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="group bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg font-semibold"
                                        >
                                            <span>Continuar Leyendo</span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register()}
                                                className="group bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 text-lg font-semibold"
                                            >
                                                <span>Comenzar Gratis</span>
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            <button className="group border-2 border-primary text-primary dark:text-primary-light px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center space-x-3 text-lg font-semibold">
                                                <Play className="h-5 w-5" />
                                                <span>Ver Demo</span>
                                            </button>
                                        </>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex items-center space-x-6 text-sm text-neutral-500"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full border-2 border-white"></div>
                                            ))}
                                        </div>
                                        <span>+5,000 lectores</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span>4.9/5 (2.1k reseñas)</span>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="relative"
                            >
                                <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                    {/* Mockup de app de biblioteca */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                                                    <Library className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-neutral-900 dark:text-white">Mi Biblioteca</div>
                                                    <div className="text-sm text-neutral-500">12 libros en progreso</div>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                                                <Eye className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-3 space-y-2">
                                                    <div className="w-full h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg"></div>
                                                    <div className="space-y-1">
                                                        <div className="h-2 bg-neutral-200 dark:bg-neutral-600 rounded"></div>
                                                        <div className="h-2 bg-neutral-200 dark:bg-neutral-600 rounded w-3/4"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex space-x-2">
                                            <div className="flex-1 bg-primary/10 text-primary rounded-lg py-2 px-3 text-center text-sm font-medium">
                                                Explorar
                                            </div>
                                            <div className="flex-1 bg-secondary/10 text-secondary rounded-lg py-2 px-3 text-center text-sm font-medium">
                                                Mi Lista
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Elementos decorativos */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="caracteristicas" className="py-20 bg-white dark:bg-neutral-900">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Zap className="h-4 w-4" />
                                <span>Características Principales</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                                Todo lo que necesitas para{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    leer mejor
                                </span>
                            </h2>
                            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                                Diseñado para amantes de la lectura que buscan una experiencia digital excepcional
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                                    <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 group-hover:border-transparent transition-all duration-300 h-full">
                                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                            {feature.description}
                                        </p>
                                        <div className="mt-4 flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                                            <span>Saber más</span>
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section id="estadisticas" className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center text-white"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl md:text-4xl font-bold mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-blue-100 font-medium">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonios" className="py-20 bg-neutral-50 dark:bg-neutral-800">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                                <Star className="h-4 w-4" />
                                <span>Lo que dicen nuestros lectores</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                                Historias de{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    éxito
                                </span>
                            </h2>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                        >
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-neutral-700 p-6 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-600"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {testimonial.avatar}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-semibold text-neutral-900 dark:text-white">
                                                {testimonial.name}
                                            </div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                                {testimonial.role}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-white dark:bg-neutral-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <div className="container mx-auto px-4 text-center relative">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-700 dark:text-white mb-6">
                                ¿Listo para comenzar tu{' '}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    viaje literario
                                </span>
                                ?
                            </h2>
                            <p className="text-xl text-neutral-500 mb-8 max-w-2xl mx-auto">
                                Únete a miles de lectores que ya están descubriendo nuevos mundos a través de nuestra biblioteca digital
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-secondary to-secondary-dark text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold"
                                    >
                                        <span>Continuar en Mi Biblioteca</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center space-x-3 bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg font-semibold"
                                    >
                                        <span>Crear Cuenta Gratuita</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                )}
                            </motion.div>
                            <p className="text-neutral-400 mt-4 text-sm">
                                Sin tarjeta de crédito • Prueba de 14 días
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-neutral-800 dark:bg-neutral-900 text-neutral-300 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Library className="h-6 w-6 text-primary" />
                                    <span className="text-xl font-bold text-white">
                                        Biblioteca<span className="text-primary">Digital</span>
                                    </span>
                                </div>
                                <p className="text-neutral-400 mb-4">
                                    Tu portal hacia el conocimiento infinito y la pasión por la lectura.
                                </p>
                                <div className="flex space-x-3">
                                    {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                        <div key={social} className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                                            <div className="w-4 h-4 bg-neutral-400 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
                                <ul className="space-y-2">
                                    {['Características', 'Estadísticas', 'Testimonios', 'Precios'].map((item) => (
                                        <li key={item}>
                                            <a href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-4">Legal</h3>
                                <ul className="space-y-2">
                                    <li><a href="#" className="hover:text-white transition-colors">Términos de Servicio</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-4">Contacto</h3>
                                <ul className="space-y-2">
                                    <li>soporte@biblioteca.com</li>
                                    <li>+1 (555) 123-4567</li>
                                    <li>Lun - Vie: 9:00 - 18:00</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
                            <p>&copy; 2025 Biblioteca Digital. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}