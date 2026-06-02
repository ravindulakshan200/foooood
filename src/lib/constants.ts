/** Shared site configuration — override via env where noted. */

export const SITE = {
  name: "Sorriso",
  tagline: "Your Belly Knows Best",
  address: "7th Lane, Wickramasinghepura Rd, Battaramulla",
  phones: ["0777 222 069", "0767 074 385"],
  email: "anushadilruksh88@gmail.com",
  whatsapp: "94777222069",
} as const;

export const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop";

export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=7th+Lane,+Wickramasinghepura+Rd,+Battaramulla,+Sri+Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed";

export const PLATFORMS = [
  {
    name: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/SorrisoFood",
    color: "hover:text-[#1877F2]",
    borderColor: "hover:border-[#1877F2]/40",
  },
  {
    name: "PickMe Food",
    href: process.env.NEXT_PUBLIC_PICKME_URL ?? "https://pickme.lk/en/food",
    color: "hover:text-[#E91E8C]",
    borderColor: "hover:border-[#E91E8C]/40",
  },
  {
    name: "Uber Eats",
    href: process.env.NEXT_PUBLIC_UBER_EATS_URL ?? "https://www.ubereats.com/lk",
    color: "hover:text-[#06C167]",
    borderColor: "hover:border-[#06C167]/40",
  },
] as const;

export const WHATSAPP_ORDER_URL = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  "Hi Sorriso! I'd like to place an order."
)}`;

export const MENU_CATEGORIES = ["Rice (Basmathi)", "Bite", "Drinks", "Other"] as const;

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
