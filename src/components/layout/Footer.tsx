"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "../providers/ToastProvider";
import { useLanguage } from "../providers/LanguageProvider";
import { supabase } from "@/lib/supabase";
import { SITE, PLATFORMS } from "@/lib/constants";

// Social / platform icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const UberEatsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c3.975 0 7.2 3.225 7.2 7.2s-3.225 7.2-7.2 7.2S4.8 15.975 4.8 12 8.025 4.8 12 4.8zm0 2.4A4.8 4.8 0 0 0 7.2 12a4.8 4.8 0 0 0 4.8 4.8 4.8 4.8 0 0 0 4.8-4.8A4.8 4.8 0 0 0 12 7.2zm0 2.4a2.4 2.4 0 0 1 2.4 2.4 2.4 2.4 0 0 1-2.4 2.4A2.4 2.4 0 0 1 9.6 12a2.4 2.4 0 0 1 2.4-2.4z" />
  </svg>
);

const PickMeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const PLATFORMS_WITH_ICONS = PLATFORMS.map((p) => ({
  ...p,
  Icon: p.name === "Facebook" ? FacebookIcon : p.name === "PickMe Food" ? PickMeIcon : UberEatsIcon,
}));

export default function Footer() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: email.trim().toLowerCase() }]);

    if (error) {
      if (error.code === "23505") toast(t.footer.alreadySubscribed, "success");
      else toast(t.footer.subscribeFail, "error");
    } else {
      toast(t.footer.subscribed, "success");
      setEmail("");
    }
    setSubmitting(false);
  };

  return (
    <footer className="bg-secondary border-t border-white/5 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <h2 className="font-heading text-4xl font-light tracking-widest text-white uppercase">
                Sorriso<span className="text-accent">.</span>
              </h2>
            </Link>
            <p className="font-heading text-text-muted italic text-lg mb-6">
              &ldquo;Your Belly Knows Best&rdquo;
            </p>
            {/* Social / Delivery Platforms */}
            <div className="flex flex-col gap-2">
              {PLATFORMS_WITH_ICONS.map(({ name, Icon, href, color, borderColor }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 border border-white/10 rounded-lg px-3 py-2.5 text-text-muted ${color} ${borderColor} transition-all font-accent text-[10px] tracking-widest uppercase`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-accent text-xs tracking-[0.2em] font-medium text-white uppercase mb-8">
              {t.footer.quickLinks}
            </h4>
            <ul className="flex flex-col gap-4 font-body text-text-muted">
              <li><Link href="/" className="hover:text-accent transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/menu" className="hover:text-accent transition-colors">{t.footer.ourMenu}</Link></li>
              <li><Link href="/cart" className="hover:text-accent transition-colors">{t.footer.cartCheckout}</Link></li>
              <li><Link href="/track" className="hover:text-accent transition-colors">{t.nav.track}</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">{t.footer.contactUs}</Link></li>
            </ul>
          </div>

          {/* Visit Us */}
          <div>
            <h4 className="font-accent text-xs tracking-[0.2em] font-medium text-white uppercase mb-8">
              {t.footer.findUs}
            </h4>
            <ul className="flex flex-col gap-5 font-body text-text-muted">
              <li className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">{SITE.address}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm">{SITE.phones.join(" / ")}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm">{SITE.email}</span>
              </li>
              <li className="flex gap-3 items-start">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-sm">Mon–Sat: 10 AM – 10 PM<br />Sun: 11 AM – 9 PM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-accent text-xs tracking-[0.2em] font-medium text-white uppercase mb-8">
              {t.footer.stayUpdated}
            </h4>
            <p className="text-text-muted font-body text-sm mb-6 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-background border border-white/10 focus:border-accent rounded-none px-4 py-3.5 text-white font-body text-sm focus:outline-none transition-colors placeholder:text-text-muted/50"
                required
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className="absolute right-0 top-0 bottom-0 px-5 bg-accent hover:bg-accent-hover text-background transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-text-muted text-sm">
            © {new Date().getFullYear()} Sorriso. All rights reserved. Your Belly Knows Best.
          </p>
          <div className="flex gap-6 font-body text-text-muted text-sm">
            <span className="text-text-muted/40">Battaramulla, Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
