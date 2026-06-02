"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.menu, href: "/menu" },
    { name: t.nav.track, href: "/track" },
    { name: t.nav.contact, href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          isScrolled
            ? "bg-secondary/80 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="relative z-[101]">
            <h1 className="font-heading text-3xl font-light tracking-widest text-white uppercase">
              SORRISO<span className="text-accent">.</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group font-accent text-xs tracking-[0.2em] font-medium uppercase text-text-primary hover:text-white transition-colors"
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-[1px] bg-accent"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}

            <div className="flex items-center gap-1 border border-white/10 rounded-full p-0.5">
              {(["en", "si"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-accent tracking-wider uppercase transition-all",
                    locale === lang ? "bg-accent text-background" : "text-text-muted hover:text-white"
                  )}
                >
                  {lang === "en" ? "EN" : "සිං"}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-4 relative z-[101]">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-text-primary hover:text-accent transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-accent text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-accent"
                  >
                    {cartCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden text-text-primary hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-background pt-32 px-6 flex flex-col"
          >
            <nav className="flex flex-col gap-8 items-center mt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-3xl font-heading tracking-widest",
                    pathname === link.href ? "text-accent" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex justify-center gap-2 mt-8">
              {(["en", "si"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLocale(lang)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-accent tracking-wider uppercase border transition-all",
                    locale === lang
                      ? "bg-accent text-background border-accent"
                      : "text-text-muted border-white/20"
                  )}
                >
                  {lang === "en" ? "English" : "සිංහල"}
                </button>
              ))}
            </div>

            <div className="mt-auto pb-10 flex flex-col items-center justify-center gap-6">
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full max-w-xs block text-center bg-accent text-background font-accent text-sm tracking-[0.2em] uppercase py-4 font-bold hover:bg-accent-hover transition-colors"
              >
                {t.nav.orderNow}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
