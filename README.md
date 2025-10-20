
### Guía de Instalación del Proyecto

Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

#### 1\. Requisitos Previos

Asegúrate de tener instalado lo siguiente:

  * **PHP** (versión 8.2 o superior)
  * **Composer**
  * **Node.js** y **npm** (o **Yarn**)
  * **Git**

#### 2\. Clonar el Repositorio

Abre una terminal y clona el repositorio de GitHub:

```bash
git clone https://github.com/MrAleexx/biblioteca-digital.git
```

Navega al directorio del proyecto:

```bash
cd eBooks-A-T
```

#### 3\. Instalar Dependencias

**Instalar dependencias de PHP (vendor):**
Usa Composer para instalar todas las librerías de PHP listadas en `composer.json`.

```bash
composer install
```

**Instalar dependencias de JavaScript (node\_modules):**
Usa npm para instalar los paquetes de Node.js.

```bash
npm install
```

#### 4\. Configuración del Entorno

**Copia el archivo de entorno:**
Crea el archivo `.env` a partir del archivo de ejemplo.

```bash
cp .env.example .env
```

**Genera la clave de la aplicación:**
Ejecuta el siguiente comando para generar una clave de cifrado única para la aplicación.

```bash
php artisan key:generate
```

Asegúrate de configurar la conexión a tu base de datos en el archivo `.env`.

#### 5\. Compilar los Assets

Una vez que las dependencias de Node.js estén instaladas, compila los archivos CSS y JavaScript para que estén listos para su uso en producción.

```bash
npm run build
```

Si estás en un entorno de desarrollo, puedes usar el siguiente comando para recompilar automáticamente cada vez que hagas un cambio en los archivos fuente:

```bash
npm run dev
```

#### 6\. Ejecutar Migraciones y Seeds

Finalmente, ejecuta las migraciones para crear las tablas de la base de datos y, opcionalmente, los seeds para poblar la base de datos con datos de ejemplo.

```bash
php artisan migrate --seed
```

