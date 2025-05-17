import { ProjectList } from '@/components/projects/ProjectList';
import { projectsData } from '@/lib/data';
import { Presentation } from 'lucide-react'; // Using Presentation icon

export const metadata = {
  title: 'Projects - CodeCanvas',
  description: 'Browse a collection of innovative projects by Alex Bryant.',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <Presentation className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">My Projects</h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          A showcase of my passion for development, design, and problem-solving. Explore the work I&apos;m most proud of.
        </p>
      </header>
      <ProjectList projects={projectsData} />
    </div>
  );
}
