import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { Buffer } from "buffer"
import { createAdminClient } from "@/lib/supabase/admin"

export const runtime = "nodejs"

const AVATAR_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET || "avatars"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const userId = formData.get("userId")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 })
    }

    if (typeof userId !== "string" || userId.length === 0) {
      return NextResponse.json({ error: "Usuario inválido" }, { status: 400 })
    }

    const fileSize = file.size
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (fileSize > maxSize) {
      return NextResponse.json({ error: "La imagen debe pesar menos de 2 MB" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 })
    }

  const supabase = createAdminClient()

  // Ensure bucket exists (idempotent)
  const { error: bucketError } = await supabase.storage.getBucket(AVATAR_BUCKET)
    if (bucketError && bucketError.message?.toLowerCase().includes("not found")) {
      const { error: createBucketError } = await supabase.storage.createBucket(AVATAR_BUCKET, {
        public: true,
        fileSizeLimit: `${maxSize}`,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      })
      if (createBucketError) {
        console.error("Error al crear bucket de avatars", createBucketError)
        return NextResponse.json({ error: "No se pudo preparar el almacenamiento" }, { status: 500 })
      }
    } else if (bucketError) {
      console.error("Error al verificar bucket de avatars", bucketError)
      return NextResponse.json({ error: "No se pudo acceder al almacenamiento" }, { status: 500 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extension = file.name.split(".").pop()?.toLowerCase() || "png"
    const fileName = `${userId}/${randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Error al subir avatar", uploadError)
      return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Error inesperado subiendo avatar", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
