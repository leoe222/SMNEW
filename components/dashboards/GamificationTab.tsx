import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GamificationTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Gamificación</CardTitle>
          <CardDescription>
            Desbloquea logros y mantén tu motivación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Aquí encontrarás tu progreso gamificado, badges, logros y desafíos para mantener tu motivación en el desarrollo de skills.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
