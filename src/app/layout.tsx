import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'InvestorView',
  description: 'Your personal investment portfolio dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar>
              <MainNav />
            </Sidebar>
            <SidebarInset className="flex flex-1 flex-col">
              <Header />
              <main className="flex-1 p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
