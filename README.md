Cuidarte+ | Frontend (Interfaz de Usuario)
Este repositorio contiene la interfaz de usuario del sistema Cuidarte+. Implementado como una Single Page Application (SPA), está diseñado para proporcionar una herramienta de gestión robusta y estructurada para pacientes, médicos y administradores del centro de salud.

Tecnologías Utilizadas
Core: React 18 con TypeScript

Herramienta de Construcción: Vite

Enrutamiento: React Router DOM

Estilos y Componentes: Material-UI (MUI) v5

Peticiones HTTP: Axios (con interceptores para manejo de JWT)

Iconografía: MUI Icons Material

Funcionalidades Principales
Interfaz Institucional: Sistema de diseño basado en MUI con la paleta de colores corporativa estrictamente definida (Azul Petróleo #064e64 y Verde Esmeralda #008763).

Dashboards Dinámicos: Paneles de inicio modulares que exponen estadísticas e indicadores del sistema dependiendo de los permisos del usuario en sesión.

Gestión de Perfiles Clínicos: Formularios estructurados para la creación y edición de fichas de pacientes.

Visualización de Historial Médico: Componentes de interfaz (acordeones y tablas) para la revisión de antecedentes y descarga directa de documentación clínica.

Protección de Rutas: Sistema de enrutamiento privado que valida el token JWT del cliente antes de conceder acceso a las vistas administrativas.

Configuración de Entorno
Se requiere crear un archivo .env en el directorio raíz del proyecto con la siguiente estructura para establecer la conexión con la API:

Fragmento de código
VITE_API_URL=http://localhost:3000/api
Despliegue y Ejecución
Instalar las dependencias del proyecto:

Bash
npm install
Iniciar el servidor de desarrollo:

Bash
npm run dev
