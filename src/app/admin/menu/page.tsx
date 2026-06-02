"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  RefreshCw,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  Eye,
  EyeOff,
  X,
  Loader2,
  ImageOff,
  Upload,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MenuItem } from "@/types";
import { MENU_CATEGORIES } from "@/lib/constants";
import { uploadMenuImage } from "@/lib/upload-image";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [...MENU_CATEGORIES];

const EMPTY_FORM: Omit<MenuItem, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: CATEGORIES[0],
  image_url: "",
  is_available: true,
  is_featured: false,
};

// ─── Add Item Modal ───────────────────────────────────────────────────────────

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (item: MenuItem) => void;
}

function AddItemModal({ open, onClose, onSaved }: AddModalProps) {
  const [form, setForm] = useState<Omit<MenuItem, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setError(null);
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadMenuImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (form.price <= 0) return setError("Price must be greater than 0.");

    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("menu_items")
      .insert([{ ...form }])
      .select()
      .single();

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      onSaved(data as MenuItem);
      onClose();
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-zinc-800/70 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h2 className="text-white font-semibold text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  Add Menu Item
                </h2>
                <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1.5">
                  <label htmlFor="menu-name" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">Name *</label>
                  <input ref={firstInputRef} id="menu-name" className={inputCls} placeholder="e.g. Truffle Risotto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="menu-desc" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">Description</label>
                  <textarea id="menu-desc" rows={2} className={`${inputCls} resize-none`} placeholder="Short description…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="menu-price" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">Price (LKR) *</label>
                    <input id="menu-price" type="number" min={0} step={0.01} className={inputCls} placeholder="0.00" value={form.price || ""} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="menu-category" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">Category</label>
                    <select id="menu-category" className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="menu-image" className="block text-xs font-medium text-zinc-400 uppercase tracking-widest">Image</label>
                  <div className="flex gap-2">
                    <input id="menu-image" className={`${inputCls} flex-1`} placeholder="https://… or upload below" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                    <label className="flex items-center gap-1.5 shrink-0 cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl px-3 py-2.5 text-xs transition-all">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-5 pt-1">
                  {(["is_available", "is_featured"] as const).map((key) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                      <div
                        role="switch"
                        aria-checked={form[key]}
                        onClick={() => setForm({ ...form, [key]: !form[key] })}
                        className={`w-10 h-5 rounded-full border relative transition-all ${form[key] ? "bg-amber-500 border-amber-500" : "bg-zinc-700 border-zinc-600"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form[key] ? "left-5" : "left-0.5"}`} />
                      </div>
                      <span className="text-xs text-zinc-400 capitalize">{key.replace("_", " ")}</span>
                    </label>
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl py-2.5 text-sm font-medium transition-all border border-zinc-700">
                    Cancel
                  </button>
                  <button
                    id="menu-save-btn"
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-xl py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Item"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCat, setFilterCat] = useState("All");

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("name");

    if (err) setError(err.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const toggle = async (id: string, field: "is_available" | "is_featured", current: boolean) => {
    setToggling(`${id}-${field}`);
    const supabase = createClient();
    const { error: err } = await supabase.from("menu_items").update({ [field]: !current }).eq("id", id);
    if (err) setError(err.message);
    else setItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: !current } : i));
    setToggling(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    setDeleting(id);
    const supabase = createClient();
    const { error: err } = await supabase.from("menu_items").delete().eq("id", id);
    if (err) setError(err.message);
    else setItems((prev) => prev.filter((i) => i.id !== id));
    setDeleting(null);
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category))).sort()];
  const filtered = filterCat === "All" ? items : items.filter((i) => i.category === filterCat);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-amber-400" />
            Menu Management
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {loading ? "Loading…" : `${items.length} item${items.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchItems}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            id="add-menu-item-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Category Filter Pills */}
      {!loading && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterCat === cat
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Item Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-zinc-800/60 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <UtensilsCrossed className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No items found</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden flex flex-col transition-all ${
                item.is_available ? "border-zinc-800 hover:border-zinc-700" : "border-zinc-800 opacity-55"
              }`}
            >
              {/* Image */}
              <div className="h-32 bg-zinc-800 relative overflow-hidden shrink-0">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-7 h-7 text-zinc-700" />
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur text-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10">
                  {item.category}
                </span>
                {item.is_featured && (
                  <span className="absolute top-2 right-2 bg-amber-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" /> Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <h3 className="text-white font-semibold text-sm leading-snug">{item.name}</h3>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                </div>
                <p className="text-amber-400 font-bold">LKR {item.price.toLocaleString()}</p>

                {/* Action controls */}
                <div className="flex items-center justify-between gap-2 mt-auto pt-1 border-t border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    {/* Available */}
                    <button
                      id={`toggle-available-${item.id}`}
                      onClick={() => toggle(item.id, "is_available", item.is_available)}
                      disabled={toggling === `${item.id}-is_available`}
                      title={item.is_available ? "Hide item" : "Show item"}
                      className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                        item.is_available
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      {item.is_available ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {item.is_available ? "Live" : "Hidden"}
                    </button>

                    {/* Featured */}
                    <button
                      id={`toggle-featured-${item.id}`}
                      onClick={() => toggle(item.id, "is_featured", item.is_featured)}
                      disabled={toggling === `${item.id}-is_featured`}
                      title={item.is_featured ? "Unfeature" : "Feature"}
                      className={`flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${
                        item.is_featured
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      {item.is_featured ? "★ On" : "Feature"}
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    id={`delete-item-${item.id}`}
                    onClick={() => deleteItem(item.id)}
                    disabled={deleting === item.id}
                    title="Delete"
                    className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                  >
                    {deleting === item.id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <Trash2 className="w-3 h-3" />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <AddItemModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSaved={(item) => {
          setItems((prev) => [item, ...prev]);
          setFilterCat("All");
        }}
      />
    </div>
  );
}
