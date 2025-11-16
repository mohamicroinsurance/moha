'use client'
import React from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail, Navigation, ExternalLink } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function BranchLocator() {
  const { locale } = useParams() as { locale?: string };
  const t = useTranslations();
  const branches = [
    {
      name: "Dar es Salaam - Head Office",
      address: "Samora Avenue, Plot 123, Dar es Salaam",
      phone: "+255 123 456 789",
      email: "darsalaam@moho.co.tz",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      region: "Dar es Salaam",
      services: ["All Insurance Products", "Claims Processing", "Customer Service"],
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.2678045634274!2d39.282911614778904!3d-6.8170489950445165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4b5ae2c71c33%3A0x5f38c6c85c5b5c68!2sSamora%20Avenue%2C%20Dar%20es%20Salaam!5e0!3m2!1sen!2stz!4v1234567890123!5m2!1sen!2stz"
    },
    {
      name: "Arusha Branch",
      address: "Clock Tower Area, Plot 45, Arusha",
      phone: "+255 123 456 790",
      email: "arusha@moho.co.tz",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      region: "Arusha",
      services: ["Insurance Products", "Claims Processing", "Consultations"],
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7029561089786!2d36.68206451474168!3d-3.386795243644522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x183c1e1c0e0b1b5b%3A0x5b5c5c5c5c5c5c5c!2sClock%20Tower%2C%20Arusha!5e0!3m2!1sen!2stz!4v1234567890124!5m2!1sen!2stz"
    },
    {
      name: "Mwanza Branch",
      address: "Kenyatta Road, Plot 67, Mwanza",
      phone: "+255 123 456 791",
      email: "mwanza@moho.co.tz",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      region: "Mwanza",
      services: ["Insurance Products", "Claims Processing", "Consultations"],
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.492092845756!2d32.9320617147481!3d-2.5236366977927836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d08c0e5f5f5f5f%3A0x5b5c5c5c5c5c5c5c!2sKenyatta%20Road%2C%20Mwanza!5e0!3m2!1sen!2stz!4v1234567890125!5m2!1sen!2stz"
    },
    {
      name: "Dodoma Branch",
      address: "Nyerere Road, Plot 89, Dodoma",
      phone: "+255 123 456 792",
      email: "dodoma@moho.co.tz",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      region: "Dodoma",
      services: ["Insurance Products", "Claims Processing", "Consultations"],
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.792896423456!2d35.74586141475092!3d-6.1630436977890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184b8c9f0f0f0f0f%3A0x5b5c5c5c5c5c5c5c!2sNyerere%20Road%2C%20Dodoma!5e0!3m2!1sen!2stz!4v1234567890126!5m2!1sen!2stz"
    },
    {
      name: "Mbeya Branch",
      address: "Lumumba Street, Plot 34, Mbeya",
      phone: "+255 123 456 793",
      email: "mbeya@moho.co.tz",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      region: "Mbeya",
      services: ["Insurance Products", "Claims Processing"],
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.609287456123!2d33.46865141474901!3d-8.9098436978012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18c6d8e8e8e8e8e8e%3A0x5b5c5c5c5c5c5c5c!2sLumumba%20Street%2C%20Mbeya!5e0!3m2!1sen!2stz!4v1234567890127!5m2!1sen!2stz"
    },
    {
      name: "Moshi Branch",
      address: "Market Street, Plot 78, Moshi",
      phone: "+255 123 456 794",
      email: "moshi@moho.co.tz",
      hours: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      region: "Kilimanjaro",
      services: ["Insurance Products", "Consultations"],
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.7892567890123!2d37.33325141474856!3d-3.3345436978001234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x183d1f2f2f2f2f2f2%3A0x5b5c5c5c5c5c5c5c!2sMarket%20Street%2C%20Moshi!5e0!3m2!1sen!2stz!4v1234567890128!5m2!1sen!2stz"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 to-blue-900/70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('branchLocator.hero.title')}</h1>
            <p className="text-xl text-blue-100">{t('branchLocator.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Card className="border-0 shadow-lg overflow-hidden h-full">
              <div className="relative h-96 bg-gray-200 w-full">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200" 
                  alt="Tanzania Map"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-2xl font-bold mb-2">{t('branchLocator.map.branches')}</h3>
                  <p className="text-blue-100">{t('branchLocator.map.serving')}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full flex flex-col overflow-hidden">
                  {/* Embedded Google Map */}
                  <div className="relative flex-1 min-h-[300px] w-full mt-0">
                    <iframe
                      src={branch.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  <CardContent className="p-6 flex-shrink-0 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{branch.name}</h3>
                        <div className="text-sm text-gray-500">{branch.region}</div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 flex-shrink-0 text-blue-600" />
                        <a href={`tel:${branch.phone}`} className="text-blue-600 hover:text-blue-700 font-medium">
                          {branch.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <a href={`mailto:${branch.email}`} className="hover:text-blue-600">
                          {branch.email}
                        </a>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{branch.hours}</span>
                      </div>
                    </div>

                    {/* Get Directions Button */}
                    <div className="mb-6">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                          <Navigation className="w-4 h-4" />
                          {t('branchLocator.directions')}
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>

                    <div className="border-t pt-4 mt-auto">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('branchLocator.services')}</div>
                      <div className="flex flex-wrap gap-2">
                        {branch.services.map((service, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('branchLocator.cta.title')}</h2>
          <p className="text-lg text-blue-100 mb-8">{t('branchLocator.cta.subtitle')}</p>
          <Link href={`/${locale}${createPageUrl("Support")}`}>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 shadow-xl text-lg px-8">
              <Phone className="w-5 h-5 mr-2" />
              {t('branchLocator.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}