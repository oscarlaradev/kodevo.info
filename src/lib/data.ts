
export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  thumbnailUrl: string;
  previewUrl: string; // URL to a larger preview image or live site screenshot
  projectUrl?: string; // Link to live project
  sourceCodeUrl?: string; // Link to GitHub repo
  downloadUrl?: string; // Link to downloadable project file (e.g., zip)
  technologies: string[];
  category: string; // e.g., "Web App", "Mobile App", "Tool"
}

export interface BioData {
  name: string;
  title: string;
  tagline: string;
  about: string;
  profilePictureUrl: string;
  skills: { name: string; icon?: React.ElementType }[];
  contact: { platform: string; link: string; icon?: React.ElementType }[];
}

export const bioData: BioData = {
  name: "Oscar Lara",
  title: "Desarrollador Full-Stack Junior",
  tagline: "Creando código elegante, construyendo aplicaciones de alto rendimiento.",
  about:
    "Soy un desarrollador Full-Stack en crecimiento con experiencia en la creación de soluciones web funcionales y eficientes. Me apasiona transformar problemas complejos en interfaces intuitivas y atractivas. Disfruto trabajar en entornos colaborativos y siempre estoy explorando nuevas tecnologías y metodologías para mejorar mis habilidades y ampliar los límites de lo posible.",
  profilePictureUrl: "/profile.jpg",
  skills: [
    { name: "HTML" },
    { name: "CSS" },
    { name: "JavaScript" },
    { name: "PHP y MySQL" },
    { name: "Figma" },
    { name: "Firebase" },
    { name: "GitHub" },
    { name: "Bootstrap" },
    { name: "APIs" },
    { name: "Cloud Computing" }, // "Cloud" is a bit generic, so I'll use "Cloud Computing"
    { name: "Diseño UI" },       // Separating UI and UX
    { name: "Diseño UX" },
    { name: "React" },
    { name: "Next.js" },
    { name: "Node.js" },
    { name: ".NET" },
    { name: "Astro" },
  ],
  contact: [
    { platform: "GitHub", link: "https://github.com/oscarlaradev" },
    { platform: "Instagram", link: "https://www.instagram.com/ossx_noxx" },
    { platform: "Email", link: "mailto:oscarinlara87@gmail.com" },
  ],
};

// Static projectsData is no longer the primary source for the /projects page.
// It will be fetched from Firestore. This can be an empty array or kept for fallback/testing if needed.
export const projectsData: Project[] = [];
