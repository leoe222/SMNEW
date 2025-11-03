# Configuración de Supabase

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Guarda la URL del proyecto y la anon key

## 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
\`\`\`

## 3. Ejecutar el esquema SQL

1. Ve al SQL Editor en tu proyecto de Supabase
2. **Primero ejecuta** el archivo `supabase-schema.sql`
3. **Luego ejecuta** el archivo `debug-database.sql` para diagnosticar y corregir problemas
4. **Después ejecuta** el archivo `fix-rls-policies.sql` para corregir políticas RLS
5. **Finalmente ejecuta** el archivo `fix-profile-trigger.sql` para corregir el trigger de perfiles
6. Ejecuta los scripts en orden

## 4. Configurar autenticación

1. Ve a Authentication > Settings en tu proyecto de Supabase
2. Configura las URLs de redirección:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/login`
   - `http://localhost:3000/register`

## 5. Verificar configuración

1. Ejecuta `npm run dev`
2. Ve a `http://localhost:3000`
3. Deberías ser redirigido a `/login`
4. Prueba crear una cuenta y hacer login

## Estructura de la base de datos

### Tablas creadas:
- `profiles` - Perfiles de usuario (con rol)
- `skills` - Habilidades técnicas
- `competencies` - Competencias blandas
- `skill_categories` - Categorías de habilidades
- `competency_categories` - Categorías de competencias

### Roles disponibles:
- `designer` - Diseñador
- `leader` - Líder
- `head_chapter` - Jefe de capítulo
- `admin` - Administrador (no disponible en registro)

### Políticas de seguridad (RLS):
- Usuarios solo pueden ver/editar sus propios datos
- Categorías son de solo lectura para usuarios autenticados
- Triggers automáticos para crear perfiles y actualizar timestamps

## Solución de problemas

### Error "Database error saving new user"
Si encuentras este error:
1. Ejecuta el archivo `debug-database.sql` en el SQL Editor
2. Este script diagnosticará y corregirá automáticamente:
   - Verificación del enum `user_role`
   - Verificación de la columna `role` en la tabla `profiles`
   - Recreación del trigger y función con mejor manejo de errores
   - Verificación de políticas RLS

### Error al obtener perfil de usuario
Si `getCurrentUser` falla al obtener el perfil:
1. Ejecuta el archivo `fix-rls-policies.sql` en el SQL Editor
2. Ejecuta el archivo `fix-profile-trigger.sql` en el SQL Editor
3. Estos scripts corregirán:
   - Las políticas RLS que pueden estar bloqueando el acceso
   - El trigger de creación de perfiles que puede no estar funcionando
   - Crearán perfiles manualmente para usuarios existentes sin perfil

### Perfiles no se crean automáticamente
Si los perfiles no se crean al registrar usuarios:
1. Ejecuta el archivo `fix-profile-trigger.sql` en el SQL Editor
2. Este script:
   - Recreará el trigger con mejor manejo de errores
   - Creará perfiles para usuarios existentes sin perfil
   - Verificará que todo esté funcionando correctamente

### Verificar configuración manual
Para verificar que todo está funcionando:
\`\`\`sql
-- Verificar que el enum existe
SELECT * FROM pg_type WHERE typname = 'user_role';

-- Verificar que la tabla profiles tiene la columna role
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';

-- Verificar que el trigger existe
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Verificar que la función existe
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verificar usuarios sin perfil
SELECT u.id, u.email 
FROM auth.users u 
LEFT JOIN profiles p ON u.id = p.id 
WHERE p.id IS NULL;
\`\`\`

### Logs de depuración
El código ahora incluye logs detallados. Revisa la consola del servidor para ver:
- Intentos de registro
- Respuestas de Supabase
- Errores detallados
- Confirmación de creación de usuario
- Intentos de obtener usuario actual
- Errores de acceso a perfiles
- Detalles de errores RLS
- Creación manual de perfiles
