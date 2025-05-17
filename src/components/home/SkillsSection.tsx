"use client";

import { bioData } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap } from 'lucide-react';

export function SkillsSection() {
  return (
    <section id="skills" className="py-16 md:py-24 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">My Expertise</h2>
          <p className="text-lg text-muted-foreground mt-2">Technologies and tools I excel in.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bioData.skills.map((skill, index) => (
            <Card 
              key={skill.name} 
              className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-md font-medium text-card-foreground">{skill.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
