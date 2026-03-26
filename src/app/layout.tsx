import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalCursor from "@/components/common/GlobalCursor";
import CartDrawer from "@/components/layout/CartDrawer";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant" 
});

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans" 
});

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-montserrat" 
});

export const metadata: Metadata = {
  title: "Sorriso Food — Taste of the Heaven",
  description: "Experience extraordinary flavors at Sorriso Food, Battaramulla. Order online, reserve a table, and taste heaven.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="bg-background text-text-primary text-base min-h-screen flex flex-col font-body antialiased">
        <Script src="https://www.payhere.lk/lib/payhere.js" strategy="lazyOnload" />
        <GlobalCursor />
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <CartDrawer />
            <div className="flex-grow flex flex-col">
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
