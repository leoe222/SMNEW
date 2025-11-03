import Link from "next/link"
import RegisterForm from "@/components/forms/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Crear cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-medium text-[#FF6B35] hover:text-[#E55A2B]">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}
