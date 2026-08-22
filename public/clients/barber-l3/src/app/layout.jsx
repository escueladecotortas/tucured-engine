import { Geist, Hanken_Grotesk, Prata, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});

const prata = Prata({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Nexus Barber L3 | Barbería Unisex",
  description: "Excelencia en precisión técnica y barbería unisex en San Miguel de Tucumán. Reserva tu turno online.",
  keywords: ["barbería fadu", "Nexus Barber L3 barbería", "precisión técnica", "barbería unisex", "ciudad universitaria"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="light scroll-smooth" data-scroll-behavior="smooth">
      {/* V8.1-EMERGENCY-AUTH-PATCH (KAEL) */}
      <head>
        <meta name="deployment-checksum" content="V8.1-EMERGENCY-AUTH-PATCH" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={`${geist.variable} ${hanken.variable} ${prata.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
