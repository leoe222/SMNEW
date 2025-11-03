# Skill Matrix

Una aplicación web para gestionar y evaluar habilidades de Product Designers, permitiendo autoevaluaciones, aprobaciones por líderes y seguimiento del progreso del equipo.

## 🚀 Características

- **Autenticación**: Sistema de login/registro con Supabase
- **Roles**: Designer, Leader, Head Chapter, Admin
- **Autoevaluaciones**: Los designers pueden evaluar sus skills
- **Aprobaciones**: Los líderes pueden aprobar/rechazar evaluaciones
- **Dashboard**: Vistas personalizadas por rol
- **Perfiles**: Gestión de información personal y líderes asignados
- **Estadísticas**: Seguimiento del progreso del equipo

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Formularios**: React Hook Form, Zod
- **Notificaciones**: Sonner
- **Iconos**: Lucide React

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

## 🚀 Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone <url-del-repositorio>
cd skill-matrix
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Supabase

#### 3.1 Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda la URL y anon key del proyecto

#### 3.2 Configurar la base de datos

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Copia y pega todo el contenido del archivo `complete-schema.sql`
3. Ejecuta el script completo
4. Verifica que las tablas se crearon correctamente

#### 3.3 Configurar autenticación

1. Ve a **Authentication > Settings** en Supabase
2. En **Site URL**, agrega: `http://localhost:3000`
3. En **Redirect URLs**, agrega:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`

### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
\`\`\`

### 5. Ejecutar el proyecto

\`\`\`bash
npm run dev
\`\`\`

El proyecto estará disponible en `http://localhost:3000`

## 👥 Roles y Funcionalidades

### Designer
- **Dashboard**: Ver progreso personal y estadísticas
- **Autoevaluación**: Evaluar 8 skills de diseño
- **Perfil**: Actualizar información personal y líder asignado
- **Overview**: Ver progreso de skills aprobadas

### Leader
- **Dashboard**: Estadísticas del equipo
- **Miembros**: Ver lista de designers asignados
- **Evaluaciones**: Aprobar/rechazar autoevaluaciones
- **Estadísticas**: Progreso promedio del equipo

### Head Chapter
- **Dashboard**: Vista general de todos los equipos
- **Gestión**: Administrar líderes y designers
- **Reportes**: Estadísticas globales

### Admin
- **Gestión completa**: Todas las funcionalidades
- **Skills**: Agregar/editar skills del sistema
- **Usuarios**: Gestión completa de usuarios

## 🗂️ Estructura del Proyecto

\`\`\`
skill-matrix/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── login/            # Página de login
│   │   ├── register/         # Página de registro
│   │   ├── profile/          # Página de perfil
│   │   └── layout.tsx        # Layout principal
│   ├── components/
│   │   ├── ui/              # Componentes de Shadcn/ui
│   │   ├── forms/           # Formularios reutilizables
│   │   └── dashboards/      # Dashboards por rol
│   ├── lib/
│   │   ├── actions/         # Server Actions
│   │   ├── supabase/        # Configuración de Supabase
│   │   ├── schemas/         # Esquemas de Zod
│   │   └── types/           # Tipos de TypeScript
│   └── middleware.ts        # Middleware de autenticación
├── complete-schema.sql      # Esquema completo de BD
└── README.md               # Este archivo
\`\`\`

## 🔧 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
\`\`\`

## 🗄️ Base de Datos

### Tablas Principales

#### `profiles`
- Información de usuarios
- Roles y relaciones jerárquicas
- Datos personales

#### `skills`
- Skills/categorías evaluables
- Organizadas por categoría
- Descripciones detalladas

#### `skill_assessments`
- Evaluaciones de skills
- Estados: pending, approved, rejected
- Justificaciones y evidencias

### Funciones Automáticas

- **Creación automática de perfiles** al registrarse
- **Actualización de timestamps** automática
- **Timestamps de aprobación/rechazo** automáticos
- **Estadísticas del equipo** para líderes

## 🔐 Seguridad

### Row Level Security (RLS)
- **Profiles**: Usuarios solo ven su propio perfil
- **Skills**: Todos pueden ver, solo admins pueden gestionar
- **Assessments**: Usuarios ven sus evaluaciones, líderes ven su equipo

### Políticas de Acceso
- **Designers**: Acceso a su perfil y evaluaciones
- **Leaders**: Acceso a su equipo y evaluaciones pendientes
- **Head Chapters**: Acceso a todos los perfiles y evaluaciones
- **Admins**: Acceso completo al sistema

## 🚀 Despliegue

### v0.dev (Recomendado para desarrollo rápido)

1. **Acceder a v0.dev**:
   - Ve a [v0.dev](https://v0.dev)
   - Inicia sesión con tu cuenta de GitHub

2. **Conectar repositorio**:
   - Busca la opción "Import from GitHub"
   - Selecciona tu repositorio: `irio-latam/skill-matrix`
   - v0 detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno**:
   - En v0, ve a la sección de Environment Variables
   - Agrega las siguientes variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   \`\`\`

4. **Configurar Supabase**:
   - Ejecuta el archivo `complete-schema.sql` en tu proyecto Supabase
   - Actualiza las Site URLs en Supabase Auth Settings para incluir tu dominio de v0

5. **Desplegar**:
   - v0 desplegará automáticamente tu aplicación
   - Obtendrás una URL pública para acceder a tu Skill Matrix

### Vercel (Recomendado para producción)

1. **Conectar repositorio** a Vercel
2. **Configurar variables de entorno**:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=tu_url_produccion
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_produccion
   \`\`\`
3. **Desplegar** automáticamente

### Otros proveedores

- **Netlify**: Similar a Vercel
- **Railway**: Soporte completo para Next.js
- **DigitalOcean App Platform**: Fácil despliegue

## 🔧 Configuración de Producción

### Supabase

1. **Actualizar Site URL** en Authentication Settings
2. **Agregar dominio de producción** en Redirect URLs
3. **Configurar RLS** si es necesario
4. **Revisar políticas de seguridad**

### Variables de Entorno

\`\`\`env
# Desarrollo
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Producción
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-prod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-prod
\`\`\`

## 🐛 Solución de Problemas

### Error de cookies de Supabase
- Verificar configuración de middleware
- Revisar variables de entorno
- Comprobar políticas RLS

### Error de autenticación
- Verificar redirect URLs en Supabase
- Comprobar configuración de Auth
- Revisar middleware de autenticación

### Error de base de datos
- Ejecutar `complete-schema.sql` completo
- Verificar políticas RLS
- Comprobar triggers y funciones

## 📝 Notas de Desarrollo

### Convenciones
- **Server Components**: Para datos y renderizado
- **Client Components**: Para interactividad
- **Server Actions**: Para mutaciones de datos
- **TypeScript**: Tipado estricto en todo el proyecto

### Mejores Prácticas
- **Componentes reutilizables**: Shadcn/ui
- **Validación**: Zod para esquemas
- **Formularios**: React Hook Form
- **Estado**: Server Components cuando sea posible

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de Supabase

---

**¡Listo para usar!** 🎉
