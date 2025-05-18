import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection';
import { ContactSection } from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <FeaturedProjectsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
