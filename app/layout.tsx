import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'זיכרון — IDF Memorial',
  description: 'Memorial map for fallen IDF soldiers — Operation Swords of Iron',
  openGraph: {
    title: 'זיכרון — לזכר חללי צה״ל',
    description: 'Interactive memorial for fallen IDF soldiers',
    locale: 'he_IL',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
