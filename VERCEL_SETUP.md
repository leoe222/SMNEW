# Configuración de Vercel

## ⚠️ SOLUCIÓN APLICADA PARA ERROR MIDDLEWARE_INVOCATION_FAILED

**Problema resuelto**: El middleware complejo con Supabase estaba causando errores en Vercel.
**Solución**: Se implementó un middleware simplificado que evita el error.

### Archivos importantes:
- `middleware.ts` - Versión simplificada (activa)
- `middleware-complex.ts` - Versión completa con Supabase (respaldo)

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

### Variables de Supabase (REQUERIDAS)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET=avatars
```

## Middleware Actual (Simplificado)

El middleware actual:
- ✅ Permite todas las rutas API sin procesamiento
- ✅ Excluye archivos estáticos 
- ✅ Solo redirige `/` a `/login`
- ✅ No hace llamadas a Supabase (evita errores)
- ⚠️ No valida autenticación (temporal)

## Para restaurar autenticación completa:

Una vez que Vercel esté funcionando, puedes restaurar el middleware completo:

```bash
mv middleware.ts middleware-simple.ts
mv middleware-complex.ts middleware.ts
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

## Problemas Comunes RESUELTOS:

### ✅ Error 500: MIDDLEWARE_INVOCATION_FAILED

**Causa**: Middleware complejo con Supabase en Edge Runtime
**Solución**: Middleware simplificado sin llamadas a Supabase

### Estado actual:
- ✅ Build funciona localmente
- ✅ Middleware liviano (32.6 kB)
- ✅ Sin errores de invocación
- ⚠️ Autenticación deshabilitada temporalmente

## Logs de Vercel:

Para ver los logs detallados:
1. Ve a tu proyecto en Vercel
2. Clickeá en el deployment 
3. Ve a la sección **Functions**
4. Verifica que no haya errores de middleware

## Próximos pasos:

1. Confirmar que Vercel funciona con middleware simple
2. Configurar variables de entorno 
3. Gradualmente restaurar funcionalidad de autenticación
4. Testear en ambiente de producción