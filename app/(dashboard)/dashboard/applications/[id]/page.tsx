'use client'

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Edit, Trash2, Save, X, Briefcase, Download, Calendar, Mail, Phone, User, FileText } from "lucide-react";
import Link from "next/link";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  
  const [applicationData, setApplicationData] = useState({
    id: id || "APP-2024-001",
    applicantName: "John Doe",
    email: "john.doe@example.com",
    phone: "+255 123 456 789",
    position: "Claims Analyst",
    status: "New",
    appliedDate: new Date("2024-01-15"),
    experience: "3 years",
    education: "Bachelor's in Business Administration",
    currentCompany: "ABC Insurance",
    expectedSalary: "2,500,000 TZS",
    availableFrom: new Date("2024-02-01"),
    cvUrl: "/cv/john-doe.pdf",
    coverLetter: "I am writing to apply for the Claims Analyst position at Moha Insurance. With over 3 years of experience in the insurance industry, I have developed strong analytical skills and a deep understanding of claims processing...",
    skills: ["Claims Processing", "Data Analysis", "Customer Service", "Risk Assessment"],
    references: "Available upon request",
    interviewDate: null as Date | null,
    interviewNotes: "",
  });

  const [formData, setFormData] = useState(applicationData);
  const [interviewDate, setInterviewDate] = useState("");

  const handleSave = () => {
    setApplicationData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(applicationData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Deleting application:", applicationData.id);
    router.push("/dashboard/applications");
  };

  const handleApprove = () => {
    setFormData({ ...formData, status: "Approved" });
    setApplicationData({ ...applicationData, status: "Approved" });
  };

  const handleReject = () => {
    setFormData({ ...formData, status: "Rejected" });
    setApplicationData({ ...applicationData, status: "Rejected" });
  };

  const handleMoveToReview = () => {
    setFormData({ ...formData, status: "In Review" });
    setApplicationData({ ...applicationData, status: "In Review" });
  };

  const handleScheduleInterview = () => {
    if (interviewDate) {
      const date = new Date(interviewDate);
      setFormData({ ...formData, status: "Interview Scheduled", interviewDate: date });
      setApplicationData({ ...applicationData, status: "Interview Scheduled", interviewDate: date });
      setIsScheduleDialogOpen(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Interview Scheduled":
        return "bg-purple-100 text-purple-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "New":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/applications">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-1">ID: {applicationData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              {applicationData.status === "New" && (
                <Button onClick={handleMoveToReview} className="bg-blue-600 hover:bg-blue-700">
                  Move to Review
                </Button>
              )}
              {applicationData.status === "In Review" && (
                <Button onClick={() => setIsScheduleDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              )}
              {(applicationData.status === "Interview Scheduled" || applicationData.status === "In Review") && (
                <>
                  <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                  <Button onClick={handleReject} variant="destructive">
                    Reject
                  </Button>
                </>
              )}
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Briefcase className="w-12 h-12 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Application Status</p>
                <Badge className={`mt-1 text-base px-3 py-1 ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Applied for</p>
              <p className="text-2xl font-bold text-blue-600">{formData.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="applicantName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-medium">{applicationData.applicantName}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-medium">{applicationData.email}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-lg font-medium">{applicationData.phone}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Applied Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-lg font-medium">{formatDate(applicationData.appliedDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="position">Position Applied</Label>
              {isEditing ? (
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{applicationData.position}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              {isEditing ? (
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{applicationData.experience}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              {isEditing ? (
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{applicationData.education}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentCompany">Current Company</Label>
              {isEditing ? (
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{applicationData.currentCompany}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              {isEditing ? (
                <Input
                  id="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, expectedSalary: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{applicationData.expectedSalary}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Available From</Label>
              <p className="text-lg font-medium">{formatDate(applicationData.availableFrom)}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {applicationData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cover Letter */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Cover Letter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isEditing ? (
              <Textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={8}
              />
            ) : (
              <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                {applicationData.coverLetter}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents & Interview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Curriculum Vitae (CV)</span>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>References</Label>
              <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">
                {applicationData.references}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Interview Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {applicationData.interviewDate ? (
              <>
                <div className="space-y-2">
                  <Label>Interview Date</Label>
                  <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <p className="text-lg font-medium text-purple-900">
                      {formatDate(applicationData.interviewDate)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewNotes">Interview Notes</Label>
                  {isEditing ? (
                    <Textarea
                      id="interviewNotes"
                      value={formData.interviewNotes}
                      onChange={(e) => setFormData({ ...formData, interviewNotes: e.target.value })}
                      rows={4}
                      placeholder="Add interview notes..."
                    />
                  ) : (
                    <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">
                      {applicationData.interviewNotes || "No notes yet"}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No interview scheduled yet</p>
                {applicationData.status === "In Review" && (
                  <Button
                    onClick={() => setIsScheduleDialogOpen(true)}
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                  >
                    Schedule Interview
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Interview Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interviewDate">Interview Date & Time</Label>
              <Input
                id="interviewDate"
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Applicant will be notified via email at <strong>{applicationData.email}</strong>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleInterview} className="bg-purple-600 hover:bg-purple-700">
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete application <strong>{applicationData.id}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
