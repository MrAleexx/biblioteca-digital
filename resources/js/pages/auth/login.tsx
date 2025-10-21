import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Form, Head } from '@inertiajs/react';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { store } from '@/routes/login';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({ status, canResetPassword, canRegister }: LoginProps) {
    return (
        <>
            <Head title="Log in" />
            <div className="flex flex-col min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-5 flex-1 h-full">
                    {/* Columna izquierda: Imagen y contenido (3/5 ancho, 100vh) */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900 text-white relative h-screen">
                        <div className="absolute inset-0 opacity-10">
                            <img
                                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Biblioteca Digital"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-12">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                    <span className="text-xl font-semibold">Biblioteca Digital</span>
                                </div>
                                <h1 className="text-5xl font-bold mb-6 leading-tight">
                                    Descubre mundos<br />
                                    infinitos a través<br />
                                    de la lectura
                                </h1>
                                <p className="text-lg text-slate-400 max-w-md">
                                    Accede a miles de libros, artículos y recursos digitales desde cualquier lugar.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Colección ilimitada</h3>
                                        <p className="text-sm text-slate-400">Miles de títulos disponibles 24/7</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Acceso multiplataforma</h3>
                                        <p className="text-sm text-slate-400">Lee desde tu dispositivo favorito</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: Formulario de login (2/5 ancho, 100vh) */}
                    <div className="flex flex-col justify-center items-center lg:col-span-2 bg-white p-8 md:p-16 h-screen">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Iniciar sesión</h2>
                            <p className="text-slate-600 mb-8">Accede a tu cuenta para continuar</p>
                            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-5">
                                {({ processing, errors }) => (
                                    <>
                                        {status && (
                                            <div className="text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                                                {status}
                                            </div>
                                        )}
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                                    Correo electrónico
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="tu@email.com"
                                                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                                                />
                                                <InputError message={errors.email} />
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                                        Contraseña
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink href={request()} className="text-sm text-slate-600 hover:text-slate-900">
                                                            ¿Olvidaste tu contraseña?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                                                />
                                                <InputError message={errors.password} />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                                <Label htmlFor="remember" className="text-sm text-slate-700 cursor-pointer">
                                                    Mantener sesión iniciada
                                                </Label>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                                                tabIndex={4}
                                                disabled={processing}
                                            >
                                                {processing && <Spinner className="mr-2" />}
                                                Iniciar sesión
                                            </Button>
                                        </div>
                                        {canRegister && (
                                            <div className="text-center text-sm text-slate-600 pt-6 border-t border-slate-200">
                                                ¿No tienes una cuenta?{' '}
                                                <TextLink href={register()} className="text-slate-900 hover:underline font-medium">
                                                    Crear cuenta
                                                </TextLink>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-950 text-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Branding & Description */}
                        <div>
                            <h2 className="text-white text-2xl font-bold mb-4">GRUPO - <span className='text-orange-400'>A &amp; T</span></h2>
                            <p className="text-sm leading-relaxed mb-6">
                                Líderes en venta de libros digitales educativos.<br />
                                Contenido de calidad para tu crecimiento.
                            </p>
                            <div className="flex space-x-4 mt-6">
                                {/* Facebook */}
                                <a href="https://www.facebook.com/grupoaytperu" aria-label="Facebook" className="hover:text-white">
                                    <svg className="w-6 h-6 text-blue-50" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
                                    </svg>
                                </a>
                                {/* Instagram */}
                                <a href="https://www.instagram.com/alex_taya/" aria-label="Instagram" className="hover:text-white">
                                    <svg className="w-6 h-6 text-blue-50" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
                                        <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
                                        <circle cx="17.5" cy="6.5" r="1.5" />
                                    </svg>
                                </a>
                            </div>

                        </div>

                        {/* Política Links */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Política</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://dtemp.xyz/politicas-privacidad" className="hover:text-white">Políticas de privacidad</a></li>
                                <li><a href="https://dtemp.xyz/politicas-de-cookie" className="hover:text-white">Políticas de Cookies</a></li>
                                <li><a href="https://dtemp.xyz/terminos-condiciones" className="hover:text-white">Términos y condiciones</a></li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://dtemp.xyz/" className="hover:text-white">Inicio</a></li>
                                <li><a href="https://dtemp.xyz/nuestros-libros" className="hover:text-white">Nuestros Libros</a></li>
                                <li><a href="https://dtemp.xyz/sobre-nosotros" className="hover:text-white">Sobre Nosotros</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <span className="font-medium">Email:</span>{' '}
                                    <a href="mailto:alextaya@hotmail.com" className="hover:text-white">alextaya@hotmail.com</a>
                                </li>
                                <li>
                                    <span className="font-medium">Horario:</span>{' '}
                                    Lunes - Viernes de 9 AM a 6 PM
                                </li>
                                <li>
                                    <span className="font-medium">RUC:</span>{' '}
                                    10154316189
                                </li>
                                <li>
                                    <span className="font-medium">Dirección:</span>{' '}
                                    Urb. Libertad Mz. I Lt. 5 Calle las Moras S/N San Vicente – Cañete – Lima – Perú
                                </li>
                                <li>
                                    <a href="https://dtemp.xyz/libro-reclamaciones" className="hover:text-white">Libro de reclamaciones</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-12 border-t border-gray-800 py-6">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
                            <p>
                                © 2025 <a href="https://dtemp.xyz/" className="text-white hover:text-yellow-500">GRUPO-A&amp;T™</a>. Todos los derechos reservados.
                            </p>
                            <div className="mt-4 md:mt-0 space-x-4">
                                <a href="https://dtemp.xyz/politicas-privacidad" className="hover:underline">Privacidad</a>
                                <a href="https://dtemp.xyz/terminos-condiciones" className="hover:underline">Términos</a>
                                <a href="https://dtemp.xyz/politicas-de-cookie" className="hover:underline">Cookies</a>
                            </div>
                            <p className="mt-4 md:mt-0">
                                Desarrollado por <a href="https://www.mattinnovasolution.com/" className="text-yellow-500 hover:underline">Matt Innova Solution</a>
                            </p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
