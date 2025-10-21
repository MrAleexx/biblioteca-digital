import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Form, Head } from '@inertiajs/react';
import { update } from '@/routes/password';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <>
            <Head title="Restablecer contraseña" />
            <div className="flex flex-col min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-5 flex-1 h-full">
                    {/* Columna izquierda: Imagen y contenido (3/5 ancho, 100vh) */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col bg-slate-900 text-white relative h-screen">
                        <div className="absolute inset-0 opacity-10">
                            <img
                                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Nueva contraseña"
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
                                    Crea una nueva<br />
                                    contraseña<br />
                                    segura
                                </h1>
                                <p className="text-lg text-slate-400 max-w-md">
                                    Elige una contraseña robusta para proteger tu cuenta y mantener seguros tus datos.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Máxima seguridad</h3>
                                        <p className="text-sm text-slate-400">Tu contraseña será encriptada y protegida</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Acceso inmediato</h3>
                                        <p className="text-sm text-slate-400">Podrás iniciar sesión al instante</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: Formulario (2/5 ancho, 100vh) */}
                    <div className="flex flex-col justify-center items-center lg:col-span-2 bg-white p-8 md:p-16 h-screen overflow-y-auto">
                        <div className="w-full max-w-md">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Restablecer contraseña</h2>
                            <p className="text-slate-600 mb-8">Ingresa tu nueva contraseña a continuación</p>
                            
                            <Form 
                                {...update.form()}
                                transform={(data) => ({ ...data, token, email })}
                                resetOnSuccess={['password', 'password_confirmation']}
                                className="space-y-5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                                    Correo electrónico
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={email}
                                                    readOnly
                                                    autoComplete="email"
                                                    className="h-11 border-slate-300 bg-slate-50 cursor-not-allowed"
                                                />
                                                <InputError message={errors.email} />
                                            </div>
                                            <div>
                                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                                    Nueva contraseña
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    autoFocus
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                                                />
                                                <InputError message={errors.password} />
                                            </div>
                                            <div>
                                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                                                    Confirmar contraseña
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    name="password_confirmation"
                                                    required
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                                                disabled={processing}
                                                data-test="reset-password-button"
                                            >
                                                {processing && <Spinner className="mr-2" />}
                                                Restablecer contraseña
                                            </Button>
                                        </div>
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
