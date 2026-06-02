"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Package,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/constants";

type PaymentStatus = "pending" | "paid" | "failed" | "all";

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  items_json: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_status: string;
  order_status: string;
  order_type: string;
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  paid:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  failed:  "bg-red-500/15 text-red-400 border-red-500/25",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_BADGE[status] ?? "bg-zinc-700/50 text-zinc-400 border-zinc-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${cls}`}>
      {status}
    </span>
  );
}

function parseItems(items_json: string): string {
  try {
    const items = JSON.parse(items_json);
    if (Array.isArray(items)) {
      return items
        .map((i: { name?: string; quantity?: number }) => `${i.name ?? "Item"} ×${i.quantity ?? 1}`)
        .join(", ");
    }
    return String(items_json);
  } catch {
    return items_json ?? "—";
  }
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = ["pending", "preparing", "ready", "delivered", "cancelled"];

function whatsappUrl(phone: string, orderId: string, status: string) {
  const msg = `Hi! Your Sorriso order #${orderId.slice(0, 8).toUpperCase()} is now: ${ORDER_STATUS_LABELS[status as OrderStatus] ?? status}. Thank you!`;
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("94") ? digits : `94${digits.replace(/^0/, "")}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;
}

const FILTER_OPTIONS: { label: string; value: PaymentStatus }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending",    value: "pending" },
  { label: "Paid",       value: "paid" },
  { label: "Failed",     value: "failed" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<PaymentStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("payment_status", filter);
    }

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
    } else {
      setOrders(data ?? []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrderStatus = async (id: string, order_status: OrderStatus) => {
    setUpdating(id);
    const supabase = createClient();
    const { error: err } = await supabase.from("orders").update({ order_status }).eq("id", id);
    if (err) setError(err.message);
    else setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, order_status } : o)));
    setUpdating(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            Orders
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${orders.length} record${orders.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              id="orders-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as PaymentStatus)}
              className="appearance-none bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              {FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-800/50">
                {["Order ID", "Customer", "Items", "Total", "Type", "Payment", "Fulfillment", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-widest px-5 py-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(9)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.25 }}
                    className="hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-zinc-400">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{order.customer_name}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{order.phone}</p>
                    </td>
                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="text-zinc-300 text-xs truncate" title={parseItems(order.items_json)}>
                        {parseItems(order.items_json)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-white font-semibold whitespace-nowrap">
                      LKR {(order.total ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-zinc-400 capitalize">{order.order_type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.payment_status} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.order_status ?? "pending"}
                        disabled={updating === order.id}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="appearance-none bg-zinc-800 border border-zinc-700 text-white text-[11px] rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer capitalize"
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 text-xs whitespace-nowrap">
                      {format(new Date(order.created_at), "MMM d, yyyy · HH:mm")}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={whatsappUrl(order.phone, order.id, order.order_status ?? "pending")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                        title="Notify customer via WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
