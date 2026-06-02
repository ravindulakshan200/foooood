"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/utils";
import Input from "@/components/common/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/providers/ToastProvider";

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: unknown) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
    };
  }
}

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const deliveryFee = orderType === "delivery" ? 250 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.phone.trim()) {
      toast("Name and phone number are required.", "error");
      return;
    }
    if (orderType === "delivery" && !formData.address.trim()) {
      toast("Address is required for delivery.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const orderPayload = {
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        address: orderType === "delivery" ? `${formData.address}, ${formData.city}` : "Pickup",
        items_json: JSON.stringify(items),
        subtotal: cartTotal,
        delivery_fee: deliveryFee,
        total: finalTotal,
        payment_status: "pending",
        order_status: "pending",
        order_type: orderType
      };

      const { error, data } = await supabase.from('orders').insert([orderPayload]).select().single();

      if (error) {
        toast("Failed to process order. Please try again.", "error");
        console.error(error);
        setIsLoading(false);
        return;
      }

      const orderId = data.id;

      // 1. Fetch encrypted MD5 Hash
      const hashRes = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, amount: finalTotal, currency: 'LKR' })
      });
      const hashData = await hashRes.json();

      if (!hashData.hash) {
        toast("Payment gateway configuration error.", "error");
        setIsLoading(false);
        return;
      }

      // 2. Configure PayHere Object
      const isSandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true';
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1222956';
      
      const payment: Record<string, string | number | boolean> = {
        sandbox: isSandbox,
        merchant_id: merchantId,
        return_url: window.location.origin + '/checkout/success?order=' + orderId,
        cancel_url: window.location.origin + '/cart',
        notify_url: window.location.origin + '/api/payhere/notify',
        order_id: orderId,
        items: 'Sorriso Food Order',
        amount: finalTotal.toFixed(2), // SDK prefers 2 decimal places formatted
        currency: 'LKR',
        hash: hashData.hash,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || 'Pickup',
        city: formData.city || 'Colombo',
        country: 'Sri Lanka'
      };

      console.log("=== PayHere Payload Debug ===");
      console.log("Payment Configuration:", payment);
      console.log("=============================");

      // 3. Define Callback Interceptors
      window.payhere.onCompleted = async function onCompleted() {
        await supabase.from('orders').update({ payment_status: 'paid' }).eq('id', orderId);
        toast("Order placed successfully!", "success");
        clearCart();
        router.push(`/checkout/success?order=${orderId}`);
        setIsLoading(false);
      };

      window.payhere.onDismissed = function onDismissed() {
        toast("Payment Cancelled", "error");
        setIsLoading(false);
      };

      window.payhere.onError = function onError(error: string) {
        toast("Payment Error: " + error, "error");
        setIsLoading(false);
      };

      // 4. Trigger Widget
      window.payhere.startPayment(payment);

    } catch {
      toast("An unexpected error occurred.", "error");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center -mt-24 min-h-screen">
        <div className="text-center">
          <h2 className="font-heading text-4xl text-white mb-4">Your Cart is Empty</h2>
          <p className="text-text-muted mb-8">Add items to your taste before checking out.</p>
          <button 
            onClick={() => router.push("/menu")}
            className="bg-accent hover:bg-accent-hover text-background px-8 py-4 font-accent text-sm tracking-[0.2em] uppercase font-bold transition-all"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-12 pb-24 relative z-10">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16">
        
        {/* Left: Order Summary */}
        <div className="w-full lg:w-5/12 order-2 lg:order-1">
          <div className="sticky top-32 glass border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h3 className="font-heading text-3xl text-white font-light tracking-wide border-b border-white/10 pb-6 mb-6">
              Order Summary
            </h3>
            
            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-baseline mb-1">
                      <h5 className="font-heading text-base text-white font-medium leading-tight">{item.name}</h5>
                      <span className="font-body text-accent">{formatPrice((item.sizePrice ?? item.price) * item.quantity)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted text-sm font-body">Qty: {item.quantity}</span>
                      {item.selectedSize && (
                        <span className="text-[9px] font-accent tracking-widest uppercase text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">
                          {item.selectedSize}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between text-text-muted font-body">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(cartTotal)}</span>
              </div>
              <AnimatePresence>
                {orderType === "delivery" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between text-text-muted font-body"
                  >
                    <span>Delivery Fee</span>
                    <span className="text-white">{formatPrice(deliveryFee)}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-between items-center text-xl font-heading text-white font-medium pt-4 border-t border-white/10">
                <span>Total</span>
                <span className="text-accent text-3xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div className="w-full lg:w-7/12 order-1 lg:order-2">
          <h2 className="font-heading text-5xl text-white font-light tracking-wide mb-10">Checkout</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Toggle */}
            <div className="relative flex w-full max-w-sm bg-card rounded-full p-1 mb-12 border border-white/5">
              <div 
                className={`flex-1 text-center py-3 font-accent text-sm tracking-[0.1em] uppercase z-10 cursor-pointer transition-colors ${
                  orderType === "delivery" ? "text-background font-bold" : "text-text-muted hover:text-white"
                }`}
                onClick={() => setOrderType("delivery")}
              >
                Delivery
              </div>
              <div 
                className={`flex-1 text-center py-3 font-accent text-sm tracking-[0.1em] uppercase z-10 cursor-pointer transition-colors ${
                  orderType === "pickup" ? "text-background font-bold" : "text-text-muted hover:text-white"
                }`}
                onClick={() => setOrderType("pickup")}
              >
                Pickup
              </div>
              <motion.div 
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-accent rounded-full z-0 pointer-events-none"
                animate={{
                  left: orderType === "delivery" ? "4px" : "calc(50%)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </div>

            {/* Inputs */}
            <div className="space-y-2">
              <h4 className="font-accent text-accent text-xs tracking-[0.2em] uppercase mb-6 border-b border-white/10 pb-2">Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input 
                  label="First Name" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  required 
                />
                <Input 
                  label="Last Name" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Input 
                  label="Phone Number" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              <AnimatePresence>
                {orderType === "delivery" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <h4 className="font-accent text-accent text-xs tracking-[0.2em] uppercase mt-8 mb-6 border-b border-white/10 pb-2">Delivery Address</h4>
                    <Input 
                      label="Street Address" 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})} 
                      required={orderType === "delivery"} 
                    />
                    <Input 
                      label="City / Suburb" 
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})} 
                      required={orderType === "delivery"} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="submit"
              disabled={isLoading || items.length === 0}
              className="mt-12 w-full bg-accent hover:bg-accent-hover text-background py-5 font-accent text-sm tracking-[0.2em] uppercase font-bold border-none transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                "Place Order"
              )}
            </button>
            <p className="text-center font-body text-xs text-text-muted mt-4">
              Secure payments powered by PayHere Sri Lanka.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}
