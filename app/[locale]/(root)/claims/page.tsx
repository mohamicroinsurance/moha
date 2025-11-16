'use client'
import React from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Upload, CheckCircle, Phone, Mail, Clock, Shield } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Claims() {
  const { locale } = useParams() as { locale?: string };
  const t = useTranslations();
  const claimSteps = [
    {
      icon: FileText,
      title: t('claims.howItWorks.step1.title'),
      description: t('claims.howItWorks.step1.description'),
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Upload,
      title: t('claims.howItWorks.step2.title'),
      description: t('claims.howItWorks.step2.description'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: CheckCircle,
      title: t('claims.howItWorks.step3.title'),
      description: t('claims.howItWorks.step3.description'),
      color: "from-green-500 to-emerald-600"
    }
  ];

  const faqs = [
    {
      question: t('claims.faq.q1.question'),
      answer: t('claims.faq.q1.answer')
    },
    {
      question: t('claims.faq.q2.question'),
      answer: t('claims.faq.q2.answer')
    },
    {
      question: t('claims.faq.q3.question'),
      answer: t('claims.faq.q3.answer')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-orange-500/50">
              <Shield className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('claims.hero.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('claims.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {t('claims.hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link href={`/${locale}${createPageUrl("ClaimNew")}`}>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl text-lg px-8">
                  <FileText className="w-5 h-5 mr-2" />
                  {t('claims.hero.newClaim')}
                </Button>
              </Link>
              <a href="tel:+255123456789">
                <Button size="lg" variant="outline" className="border-2 border-white text-black hover:bg-white/10 text-lg px-8">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('claims.hero.hotline')}
                </Button>
              </a>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300">48hrs</div>
                <div className="text-sm text-blue-200">{t('claims.hero.stats.processing')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300">98%</div>
                <div className="text-sm text-blue-200">{t('claims.hero.stats.approved')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-300">24/7</div>
                <div className="text-sm text-blue-200">{t('claims.hero.stats.support')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Claim Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('claims.howItWorks.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('claims.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {claimSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="relative h-full border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="absolute -top-6 left-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardContent className="pt-12 pb-8 px-8">
                    <div className="text-blue-600 font-bold text-sm mb-2">STEP {index + 1}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}${createPageUrl("ClaimNew")}`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                {t('claims.howItWorks.button')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t('claims.emergency.title')}</h2>
              <p className="text-red-100 text-lg">
                {t('claims.emergency.description')}
              </p>
            </div>
            <div className="space-y-4">
              <a href="tel:+255123456789" className="flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-xl transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">{t('claims.emergency.hotline')}</div>
                  <div className="text-xl font-bold">+255 123 456 789</div>
                </div>
              </a>
              <a href="mailto:claims@moho.co.tz" className="flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-4 rounded-xl transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">{t('claims.emergency.email')}</div>
                  <div className="text-lg">claims@moho.co.tz</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('claims.faq.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('claims.faq.subtitle')}
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}