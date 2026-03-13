import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'זיכרון — Memorial',
  description:
    'Interactive memorial map for fallen IDF soldiers — Operation Swords of Iron',
  openGraph: {
    title: 'זיכרון — Zikaron Memorial',
    description: 'Honoring fallen IDF soldiers from Operation Swords of Iron',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=Frank+Ruhl+Libre:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
