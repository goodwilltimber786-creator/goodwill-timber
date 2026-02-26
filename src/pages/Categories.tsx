import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/api";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";
import { MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const whatsappNumber = "918638264329";

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-primary py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-display font-bold text-primary-foreground text-center">
              Our Categories
            </h1>
            <p className="text-primary-foreground/70 text-center max-w-2xl mx-auto mt-3 md:mt-4 text-sm md:text-base">
              Explore our wide range of timber, plywood, doors, fittings, and hardware
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
              {isLoading ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-muted-foreground">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-muted-foreground">No categories available</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => navigate(`/products`)}
                    className="bg-card rounded border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    {/* Category Image */}
                    <div className="w-full h-32 md:h-40 overflow-hidden bg-muted">
                      {category.image_path ? (
                        <img
                          src={category.image_path}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl mb-1">📦</div>
                            <span className="text-muted-foreground text-xs font-medium">{category.name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm md:text-base font-semibold text-foreground mb-1 line-clamp-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Store Location Section */}
        <section className="py-8 md:py-10 lg:py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-foreground mb-6 md:mb-8 text-center">
              Our Store Location
            </h2>

            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-72 lg:h-80">
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

              {/* Location Details */}
              <div className="flex flex-col justify-center space-y-4">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                    M/S Goodwill Timber Trade
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    Premium timber and construction materials
                  </p>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5 text-sm">Address</h4>
                    <p className="text-muted-foreground text-xs md:text-sm">
                      Mirzabag By, Lane 1,<br />
                      West Milan Nagar, Amolapatty,<br />
                      Dibrugarh, Assam 786003
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5 text-sm">Phone</h4>
                    <a
                      href="tel:+918638264329"
                      className="text-primary hover:underline text-xs md:text-sm font-medium"
                    >
                      +91 86382 64329
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-0.5 text-sm">Email</h4>
                    <a
                      href="mailto:goodwilltimber786@gmail.com"
                      className="text-primary hover:underline text-xs md:text-sm font-medium break-all"
                    >
                      goodwilltimber786@gmail.com
                    </a>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/M%2FS+Goodwill+Timber+Trade/@27.462075,94.9111135,15z`,
                      "_blank"
                    )
                  }
                  className="mt-3 py-2 md:py-2.5 px-4 md:px-6 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-xs md:text-sm w-full sm:w-auto"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Floating Button */}
      <WhatsAppFloating
        phoneNumber={whatsappNumber}
        message="Hi! I'm interested in your products. Can you help me?"
      />

      <Footer />
    </div>
  );
};

export default Categories;
