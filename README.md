# Sistema de Gestión Clínica Cuidarte+ | Cliente Interfaz de Usuario (SPA)

Este repositorio contiene la aplicación cliente (Frontend) del ecosistema Cuidarte+. Construida como una Single Page Application (SPA) utilizando React 18 y TypeScript, la plataforma ofrece una interfaz unificada, asíncrona y reactiva, diseñada para satisfacer las necesidades operativas de administradores, personal médico y pacientes.

## 1. Arquitectura de Interfaz y Lógica de Negocio

La aplicación emplea un patrón de diseño basado en componentes modulares, centralizando el estado de autenticación a través de React Context API (`AuthContext`). Este enfoque permite que toda la aplicación reaccione en tiempo real a los cambios de estado de la sesión, inyectando el perfil del usuario (id, nombre, email, rol) en cualquier nivel del árbol de componentes.

Para asegurar el cumplimiento de la identidad visual exigida por el caso de estudio, se configuró un tema global estricto mediante Material-UI (`createTheme`), forzando el uso de la paleta institucional en todos los componentes de la interfaz, eliminando la necesidad de estilos en línea y garantizando coherencia visual.

* **Color Primario (Institucional):** Azul Petróleo (`#064e64`)
* **Color Secundario (Acciones/Roles):** Verde Esmeralda (`#008763`)

## 2. Trazabilidad de Requisitos del Caso (RF y NFR)

### Cumplimiento de Seguridad Front-End (NFR-SEG)
* **Protección de Rutas (Guards):** Se implementaron componentes de orden superior (HOC) en React Router DOM. Si un usuario intenta acceder a `/audit` (Auditoría) y su payload JWT no contiene el rol `administrador`, el componente intercepta el renderizado y lo redirige forzosamente al Dashboard.
* **Interceptores HTTP (Axios):** Para evitar la inyección manual del token en cada petición, se configuró una instancia global de Axios. Este interceptor captura cada solicitud saliente, recupera el JWT del almacenamiento local y lo inyecta en la cabecera `Authorization: Bearer <token>`, garantizando el acceso seguro a los recursos de la API.
* **Renderizado Condicional RBAC:** La interfaz aplica el Principio de Menor Privilegio visual. Botones de acciones destructivas (Eliminar, Cambiar Rol) y enlaces del menú lateral simplemente no se añaden al DOM si el rol del usuario no tiene los permisos suficientes, previniendo ingeniería inversa básica en el navegador.

### Resolución de Requisitos Funcionales (RF)
* **Dashboard Estadístico:** Se implementó un panel de control asíncrono que consume indicadores en tiempo real desde el backend, permitiendo a la administración visualizar el volumen de pacientes y el estado del flujo de exámenes (Pendientes vs Completados).
* **Ficha Clínica Interactiva (RF-2.3):** Las vistas de perfil de paciente utilizan componentes `Dialog` (Modales) para la edición de datos y registro de nuevos exámenes. Esto permite al médico actualizar la información clínica sin perder el contexto visual del historial del paciente.
* **Descarga de Documentos (BLOB):** El cliente maneja las respuestas binarias (application/pdf) de la API utilizando la API nativa de `Blob` del navegador. Esto permite descargar silenciosamente en segundo plano tanto archivos escaneados físicamente como informes generados dinámicamente en el backend.

## 3. Estructura del Directorio

```text
src/
 ├── api/              # Configuración de Axios e interceptores de seguridad JWT
 ├── components/       # Componentes reutilizables (Sidebar responsivo, Navbar)
 ├── context/          # Proveedores de estado global (AuthContext para sesión de usuario)
 ├── pages/            # Vistas principales (Login, Dashboard, Patients, Audit)
 ├── theme.ts          # Configuración de tipografía, formas y paleta de colores corporativa (MUI)
 └── App.tsx           # Configuración del enrutador y envoltura de contextos
4. Despliegue y Configuración
Para asegurar la correcta comunicación con el servidor de Backend, se debe crear un archivo .env en la raíz del proyecto:

Fragmento de código
VITE_API_URL=http://localhost:3000/api
Comandos de inicialización:

Bash
# 1. Instalación de dependencias del entorno (React, MUI, Axios, React-Router)
npm install

# 2. Transpilación e inicio del servidor de desarrollo optimizado por Vite
npm run dev
