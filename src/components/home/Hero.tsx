"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { PLATFORMS, WHATSAPP_ORDER_URL } from "@/lib/constants";

// Delivery platform SVG icons
const UberEatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c3.975 0 7.2 3.225 7.2 7.2s-3.225 7.2-7.2 7.2S4.8 15.975 4.8 12 8.025 4.8 12 4.8zm0 2.4A4.8 4.8 0 0 0 7.2 12a4.8 4.8 0 0 0 4.8 4.8 4.8 4.8 0 0 0 4.8-4.8A4.8 4.8 0 0 0 12 7.2zm0 2.4a2.4 2.4 0 0 1 2.4 2.4 2.4 2.4 0 0 1-2.4 2.4A2.4 2.4 0 0 1 9.6 12a2.4 2.4 0 0 1 2.4-2.4z"/>
  </svg>
);

const PickMeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const PLATFORM_ICONS: Record<string, () => JSX.Element> = {
  "Facebook": FacebookIcon,
  "PickMe Food": PickMeIcon,
  "Uber Eats": UberEatsIcon,
};

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center -mt-24 overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-background" />

      {/* Animated grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center mt-24">

        {/* Brand eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-accent text-accent tracking-[0.35em] text-xs uppercase">
            Battaramulla · Since 2024
          </span>
          <div className="h-px w-8 bg-accent/60" />
        </motion.div>

        {/* Logo / Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mb-6 relative"
        >
          <h1 className="font-heading text-[5rem] md:text-[8rem] lg:text-[11rem] font-light text-white tracking-[0.08em] leading-none uppercase">
            Sorriso
          </h1>
          {/* Gold underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.9, ease: "anticipate" }}
            className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent mt-2 origin-center"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="font-heading text-2xl md:text-3xl text-white/80 font-light italic tracking-wide mb-4"
        >
          &ldquo;Your Belly Knows Best&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="font-body text-text-muted text-base max-w-lg mb-12"
        >
          Sri Lankan & International fusion dishes crafted with passion. Order online or find us on your favourite delivery app.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 mb-14"
        >
          <Link
            href="/menu"
            id="hero-order-now-btn"
            className="group flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-background px-8 py-4 font-accent text-sm tracking-[0.2em] uppercase font-bold transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.45)]"
          >
            <ShoppingBag className="w-4 h-4" />
            Order Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={WHATSAPP_ORDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-white/30 hover:border-accent hover:text-accent text-white px-8 py-4 font-accent text-sm tracking-[0.2em] uppercase bg-black/20 backdrop-blur-sm transition-all"
          >
            WhatsApp Order
          </Link>
        </motion.div>

        {/* Delivery Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-text-muted">
            Also available on
          </span>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {PLATFORMS.map((p) => {
              const Icon = PLATFORM_ICONS[p.name];
              return (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 text-text-muted ${p.color} hover:border-white/30 transition-all font-accent text-xs tracking-widest`}
              >
                {Icon && <Icon />}
                {p.name}
              </a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="font-accent text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
