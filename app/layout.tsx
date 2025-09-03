import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nike Store - Premium Athletic Wear & Sneakers | Shop Official Nike Products",
    template: "%s | Nike Store - Athletic Wear & Sneakers"
  },
  description: "Shop the latest Nike athletic wear, sneakers, and sports equipment. Find Air Max, Air Force 1, Dri-FIT apparel and more premium Nike products with fast shipping.",
  keywords: [
    "Nike", "sneakers", "athletic wear", "Air Max", "Air Force 1", 
    "Dri-FIT", "sports equipment", "running shoes", "basketball shoes",
    "Nike apparel", "sportswear", "Nike store", "official Nike"
  ],
  authors: [{ name: "Nike Store" }],
  creator: "Nike Store",
  publisher: "Nike Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nike-store.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nike Store - Premium Athletic Wear & Sneakers",
    description: "Shop the latest Nike athletic wear, sneakers, and sports equipment. Premium quality Nike products with fast shipping.",
    url: 'https://nike-store.vercel.app', // Update with your actual domain
    siteName: 'Nike Store',
    images: [
      {
        url: '/og-image.jpg', // We'll create this
        width: 1200,
        height: 630,
        alt: 'Nike Store - Premium Athletic Wear Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nike Store - Premium Athletic Wear & Sneakers",
    description: "Shop the latest Nike athletic wear, sneakers, and sports equipment. Premium quality Nike products.",
    images: ['/og-image.jpg'], // We'll create this
    creator: '@nikestore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Favicon and Apple Touch Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nike Store",
              "description": "Premium athletic wear and sneakers store featuring official Nike products",
              "url": "https://nike-store.vercel.app",
              "logo": "https://nike-store.vercel.app/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-800-344-6453",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://twitter.com/nikestore",
                "https://facebook.com/nikestore",
                "https://instagram.com/nikestore"
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Nike Store",
              "url": "https://nike-store.vercel.app",
              "description": "Shop the latest Nike athletic wear, sneakers, and sports equipment",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://nike-store.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
        
        {/* Google Analytics - Replace with your GA4 measurement ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
