'use client'
import React from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Shield, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Products() {
  const t = useTranslations();
  const products = [
    {
      icon: Heart,
      title: t('products.life.title'),
      slug: "life",
      description: t('products.life.description'),
      features: [
        t('products.life.features.coverage'),
        t('products.life.features.affordable'),
        t('products.life.features.flexible'),
        t('products.life.features.accidental'),
        t('products.life.features.funeral'),
        t('products.life.features.education'),
        t('products.life.features.noMedical'),
        t('products.life.features.fastClaims')
      ],
      color: "from-pink-500 to-rose-500",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600",
      premium: t('products.life.premium'),
      coverageAmount: t('products.life.coverage')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('products.hero.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('products.hero.title')}
            </h1>
            <p className="text-xl text-blue-100">
              {t('products.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-96 md:h-auto overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-6 left-6 w-16 h-16 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <product.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Daily Premium</p>
                          <p className="text-2xl font-bold text-orange-600">{product.premium}</p>
                        </div>
                        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Coverage</p>
                          <p className="text-xl font-bold text-green-600">{product.coverageAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h3>
                    <p className="text-lg text-gray-600 mb-6">{product.description}</p>
                    
                    <div className="grid grid-cols-1 gap-3 mb-8">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      <Link href={`/products/${product.slug}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                          {t('products.life.learnMore')}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <Link href={createPageUrl("Support")} className="flex-1">
                        <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-6">
                          {t('products.life.getQuote')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('products.needHelp.title')}
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            {t('products.needHelp.description')}
          </p>
          <Link href={createPageUrl("Support")}>
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 shadow-xl text-lg px-8">
              {t('products.needHelp.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}