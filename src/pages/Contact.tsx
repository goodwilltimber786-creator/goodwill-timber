 import { useState } from "react";
 import { Navbar } from "@/components/layout/Navbar";
 import { Footer } from "@/components/layout/Footer";
 import { ContactForm } from "@/components/ContactForm";
 import { Phone, MapPin, Clock, MessageCircle, Bell } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { useToast } from "@/hooks/use-toast";
 
 const Contact = () => {
   const { toast } = useToast();
 
   const handleWhatsApp = () => {
     const message = encodeURIComponent("Hello, I'm interested in your timber products. Please provide more information.");
     window.open(`https://wa.me/918638264329?text=${message}`, "_blank");
   };
 
   return (
     <div className="min-h-screen">
       <Navbar />
       <main>
         {/* Header */}
         <section className="bg-primary py-12 md:py-16 lg:py-20">
           <div className="container mx-auto px-4">
             <h1 className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-primary-foreground text-center">
               Contact Us
             </h1>
             <p className="text-primary-foreground/70 text-center max-w-2xl mx-auto mt-3 md:mt-4 text-sm md:text-base">
               Get in touch for enquiries, bulk orders, or custom requirements
             </p>
           </div>
         </section>

         {/* Contact Content */}
         <section className="py-12 md:py-16 lg:py-20 bg-background">
           <div className="container mx-auto px-4">
             <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
               {/* Contact Info */}
               <div className="space-y-8">
                 <div>
                   <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4 md:mb-6 accent-underline inline-block">
                     Get In Touch
                   </h2>
                   <p className="text-muted-foreground text-sm md:text-base mt-6 md:mt-8">
                     Have questions about our products or need a custom quote? 
                     Our team is here to help you find the perfect materials for your project.
                   </p>
                 </div>

                 <div className="space-y-4 md:space-y-6">
                   <div className="flex items-start gap-3 md:gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                       <MapPin className="h-5 w-5 text-foreground" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground text-sm md:text-base">Address</h3>
                       <p className="text-muted-foreground text-xs md:text-sm mt-1">
                         Mirzabag By, Lane 1,<br />
                         West Milan Nagar, Amolapatty,<br />
                         Dibrugarh, Assam 786003
                       </p>
                     </div>
                   </div>

                   <div className="flex items-start gap-3 md:gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                       <Phone className="h-5 w-5 text-foreground" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground text-sm md:text-base">Phone</h3>
                       <a href="tel:+918638264329" className="text-muted-foreground text-xs md:text-sm mt-1 hover:text-foreground transition-colors">
                         +91 86382 64329
                       </a>
                     </div>
                   </div>

                   <div className="flex items-start gap-3 md:gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                       <Clock className="h-5 w-5 text-foreground" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground text-sm md:text-base">Business Hours</h3>
                       <p className="text-muted-foreground text-xs md:text-sm mt-1">
                         Mon - Sat: 9:00 AM - 7:00 PM<br />
                         Sunday: Closed
                       </p>
                     </div>
                   </div>

                   <div className="flex items-start gap-3 md:gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                       <MessageCircle className="h-5 w-5 text-foreground" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground text-sm md:text-base">Telegram</h3>
                       <a href="https://t.me/goodwilltimber" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs md:text-sm mt-1 hover:text-foreground transition-colors">
                         Chat with us on Telegram
                       </a>
                     </div>
                   </div>

                   <div className="flex items-start gap-3 md:gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                       <Bell className="h-5 w-5 text-foreground" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-foreground text-sm md:text-base">Admin Dashboard</h3>
                       <a href="/admin" className="text-muted-foreground text-xs md:text-sm mt-1 hover:text-foreground transition-colors">
                         View submissions and notifications
                       </a>
                     </div>
                   </div>
                 </div>

                 {/* WhatsApp Button */}
                 <Button
                   onClick={handleWhatsApp}
                   className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm md:text-base py-2 md:py-3"
                 >
                   <MessageCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                   Chat on WhatsApp
                 </Button>
               </div>

               {/* Contact Form */}
               <div className="lg:col-span-2">
                 <div className="bg-card rounded-lg p-4 md:p-6 lg:p-8 shadow-card border border-border">
                   <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-4 md:mb-6">
                     Send Us an Enquiry
                   </h2>
                   <ContactForm type="contact" hideEmail={true} />
                 </div>
               </div>
             </div>
 
           </div>
         </section>

         {/* Store Location Map */}
         <section className="py-8 md:py-12 lg:py-16 bg-muted">
           <div className="container mx-auto px-4">
             <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-foreground mb-6 md:mb-8 text-center">
               Our Store Location
             </h2>
             <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-80 lg:h-96">
               <iframe
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.2307342496665!2d94.9111135!3d27.462075199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3740a300f1a51135%3A0x3fe81f40be0c2766!2sM%2FS%20Goodwill%20Timber%20Trade!5e0!3m2!1sen!2sin!4v1771698855118!5m2!1sen!2sin"
                 width="100%"
                 height="100%"
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
                 title="Goodwill Timber Trade Location"
               />
             </div>
           </div>
         </section>
       </main>
       <Footer />
     </div>
   );
 };
 
 export default Contact;