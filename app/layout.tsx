import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/language-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MotionObserver } from '@/components/motion-observer';

export const metadata: Metadata = {
  title: 'Finding Farmers — बिहार के लिए साप्ताहिक फसल सलाह',
  description: 'हाल की बारिश, सात दिन के मौसम, मिट्टी की नमी और फसल अवस्था पर आधारित साप्ताहिक खेत सलाह।',
  metadataBase: new URL('http://localhost:3001'),
  openGraph: {
    title: 'Finding Farmers — बिहार के लिए साप्ताहिक फसल सलाह',
    description: 'हिंदी, भोजपुरी और अंग्रेज़ी में साप्ताहिक खेत सलाह।',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'भोजपुरी कृषि' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'भोजपुरी कृषि — बिहार के लिए साप्ताहिक फसल सलाह',
    description: 'हिंदी, भोजपुरी और अंग्रेज़ी में साप्ताहिक खेत सलाह।',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="antialiased">
        <LanguageProvider>
          <MotionObserver />
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
