"use client";

import { useCart } from "../providers/CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { formatPrice, getFoodImageUrl } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-secondary border-l border-white/5 shadow-2xl z-[10000] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-heading text-text-primary">Your Cart</h2>
              </div>
              <button
                id="close-cart-drawer"
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-text-muted hover:text-white" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-muted gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="font-body text-lg">Your cart is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-accent hover:text-accent-hover underline underline-offset-4 text-sm font-accent tracking-widest mt-4"
                  >
                    RETURN TO MENU
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const linePrice = (item.sizePrice ?? item.price) * item.quantity;
                  return (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-4 rounded-xl bg-card border border-white/5"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={getFoodImageUrl(item.image_url)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h4 className="font-heading text-base font-medium leading-tight text-white truncate">
                              {item.name}
                            </h4>
                            {/* Size badge */}
                            {item.selectedSize && (
                              <span className="inline-block mt-1 font-accent text-[9px] tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                                {item.selectedSize}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-text-muted hover:text-red-500 transition-colors p-1 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-background rounded-full px-3 py-1.5 border border-white/5">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-text-muted hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-body w-4 text-center font-medium text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-text-muted hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-body text-accent font-medium">
                            {formatPrice(linePrice)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer total + CTA */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-secondary/95 backdrop-blur-md">
                <div className="flex justify-between mb-2 text-text-muted text-sm font-body">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between mb-5 text-text-muted text-sm font-body">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(250)}</span>
                </div>
                <div className="flex justify-between mb-6 text-lg font-heading text-white font-medium">
                  <span>Total</span>
                  <span className="text-accent text-xl">{formatPrice(cartTotal + 250)}</span>
                </div>

                <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                  <button
                    id="cart-checkout-btn"
                    className="w-full bg-accent hover:bg-accent-hover text-background font-accent text-sm tracking-[0.2em] uppercase py-4 font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.35)]"
                  >
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
