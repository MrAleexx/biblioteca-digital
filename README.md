# 📚 Sistema de Biblioteca Digital

> Sistema completo de gestión de biblioteca digital con catálogo de libros, autenticación por roles, y preparación para e-commerce y préstamos físicos.

## 🚀 Estado del Proyecto

✅ **Fase 1 Completa:** Gestión CRUD de libros operativa  
🔄 **Fase 2 En Progreso:** Formularios de creación/edición  
⏳ **Fase 3 Pendiente:** Sistema de préstamos y e-commerce

## ⚡ Quick Start

```bash
# Instalar dependencias
composer install && npm install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Base de datos
php artisan migrate:fresh --seed

# Iniciar
npm run dev
php artisan serve
```

**URL:** http://localhost:8000

## 🔐 Credenciales de Prueba

```
Admin: admin@biblioteca.com / admin123
Bibliotecario: bibliotecario@biblioteca.com / biblio123
Usuario: usuario@ejemplo.com / user123
```

## 📖 Funcionalidades Actuales

- ✅ Autenticación con roles (admin, bibliotecario, usuario)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Catálogo de 25 libros con datos realistas
- ✅ Filtros avanzados (búsqueda, categoría, estado)
- ✅ Paginación (10 libros por página)
- ✅ Modal de detalles completos
- ✅ Control de acceso por rol
- ✅ Backend CRUD completo documentado

## 🛠️ Stack Tecnológico

- **Backend:** Laravel 12 + PHP 8.2
- **Frontend:** React 18 + TypeScript + Inertia.js
- **Estilos:** Tailwind CSS 4 + Shadcn/ui
- **Base de Datos:** MySQL 8.0
- **Autenticación:** Laravel Fortify (2FA)

## 📁 Estructura del Proyecto

```
app/
├── Http/Controllers/
│   └── BookController.php        # CRUD completo documentado
└── Models/
    ├── Book.php                  # Modelo principal
    ├── Category.php
    └── ...

database/
├── migrations/                   # 10 tablas creadas
└── seeders/                      # 25 libros de prueba

resources/js/
├── components/
│   ├── app-sidebar.tsx
│   └── book-details-modal.tsx    # Modal de detalles
└── pages/
    ├── dashboard.tsx
    └── books/
        └── index.tsx             # Gestión de libros
```

## 📚 Documentación Completa

**Ver:** [DOCUMENTATION.md](./DOCUMENTATION.md)

Incluye:
- Arquitectura detallada del sistema
- Estructura completa de la base de datos
- Flujo de datos explicado
- Convenciones de código
- Guía para desarrolladores
- Roadmap de funcionalidades pendientes

## 🗄️ Base de Datos (10 tablas)

1. **books** - Tabla central con 24 columnas
2. **book_contributors** - Autores, editores, traductores
3. **book_category** - Relación muchos a muchos
4. **book_details** - Metadatos extendidos
5. **categories** - Categorías jerárquicas
6. **publishers** - Editoriales
7. **languages** - Idiomas
8. **contacts** - Formulario contacto
9. **claims** - Sistema de reclamos
10. **users** - Usuarios con roles

## 📝 Tareas Pendientes

### Prioridad Alta 🔴
- [ ] Formulario Crear Libro (Frontend)
- [ ] Formulario Editar Libro (Frontend)
- [ ] Modal de confirmación de eliminación

### Prioridad Media 🟡
- [ ] Sistema de préstamos físicos
- [ ] E-commerce para libros premium
- [ ] Control de descargas (5/día)

### Prioridad Baja 🟢
- [ ] Vista previa de PDF
- [ ] Sistema de calificaciones
- [ ] Notificaciones por email

## 🔗 Rutas Principales

```
GET  /dashboard            # Vista general con estadísticas
GET  /books                # Gestión de libros (admin/bibliotecario)
POST /books                # Crear libro
GET  /books/{id}/edit      # Editar libro
PUT  /books/{id}           # Actualizar libro
DELETE /books/{id}         # Eliminar libro (soft delete)
```

## 👥 Colaboradores

- **Desarrollador Principal:** Sistema Biblioteca Digital
- **Última actualización:** 21 de Octubre de 2025
- **Versión:** 1.0.0

## 📄 Licencia

Este proyecto es privado y está en desarrollo activo.

---

**Repositorio:** github.com/MrAleexx/biblioteca-digital  
**Branch Actual:** `dev`

