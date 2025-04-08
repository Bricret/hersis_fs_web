# Hersis FS Web

<div align="center">
  <img src="public/onlylogo.png" alt="Farmacia Los Ángeles Logo" width="500"/>
</div>

Sistema de gestión integral para Farmacia Los Ángeles, diseñado para optimizar y automatizar los procesos de inventario, ventas, facturación y administración de la farmacia. Esta plataforma permite un control eficiente del stock de medicamentos, gestión de ventas, seguimiento de prescripciones y generación de reportes detallados.

## Descripción

Hersis FS Web es una aplicación web moderna desarrollada con Next.js 15, diseñada para proporcionar una interfaz de usuario robusta y eficiente. El proyecto implementa una arquitectura limpia y modular, siguiendo las mejores prácticas de desarrollo.

## Características Principales

- 🚀 Desarrollado con Next.js 15 y React 19
- 🎨 UI moderna con Tailwind CSS y componentes Radix UI
- 📊 Visualización de datos con Chart.js y Recharts
- 🔒 Gestión de estado con Zustand
- 📝 Formularios avanzados con React Hook Form y Zod
- 🌙 Soporte para tema claro/oscuro
- 📱 Diseño responsive
- 🔍 Búsqueda con debounce
- 📅 Manejo de fechas con date-fns
- 🎭 Animaciones con Lottie

## Estructura del Proyecto

```
hersis_fs_web/
├── app/                 # Páginas y rutas de Next.js
├── core/               # Lógica de negocio central
├── infraestructure/    # Configuraciones y servicios externos
├── presentation/       # Componentes de UI y lógica de presentación
├── public/            # Archivos estáticos
└── resources/         # Recursos adicionales
```

## Requisitos Previos

- Node.js (versión LTS recomendada)
- pnpm (gestor de paquetes)

## Instalación

1. Clonar el repositorio:

```bash
git clone [URL_DEL_REPOSITORIO]
cd hersis_fs_web
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo con Turbopack
- `pnpm build`: Construye la aplicación para producción
- `pnpm start`: Inicia el servidor de producción
- `pnpm lint`: Ejecuta el linter

## Tecnologías Principales

- **Framework**: Next.js 15
- **UI**: Tailwind CSS, Radix UI
- **Estado**: Zustand
- **Formularios**: React Hook Form, Zod
- **Visualización**: Chart.js, Recharts
- **Utilidades**: date-fns, js-cookie
- **Desarrollo**: TypeScript, ESLint, Biome

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y todos los derechos están reservados.

## Soporte

Para soporte, por favor contacta al equipo de desarrollo.
