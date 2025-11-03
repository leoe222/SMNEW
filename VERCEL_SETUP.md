# Configuración de Vercel

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

### Variables de Supabase (REQUERIDAS)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET=avatars
```

## Pasos para configurar en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Navegá a **Settings** → **Environment Variables**
3. Agregá cada variable con su valor correspondiente
4. Asegurate de seleccionar todos los environments (Production, Preview, Development)
5. Redeploy el proyecto

## Cómo obtener las credenciales de Supabase:

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Settings** → **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## Problemas Comunes:

### Error 500: MIDDLEWARE_INVOCATION_FAILED

Este error generalmente ocurre cuando:
- Las variables de entorno no están configuradas
- Hay un error en la conexión con Supabase
- El middleware no puede acceder a las variables de entorno

### Solución:
1. Verificá que todas las variables de entorno estén configuradas
2. Redeploy después de agregar las variables
3. Revisá los logs de Vercel para más detalles

## Logs de Vercel:

Para ver los logs detallados del error:
1. Ve a tu proyecto en Vercel
2. Clickeá en el deployment que falló
3. Ve a la sección **Functions**
4. Clickeá en cualquier función para ver los logs

## Contacto de Suporte:

Si el problema persiste, verificá:
- Que las credenciales de Supabase sean válidas
- Que el proyecto de Supabase esté activo
- Que no haya restricciones de CORS en Supabase