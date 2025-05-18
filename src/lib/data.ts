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
  name: "Alex Bryant",
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
    { platform: "GitHub", link: "https://github.com" },
    { platform: "LinkedIn", link: "https://linkedin.com" },
    { platform: "Email", link: "mailto:alex.bryant.dev@example.com" },
  ],
};

export const projectsData: Project[] = [
  {
    id: "1",
    title: "EcoSort AI",
    shortDescription: "AI-powered waste sorting assistant.",
    longDescription:
      "EcoSort AI is an innovative web application designed to help users correctly sort their waste using artificial intelligence. Upload an image of an item, and the AI identifies it, providing detailed sorting instructions. Built with Next.js for a fast frontend, Python/Flask for the AI backend, and deployed on Vercel.",
    thumbnailUrl: "https://placehold.co/600x400.png",
    previewUrl: "https://placehold.co/1200x800.png",
    projectUrl: "#",
    sourceCodeUrl: "#",
    downloadUrl: "#", // Placeholder for actual download link
    technologies: ["Next.js", "TypeScript", "Python", "Flask", "AI/ML", "Vercel"],
    category: "Web App",
  },
  {
    id: "2",
    title: "Stellar Journey Planner",
    shortDescription: "Interactive space travel itinerary builder.",
    longDescription:
      "Plan your hypothetical interstellar voyages with Stellar Journey Planner. This app uses real astronomical data to simulate travel times and conditions between star systems. Features a 3D starmap visualization. Developed using React, Three.js, and a custom-built physics engine.",
    thumbnailUrl: "https://placehold.co/600x400.png",
    previewUrl: "https://placehold.co/1200x800.png",
    projectUrl: "#",
    sourceCodeUrl: "#",
    // No downloadUrl for this project example
    technologies: ["React", "Three.js", "Node.js", "API Integration"],
    category: "Web App",
  },
  {
    id: "3",
    title: "DevPortfolio UI Kit",
    shortDescription: "A UI kit for developers to build portfolios.",
    longDescription:
      "A comprehensive UI kit built with Tailwind CSS and React components, designed to help developers quickly scaffold beautiful and responsive portfolio websites. Includes various themes and customizable sections. This very portfolio is a testament to its capabilities!",
    thumbnailUrl: "https://placehold.co/600x400.png",
    previewUrl: "https://placehold.co/1200x800.png",
    projectUrl: "#",
    sourceCodeUrl: "#",
    downloadUrl: "#", // Placeholder
    technologies: ["React", "Tailwind CSS", "Storybook", "Figma"],
    category: "UI Kit",
  },
  {
    id: "4",
    title: "Quantum Notes",
    shortDescription: "Secure, end-to-end encrypted note-taking app.",
    longDescription:
      "Quantum Notes offers a privacy-focused note-taking experience with robust end-to-end encryption. Features include markdown support, tagging, and cross-device sync. Built using Electron, React, and a custom encryption library.",
    thumbnailUrl: "https://placehold.co/600x400.png",
    previewUrl: "https://placehold.co/1200x800.png",
    sourceCodeUrl: "#",
    // No downloadUrl for this project example
    technologies: ["Electron", "React", "Cryptography", "SQLite"],
    category: "Desktop App",
  },
];

// AI Hints are now primarily handled via data-ai-hint attributes in components.
// The placeholder URLs are static now.
