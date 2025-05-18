
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
  name: "Oscar Lara", // Updated name
  title: "Senior Full-Stack Developer",
  tagline: "Crafting elegant code, building performant applications.",
  about:
    "With over a decade of experience in the tech industry, I specialize in creating innovative and efficient web solutions. My passion lies in turning complex problems into simple, beautiful, and intuitive designs. I thrive in collaborative environments and am always eager to learn new technologies and methodologies to push the boundaries of what's possible.",
  profilePictureUrl: "https://placehold.co/400x400.png",
  skills: [
    { name: "React & Next.js" },
    { name: "Node.js & Express" },
    { name: "TypeScript" },
    { name: "GraphQL & REST APIs" },
    { name: "Database Design (SQL & NoSQL)" },
    { name: "Cloud Platforms (AWS, Firebase)" },
    { name: "UI/UX Principles" },
    { name: "Agile Methodologies" },
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
