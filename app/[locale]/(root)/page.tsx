import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, Heart, ArrowRight, Phone, Coins,
  Users, Award, Clock, CheckCircle, TrendingUp,
  Handshake, GraduationCap, Building2, UserCheck, Target
} from "lucide-react";
import { getTranslations } from 'next-intl/server';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  const lifeInsuranceProduct = {
    icon: Heart,
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
    ]
  };

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600')] opacity-15 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-orange-500/50">
                <Shield className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-medium">Bima kwa Kila Mtanzania | Insurance for Every Tanzanian</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed">
                {t('home.hero.description')}
              </p>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Coins className="w-6 h-6 text-orange-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-orange-200 mb-1">Affordable. Accessible. Empowering.</p>
                    <p className="text-sm text-blue-100">
                      Weekly payments, easy enrollment, and coverage that fits your life. 
                      Built for the hardworking people of Tanzania.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href={`/${locale}/support`}>
                  <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 shadow-2xl hover:shadow-3xl transition-all text-lg px-8">
                    {t('home.hero.getStarted')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href={`/${locale}/support`}>
                  <Button size="lg" variant="outline" className="border-2 border-white bg-white text-black hover:bg-gray-100 text-lg px-8">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('common.contact')}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-300">10,000+</div>
                  <div className="text-xs md:text-sm text-blue-200">Families Protected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-300">98%</div>
                  <div className="text-xs md:text-sm text-blue-200">Claims Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-300">500+</div>
                  <div className="text-xs md:text-sm text-blue-200">Jobs Created</div>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800" 
                alt="Family Protection"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('products.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('products.description')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Life Insurance</h3>
                <p className="text-orange-600 font-semibold">500 TSH/day - Up to TSh 10 million coverage</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              Protect your family for just 500 TSH per day - affordable life insurance designed for everyday Tanzanians
            </p>
            
            <div className="flex gap-4">
              <Link href={`/${locale}/products`} className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {t('products.learnMore')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href={`/${locale}/support`} className="flex-1">
                <Button variant="outline" className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50">
                  {t('products.getQuote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY MOHA EXISTS - CEO MISSION SECTION */}
      <section className="py-20 bg-gradient-to-b from-white via-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600" 
                  alt="CEO"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl shadow-2xl max-w-xs">
                  <p className="font-bold text-lg mb-1">&quot;{t('home.mission.ceoQuote')}&quot;</p>
                  <p className="text-sm text-orange-100">- CEO, Founder</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">{t('home.mission.badge')}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('home.mission.title')}
              </h2>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">{t('home.mission.intro')}</p>
                <p>{t('home.mission.problem')}</p>
                <p>{t('home.mission.vision')}</p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
                  <p className="font-semibold text-blue-900 mb-2">{t('home.mission.impact.title')}</p>
                  <p className="text-sm text-blue-800">{t('home.mission.impact.description')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t('home.mission.values.affordability.title')}</p>
                      <p className="text-sm text-gray-600">{t('home.mission.values.affordability.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t('home.mission.values.community.title')}</p>
                      <p className="text-sm text-gray-600">{t('home.mission.values.community.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMPLOYMENT OPPORTUNITIES SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Handshake className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('home.employment.badge')}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('home.employment.title')}
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              {t('home.employment.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.employment.heslb.title')}</h3>
              <p className="text-blue-100 mb-4">{t('home.employment.heslb.description')}</p>
              <div className="text-sm text-orange-300 font-medium space-y-1">
                <div>✓ {t('home.employment.heslb.benefits.0')}</div>
                <div>✓ {t('home.employment.heslb.benefits.1')}</div>
                <div>✓ {t('home.employment.heslb.benefits.2')}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.employment.insurance.title')}</h3>
              <p className="text-blue-100 mb-4">{t('home.employment.insurance.description')}</p>
              <div className="text-sm text-orange-300 font-medium space-y-1">
                <div>✓ {t('home.employment.insurance.benefits.0')}</div>
                <div>✓ {t('home.employment.insurance.benefits.1')}</div>
                <div>✓ {t('home.employment.insurance.benefits.2')}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('home.employment.jobs.title')}</h3>
              <p className="text-blue-100 mb-4">{t('home.employment.jobs.description')}</p>
              <div className="text-sm text-orange-300 font-medium space-y-1">
                <div>✓ {t('home.employment.jobs.benefits.0')}</div>
                <div>✓ {t('home.employment.jobs.benefits.1')}</div>
                <div>✓ {t('home.employment.jobs.benefits.2')}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href={`/${locale}/resources`}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl text-lg px-8">
                {t('home.employment.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-blue-200 mt-4">{t('home.employment.footer')}</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-gradient-to-b from-blue-50 via-white to-orange-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-6">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">{t('home.testimonials.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.testimonials.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Award key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">{t('home.testimonials.footer')}</p>
            <Link href={`/${locale}/support`}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                {t('home.testimonials.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.whyChoose.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.whyChoose.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.whyChoose.families.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.families.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.whyChoose.experience.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.experience.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.whyChoose.support.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.support.description')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.whyChoose.claims.title')}</h3>
              <p className="text-gray-600">{t('home.whyChoose.claims.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS CAROUSEL */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-2xl font-bold text-gray-900 mb-12">
            {t('home.partners.title')}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white px-8 py-4 rounded-lg shadow-sm border border-gray-100">
                <span className="text-gray-600 font-medium whitespace-nowrap">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-orange-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-medium">{t('home.finalCta.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('home.finalCta.title')}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('home.finalCta.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+255123456789">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-2xl text-lg px-8">
                <Phone className="w-5 h-5 mr-2" />
                {t('home.finalCta.phone')}
              </Button>
            </a>
            <Link href={`/${locale}/support`}>
              <Button size="lg" variant="outline" className="border-2 border-white bg-white text-black hover:bg-gray-100 text-lg px-8">
                {t('home.finalCta.getQuote')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            {t('home.finalCta.features')}
          </p>
        </div>
      </section>
    </div>
  );
}