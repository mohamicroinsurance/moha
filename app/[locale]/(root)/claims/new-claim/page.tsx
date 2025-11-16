"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, CheckCircle2, ArrowLeft, FileText, User, ClipboardCheck, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FileClaimPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, url: string, size: number}>>([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [error, setError] = useState("")
  const [claimNumber, setClaimNumber] = useState("")
  
  const [formData, setFormData] = useState({
    claimType: "",
    policyNumber: "",
    incidentDate: "",
    incidentTime: "",
    location: "",
    description: "",
    amount: "",
    policeReport: false,
    policeReportNumber: "",
    witnesses: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed 5 files total
    if (uploadedFiles.length + files.length > 5) {
      setError("Maximum 5 files allowed")
      return
    }

    setUploadingFiles(true)
    setError("")

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 10MB limit`)
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} type not allowed. Only JPG, PNG, and PDF are accepted.`)
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'claims')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const data = await response.json()
        return {
          name: file.name,
          url: data.data.url,
          size: file.size,
        }
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles([...uploadedFiles, ...results])
    } catch (err: any) {
      setError(err.message || 'Failed to upload files')
    } finally {
      setUploadingFiles(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Combine date and time
      const incidentDateTime = new Date(`${formData.incidentDate}T${formData.incidentTime}:00`)

      // Prepare claim data
      const claimData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        type: formData.claimType,
        amount: parseFloat(formData.amount),
        policyNumber: formData.policyNumber,
        incidentDate: incidentDateTime.toISOString(),
        incidentLocation: formData.location,
        description: formData.description,
        notes: formData.policeReportNumber 
          ? `Police Report: ${formData.policeReportNumber}${formData.witnesses ? '\nWitnesses: ' + formData.witnesses : ''}`
          : formData.witnesses ? `Witnesses: ${formData.witnesses}` : null,
        documents: uploadedFiles.map(f => f.url),
      }

      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claimData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit claim')
      }

      // Generate a readable claim number
      const generatedClaimNumber = `CLM-${new Date().getFullYear()}-${result.data.id.slice(-8).toUpperCase()}`
      setClaimNumber(generatedClaimNumber)
      setStep(4)
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/claims">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Claims
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">File a Claim</h1>
            <p className="text-lg text-slate-600">Complete the form below to submit your insurance claim</p>
          </div>

          {/* Progress Steps */}
          {step < 4 && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="w-full">
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all ${
                          step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {step > 1 ? <CheckCircle2 className="h-6 w-6" /> : 1}
                      </div>
                      <div className={`flex-1 h-1.5 mx-2 transition-all ${
                        step > 1 ? "bg-blue-600" : "bg-slate-200"
                      }`} />
                    </div>
                    
                    <div className="flex items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all ${
                          step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {step > 2 ? <CheckCircle2 className="h-6 w-6" /> : 2}
                      </div>
                      <div className={`flex-1 h-1.5 mx-2 transition-all ${
                        step > 2 ? "bg-blue-600" : "bg-slate-200"
                      }`} />
                    </div>
                    
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold shadow-sm transition-all ${
                          step >= 3 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {step > 3 ? <CheckCircle2 className="h-6 w-6" /> : 3}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Labels */}
                  <div className="flex justify-between mt-2">
                    <span className={`text-sm font-medium flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-slate-600"}`}>
                      <FileText className="h-4 w-4" />
                      Incident Details
                    </span>
                    <span className={`text-sm font-medium flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-slate-600"}`}>
                      <User className="h-4 w-4" />
                      Contact Info
                    </span>
                    <span className={`text-sm font-medium flex items-center gap-2 ${step >= 3 ? "text-blue-600" : "text-slate-600"}`}>
                      <ClipboardCheck className="h-4 w-4" />
                      Review
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Notice */}
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Emergency Claims</p>
                <p className="text-sm text-slate-600">
                  For urgent claims requiring immediate attention, please call our 24/7 hotline: +255 123 456 789
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Incident Details */}
            {step === 1 && (
              <Card className="shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-slate-50">
                  <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    Incident Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="claimType">Claim Type *</Label>
                    <Select
                      value={formData.claimType}
                      onValueChange={(value) => setFormData({ ...formData, claimType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto Insurance</SelectItem>
                        <SelectItem value="home">Home Insurance</SelectItem>
                        <SelectItem value="life">Life Insurance</SelectItem>
                        <SelectItem value="business">Business Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number *</Label>
                    <Input
                      id="policyNumber"
                      placeholder="Enter your policy number"
                      value={formData.policyNumber}
                      onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incidentDate">Date of Incident *</Label>
                      <Input
                        id="incidentDate"
                        type="date"
                        value={formData.incidentDate}
                        onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incidentTime">Time of Incident *</Label>
                      <Input
                        id="incidentTime"
                        type="time"
                        value={formData.incidentTime}
                        onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location of Incident *</Label>
                    <Input
                      id="location"
                      placeholder="Enter the location where the incident occurred"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Claim Amount (TZS) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter estimated claim amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      min="0"
                      step="1000"
                    />
                    <p className="text-sm text-gray-500">Enter the estimated cost of damages or expenses</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description of Incident *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide a detailed description of what happened"
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policeReportNumber">Police Report Number (if applicable)</Label>
                    <Input
                      id="policeReportNumber"
                      placeholder="Enter police report number"
                      value={formData.policeReportNumber}
                      onChange={(e) => setFormData({ ...formData, policeReportNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="witnesses">Witness Information</Label>
                    <Textarea
                      id="witnesses"
                      placeholder="Names and contact information of any witnesses"
                      rows={3}
                      value={formData.witnesses}
                      onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                    />
                  </div>

                  <Button type="button" onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Continue to Contact Information
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <Card className="shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-slate-50">
                  <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
                    <User className="h-6 w-6 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documents">Upload Supporting Documents</Label>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          id="documents"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploadingFiles || uploadedFiles.length >= 5}
                        />
                        <label htmlFor="documents" className="cursor-pointer">
                          {uploadingFiles ? (
                            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                          ) : (
                            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          )}
                          <p className="text-slate-600 mb-2">
                            {uploadingFiles ? "Uploading..." : "Click to upload or drag and drop"}
                          </p>
                          <p className="text-sm text-slate-500">
                            JPG, PNG, or PDF (Max 10MB each, up to 5 files)
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {uploadedFiles.length} of 5 files uploaded
                          </p>
                        </label>
                      </div>

                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handleBack} className="flex-1 border-slate-300 hover:bg-slate-50">
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Review Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Card className="shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-slate-50">
                  <CardTitle className="text-2xl text-slate-900 flex items-center gap-2">
                    <ClipboardCheck className="h-6 w-6 text-blue-600" />
                    Review Your Claim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Incident Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Claim Type:</span>
                        <span className="font-semibold text-slate-900">{formData.claimType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Policy Number:</span>
                        <span className="font-semibold text-slate-900">{formData.policyNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Date:</span>
                        <span className="font-semibold text-slate-900">{formData.incidentDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Location:</span>
                        <span className="font-semibold text-slate-900">{formData.location || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Description
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{formData.description || 'No description provided'}</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Name:</span>
                        <span className="font-semibold text-slate-900">
                          {formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Email:</span>
                        <span className="font-semibold text-slate-900">{formData.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">Phone:</span>
                        <span className="font-semibold text-slate-900">{formData.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Uploaded Documents ({uploadedFiles.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            {/* Check if file is an image */}
                            {file.name.match(/\.(jpg|jpeg|png)$/i) ? (
                              <div className="relative aspect-video bg-white rounded-lg overflow-hidden border-2 border-slate-200">
                                <img 
                                  src={file.url} 
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a 
                                      href={file.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
                                    >
                                      View Full Size
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // PDF or other document
                              <div className="aspect-video bg-white rounded-lg overflow-hidden border-2 border-slate-200 flex flex-col items-center justify-center p-4">
                                <FileText className="h-12 w-12 text-blue-600 mb-2" />
                                <p className="text-sm font-medium text-slate-900 text-center truncate w-full">
                                  {file.name}
                                </p>
                                <a 
                                  href={file.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mt-2 text-blue-600 text-sm hover:underline"
                                >
                                  View Document
                                </a>
                              </div>
                            )}
                            <p className="mt-2 text-xs text-slate-500 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-slate-700">
                      By submitting this claim, you confirm that all information provided is accurate and complete to
                      the best of your knowledge.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack} 
                      className="flex-1 border-slate-300 hover:bg-slate-50"
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Claim'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <Card className="text-center">
                <CardContent className="p-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Claim Submitted Successfully!</h2>
                  <p className="text-lg text-slate-600 mb-2">Your claim number is:</p>
                  <p className="text-3xl font-bold text-blue-600 mb-6">{claimNumber}</p>
                  <p className="text-slate-600 mb-8">
                    We've sent a confirmation email to {formData.email}. Our team will review your claim and contact you
                    within 24-48 hours. Please keep your claim number for future reference.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/claims/track">
                      <Button variant="default">Track Your Claim</Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline">Return to Home</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
