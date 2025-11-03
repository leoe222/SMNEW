import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Target, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
// testeo commit Diego
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Skill Matrix</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            Gestión de Competencias Profesionales
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Desarrolla y gestiona tus <span className="text-[#003366]">habilidades</span> profesionales
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Una plataforma integral para evaluar, desarrollar y hacer seguimiento de las competencias de tu equipo o las
            tuyas propias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
                Comenzar Gratis
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
              >
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Características principales</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar el desarrollo profesional
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#003366]/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#003366]" />
              </div>
              <CardTitle>Gestión de Equipos</CardTitle>
              <CardDescription>Administra las habilidades de todo tu equipo desde un solo lugar</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Perfiles individuales de competencias</li>
                <li>• Evaluaciones 360°</li>
                <li>• Reportes de equipo</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <CardTitle>Planes de Desarrollo</CardTitle>
              <CardDescription>Crea planes personalizados para el crecimiento profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Objetivos SMART</li>
                <li>• Seguimiento de progreso</li>
                <li>• Recursos de aprendizaje</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-[#003366]/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[#003366]" />
              </div>
              <CardTitle>Análisis y Métricas</CardTitle>
              <CardDescription>Visualiza el progreso con dashboards intuitivos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gráficos de competencias</li>
                <li>• Tendencias de crecimiento</li>
                <li>• Comparativas de equipo</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#003366] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">¿Listo para potenciar tu desarrollo profesional?</h3>
            <p className="text-blue-100 mb-8 text-lg">
              Únete a miles de profesionales que ya están usando Skill Matrix para acelerar su crecimiento.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">
                Comenzar Ahora
                <Star className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-[#003366] rounded flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Skill Matrix</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 Skill Matrix. Desarrolla tu potencial profesional.</p>
        </div>
      </footer>
    </div>
  )
}
