'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, Heart, ArrowRight,
  Phone, Coins, Users, Award, Clock, CheckCircle,
  TrendingUp, Handshake, GraduationCap, Building2, UserCheck, Target
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function FullHomePage() {
  const t = useTranslations('home');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const [count, setCount] = useState({ customers: 0, claims: 0, employees: 0 });

  // Animated counter effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => ({
        customers: prev.customers < 50000 ? prev.customers + 1000 : 50000,
        claims: prev.claims < 98 ? prev.claims + 2 : 98,
        employees: prev.employees < 500 ? prev.employees + 10 : 500
      }));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const lifeInsuranceProduct = {
    icon: Heart,
    title: t('products.life.title'),
    description: t('products.life.description'),
    slug: "life",
    color: "from-pink-500 to-rose-500",
    price: t('products.life.price'),
    coverageAmount: t('products.life.coverage'),
    benefits: [
      "Death benefit coverage up to TSh 10 million",
      "Affordable premiums - only 500 TSH per day",
      "Flexible payment options (daily, weekly, monthly)",
      "Accidental death benefit (double payout)",
      "Funeral expense coverage up to TSh 2 million",
      "Children's education fund protection",
      "Terminal illness advance payment",
      "No medical examination for basic coverage",
      "Outstanding debt/loan settlement coverage",
      "Family income replacement for 3-12 months",
      "24/7 claim processing and support",
      "Free annual health check-up"
    ],
    keyFeatures: [
      {
        title: t('products.life.keyFeatures.affordable.title'),
        description: t('products.life.keyFeatures.affordable.description'),
        icon: Coins
      },
      {
        title: t('products.life.keyFeatures.fast.title'),
        description: t('products.life.keyFeatures.fast.description'),
        icon: Clock
      },
      {
        title: t('products.life.keyFeatures.transparent.title'),
        description: t('products.life.keyFeatures.transparent.description'),
        icon: CheckCircle
      },
      {
        title: t('products.life.keyFeatures.easy.title'),
        description: t('products.life.keyFeatures.easy.description'),
        icon: UserCheck
      }
    ]
  };

  const features = [
    {
      icon: Users,
      title: t('whyChoose.families.title'),
      description: t('whyChoose.families.description')
    },
    {
      icon: Award,
      title: t('whyChoose.experience.title'),
      description: t('whyChoose.experience.description')
    },
    {
      icon: Clock,
      title: t('whyChoose.support.title'),
      description: t('whyChoose.support.description')
    },
    {
      icon: TrendingUp,
      title: t('whyChoose.claims.title'),
      description: t('whyChoose.claims.description')
    }
  ];

  const testimonials = [
    {
      name: "Joseph Mwamba",
      role: "Boda Boda Rider, Dar es Salaam",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      quote: "With Moha, I can protect my family for just 500 shillings a day. It's affordable and gives me peace of mind while I work.",
      rating: 5
    },
    {
      name: "Mama Grace",
      role: "Market Vendor, Arusha",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      quote: "When my husband fell sick, Moha paid our claim within one week. This insurance saved my family from debt. Asante sana!",
      rating: 5
    },
    {
      name: "David Komba",
      role: "Small Business Owner, Mwanza",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      quote: "I never thought insurance was for people like me. Moha changed that. Now my shop and my family are both protected.",
      rating: 5
    }
  ];

  const partners = [
    "Aga Khan Hospital", "Muhimbili National Hospital", "AAR Healthcare",
    "International School of Tanganyika", "Diamond Trust Bank", "CRDB Bank"
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600')] opacity-15 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-orange-500/50">
                <Shield className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-medium">{t('hero.badge')} | {t('hero.badgeSwahili')}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Coins className="w-6 h-6 text-orange-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-orange-200 mb-1">{t('hero.trustBadge.title')}</p>
                    <p className="text-sm text-blue-100">
                      {t('hero.trustBadge.description')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href={`/${locale}/support`}>
                  <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-2xl hover:shadow-3xl transition-all text-lg px-8">
                    {t('hero.getStarted')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href={`/${locale}/support`}>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('hero.callUs')}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <motion.div 
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-orange-300">
                    {count.customers.toLocaleString()}+
                  </div>
                  <div className="text-xs md:text-sm text-blue-200">{t('hero.stats.families')}</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-orange-300">{count.claims}%</div>
                  <div className="text-xs md:text-sm text-blue-200">{t('hero.stats.claims')}</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-orange-300">
                    {count.employees}+
                  </div>
                  <div className="text-xs md:text-sm text-blue-200">{t('hero.stats.jobs')}</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800" 
                  alt="Family Protection"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{t('hero.regulatedBadge')}</div>
                      <div className="text-sm text-gray-600">{t('hero.regulatedBy')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY MOHA EXISTS - CEO MISSION SECTION */}
      <section className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600" 
                  alt="CEO"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl shadow-2xl max-w-xs">
                  <p className="font-bold text-lg mb-1">&quot;{t('mission.ceoQuote')}&quot;</p>
                  <p className="text-sm text-orange-100">- CEO, Founder</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">{t('mission.badge')}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('mission.title')}
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  {t('mission.intro')}
                </p>
                
                <p>
                  {t('mission.problem')}
                </p>

                <p>
                  {t('mission.vision')}
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
                  <p className="font-semibold text-blue-900 mb-2">{t('mission.impact.title')}</p>
                  <p className="text-sm text-blue-800">
                    {t('mission.impact.description')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t('mission.values.affordability.title')}</p>
                      <p className="text-sm text-gray-600">{t('mission.values.affordability.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t('mission.values.community.title')}</p>
                      <p className="text-sm text-gray-600">{t('mission.values.community.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EMPLOYMENT OPPORTUNITIES SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Handshake className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('employment.badge')}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('employment.title')}
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              {t('employment.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('employment.heslb.title')}</h3>
              <p className="text-blue-100 mb-4">
                {t('employment.heslb.description')}
              </p>
              <div className="text-sm text-orange-300 font-medium space-y-1">
                <div>✓ {t('employment.heslb.benefits.0')}</div>
                <div>✓ {t('employment.heslb.benefits.1')}</div>
                <div>✓ {t('employment.heslb.benefits.2')}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('employment.insurance.title')}</h3>
              <p className="text-blue-100 mb-4">
                {t('employment.insurance.description')}
              </p>
              <div className="text-sm text-orange-300 font-medium space-y-1">
                <div>✓ {t('employment.insurance.benefits.0')}</div>
                <div>✓ {t('employment.insurance.benefits.1')}</div>
                <div>✓ {t('employment.insurance.benefits.2')}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('employment.jobs.title')}</h3>
              <p className="text-blue-100 mb-4">
                {t('employment.jobs.description')}
              </p>
              <div className="text-sm text-orange-300 font-medium space-y-1">
                <div>✓ {t('employment.jobs.benefits.0')}</div>
                <div>✓ {t('employment.jobs.benefits.1')}</div>
                <div>✓ {t('employment.jobs.benefits.2')}</div>
              </div>
            </motion.div>
          </div>

          <div className="text-center">
            <Link href={`/${locale}/resources`}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl text-lg px-8">
                {t('employment.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-blue-200 mt-4">
              {t('employment.footer')}
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION - Continue in next message due to length... */}
      <section id="products" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('products.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3 p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${lifeInsuranceProduct.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <lifeInsuranceProduct.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">{lifeInsuranceProduct.title}</h3>
                  <div className="flex items-baseline gap-4 mb-4">
                    <div className="text-4xl font-bold text-orange-600">{lifeInsuranceProduct.price}</div>
                    <div className="text-lg text-gray-600">{t('products.life.coverage')}: {lifeInsuranceProduct.coverageAmount}</div>
                  </div>
                  <p className="text-lg text-gray-700 mb-8">{lifeInsuranceProduct.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {lifeInsuranceProduct.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <feature.icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-bold text-gray-900">{feature.title}</div>
                          <div className="text-sm text-gray-600">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Link href={`/${locale}/products/${lifeInsuranceProduct.slug}`} className="flex-1">
                      <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                        {t('products.life.viewDetails')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href={`/${locale}/support`} className="flex-1">
                      <Button size="lg" variant="outline" className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50">
                        {t('products.life.getQuote')}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 p-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">{t('products.life.benefitsTitle')}</h4>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {lifeInsuranceProduct.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/products`}>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                {t('products.learnMore')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Rest of sections in next part... */}
    </div>
  );
}
