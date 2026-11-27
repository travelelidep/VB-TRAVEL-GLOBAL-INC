import type { Metadata, Viewport } from "next";
import "./globals.css";
import AsesorIA from "@/components/AsesorIA";

export const metadata: Metadata = {
  title: "VB TRAVEL GLOBAL INC | Casillero China → Venezuela | Envíos Puerta a Puerta",
  description: "VB TRAVEL GLOBAL INC - Tu casillero en China para compras online. Recibe en Venezuela puerta a puerta. Guangzhou, Shenzhen, Yiwu → Caracas, Valencia, Maracaibo. WhatsApp: +58 416 111157",
  keywords: "casillero China Venezuela, VB TRAVEL GLOBAL, envíos China Venezuela, comprar en China desde Venezuela, casillero Guangzhou, casillero Shenzhen, paquetería China Venezuela, puerta a puerta Venezuela, importar Taobao 1688 Alibaba",
  authors: [{ name: "VB TRAVEL GLOBAL INC" }],
  creator: "VB TRAVEL GLOBAL INC",
  publisher: "VB TRAVEL GLOBAL INC",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://vbtravelglobal.com",
    siteName: "VB TRAVEL GLOBAL INC",
    title: "VB TRAVEL GLOBAL INC | Tu Casillero en China para Envíos a Venezuela",
    description: "Abre tu casillero gratis en Guangzhou. Compra en Taobao, 1688, Alibaba, Tmall y recibe en tu puerta en Venezuela. Aéreo 24-48h | Marítimo 25-35 días. WhatsApp: +58 416 111157",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VB TRAVEL GLOBAL INC - Casillero China Venezuela",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VB TRAVEL GLOBAL INC | Casillero China → Venezuela",
    description: "Tu casillero gratis en China. Compra online y recibe en Venezuela puerta a puerta. WhatsApp: +58 416 111157",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-VE">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        {children}
        <AsesorIA />
      </body>
    </html>
  );
}
