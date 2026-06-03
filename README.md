# TPO — Librería Online

Aplicación web de e-commerce para una librería. Permite a los usuarios explorar el catálogo de libros, agregar productos al carrito y realizar compras. Incluye un panel de administración para gestionar libros, autores, géneros, editoriales, descuentos, imágenes, usuarios y pedidos.

## Tecnologías

- **React 19** con React Router DOM v6
- **Vite** como bundler
- **Tailwind CSS v4** para estilos
- **Recharts** para gráficos en el dashboard admin
- **SweetAlert2** y **React Toastify** para notificaciones

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | administrator@gmail.com | admin123 |
| Usuario | juan@gmail.com | juan123 |

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación y ejecución

```bash
# 1. Ingresar a la carpeta del cliente
cd Client

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

## Script

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |

-------------------------------------------------------------
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
