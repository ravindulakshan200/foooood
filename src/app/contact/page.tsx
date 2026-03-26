"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import Input from "@/components/common/Input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/providers/ToastProvider";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast("Please fill in all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message
      }]);

      if (error) {
        toast("Failed to send message. Please try again.", "error");
      } else {
        setFormData({ name: "", email: "", message: "" });
        toast("Message sent successfully. We will be in touch shortly.", "success");
      }
    } catch (err) {
      toast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative z-10">
      
      {/* Header Banner */}
      <div className="relative h-[40vh] w-full flex items-center justify-center -mt-24 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2940&auto=format&fit=crop')]" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center mt-20">
          <span className="font-accent text-accent tracking-[0.3em] text-xs uppercase mb-4 block">Reach Out</span>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-white tracking-wide">Contact Us</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mb-32 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left: Contact Info & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-12"
          >
            <div>
              <h2 className="font-heading text-4xl text-white mb-8 font-light tracking-wide">Get in Touch</h2>
              <p className="font-body text-text-muted text-lg font-light leading-relaxed mb-10">
                Whether you have an inquiry about private dining, dietary requirements, or career opportunities, our concierge is at your service.
              </p>
              
              <ul className="flex flex-col gap-8 font-body text-text-muted">
                <li className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h5 className="text-white font-accent text-xs tracking-[0.2em] uppercase mb-2">Location</h5>
                    <p className="leading-relaxed">7th Lane, Wickramasinghepura Rd, Battaramulla</p>
                  </div>
                </li>
                <li className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h5 className="text-white font-accent text-xs tracking-[0.2em] uppercase mb-2">Reservations</h5>
                    <p>0777 222 069 / 0767 074 385</p>
                  </div>
                </li>
                <li className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h5 className="text-white font-accent text-xs tracking-[0.2em] uppercase mb-2">Email Directory</h5>
                    <p>anushadilruksh88@gmail.com</p>
                  </div>
                </li>
                <li className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h5 className="text-white font-accent text-xs tracking-[0.2em] uppercase mb-2">Opening Hours</h5>
                    <p>Mon-Sat: 10:00 AM - 10:00 PM<br/>Sun: 11:00 AM - 9:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Dark Styled Map */}
            <div className="w-full h-[300px] border border-white/10 rounded-2xl overflow-hidden glass relative group">
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors pointer-events-none z-10" />
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1m2!1s0x3ae25923838dc2fd%3A0x6b72d2448373b5ae!2sColombo%2003%2C%20Colombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) opacity(80%)" }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="bg-card glass border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              
              <h3 className="font-heading text-3xl font-light text-white mb-10 tracking-wide border-b border-white/10 pb-6">
                Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                <Input 
                  label="Your Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input 
                  label="Email Address" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                
                {/* Custom Textarea with floating label logic manually applied for simplicity here */}
                <div className="relative mt-4 mb-4">
                  <textarea
                    className="peer w-full bg-card border-b-2 border-white/20 px-4 pt-6 pb-2 text-white font-body text-base outline-none transition-all placeholder-transparent min-h-[150px] focus:border-accent focus:bg-white/5 resize-none"
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                  <label className={`absolute left-4 top-2 text-xs font-accent tracking-widest uppercase transition-all pointer-events-none ${
                    formData.message ? "text-accent" : "peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:font-body peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-text-muted peer-focus:top-2 peer-focus:text-xs peer-focus:font-accent peer-focus:tracking-widest peer-focus:uppercase peer-focus:text-accent"
                  }`}>
                    Your Message
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-8 bg-accent/10 border border-accent hover:bg-accent hover:text-background text-accent py-5 font-accent text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        
        </div>
      </div>
    </div>
  );
}
