import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { projectsData, type Project } from '@/lib/data'; // Using existing data for now
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default function AdminProjectsPage() {
  // For now, we'll use the static projectsData.
  // Later, this will fetch from Firebase.
  const projects: Project[] = projectsData;

  return (
    <div className="container mx-auto py-8">
      <AdminPageHeader title="Gestionar Proyectos" description="Visualiza, añade, edita o elimina proyectos de tu portafolio.">
        <Button asChild>
          <Link href="/admin/projects/new"> {/* Link to a future page */}
            <PlusCircle className="mr-2 h-5 w-5" />
            Añadir Nuevo Proyecto
          </Link>
        </Button>
      </AdminPageHeader>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Lista de Proyectos</CardTitle>
          <CardDescription>
            Actualmente mostrando {projects.length} proyecto(s). La funcionalidad de editar y eliminar se añadirá pronto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tecnologías</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {project.technologies.slice(0, 3).join(', ')}
                    {project.technologies.length > 3 && '...'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" disabled className="mr-2" title="Editar (Próximamente)">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled title="Eliminar (Próximamente)">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No hay proyectos para mostrar. ¡Añade uno nuevo!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>La página para añadir nuevos proyectos (`/admin/projects/new`) y la conexión a Firebase se implementarán en los próximos pasos.</p>
        </div>
    </div>
  );
}
