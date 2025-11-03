import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface HeadChapterDashboardProps {
  user: UserProfile;
}

export default function HeadChapterDashboard({ user }: HeadChapterDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header con emoción */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Globe className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">
            ¡Hola {user.first_name}! 🌍
          </h1>
        </div>
        <p className="text-xl text-gray-600">
          ¡Vista estratégica del desarrollo de competencias en Product Design! 🎯
        </p>
      </div>
      
      {/* Tarjetas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estrategia Global</CardTitle>
            <CardDescription>
              Define la estrategia de desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Establece la estrategia global de desarrollo de competencias en Product Design.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análisis de Competencias</CardTitle>
            <CardDescription>
              Analiza el panorama completo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Analiza las competencias a nivel organizacional y identifica gaps.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gestión de Capítulos</CardTitle>
            <CardDescription>
              Supervisa todos los capítulos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Gestiona y supervisa el desarrollo de competencias en todos los capítulos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
