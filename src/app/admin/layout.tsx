import type { Metadata } from 'next';
import '@/app/globals.css'; // Make sure Tailwind processes classes used in admin pages

export const metadata: Metadata = {
  title: 'Admin Dashboard - CodeCanvas',
  description: 'Administración de CodeCanvas.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This component's output will be slotted into the {children} of RootLayout.
  // RootLayout already provides <html>, <body>, main site Header, Toaster, Providers, and a <main> tag.
  // AdminLayout should only provide the specific structure/styling for the admin section itself,
  // which will be nested within RootLayout's <main>.
  return (
    <div className="bg-muted/40">
      {/* Individual admin pages (e.g., /admin/page.tsx, /admin/projects/page.tsx) 
          are responsible for their own internal layout like containers and padding.
          If a persistent Admin Sidebar or Header were needed, it would go here,
          inside this div and wrapping or alongside {children}. */}
      {children}
    </div>
  );
}
