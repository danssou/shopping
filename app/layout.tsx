import type { Metadata } from "next";
import { Jost} from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/components";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: {
    default: "CODALWARE Store - Premium Products & Technology | Shop Official CODALWARE Products",
    template: "%s | CODALWARE Store - Premium Products & Technology"
  },
  description: "Shop the latest CODALWARE products and technology solutions. Find premium quality CODALWARE products with fast shipping.",
  keywords: [
    "CODALWARE", "technology", "premium products", "software", "solutions",
    "tech store", "CODALWARE products", "official CODALWARE"
  ],
  authors: [{ name: "CODALWARE Ltd co" }],
  creator: "CODALWARE Store",
  publisher: "CODALWARE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://codalware.com'), 
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "CODALWARE Store - Premium Products & Technology",
    description: "Shop the latest CODALWARE products and technology solutions. Premium quality CODALWARE products with fast shipping.",
    url: 'https://codalware-store.vercel.app', 
    siteName: 'CODALWARE Store',
    images: [
      {
        url: '/og-image.jpg', // We'll create this
        width: 1200,
        height: 630,
        alt: 'CODALWARE Store - Premium Product Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CODALWARE Store - Premium Products & Technology",
    description: "Shop the latest CODALWARE products and technology solutions. Premium quality CODALWARE products.",
    images: ['/og-image.jpg'], // We'll create this
    creator: '@codalwarestore',
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
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
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
        
        {/* Essential Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CODALWARE Store",
              "description": "Premium products and technology solutions store featuring official CODALWARE products",
              "url": "https://codalware-store.vercel.app"
            })
          }}
        />


      </head>
      <body
        className={`${jost.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
