"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Loader2, Star } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { MenuItem } from "@/types";

const CATEGORIES = ["All", "Starters", "Mains", "Desserts", "Drinks"];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*");
          
        if (error) {
          toast("Failed to load menu items", "error");
        } else if (data) {
          setMenuItems(data as MenuItem[]);
        }
      } catch (err) {
        toast("Network error occurred", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = (item: MenuItem) => {
    addToCart(item);
    toast(`${item.name} added to cart`, "success");
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background relative z-10 pb-32">
      {/* Header Banner */}
      <div className="relative h-[40vh] w-full flex items-center justify-center -mt-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2940&auto=format&fit=crop')]" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative z-10 text-center mt-20">
          <span className="font-accent text-accent tracking-[0.3em] text-xs uppercase mb-4 block">Sorriso Food</span>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-white tracking-wide">Our Menu</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Search & Filter Bar (Sticky) */}
        <div className="sticky top-[88px] z-50 bg-background/90 backdrop-blur-lg border-b border-white/5 pb-6 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center transition-all pt-4">
          
          {/* Categories Pill Nav */}
          <div className="flex gap-2 overflow-x-auto w-full max-w-full pb-2 scrollbar-hide no-scrollbar snap-x">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-2.5 rounded-full font-accent text-xs tracking-[0.1em] uppercase whitespace-nowrap snap-start transition-colors ${
                  activeCategory === cat ? "text-background bg-accent border-transparent" : "text-white border border-white/20 hover:border-white/50"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-full border border-accent/20 shadow-[0_0_15px_rgba(201,168,76,0.3)] pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isSearchFocused ? "text-accent" : "text-text-muted"}`} />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-secondary border-none rounded-full pl-12 pr-4 py-3 text-white font-body text-sm focus:outline-none placeholder:text-text-muted/50"
            />
            <motion.div 
              className="absolute -bottom-1 left-4 right-4 h-[1px] bg-accent origin-center"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isSearchFocused ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Menu Grid */}
        {/* Menu Grid and Layout Conditional Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-accent">
            <Loader2 className="w-12 h-12 mb-4 animate-spin opacity-80" />
            <p className="font-accent tracking-[0.2em] text-xs uppercase text-text-muted">Loading Menu...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-card rounded-2xl overflow-hidden glass group flex flex-col h-[480px] hover:glass-hover transform hover:-translate-y-2 transition-all duration-300 relative shadow-lg"
                >
                  {/* Featured Tag Details */}
                  {item.is_featured && (
                    <div className="absolute top-4 left-4 z-20 flex gap-1">
                      <div className="bg-accent text-background font-accent text-[8px] tracking-[0.2em] px-3 py-1.5 uppercase shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center gap-1 font-bold">
                        <Star className="w-2.5 h-2.5 fill-background" /> Featured
                      </div>
                    </div>
                  )}

                  <div className="relative h-[220px] w-full overflow-hidden shrink-0">
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border border-white/10 font-heading text-lg text-accent px-4 py-1 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-20">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading text-xl font-medium text-white tracking-wide leading-tight z-10">{item.name}</h3>
                    </div>
                    <p className="font-body text-text-muted text-sm font-light leading-relaxed mb-6 flex-grow z-10">
                      {item.description}
                    </p>
                    <button 
                      onClick={() => handleAdd(item)}
                      className="mt-auto z-10 flex items-center justify-between w-full border border-white/10 group-hover:border-accent text-text-muted group-hover:text-accent bg-background/50 py-3 px-5 rounded-xl transition-all duration-300 relative"
                    >
                      <span className="font-accent text-[10px] tracking-[0.2em] uppercase font-bold">Add to Cart</span>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-24 text-text-muted"
          >
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-body text-lg">No culinary creations found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
