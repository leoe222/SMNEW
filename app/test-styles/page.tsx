import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Prueba de Estilos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Botones */}
          <Card>
            <CardHeader>
              <CardTitle>Botones</CardTitle>
              <CardDescription>Prueba de diferentes variantes de botones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>Botón Default</Button>
              <Button variant="destructive">Botón Destructive</Button>
              <Button variant="outline">Botón Outline</Button>
              <Button variant="secondary">Botón Secondary</Button>
              <Button variant="ghost">Botón Ghost</Button>
              <Button variant="link">Botón Link</Button>
            </CardContent>
          </Card>

          {/* Colores */}
          <Card>
            <CardHeader>
              <CardTitle>Colores del Sistema</CardTitle>
              <CardDescription>Variables CSS de shadcn/ui</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-12 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                Primary
              </div>
              <div className="h-12 bg-secondary rounded-md flex items-center justify-center text-secondary-foreground">
                Secondary
              </div>
              <div className="h-12 bg-accent rounded-md flex items-center justify-center text-accent-foreground">
                Accent
              </div>
              <div className="h-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Muted
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de colores */}
        <Card>
          <CardHeader>
            <CardTitle>Paleta de Colores</CardTitle>
            <CardDescription>Colores del sistema de diseño</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="h-20 bg-red-500 rounded-md flex items-center justify-center text-white font-medium">
                Red-500
              </div>
              <div className="h-20 bg-[#003366] rounded-md flex items-center justify-center text-white font-medium">
                LATAM Navy
              </div>
              <div className="h-20 bg-green-500 rounded-md flex items-center justify-center text-white font-medium">
                Green-500
              </div>
              <div className="h-20 bg-[#FF6B35] rounded-md flex items-center justify-center text-white font-medium">
                LATAM Coral
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
