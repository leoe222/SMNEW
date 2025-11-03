"use client"

import { useState, useEffect, useRef, useCallback, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { updateProfile, getLeadersByRole } from "@/lib/actions/profile"
import { profileSchema, type ProfileFormData, type UserProfile, type Leader } from "@/lib/schemas/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileFormProps {
  initialData: UserProfile
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar_url || "")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const getInitials = (first: string, last: string, email?: string) => {
    const firstInitial = first?.trim()?.charAt(0)
    const lastInitial = last?.trim()?.charAt(0)
    const combined = `${firstInitial || ""}${lastInitial || ""}`
    if (combined) return combined.toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return "?"
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialData?.first_name || "",
      lastName: initialData?.last_name || "",
      leaderId: initialData?.leader_id || "none",
      squad: initialData?.squad || "",
      avatarUrl: initialData?.avatar_url || "",
    },
  })

  const currentLeaderId = watch("leaderId")
  const watchedFirstName = watch("firstName")
  const watchedLastName = watch("lastName")

  useEffect(() => {
    const loadLeaders = async () => {
      try {
        const leadersData = await getLeadersByRole(initialData.role)
        setLeaders(leadersData)

        // Establecer el líder correcto después de cargar los datos
        if (initialData?.leader_id) {
          setValue("leaderId", initialData.leader_id)
        }
      } catch (error) {
        console.error("Error al cargar líderes:", error)
        toast.error("Error al cargar los líderes disponibles")
      }
    }

    loadLeaders()
  }, [initialData.role, initialData.leader_id, setValue])

  const uploadAvatar = useCallback(
    async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", initialData.id)

      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || "No se pudo subir la imagen")
      }

      const data = (await response.json()) as { url: string }
      if (!data?.url) {
        throw new Error("Respuesta inválida del servidor")
      }

      return data.url
    },
    [initialData.id]
  )

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 2 MB")
      return
    }

    setAvatarUploading(true)
    try {
      const publicUrl = await uploadAvatar(file)
      setAvatarPreview(publicUrl)
      setValue("avatarUrl", publicUrl, { shouldDirty: true })
      toast.success("Foto de perfil actualizada")
    } catch (error) {
      console.error("Error inesperado al subir avatar:", error)
      const message = error instanceof Error ? error.message : "Ocurrió un error al subir la imagen"
      toast.error(message)
    } finally {
      setAvatarUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleAvatarRemove = () => {
    setAvatarPreview("")
    setValue("avatarUrl", "", { shouldDirty: true })
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data)

      if (result.success) {
        toast.success("Perfil actualizado exitosamente")
        router.refresh()
      } else {
        toast.error(result.error || "Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      toast.error("Error al actualizar el perfil")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <input type="hidden" {...register("avatarUrl")} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-gray-100 shadow-sm">
              {avatarPreview && <AvatarImage src={avatarPreview} alt="Foto de perfil" referrerPolicy="no-referrer" />}
              <AvatarFallback className="text-lg font-medium text-gray-600 bg-gray-100">
                {getInitials(watchedFirstName || initialData?.first_name || "", watchedLastName || initialData?.last_name || "", initialData?.email)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Foto de perfil</p>
            <p className="text-xs text-gray-500">Formatos PNG o JPG. Tamaño máximo 2 MB.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
              >
                {avatarUploading ? "Subiendo..." : avatarPreview ? "Cambiar foto" : "Subir foto"}
              </Button>
              {avatarPreview && !avatarUploading && (
                <Button type="button" variant="ghost" onClick={handleAvatarRemove} className="text-sm text-red-600">
                  Quitar foto
                </Button>
              )}
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="bg-[#003366]/10 border border-[#003366]/20 rounded-lg p-4">
        <p className="text-sm text-[#003366]">
          <strong>Email:</strong> {initialData?.email}
        </p>
        <p className="text-xs text-[#003366]/70 mt-1">
          El email no se puede modificar desde aquí. Contacta al administrador si necesitas cambiarlo.
        </p>
      </div>

      <div>
        <label htmlFor="squad" className="block text-sm font-medium text-gray-700 mb-1">
          Squad
        </label>
        <input
          id="squad"
          placeholder="Ej: Alpha, Delta, Transversal"
          {...register("squad")}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
        />
        {errors.squad && <p className="text-destructive text-sm mt-1">{errors.squad.message}</p>}
        <p className="text-xs text-gray-500 mt-1">Puedes cambiar tu squad libremente.</p>
      </div>

      <div>
        <label htmlFor="leaderId" className="block text-sm font-medium text-gray-700 mb-1">
          {initialData?.role === "designer"
            ? "Líder"
            : initialData?.role === "leader"
              ? "Head Chapter"
              : initialData?.role === "head_chapter"
                ? "Administrador"
                : "Supervisor"}
        </label>
        <select
          id="leaderId"
          {...register("leaderId")}
          value={currentLeaderId}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#003366] focus:border-[#003366]"
        >
          <option value="none">Sin líder asignado</option>
          {leaders.map((leader) => (
            <option key={leader.id} value={leader.id}>
              {leader.firstName} {leader.lastName}
            </option>
          ))}
        </select>
        {errors.leaderId && <p className="text-destructive text-sm mt-1">{errors.leaderId.message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className={!isDirty ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isSubmitting ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  )
}
