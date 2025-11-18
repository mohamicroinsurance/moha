'use client'
import React from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Award, TrendingUp, Target, Heart, Briefcase, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function About() {
  const { locale } = useParams() as { locale?: string };
  const t = useTranslations();
  const timeline = [
    { year: "2010", title: "Company Founded", description: "Moho Insurance established in Dar es Salaam" },
    { year: "2013", title: "Nationwide Expansion", description: "Opened branches in Arusha and Mwanza" },
    { year: "2016", title: "Digital Transformation", description: "Launched online services and mobile app" },
    { year: "2019", title: "50,000 Customers", description: "Reached milestone of 50,000 satisfied customers" },
    { year: "2022", title: "Industry Recognition", description: "Awarded Best Insurance Company in Tanzania" },
    { year: "2024", title: "Continued Growth", description: "Expanding services and coverage options" }
  ];

  const leadership = [
    { name: "Dr. James Mwangi", position: "Chief Executive Officer", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
    { name: "Sarah Kimaro", position: "Chief Financial Officer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
    { name: "David Masanja", position: "Chief Operations Officer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
    { name: "Grace Ndege", position: "Head of Claims", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" }
  ];

  const values = [
    { icon: Shield, title: t('about.values.trust.title'), description: t('about.values.trust.description') },
    { icon: Heart, title: t('about.values.customer.title'), description: t('about.values.customer.description') },
    { icon: Award, title: t('about.values.excellence.title'), description: t('about.values.excellence.description') },
    { icon: Target, title: t('about.values.innovation.title'), description: t('about.values.innovation.description') }
  ];

  const partners = [
    "Aga Khan Hospital", "Muhimbili National Hospital", "AAR Healthcare", 
    "CRDB Bank", "Diamond Trust Bank", "Tanzania Revenue Authority"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('about.hero.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {t('about.hero.subtitle')}
            </p>
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-300">50K+</div>
                <div className="text-sm text-blue-200">{t('about.hero.stats.families')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-300">500+</div>
                <div className="text-sm text-blue-200">{t('about.hero.stats.jobs')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-orange-300">14</div>
                <div className="text-sm text-blue-200">{t('about.hero.stats.years')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 
        CEO MISSION - WHY WE EXIST
        IMAGE NEEDED: CEO photo with community members, or visiting field agents
      */}
      <section className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800" 
                alt="CEO - Founder"
                className="rounded-2xl shadow-2xl"
              />
              <div className="mt-6 bg-orange-500 text-white p-6 rounded-xl">
                <p className="text-lg font-semibold mb-2">"Insurance shouldn't be a luxury"</p>
                <p className="text-sm text-orange-100">
                  "Every Tanzanian deserves the dignity of protection. That's why we created 
                  Moha  affordable insurance for the people, by the people."
                </p>
                <p className="text-sm mt-3 font-medium"> [CEO Name], Founder & CEO</p>
              </div>
            </motion.div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">{t('about.mission.tag')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('about.mission.intro')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="text-gray-900">{t('about.mission.changed')}</strong> {t('about.mission.solution')}
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3">{t('about.mission.beyondTitle')}</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
                    <span>{t('about.mission.beyondItems.jobs')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
                    <span>{t('about.mission.beyondItems.heslb')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
                    <span>{t('about.mission.beyondItems.insurance')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
                    <span>{t('about.mission.beyondItems.community')}</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-1">50,000+</div>
                  <div className="text-sm text-blue-900">Families Protected</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-1">98%</div>
                  <div className="text-sm text-orange-900">Claims Paid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full group">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.journey.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('about.journey.subtitle')}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden lg:block" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className="flex-1 lg:text-right">
                    <Card className="border-0 shadow-lg inline-block">
                      <CardContent className="p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden lg:block w-4 h-4 bg-blue-600 rounded-full z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('about.leadership.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('about.leadership.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={leader.image} 
                      alt={leader.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                    <p className="text-blue-600 font-medium">{leader.position}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-2xl font-bold text-gray-900 mb-12">
            {t('about.partners.title')}
          </h3>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-12 items-center"
              animate={{ x: [0, -1000] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...partners, ...partners].map((partner, index) => (
                <div key={index} className="flex-shrink-0 bg-white px-8 py-4 rounded-lg shadow-sm border border-gray-100">
                  <span className="text-gray-600 font-medium whitespace-nowrap">{partner}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Whistleblowing CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('about.whistleblowing.title')}</h2>
          <p className="text-lg text-gray-300 mb-8">
            {t('about.whistleblowing.description')}
          </p>
          <Link href={`/${locale}${createPageUrl("Whistleblowing")}`}>
            <Button size="lg" variant="outline" className="border-white bg-white text-black hover:bg-gray-100 hover:text-gray-900">
              {t('about.whistleblowing.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('about.joinTeam.title')}
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            {t('about.joinTeam.description')}
          </p>
          <Link href={`/${locale}${createPageUrl("Resources")}#careers`}>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 shadow-xl text-lg px-8">
                {t('about.joinTeam.button')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
        </div>
      </section>
    </div>
  );
}