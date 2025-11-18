'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, Briefcase, Calendar, MapPin, CheckCircle, Loader2, User, BookOpen, Newspaper, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  imageUrl?: string | null;
}

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  downloads: number;
  createdAt: string;
}

export default function Resources() {
  const t = useTranslations();
  const [applyingFor, setApplyingFor] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  const [applicationData, setApplicationData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    education: "",
    currentCompany: "",
    expectedSalary: "",
    availableFrom: "",
    coverLetter: "",
    skills: "",
    references: "",
    cvFile: null as File | null,
  });

  useEffect(() => {
    fetchNews();
    fetchDocuments();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoadingNews(true);
      const response = await fetch('/api/news?limit=6');
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setNews(data.data.news);
    } catch (error: any) {
      console.error('Fetch news error:', error);
      toast.error('Failed to load news articles');
    } finally {
      setIsLoadingNews(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setIsLoadingDocs(true);
      const response = await fetch('/api/documents?limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.data.documents);
    } catch (error: any) {
      console.error('Fetch documents error:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const careers = [
    {
      title: "Senior Insurance Underwriter",
      department: "Underwriting",
      location: "Dar es Salaam",
      type: "Full-time",
      description: "Review and evaluate insurance applications, determine coverage and pricing"
    },
    {
      title: "Claims Processing Officer",
      department: "Claims",
      location: "Arusha",
      type: "Full-time",
      description: "Process insurance claims efficiently and provide excellent customer service"
    },
    {
      title: "Business Development Manager",
      department: "Sales",
      location: "Mwanza",
      type: "Full-time",
      description: "Drive sales growth and develop new business partnerships"
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Dar es Salaam",
      type: "Full-time",
      description: "Develop and execute digital marketing campaigns to grow our online presence"
    }
  ];

  const handleApply = (job: any) => {
    setApplyingFor(job);
    setApplicationData({
      ...applicationData,
      position: job.title,
    });
  };

  const handleDownload = async (doc: Document) => {
    try {
      // Increment download count
      await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
      });

      // Open file in new tab
      window.open(doc.fileUrl, '_blank');
      
      toast.success('Document downloaded');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!applicationData.applicantName || !applicationData.email || !applicationData.phone || 
        !applicationData.coverLetter || !applicationData.experience || !applicationData.education) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload CV if present
      let cvUrl = null;
      if (applicationData.cvFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', applicationData.cvFile);
        uploadFormData.append('folder', 'moha-insurance/applications');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload CV');
        }

        const uploadData = await uploadResponse.json();
        cvUrl = uploadData.data.url;
      }

      // Submit application
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantName: applicationData.applicantName,
          email: applicationData.email,
          phone: applicationData.phone,
          position: applicationData.position,
          experience: applicationData.experience,
          education: applicationData.education,
          currentCompany: applicationData.currentCompany || null,
          expectedSalary: applicationData.expectedSalary || null,
          availableFrom: new Date(applicationData.availableFrom || Date.now()).toISOString(),
          coverLetter: applicationData.coverLetter,
          skills: applicationData.skills ? applicationData.skills.split(',').map(s => s.trim()) : [],
          references: applicationData.references || null,
          cvUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      setApplicationSubmitted(true);
      toast.success('Application submitted successfully');
      
      setTimeout(() => {
        setApplicationSubmitted(false);
        setApplyingFor(null);
        setApplicationData({
          applicantName: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          education: "",
          currentCompany: "",
          expectedSalary: "",
          availableFrom: "",
          coverLetter: "",
          skills: "",
          references: "",
          cvFile: null,
        });
      }, 3000);
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-orange-900 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-orange-900/85" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium">{t('resources.hero.tag')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('resources.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {t('resources.hero.subtitle')}
            </p>
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <Newspaper className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{t('resources.hero.tabs.news')}</div>
                <div className="text-sm text-blue-200">Stay Updated</div>
              </div>
              <div className="text-center">
                <FileText className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{t('resources.hero.tabs.documents')}</div>
                <div className="text-sm text-blue-200">Download Resources</div>
              </div>
              <div className="text-center">
                <GraduationCap className="w-8 h-8 text-orange-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{t('resources.hero.tabs.careers')}</div>
                <div className="text-sm text-blue-200">Join Our Team</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 max-w-2xl mx-auto h-14 bg-blue-50">
              <TabsTrigger value="news" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-lg font-medium">
                <Newspaper className="w-5 h-5 mr-2" />
                {t('resources.hero.tabs.news')}
              </TabsTrigger>
              <TabsTrigger value="downloads" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-lg font-medium">
                <FileText className="w-5 h-5 mr-2" />
                {t('resources.hero.tabs.documents')}
              </TabsTrigger>
              <TabsTrigger value="careers" id="careers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-lg font-medium">
                <Briefcase className="w-5 h-5 mr-2" />
                {t('resources.hero.tabs.careers')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              {isLoadingNews ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-20">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('resources.news.noArticles')}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                              <FileText className="w-16 h-16 text-white opacity-50" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span>{formatDate(item.publishedDate)}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4 text-blue-600" />
                              <span>{item.author}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 flex-1 line-clamp-3">{item.content.substring(0, 150)}...</p>
                          <div className="mt-4 pt-4 border-t">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                              {item.category}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="downloads">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('resources.documents.title')}</h2>
                  {isLoadingDocs ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">{t('resources.documents.noDocuments')}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                          onClick={() => handleDownload(doc)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">{doc.title}</div>
                              <div className="text-sm text-gray-500 truncate">{doc.description}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {doc.category} • {doc.fileSize} • {doc.downloads} downloads
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="careers">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('resources.careers.title')}</h2>
                  <p className="text-lg text-gray-600">
                    {t('resources.careers.subtitle')}
                  </p>
                </div>

                <div className="space-y-6">
                  {careers.map((job, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                              <p className="text-gray-600 mb-4">{job.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Briefcase className="w-4 h-4" />
                                  <span>{job.department}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {job.type}
                                </div>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleApply(job)}>
                                  {t('resources.careers.applyNow')}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{t('resources.careers.application.title')} {job.title}</DialogTitle>
                                </DialogHeader>
                                {!applicationSubmitted ? (
                                  <form onSubmit={handleApplicationSubmit} className="space-y-4 mt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="applicantName">{t('resources.careers.application.fullName')}</Label>
                                        <Input 
                                          id="applicantName" 
                                          value={applicationData.applicantName}
                                          onChange={(e) => setApplicationData({...applicationData, applicantName: e.target.value})}
                                          required 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="email">{t('resources.careers.application.email')}</Label>
                                        <Input 
                                          id="email" 
                                          type="email" 
                                          value={applicationData.email}
                                          onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                                          required 
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="phone">{t('resources.careers.application.phone')}</Label>
                                        <Input 
                                          id="phone" 
                                          type="tel" 
                                          value={applicationData.phone}
                                          onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                                          required 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="availableFrom">{t('resources.careers.application.availableFrom')}</Label>
                                        <Input 
                                          id="availableFrom" 
                                          type="date" 
                                          value={applicationData.availableFrom}
                                          onChange={(e) => setApplicationData({...applicationData, availableFrom: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="experience">{t('resources.careers.application.experience')}</Label>
                                        <Input 
                                          id="experience" 
                                          placeholder="e.g., 5 years"
                                          value={applicationData.experience}
                                          onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                                          required 
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="education">{t('resources.careers.application.education')}</Label>
                                        <Input 
                                          id="education" 
                                          placeholder="e.g., Bachelor's Degree"
                                          value={applicationData.education}
                                          onChange={(e) => setApplicationData({...applicationData, education: e.target.value})}
                                          required 
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="currentCompany">{t('resources.careers.application.currentCompany')}</Label>
                                        <Input 
                                          id="currentCompany" 
                                          value={applicationData.currentCompany}
                                          onChange={(e) => setApplicationData({...applicationData, currentCompany: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="expectedSalary">{t('resources.careers.application.expectedSalary')}</Label>
                                        <Input 
                                          id="expectedSalary" 
                                          placeholder="e.g., 5,000,000 TZS"
                                          value={applicationData.expectedSalary}
                                          onChange={(e) => setApplicationData({...applicationData, expectedSalary: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="skills">{t('resources.careers.application.skills')}</Label>
                                      <Input 
                                        id="skills" 
                                        placeholder="e.g., Insurance, Sales, Customer Service"
                                        value={applicationData.skills}
                                        onChange={(e) => setApplicationData({...applicationData, skills: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="coverLetter">{t('resources.careers.application.coverLetter')}</Label>
                                      <Textarea 
                                        id="coverLetter" 
                                        rows={6} 
                                        placeholder="Tell us why you're a great fit for this position..."
                                        value={applicationData.coverLetter}
                                        onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                                        required 
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="references">{t('resources.careers.application.references')}</Label>
                                      <Textarea 
                                        id="references" 
                                        rows={3} 
                                        placeholder="Provide contact information for references"
                                        value={applicationData.references}
                                        onChange={(e) => setApplicationData({...applicationData, references: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="cv">{t('resources.careers.application.uploadCV')}</Label>
                                      <Input 
                                        id="cv" 
                                        type="file" 
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setApplicationData({...applicationData, cvFile: e.target.files?.[0] || null})}
                                      />
                                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (MAX. 10MB)</p>
                                    </div>
                                    <Button 
                                      type="submit" 
                                      className="w-full bg-blue-600 hover:bg-blue-700"
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          {t('resources.careers.application.submitting')}
                                        </>
                                      ) : (
                                        t('resources.careers.application.submit')
                                      )}
                                    </Button>
                                  </form>
                                ) : (
                                  <div className="text-center py-8">
                                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('resources.careers.application.success.title')}</h3>
                                    <p className="text-gray-600">{t('resources.careers.application.success.message')}</p>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}