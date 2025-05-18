
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

export interface Skill {
  name: string;
  description: string;
  icon?: React.ElementType; // Icono es opcional, pero lo teníamos con CheckCircle
}

export interface BioData {
  name: string;
  title: string;
  tagline: string;
  about: string;
  profilePictureUrl: string;
  skills: Skill[];
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
    { name: "HTML", description: "Lenguaje de Marcado de Hipertexto, la estructura fundamental de las páginas web. Define el contenido y su organización semántica." },
    { name: "CSS", description: "Hojas de Estilo en Cascada, utilizado para describir la presentación y el diseño visual de documentos HTML." },
    { name: "JavaScript", description: "Lenguaje de programación versátil que permite crear interactividad dinámica en sitios web y aplicaciones." },
    { name: "PHP y MySQL", description: "PHP es un lenguaje de scripting del lado del servidor popular para el desarrollo web, a menudo usado con MySQL, un sistema de gestión de bases de datos relacionales." },
    { name: "Figma", description: "Herramienta de diseño de interfaces colaborativa basada en la nube, utilizada para crear prototipos, wireframes y diseños de UI/UX." },
    { name: "Firebase", description: "Plataforma de desarrollo de aplicaciones de Google que proporciona backend como servicio, incluyendo bases de datos, autenticación y hosting." },
    { name: "GitHub", description: "Plataforma de desarrollo colaborativo para alojar proyectos utilizando el sistema de control de versiones Git." },
    { name: "Bootstrap", description: "Framework de CSS front-end de código abierto para desarrollar sitios web y aplicaciones responsivas y mobile-first." },
    { name: "APIs", description: "Interfaces de Programación de Aplicaciones, conjuntos de reglas que permiten que diferentes aplicaciones de software se comuniquen entre sí." },
    { name: "Cloud Computing", description: "Entrega de diferentes servicios a través de Internet, incluyendo almacenamiento de datos, servidores, bases de datos, redes y software." },
    { name: "Diseño UI", description: "Diseño de Interfaces de Usuario, enfocado en la apariencia y la interactividad de un producto digital para asegurar una experiencia visualmente atractiva y fácil de usar." },
    { name: "Diseño UX", description: "Diseño de Experiencia de Usuario, centrado en la experiencia general del usuario con un producto, asegurando que sea útil, usable y satisfactorio." },
    { name: "React", description: "Biblioteca de JavaScript de código abierto para construir interfaces de usuario o componentes de UI, especialmente para aplicaciones de una sola página (SPA)." },
    { name: "Next.js", description: "Framework de React para producción que permite funcionalidades como renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG)." },
    { name: "Node.js", description: "Entorno de ejecución de JavaScript del lado del servidor, construido sobre el motor V8 de Chrome, permitiendo ejecutar JavaScript fuera del navegador." },
    { name: ".NET", description: "Framework de desarrollo de Microsoft para construir una amplia gama de aplicaciones, incluyendo web, móviles, de escritorio y de IoT." },
    { name: "Astro", description: "Framework web moderno para construir sitios web rápidos y optimizados para el contenido, que envía menos JavaScript al cliente por defecto." },
  ],
  contact: [
    { platform: "GitHub", link: "https://github.com/oscarlaradev" },
    { platform: "Instagram", link: "https://www.instagram.com/ossx_noxx" },
    { platform: "Email", link: "mailto:oscarinlara87@gmail.com" },
  ],
};

export const projectsData: Project[] = [];
