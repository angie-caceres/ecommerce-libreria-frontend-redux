# TPO — Librería Online

Aplicación web de e-commerce para una librería desarrollada con React. Permite a los usuarios explorar el catálogo de libros, agregar productos al carrito y realizar compras. Además, incluye un panel de administración para gestionar libros, autores, géneros, editoriales, descuentos, imágenes, usuarios y pedidos.

## Tecnologías utilizadas

### Frontend

- React 19
- React Router DOM v6
- Redux Toolkit
- Redux Persist
- Axios
- Vite
- Tailwind CSS v4
- Recharts
- SweetAlert2
- React Toastify
- Lucide React

### Arquitectura

El proyecto implementa una arquitectura basada en:

- Componentes reutilizables.
- Gestión de estado global mediante Redux Toolkit.
- Slices independientes por dominio (`libros`, `usuarios`, `ordenes`, `carrito`, `autores`, `géneros`, `editoriales`, `descuentos`, `imágenes` y `auth`).
- Comunicación con la API REST utilizando Axios.
- Persistencia de la sesión del usuario mediante Redux Persist.
- Interceptores de Axios para el envío automático del token JWT y el manejo centralizado de errores.

## Funcionalidades principales

### Usuario

- Registro e inicio de sesión.
- Exploración del catálogo.
- Búsqueda y filtrado de libros.
- Visualización del detalle de un libro.
- Gestión del carrito de compras.
- Confirmación de pedidos.
- Consulta del historial de compras.
- Edición del perfil.

### Administrador

- Dashboard con estadísticas.
- Gestión de libros.
- Gestión de autores.
- Gestión de géneros.
- Gestión de editoriales.
- Gestión de descuentos.
- Gestión de imágenes.
- Gestión de usuarios.
- Gestión de pedidos.

## Credenciales de prueba

| Rol | Email | Contraseña |
|------|-------|------------|
| Administrador | administrator@gmail.com | admin123 |
| Usuario | juan@gmail.com | juan123 |

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
# Clonar el repositorio

# Ingresar al proyecto
cd Client

# Instalar dependencias
npm install

# Ejecutar la aplicación
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| npm run dev | Inicia el servidor de desarrollo |
| npm run build | Genera la versión de producción |
| npm run preview | Ejecuta la versión compilada |
| npm run lint | Ejecuta ESLint |

## Estado global (Redux)

La aplicación utiliza Redux Toolkit para centralizar el estado mediante los siguientes slices:

- `authSlice`
- `librosSlice`
- `usuariosSlice`
- `ordenSlice`
- `carritoSlice`
- `autoresSlice`
- `generosSlice`
- `editorialesSlice`
- `descuentosSlice`
- `imagenesSlice`

Cada slice encapsula:

- Estado.
- Reducers.
- Async Thunks para comunicación con la API.
- Manejo de carga y errores.

## API

El frontend consume una API REST desarrollada en Spring Boot.

Las solicitudes HTTP se realizan mediante Axios y utilizan interceptores para:

- agregar automáticamente el token JWT en cada petición autenticada;
- centralizar el manejo de errores provenientes del backend.

## Autores

Trabajo Práctico Obligatorio — Desarrollo de Software.