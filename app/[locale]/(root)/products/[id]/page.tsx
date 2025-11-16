'use client'
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Car, Plane, Briefcase, Home, CheckCircle, Download, Phone, ArrowRight, Shield } from "lucide-react";

export default function ProductDetails() {
  const { id, locale } = useParams() as { id?: string; locale?: string };
  const productSlug = id || 'life';

  const products: Record<string, any> = {
    life: {
      icon: Heart,
      title: "Life Insurance",
      subtitle: "Protect your family for just 500 TSH per day",
      color: "from-pink-500 to-rose-500",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200",
      overview: "Moha Life Insurance is specifically designed for everyday Tanzanians - boda boda riders, market vendors, small business owners, and hardworking families. For just 500 TSH per day (approximately 15,000 TSH per month), you can secure your family's financial future and ensure they are protected even when you're gone.",
      premiumDetails: {
        daily: "500 TSH",
        weekly: "3,500 TSH",
        monthly: "15,000 TSH",
        annually: "180,000 TSH"
      },
      coverageAmount: "Up to TSh 10,000,000",
      ageRange: "18-65 years",
      policyTerm: "1 to 30 years renewable",
      benefits: [
        "Death benefit coverage up to TSh 10 million",
        "Affordable premiums - only 500 TSH per day",
        "Flexible payment options - daily, weekly, or monthly",
        "Accidental death benefit (double payout)",
        "Funeral expense coverage up to TSh 2 million",
        "Children's education fund protection",
        "Terminal illness advance payment",
        "No medical examination required for basic coverage",
        "Outstanding debt/loan settlement coverage",
        "Family income replacement for 3-12 months",
        "24/7 claim processing and support",
        "Free annual health check-up"
      ],
      coverage: [
        "Natural death from any cause",
        "Accidental death (road, workplace, home)",
        "Terminal illness diagnosis (advance payment)",
        "Permanent total disability coverage",
        "Funeral and burial expenses",
        "Children's education continuation fund",
        "Outstanding loan/mortgage settlement",
        "Medical expenses prior to death (up to TSh 500,000)",
        "Repatriation of remains (within Tanzania)",
        "Family bereavement counseling services"
      ],
      keyFeatures: [
        { 
          title: "Affordable for Everyone",
          description: "Just 500 TSH per day - less than the cost of a soda. Built specifically for hardworking Tanzanians."
        },
        {
          title: "Flexible Payments",
          description: "Choose daily, weekly, or monthly payments. Pay via M-Pesa, Tigo Pesa, Airtel Money, or bank transfer."
        },
        {
          title: "Fast Claims Processing",
          description: "98% of claims paid within 7 days. We understand families need support quickly during difficult times."
        },
        {
          title: "No Hidden Fees",
          description: "Transparent pricing. What you see is what you pay. No surprise charges or hidden terms."
        },
        {
          title: "Family Protection",
          description: "Ensure your spouse, children, and dependents are financially secure even in your absence."
        },
        {
          title: "Easy Enrollment",
          description: "Simple application process. No complicated forms or lengthy medical exams for standard coverage."
        }
      ],
      exclusions: [
        "Suicide within first 2 years of policy",
        "Death due to pre-existing terminal illness not disclosed at enrollment",
        "Death while committing a crime",
        "Death from war or acts of terrorism",
        "Self-inflicted injuries"
      ],
      documents: [
        { name: "Life Insurance Policy Document", size: "2.4 MB" },
        { name: "Premium Calculator", size: "856 KB" },
        { name: "Claim Form", size: "1.2 MB" },
        { name: "Beneficiary Nomination Form", size: "645 KB" },
        { name: "Payment Schedule Guide", size: "523 KB" },
        { name: "Frequently Asked Questions", size: "1.8 MB" }
      ]
    }
  };

  const product = products[productSlug] || products.life;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-3xl"
          >
            <div className={`inline-flex items-center gap-3 bg-gradient-to-br ${product.color} px-6 py-3 rounded-xl mb-6 shadow-lg`}>
              <product.icon className="w-6 h-6" />
              <span className="font-semibold">{product.title}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {product.subtitle}
            </h1>
            <p className="text-xl text-blue-100">
              Comprehensive coverage designed with your needs in mind
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="coverage">Coverage</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.overview}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Our {product.title}?</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Comprehensive Coverage</h4>
                          <p className="text-sm text-gray-600">All-inclusive protection for peace of mind</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Fast Claims</h4>
                          <p className="text-sm text-gray-600">Quick processing and settlement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                          <p className="text-sm text-gray-600">Always available when you need us</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Trusted by 50K+</h4>
                          <p className="text-sm text-gray-600">Tanzania's preferred choice</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
                    <div className="space-y-4">
                      {product.benefits.map((benefit: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-lg">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="coverage">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Covered</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {product.coverage.map((item: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    {product.exclusions && (
                      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-lg font-bold text-red-900 mb-4">Important Exclusions</h3>
                        <ul className="space-y-2">
                          {product.exclusions.map((exclusion: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-red-800">
                              <span className="text-red-600 mt-1">⚠</span>
                              <span>{exclusion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="premium">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Premium Details</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-300">
                        <h3 className="text-sm font-medium text-orange-900 mb-2">Daily Premium</h3>
                        <p className="text-4xl font-bold text-orange-600">{product.premiumDetails?.daily}</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">Monthly Premium</h3>
                        <p className="text-4xl font-bold text-blue-600">{product.premiumDetails?.monthly}</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                        <h3 className="text-sm font-medium text-green-900 mb-2">Coverage Amount</h3>
                        <p className="text-3xl font-bold text-green-700">{product.coverageAmount}</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <h3 className="text-sm font-medium text-purple-900 mb-2">Policy Term</h3>
                        <p className="text-2xl font-bold text-purple-700">{product.policyTerm}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
                      <h3 className="font-bold text-blue-900 mb-2">Eligibility</h3>
                      <p className="text-blue-800">Age Range: <strong>{product.ageRange}</strong></p>
                      <p className="text-blue-800 mt-1">Open to all Tanzanian citizens and residents</p>
                    </div>

                    {product.keyFeatures && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Plan Works for You</h3>
                        {product.keyFeatures.map((feature: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                            <p className="text-gray-700">{feature.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Documents & Forms</h2>
                    <div className="space-y-3">
                      {product.documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Download className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.size}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="border-2 border-blue-600">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Get a Quote</h3>
                  <p className="text-gray-600 mb-6">
                    Speak with our insurance experts to get a personalized quote
                  </p>
                  <Link href={`/${locale}${createPageUrl("Support")}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-3">
                      <Phone className="w-4 h-4 mr-2" />
                      Request a Call
                    </Button>
                  </Link>
                  <a href="tel:+255123456789">
                    <Button variant="outline" className="w-full">
                      Call: +255 123 456 789
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Link href={`/${locale}${createPageUrl("Claims")}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <ArrowRight className="w-4 h-4" />
                      File a Claim
                    </Link>
                    <Link href={`/${locale}${createPageUrl("Support")}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <ArrowRight className="w-4 h-4" />
                      Contact Support
                    </Link>
                    <Link href={`/${locale}${createPageUrl("BranchLocator")}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <ArrowRight className="w-4 h-4" />
                      Find a Branch
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}