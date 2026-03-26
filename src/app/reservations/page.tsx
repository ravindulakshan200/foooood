"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/common/Input";
import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/providers/ToastProvider";

export default function ReservationsPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    time: "19:00",
    guests: 2,
    requests: "",
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const timeSlots = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

  const nextStep = () => {
    if (step === 1 && (!formData.date || !formData.time)) return;
    if (step === 2 && (!formData.guests)) return;
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return nextStep();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast("Please fill in all contact details.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert([{
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        special_requests: formData.requests,
        status: 'pending'
      }]);

      if (error) {
        toast("Failed to submit reservation. Please try again.", "error");
        console.error(error);
      } else {
        toast("Reservation successfully submitted!", "success");
        setIsSubmitted(true);
        setFormData({
          date: format(new Date(), "yyyy-MM-dd"),
          time: "19:00",
          guests: 2,
          requests: "",
          name: "",
          phone: "",
          email: "",
        });
        setStep(1);
      }
    } catch (err) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (isSubmitted) {
    return (
      <div className="flex-grow bg-background flex flex-col items-center justify-center -mt-24 min-h-screen relative z-10 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card glass border border-accent/20 rounded-3xl p-12 max-w-lg w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-hover" />
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-8" />
          <h2 className="font-heading text-4xl text-white tracking-wide mb-4">Table Reserved</h2>
          <p className="font-body text-text-muted text-lg mb-8 leading-relaxed">
            We eagerly anticipate your arrival, {formData.name}. A confirmation email has been dispatched to {formData.email}.
          </p>
          <div className="bg-background p-6 rounded-xl border border-white/5 mx-auto text-left flex flex-col gap-4 text-white font-body mb-8">
            <div className="flex justify-between border-b border-white/5 pb-2">
               <span className="text-text-muted">Date & Time</span>
               <span>{format(new Date(formData.date), "MMM d, yyyy")} at {formData.time}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
               <span className="text-text-muted">Guests</span>
               <span>{formData.guests} people</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-accent text-background uppercase font-accent text-xs tracking-widest font-bold py-4 hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 block text-center"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative z-10 flex flex-col">
      {/* Hero */}
      <div className="relative h-[50vh] w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2940&auto=format&fit=crop')]" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center mt-20">
          <span className="font-accent text-accent tracking-[0.3em] text-xs uppercase mb-4 block">Securing Perfection</span>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-white tracking-wide">Reserve Your Table</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 -mt-24 mb-32 relative z-20 max-w-3xl">
        <div className="bg-card glass rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          
          {/* Progress Bar & Steps */}
          <div className="p-8 border-b border-white/5 relative">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-background">
              <motion.div 
                className="h-full bg-accent"
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <div className="flex justify-between max-w-sm mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className={`flex flex-col items-center gap-2 ${step >= i ? "text-accent" : "text-white/20"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading text-xl border ${step >= i ? "border-accent bg-accent/10" : "border-white/20"}`}>
                    {i}
                  </div>
                  <span className="font-accent text-[10px] tracking-widest uppercase font-bold">
                    {i === 1 ? 'Date' : i === 2 ? 'Details' : 'Contact'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 overflow-hidden min-h-[500px] flex flex-col relative text-white">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={formVariants} initial="initial" animate="animate" exit="exit" className="flex-1 w-full flex flex-col justify-center">
                  <h3 className="font-heading text-3xl mb-8 font-light tracking-wide border-b border-white/10 pb-4">Select Date & Time</h3>
                  
                  <div className="mb-8">
                    <label className="font-accent text-xs tracking-[0.2em] text-accent uppercase mb-4 block">Choose Date</label>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar snap-x">
                      {dates.map((d, i) => {
                        const dateStr = format(d, "yyyy-MM-dd");
                        const isSelected = formData.date === dateStr;
                        return (
                          <div 
                            key={i} 
                            onClick={() => setFormData({...formData, date: dateStr})}
                            className={`snap-start shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border ${
                              isSelected ? "bg-accent text-background font-bold border-accent shadow-[0_0_15px_rgba(201,168,76,0.3)]" : "bg-background/50 border-white/10 text-white hover:border-white/30"
                            }`}
                          >
                            <span className="font-accent text-[10px] tracking-widest uppercase mb-1">{format(d, "EEE")}</span>
                            <span className="font-heading text-3xl">{format(d, "d")}</span>
                            <span className="font-accent text-[10px] tracking-widest uppercase mt-1">{format(d, "MMM")}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="font-accent text-xs tracking-[0.2em] text-accent uppercase mb-4 block">Choose Time</label>
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots.map(t => (
                        <div
                          key={t}
                          onClick={() => setFormData({...formData, time: t})}
                          className={`py-3 rounded-lg text-center font-body text-sm cursor-pointer transition-colors border ${
                            formData.time === t ? "bg-accent border-accent text-background font-medium" : "bg-background/50 border-white/10 hover:border-white/30 text-white"
                          }`}
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={formVariants} initial="initial" animate="animate" exit="exit" className="flex-1 w-full flex flex-col justify-center relative">
                  <h3 className="font-heading text-3xl mb-8 font-light tracking-wide border-b border-white/10 pb-4">Guests & Preferences</h3>
                  
                  <div className="mb-10">
                    <label className="font-accent text-xs tracking-[0.2em] text-accent uppercase mb-6 block">Number of Guests</label>
                    <div className="flex items-center justify-center gap-12 bg-background/50 p-6 rounded-2xl border border-white/10">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-2xl"
                      >
                        -
                      </button>
                      <span className="font-heading text-6xl text-white">{formData.guests}</span>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, guests: Math.min(12, formData.guests + 1)})}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors text-2xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-accent text-xs tracking-[0.2em] text-text-muted uppercase mb-4 block">Special Requests (Optional)</label>
                    <textarea 
                      value={formData.requests}
                      onChange={(e) => setFormData({...formData, requests: e.target.value})}
                      placeholder="Allergies, anniversaries, precise seating requirements..."
                      className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white font-body min-h-[120px] focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/30"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={formVariants} initial="initial" animate="animate" exit="exit" className="flex-1 w-full flex flex-col justify-center relative">
                  <h3 className="font-heading text-3xl mb-8 font-light tracking-wide border-b border-white/10 pb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <Input 
                      label="Full Name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
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
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-10 flex gap-4 w-full relative z-20 bg-card">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex-1 max-w-[120px] border border-white/20 text-white font-accent text-xs tracking-widest uppercase hover:text-accent hover:border-accent transition-colors flex items-center justify-center gap-2 py-4 shadow-xl"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex-1 bg-accent text-background font-accent text-xs tracking-widest uppercase font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 py-4 shadow-xl shadow-accent/20"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-accent text-background font-accent text-xs tracking-widest uppercase font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 py-4 shadow-xl shadow-accent/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
                  ) : (
                    <>Confirm Reservation <CheckCircle className="w-4 h-4" /></>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
