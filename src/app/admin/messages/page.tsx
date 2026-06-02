"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Mail, RefreshCw, AlertCircle, MessageSquare, CheckCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) setError(err.message);
    else setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id: string) => {
    setUpdating(id);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (!err) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    }
    setUpdating(null);
  };

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            Contact Messages
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${messages.length} message${messages.length !== 1 ? "s" : ""}${unread ? ` · ${unread} unread` : ""}`}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-zinc-800/60 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`bg-zinc-900 border rounded-2xl p-5 transition-all ${
                msg.is_read ? "border-zinc-800 opacity-70" : "border-amber-500/30"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-white font-medium">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="text-amber-400/80 text-xs hover:underline">
                    {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-xs">
                    {format(new Date(msg.created_at), "MMM d, yyyy · HH:mm")}
                  </span>
                  {!msg.is_read && (
                    <button
                      onClick={() => markRead(msg.id)}
                      disabled={updating === msg.id}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
