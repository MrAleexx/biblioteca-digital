<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador de configuración de apariencia
 * 
 * Gestiona la página de ajustes de tema (claro/oscuro)
 * y preferencias visuales del usuario.
 * 
 * @package App\Http\Controllers\Settings
 * @author Sistema Biblioteca Digital
 * @version 1.0.0
 */
class AppearanceController extends Controller
{
    /**
     * Mostrar página de configuración de apariencia
     * 
     * Renderiza el formulario donde el usuario puede cambiar:
     * - Tema (claro/oscuro/automático)
     * - Preferencias de visualización
     * 
     * @return \Inertia\Response Vista de configuración de apariencia
     */
    public function edit()
    {
        return Inertia::render('settings/appearance');
    }
}
