"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signUp } from "@/lib/actions/auth"
import { toast } from "sonner"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await signUp(data)

        if (result?.error) {
          toast.error(result.error)
        } else if (result?.success && result?.redirect) {
          toast.success("Cuenta creada exitosamente. Revisa tu email para confirmar.")

          // Pequeño delay para asegurar que el toast se muestre
          setTimeout(() => {
            router.push(result.redirect)
          }, 100)
        }
      } catch {
        toast.error("Error inesperado al crear la cuenta")
      }
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Completa los datos para crear tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="firstName"
                placeholder="Tu nombre"
                {...register("firstName")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
              />
              {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                id="lastName"
                placeholder="Tu apellido"
                {...register("lastName")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
              />
              {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
            />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              id="role"
              {...register("role")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
            >
              <option value="">Selecciona tu rol</option>
              <option value="designer">Designer</option>
              <option value="leader">Leader</option>
              <option value="head_chapter">Head Chapter</option>
            </select>
            {errors.role && <p className="text-destructive text-sm mt-1">{errors.role.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || isPending}>
            {isSubmitting || isPending ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
