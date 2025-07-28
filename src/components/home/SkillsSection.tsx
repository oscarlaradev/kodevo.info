
"use client";

import { useState } from 'react';
import { bioData, type Skill } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose, // Import DialogClose for explicit close button if needed
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // For DialogClose if needed

export function SkillsSection() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDialogOpen(true);
  };

  return (
    <>
      <section id="skills" className="py-16 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Mi Experiencia</h2>
            <p className="text-lg text-muted-foreground mt-2">Tecnologías y herramientas en las que destaco.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bioData.skills.map((skill, index) => (
              <Card 
                key={skill.name} 
                className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden animate-fade-in-up cursor-pointer group"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCardClick(skill)}
                tabIndex={0} // Make card focusable
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(skill); }} // Make card activatable with keyboard
              >
                <CardContent className="p-6 flex items-center space-x-4 group-hover:bg-muted/50 transition-colors">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-md font-medium text-card-foreground">{skill.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedSkill && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-card shadow-2xl rounded-xl">
            <DialogHeader className="p-6 pb-4 text-left border-b border-border">
              <DialogTitle className="text-2xl font-semibold text-primary">{selectedSkill.name}</DialogTitle>
            </DialogHeader>
            <DialogDescription className="p-6 text-md text-foreground/90 leading-relaxed whitespace-pre-line">
              {selectedSkill.description}
            </DialogDescription>
            {/* 
              DialogContent already has a default close button (X icon).
              If you want an explicit button in the footer, you can add:
              <DialogFooter className="p-4 border-t border-border">
                <DialogClose asChild>
                  <Button variant="outline">Cerrar</Button>
                </DialogClose>
              </DialogFooter> 
            */}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
