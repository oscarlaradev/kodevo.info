import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, BarChart3, Wrench, Briefcase } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default function AdminDashboardPage() {
  const features = [
    {
      title: "Gestionar Proyectos",
      description: "Añade, edita y elimina proyectos de tu portafolio.",
      href: "/admin/projects",
      icon: Briefcase,
      cta: "Ir a Proyectos"
    },
    {
      title: "Analíticas",
      description: "Visualiza estadísticas de visitas y rendimiento (Próximamente).",
      href: "#", // Placeholder, no page yet
      icon: BarChart3,
      cta: "Ver Analíticas",
      disabled: true,
    },
    {
      title: "Herramientas SEO",
      description: "Optimiza el SEO de tu portafolio (Próximamente).",
      href: "#", // Placeholder, no page yet
      icon: Wrench,
      cta: "Optimizar SEO",
      disabled: true,
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Panel de Administración" description="Bienvenido al panel de control de CodeCanvas." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow rounded-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-semibold text-primary">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-sm h-12">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" disabled={feature.disabled}>
                <Link href={feature.href}>{feature.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
       <Card className="mt-8 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Conectar la gestión de proyectos a Firebase Firestore.</li>
            <li>Implementar formularios para añadir y editar proyectos.</li>
            <li>Permitir la subida de archivos de proyectos (ej. imágenes, zip para descarga).</li>
            <li>Desarrollar la sección de analíticas con gráficas funcionales.</li>
            <li>Construir herramientas básicas de SEO.</li>
            <li>Añadir autenticación para proteger el panel de administración.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
