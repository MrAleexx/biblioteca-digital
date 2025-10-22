<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/**
 * Controlador de la página principal (landing page)
 * 
 * Gestiona la vista pública de bienvenida del sistema.
 * Muestra información sobre la biblioteca digital y
 * opciones de registro si están habilitadas.
 * 
 * @package App\Http\Controllers
 * @author Sistema Biblioteca Digital
 * @version 1.0.0
 */
class HomeController extends Controller
{
    /**
     * Mostrar página de bienvenida
     * 
     * Renderiza la landing page pública del sistema.
     * Pasa configuración de si el registro está habilitado
     * para mostrar/ocultar botón de "Crear cuenta".
     * 
     * @return \Inertia\Response Vista de bienvenida
     */
    public function index()
    {
        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
