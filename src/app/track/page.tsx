"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Loader2, Phone } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  total: number;
  payment_status: string;
  order_status: string;
  order_type: string;
  created_at: string;
}

const PAYMENT_COLORS: Record<string, string> = {
  paid: "text-emerald-400",
  pending: "text-amber-400",
  failed: "text-red-400",
};

export default function TrackOrderPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = phone.replace(/\s/g, "");
    if (!normalized) return;

    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from("orders")
      .select("id, customer_name, phone, total, payment_status, order_status, order_type, created_at")
      .or(`phone.eq.${normalized},phone.ilike.%${normalized.slice(-9)}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    setOrders((data as OrderRow[]) ?? []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative z-10">
      <div className="relative h-[35vh] w-full flex items-center justify-center -mt-24 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=2000&auto=format&fit=crop')]" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center mt-16 px-6">
          <span className="font-accent text-accent tracking-[0.3em] text-xs uppercase mb-3 block">Sorriso</span>
          <h1 className="font-heading text-4xl md:text-6xl font-light text-white">{t.track.title}</h1>
          <p className="text-text-muted mt-3 text-sm md:text-base">{t.track.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-2xl mb-24">
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0777 222 069"
              className="w-full bg-card border border-white/10 focus:border-accent rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-background font-accent text-xs tracking-widest uppercase px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {t.track.search}
          </button>
        </form>

        {searched && !loading && orders.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t.track.noOrders}</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-white/10 rounded-2xl p-6"
            >
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest font-accent">{t.track.orderId}</p>
                  <p className="text-white font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <p className="text-text-muted text-xs self-end">
                  {format(new Date(order.created_at), "MMM d, yyyy · HH:mm")}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-text-muted text-xs mb-1">{t.track.payment}</p>
                  <p className={`capitalize font-medium ${PAYMENT_COLORS[order.payment_status] ?? "text-white"}`}>
                    {order.payment_status}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">{t.track.status}</p>
                  <p className="text-accent font-medium capitalize">
                    {ORDER_STATUS_LABELS[(order.order_status as OrderStatus) ?? "pending"] ?? order.order_status}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs mb-1">Total</p>
                  <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                </div>
              </div>

              <p className="text-text-muted text-xs mt-4 capitalize">{order.order_type}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
