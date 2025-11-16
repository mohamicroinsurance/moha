'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge, PriorityBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
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
import { Eye, Shield, User, Lock, Loader2, Trash2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WhistleblowingReport {
  id: string;
  type: string;
  priority: string;
  status: string;
  isAnonymous: boolean;
  reporterName: string | null;
  reporterEmail: string | null;
  reporterPhone: string | null;
  description: string;
  location: string | null;
  witnessDetails: string | null;
  actionTaken: string | null;
  assignedTo: string | null;
  investigationNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WhistleblowingPage() {
  const router = useRouter();
  const [reports, setReports] = useState<WhistleblowingReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<WhistleblowingReport | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [updateData, setUpdateData] = useState({
    status: "",
    priority: "",
    assignedTo: "",
    actionTaken: "",
    investigationNotes: "",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/whistleblowing');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch reports');
      }

      const data = await response.json();
      setReports(data.data.reports);
    } catch (error: any) {
      console.error('Fetch reports error:', error);
      
      if (error.message?.includes("Can't reach database") || 
          error.message?.includes("database") ||
          error.message?.includes("Connection")) {
        toast.error('Database Connection Error', {
          description: 'Unable to connect to the database. Please check your connection.',
          duration: 5000,
        });
      } else {
        toast.error('Error Loading Reports', {
          description: error.message || 'Failed to load whistleblowing reports',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (report: WhistleblowingReport) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleUpdate = (report: WhistleblowingReport) => {
    setSelectedReport(report);
    setUpdateData({
      status: report.status,
      priority: report.priority,
      assignedTo: report.assignedTo || "",
      actionTaken: report.actionTaken || "",
      investigationNotes: report.investigationNotes || "",
    });
    setIsUpdateDialogOpen(true);
  };

  const handleDelete = (report: WhistleblowingReport) => {
    setSelectedReport(report);
    setIsDeleteDialogOpen(true);
  };

  const submitUpdate = async () => {
    if (!selectedReport) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/whistleblowing/${selectedReport.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update report');
      }

      toast.success('Report updated successfully');
      setIsUpdateDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update report');
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedReport) return;

    try {
      const response = await fetch(`/api/whistleblowing/${selectedReport.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete report');
      }

      toast.success('Report deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCounts = () => {
    return {
      total: reports.length,
      new: reports.filter(r => r.status === 'NEW').length,
      pending: reports.filter(r => r.status === 'PENDING').length,
      underReview: reports.filter(r => r.status === 'UNDER_REVIEW').length,
      resolved: reports.filter(r => r.status === 'RESOLVED').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Whistleblowing Reports</h1>
          <p className="text-gray-600 mt-1">Review and manage whistleblowing reports</p>
        </div>
        <Button onClick={fetchReports} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
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
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-orange-600">{counts.underReview}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{counts.resolved}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Report ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-gray-500 mt-2">Loading reports...</p>
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Shield className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No reports found</p>
                        <p className="text-sm text-gray-400">Whistleblowing reports will appear here</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id.slice(0, 8)}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={report.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={report.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.isAnonymous ? (
                            <>
                              <Lock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Anonymous</span>
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4 text-gray-400" />
                              <span>{report.reporterName || report.reporterEmail || 'N/A'}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.assignedTo ? (
                          <span>{report.assignedTo}</span>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(report)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdate(report)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report)}
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
              Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Confidential Report</p>
                  <p className="text-xs text-blue-700">This information is confidential and should be handled with care.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Report ID</label>
                  <p className="text-lg font-semibold">{selectedReport.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedReport.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-lg">{selectedReport.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <div className="mt-1">
                    <PriorityBadge priority={selectedReport.priority} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reporter</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedReport.isAnonymous ? (
                      <>
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-lg text-gray-500">Anonymous</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-lg">{selectedReport.reporterName || 'N/A'}</span>
                      </>
                    )}
                  </div>
                </div>
                {!selectedReport.isAnonymous && selectedReport.reporterEmail && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter Email</label>
                    <p className="text-lg">{selectedReport.reporterEmail}</p>
                  </div>
                )}
                {!selectedReport.isAnonymous && selectedReport.reporterPhone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter Phone</label>
                    <p className="text-lg">{selectedReport.reporterPhone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                  <p className="text-lg">{formatDate(selectedReport.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned To</label>
                  <p className="text-lg">
                    {selectedReport.assignedTo || (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-lg mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {selectedReport.description}
                </p>
              </div>
              {selectedReport.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-lg mt-1 p-3 bg-gray-50 rounded-lg">
                    {selectedReport.location}
                  </p>
                </div>
              )}
              {selectedReport.witnessDetails && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Witness Details</label>
                  <p className="text-lg mt-1 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {selectedReport.witnessDetails}
                  </p>
                </div>
              )}
              {selectedReport.actionTaken && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Action Taken</label>
                  <p className="text-lg mt-1 p-3 bg-green-50 rounded-lg whitespace-pre-wrap">
                    {selectedReport.actionTaken}
                  </p>
                </div>
              )}
              {selectedReport.investigationNotes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Investigation Notes</label>
                  <p className="text-lg mt-1 p-3 bg-yellow-50 rounded-lg whitespace-pre-wrap">
                    {selectedReport.investigationNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  <option value="NEW">New</option>
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={updateData.priority}
                  onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <input
                id="assignedTo"
                type="text"
                value={updateData.assignedTo}
                onChange={(e) => setUpdateData({ ...updateData, assignedTo: e.target.value })}
                placeholder="Enter assignee name"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
              />
            </div>
            <div>
              <Label htmlFor="actionTaken">Action Taken</Label>
              <Textarea
                id="actionTaken"
                value={updateData.actionTaken}
                onChange={(e) => setUpdateData({ ...updateData, actionTaken: e.target.value })}
                placeholder="Describe actions taken..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="investigationNotes">Investigation Notes</Label>
              <Textarea
                id="investigationNotes"
                value={updateData.investigationNotes}
                onChange={(e) => setUpdateData({ ...updateData, investigationNotes: e.target.value })}
                placeholder="Add investigation notes..."
                rows={4}
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
            Are you sure you want to delete this whistleblowing report? This action cannot be undone.
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
