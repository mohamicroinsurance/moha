'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Support() {
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: "", phone: "", preferredTime: "" });
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
const t = useTranslations();

  const branches = [
    { name: "Dar es Salaam - Head Office", address: "Samora Avenue, Plot 123", phone: "+255 123 456 789", region: "Dar es Salaam" },
    { name: "Arusha Branch", address: "Clock Tower Area, Plot 45", phone: "+255 123 456 790", region: "Arusha" },
    { name: "Mwanza Branch", address: "Kenyatta Road, Plot 67", phone: "+255 123 456 791", region: "Mwanza" },
    { name: "Dodoma Branch", address: "Nyerere Road, Plot 89", phone: "+255 123 456 792", region: "Dodoma" },
  ];

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSubmitted(true);
    setTimeout(() => setCallbackSubmitted(false), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MessageCircle className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('support.hero.tag')}</span>
            </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{t('support.hero.title')}</h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">{t('support.hero.subtitle')}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
                <div className="text-center">
                  <Phone className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">{t('support.stats.callAnytime')}</div>
                </div>
                <div className="text-center">
                  <Mail className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">{t('support.stats.emailSupport')}</div>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">{t('support.stats.branchesCount')}</div>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                  <div className="text-sm text-blue-200">{t('support.stats.fastResponse')}</div>
                </div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 -mt-16 relative z-10">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('support.cards.callUs.title')}</h3>
                <p className="text-gray-600 mb-4">{t('support.cards.callUs.subtitle')}</p>
                <a href="tel:+255123456789" className="text-blue-600 font-semibold hover:text-blue-700">
                  +255 123 456 789
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('support.cards.emailUs.title')}</h3>
                <p className="text-gray-600 mb-4">{t('support.cards.emailUs.subtitle')}</p>
                <a href="mailto:info@moho.co.tz" className="text-blue-600 font-semibold hover:text-blue-700">
                  info@moho.co.tz
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('support.cards.hours.title')}</h3>
                <p className="text-gray-600 mb-2">{t('support.cards.hours.weekdays')}</p>
                <p className="text-gray-600">{t('support.cards.hours.saturday')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Request Callback & Contact Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Request Callback */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('support.callback.title')}</h2>
                    <p className="text-gray-600">{t('support.callback.subtitle')}</p>
                  </div>
                </div>

                {!callbackSubmitted ? (
                  <form onSubmit={handleCallbackSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">{t('support.callback.form.nameLabel')}</Label>
                        <Input
                          id="name"
                          placeholder={t('support.callback.form.namePlaceholder')}
                          value={callbackData.name}
                          onChange={(e) => setCallbackData({...callbackData, name: e.target.value})}
                          required
                        />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('support.callback.form.phoneLabel')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t('support.callback.form.phonePlaceholder')}
                          value={callbackData.phone}
                          onChange={(e) => setCallbackData({...callbackData, phone: e.target.value})}
                          required
                        />
                    </div>
                    <div>
                      <Label htmlFor="time">{t('support.callback.form.timeLabel')}</Label>
                      <Input
                        id="time"
                        placeholder={t('support.callback.form.timePlaceholder')}
                        value={callbackData.preferredTime}
                        onChange={(e) => setCallbackData({...callbackData, preferredTime: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      {t('support.callback.form.submit')}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('support.callback.success.title')}</h3>
                    <p className="text-gray-600">{t('support.callback.success.subtitle')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('support.contact.title')}</h2>
                    <p className="text-gray-600">{t('support.contact.subtitle')}</p>
                  </div>
                </div>

                {!contactSubmitted ? (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="contact-name">{t('support.contact.form.nameLabel')}</Label>
                      <Input
                        id="contact-name"
                        placeholder={t('support.contact.form.namePlaceholder')}
                        value={contactData.name}
                        onChange={(e) => setContactData({...contactData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('support.contact.form.emailLabel')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('support.contact.form.emailPlaceholder')}
                        value={contactData.email}
                        onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">{t('support.contact.form.messageLabel')}</Label>
                      <Textarea
                        id="message"
                        placeholder={t('support.contact.form.messagePlaceholder')}
                        rows={4}
                        value={contactData.message}
                        onChange={(e) => setContactData({...contactData, message: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      {t('support.contact.form.submit')}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('support.contact.success.title')}</h3>
                    <p className="text-gray-600">{t('support.contact.success.subtitle')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="py-16 bg-white" id="branches">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('support.branches.title')}</h2>
            <p className="text-lg text-gray-600">{t('support.branches.description')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((branch, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{branch.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{branch.address}</p>
                  <a href={`tel:${branch.phone}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    {branch.phone}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}