# 🔧 Configuración de Variables de Entorno - REQUERIDO

## ⚠️ PASO OBLIGATORIO PARA HACER FUNCIONAR LA APLICACIÓN

La aplicación necesita conectarse a Supabase para funcionar. Actualmente **NO PUEDES INICIAR SESIÓN** porque faltan las variables de entorno.

### 📋 Pasos para configurar:

#### 1. Obtener credenciales de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a **Settings** → **API**
4. Copia estos valores:

```bash
# Project URL (ejemplo: https://abcdefgh.supabase.co)
NEXT_PUBLIC_SUPABASE_URL=

# anon public key (eyJhbGciOiJIUzI1NiIs...)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# service_role secret key (eyJhbGciOiJIUzI1NiIs...)  
SUPABASE_SERVICE_ROLE_KEY=

# Bucket para avatares (normalmente "avatars")
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET=avatars
```

#### 2. Configurar archivo .env.local

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza `your_supabase_project_url` con tu URL real
3. Reemplaza `your_supabase_anon_key` con tu clave anónima real
4. Reemplaza `your_supabase_service_role_key` con tu clave de servicio real

**Ejemplo de .env.local correcto:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-real.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET=avatars
```

#### 3. Reiniciar el servidor de desarrollo

```bash
# Detener el servidor (Ctrl+C si está corriendo)
# Luego ejecutar:
npm run dev
```

#### 4. Para Vercel (Producción)

1. Ve a tu proyecto en Vercel Dashboard  
2. **Settings** → **Environment Variables**
3. Agrega las mismas 4 variables
4. Selecciona **Production**, **Preview** y **Development**
5. **Redeploy** el proyecto

### 🔍 Verificar configuración

Después de configurar, puedes verificar que funciona:
1. Ve a http://localhost:3000/api/debug/env
2. Debería mostrar `hasUrl: true` y `hasKey: true`

### ❌ Errores comunes:

- **"URL and Key are required"** → Variables no configuradas
- **"Invalid URL"** → URL incorrecta (debe empezar con https://)
- **"Invalid JWT"** → Clave incorrecta o copiada mal

### 📞 ¿Necesitas ayuda?

Si no tienes acceso a Supabase o necesitas ayuda:
1. Contacta al administrador del proyecto
2. O crea un nuevo proyecto en Supabase siguiendo `SUPABASE_SETUP.md`

---

**⚠️ IMPORTANTE: Sin estas variables, la aplicación NO funcionará en local ni en producción.**