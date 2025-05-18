
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
  name: "Oscar Lara", // Name likely kept as is
  title: "Desarrollador Full-Stack Senior",
  tagline: "Creando código elegante, construyendo aplicaciones de alto rendimiento.",
  about:
    "Con más de una década de experiencia en la industria tecnológica, me especializo en crear soluciones web innovadoras y eficientes. Mi pasión radica en convertir problemas complejos en diseños simples, hermosos e intuitivos. Prospero en entornos colaborativos y siempre estoy ansioso por aprender nuevas tecnologías y metodologías para ampliar los límites de lo posible.",
  profilePictureUrl: "https://placehold.co/400x400.png", // Assuming this placeholder URL is fine
  skills: [ // Skill names are often kept in English or using common industry terms
    { name: "React & Next.js" },
    { name: "Node.js & Express" },
    { name: "TypeScript" },
    { name: "GraphQL & REST APIs" },
    { name: "Diseño de Bases de Datos (SQL & NoSQL)" },
    { name: "Plataformas Cloud (AWS, Firebase)" },
    { name: "Principios UI/UX" },
    { name: "Metodologías Ágiles" },
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
