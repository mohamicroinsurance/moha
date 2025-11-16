'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, Download, Briefcase, Calendar, Mail, Phone, Loader2, RefreshCw, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Application {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  currentCompany: string | null;
  expectedSalary: string | null;
  availableFrom: string;
  coverLetter: string;
  skills: string[];
  references: string | null;
  cvUrl: string | null;
  status: string;
  interviewDate: string | null;
  interviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [updateData, setUpdateData] = useState({
    status: "",
    interviewDate: "",
    interviewNotes: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/applications');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.data.applications);
    } catch (error: any) {
      console.error('Fetch applications error:', error);
      
      if (error.message?.includes("Can't reach database") || 
          error.message?.includes("database") ||
          error.message?.includes("Connection")) {
        toast.error('Database Connection Error', {
          description: 'Unable to connect to the database. Please check your connection.',
          duration: 5000,
        });
      } else {
        toast.error('Error Loading Applications', {
          description: error.message || 'Failed to load job applications',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  const handleUpdate = (application: Application) => {
    setSelectedApplication(application);
    setUpdateData({
      status: application.status,
      interviewDate: application.interviewDate ? application.interviewDate.split('T')[0] : "",
      interviewNotes: application.interviewNotes || "",
    });
    setIsUpdateDialogOpen(true);
  };

  const handleDelete = (application: Application) => {
    setSelectedApplication(application);
    setIsDeleteDialogOpen(true);
  };

  const submitUpdate = async () => {
    if (!selectedApplication) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updateData.status,
          interviewDate: updateData.interviewDate ? new Date(updateData.interviewDate).toISOString() : null,
          interviewNotes: updateData.interviewNotes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update application');
      }

      toast.success('Application updated successfully');
      setIsUpdateDialogOpen(false);
      fetchApplications();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update application');
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedApplication) return;

    try {
      const response = await fetch(`/api/applications/${selectedApplication.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete application');
      }

      toast.success('Application deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchApplications();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete application');
    }
  };

  const handleDownloadCV = (application: Application) => {
    if (application.cvUrl) {
      window.open(application.cvUrl, '_blank');
      toast.success('Opening CV...');
    } else {
      toast.info('No CV uploaded for this application');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusCounts = () => {
    return {
      total: applications.length,
      new: applications.filter(a => a.status === 'NEW').length,
      inReview: applications.filter(a => a.status === 'IN_REVIEW').length,
      interviewScheduled: applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length,
      approved: applications.filter(a => a.status === 'APPROVED').length,
      rejected: applications.filter(a => a.status === 'REJECTED').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage job applications</p>
        </div>
        <Button onClick={fetchApplications} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{counts.new}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.inReview}</p>
              </div>
              <Briefcase className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interview</p>
                <p className="text-2xl font-bold text-purple-600">{counts.interviewScheduled}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{counts.approved}</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
              </div>
              <Briefcase className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-gray-500 mt-2">Loading applications...</p>
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Briefcase className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No applications found</p>
                        <p className="text-sm text-gray-400">Job applications will appear here</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.applicantName}</p>
                          <p className="text-sm text-gray-500">{application.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{application.position}</TableCell>
                      <TableCell>{application.experience}</TableCell>
                      <TableCell>{application.education}</TableCell>
                      <TableCell>
                        <StatusBadge status={application.status} />
                      </TableCell>
                      <TableCell>{formatDate(application.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(application)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {application.cvUrl && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownloadCV(application)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdate(application)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(application)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Job Application</p>
                  <p className="text-xs text-blue-700">Application ID: {selectedApplication.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Applicant Name</label>
                  <p className="text-lg font-semibold">{selectedApplication.applicantName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="text-lg font-semibold">{selectedApplication.position}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-lg">{selectedApplication.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-lg">{selectedApplication.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-lg">{selectedApplication.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Education</label>
                  <p className="text-lg">{selectedApplication.education}</p>
                </div>
                {selectedApplication.currentCompany && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Company</label>
                    <p className="text-lg">{selectedApplication.currentCompany}</p>
                  </div>
                )}
                {selectedApplication.expectedSalary && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expected Salary</label>
                    <p className="text-lg">{selectedApplication.expectedSalary}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Available From</label>
                  <p className="text-lg">{formatDate(selectedApplication.availableFrom)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Application Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedApplication.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Applied Date</label>
                  <p className="text-lg">{formatDate(selectedApplication.createdAt)}</p>
                </div>
                {selectedApplication.interviewDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Interview Date</label>
                    <p className="text-lg">{formatDate(selectedApplication.interviewDate)}</p>
                  </div>
                )}
              </div>

              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Cover Letter</label>
                <p className="text-lg mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedApplication.coverLetter}
                </p>
              </div>

              {selectedApplication.references && (
                <div>
                  <label className="text-sm font-medium text-gray-500">References</label>
                  <p className="text-lg mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {selectedApplication.references}
                  </p>
                </div>
              )}

              {selectedApplication.interviewNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Interview Notes</label>
                  <p className="text-lg mt-1 p-4 bg-yellow-50 rounded-lg whitespace-pre-wrap">
                    {selectedApplication.interviewNotes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                {selectedApplication.cvUrl && (
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleDownloadCV(selectedApplication)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleUpdate(selectedApplication);
                  }}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Application Status</Label>
              <select
                id="status"
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
              >
                <option value="NEW">New</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <Label htmlFor="interviewDate">Interview Date (Optional)</Label>
              <input
                id="interviewDate"
                type="date"
                value={updateData.interviewDate}
                onChange={(e) => setUpdateData({ ...updateData, interviewDate: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
              />
            </div>
            <div>
              <Label htmlFor="interviewNotes">Interview Notes (Optional)</Label>
              <Textarea
                id="interviewNotes"
                value={updateData.interviewNotes}
                onChange={(e) => setUpdateData({ ...updateData, interviewNotes: e.target.value })}
                placeholder="Add notes about the interview or application review..."
                rows={6}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitUpdate} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
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
            Are you sure you want to delete the application from <strong>{selectedApplication?.applicantName}</strong>? 
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
