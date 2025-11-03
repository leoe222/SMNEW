import Link from "next/link"
import LoginForm from "@/components/forms/LoginForm"
import FeatureCard from "@/components/ui/FeatureCard"
import { loginFeatures } from "@/lib/data/features"

export default function LoginPage() {
  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/images/login-background.png)",
        }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4 drop-shadow-lg">Skill Matrix UX LATAM</h1>
            <p className="text-lg text-white/90 drop-shadow-md">
              Gestiona tus habilidades y competencias profesionales
            </p>
          </div>

          {/* Login Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="font-medium text-[#FF6B35] hover:text-[#E55A2B]">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>

                <LoginForm />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {loginFeatures.map((feature, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                <FeatureCard
                  title={feature.title}
                  icon={feature.icon}
                  color={feature.color}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
