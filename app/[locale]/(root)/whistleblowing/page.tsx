'use client'
import React, { useState } from "react";
import Link from "next/link";
import { createPageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, Eye, CheckCircle, Upload, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function Whistleblowing() {
  const { locale } = useParams() as { locale?: string };
  const [submitted, setSubmitted] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "Fraud",
    priority: "MEDIUM",
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
    description: "",
    location: "",
    witnessDetails: "",
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.description.trim()) {
      toast.error("Please provide a detailed description of the incident");
      return;
    }

    if (!anonymous && !formData.reporterEmail.trim()) {
      toast.error("Please provide your email address or submit anonymously");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file to Cloudinary if present
      let fileUrl = null;
      if (formData.file) {
        // Validate file size (max 5MB for public uploads)
        if (formData.file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.file);
        uploadFormData.append("folder", "moha-insurance/whistleblowing");
        uploadFormData.append("public", "true");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || "Failed to upload document");
        }

        const uploadData = await uploadResponse.json();
        fileUrl = uploadData.data.url;
      }

      // Submit whistleblowing report
      const response = await fetch("/api/whistleblowing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: formData.type,
          priority: formData.priority,
          isAnonymous: anonymous,
          reporterName: anonymous ? null : formData.reporterName || null,
          reporterEmail: anonymous ? null : formData.reporterEmail || null,
          reporterPhone: anonymous ? null : formData.reporterPhone || null,
          description: formData.description,
          location: formData.location || null,
          witnessDetails: formData.witnessDetails || null,
          documents: fileUrl ? [fileUrl] : [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit report");
      }

      setSubmitted(true);
      toast.success("Report submitted successfully");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto px-4"
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Courage
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Your report has been submitted securely and {anonymous ? 'anonymously' : 'confidentially'}.
              </p>
              <p className="text-gray-600 mb-8">
                We take all reports seriously and will investigate thoroughly while protecting your identity.
              </p>
              <div className="space-y-3">
                <Link href={`/${locale}${createPageUrl("Home")}`}>
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Return to Home
                  </Button>
                </Link>
                <Link href={`/${locale}${createPageUrl("About")}`}>
                  <Button size="lg" variant="outline" className="w-full">
                    Back to About Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">Secure & Confidential</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Speak Up <span className="text-orange-300">Safely</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your voice matters. Report fraud, misconduct, or concerns confidentially. 
              We protect whistleblowers and take action.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href={createPageUrl("About")}>
            <Button variant="ghost" className="hover:bg-orange-50 hover:text-orange-600 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About Us
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Confidential</h3>
              <p className="text-sm text-gray-600">Your identity is protected</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">Encrypted submission</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Anonymous</h3>
              <p className="text-sm text-gray-600">Option available</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Report</h2>
              <p className="text-gray-600 leading-relaxed">
                Moho Insurance is committed to maintaining the highest standards of ethics and integrity. 
                If you have witnessed or suspect any wrongdoing, fraud, or unethical behavior, please report it here. 
                All reports are treated seriously and investigated thoroughly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg">
                <Checkbox 
                  id="anonymous" 
                  checked={anonymous}
                  onCheckedChange={(checked) => setAnonymous(checked === true)}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">
                  Submit this report anonymously (optional contact information will not be collected)
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Report Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                    required
                  >
                    <option value="Fraud">Fraud</option>
                    <option value="Misconduct">Misconduct</option>
                    <option value="Policy Violation">Policy Violation</option>
                    <option value="Ethics Violation">Ethics Violation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level *</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              {!anonymous && (
                <div className="space-y-4 border-l-4 border-blue-600 pl-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Providing your contact information helps us follow up if needed. Your identity will remain confidential.
                  </p>
                  <div>
                    <Label htmlFor="name">Full Name (Optional)</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.reporterEmail}
                      onChange={(e) => setFormData({...formData, reporterEmail: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 123 456 789"
                      value={formData.reporterPhone}
                      onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="description">Incident Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about the incident..."
                  rows={8}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="location">Incident Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="Where did this occur?"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="witnessDetails">Witness Details (Optional)</Label>
                <Textarea
                  id="witnessDetails"
                  placeholder="Were there any witnesses? Please provide their details if available..."
                  rows={3}
                  value={formData.witnessDetails}
                  onChange={(e) => setFormData({...formData, witnessDetails: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="file">Supporting Documents (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      {formData.file ? formData.file.name : 'Click to upload documents'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Securely...
                  </>
                ) : (
                  'Submit Report Securely'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}