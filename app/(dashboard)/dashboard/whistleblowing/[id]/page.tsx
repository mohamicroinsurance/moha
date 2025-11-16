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
import { ArrowLeft, Edit, Trash2, Save, X, Shield, Lock, User, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function WhistleblowingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const [reportData, setReportData] = useState({
    id: id || "WB-2024-001",
    type: "Fraud",
    priority: "High",
    status: "New",
    submittedDate: new Date("2024-01-15"),
    isAnonymous: false,
    reporterName: "John Doe",
    reporterEmail: "john.doe@example.com",
    reporterPhone: "+255 123 456 789",
    description: "Suspected fraudulent claim processing in the claims department. Multiple claims with similar patterns have been approved without proper verification.",
    location: "Claims Department - Dar es Salaam Office",
    witnessDetails: "Two colleagues noticed similar patterns",
    actionTaken: "Initial investigation started",
    assignedTo: null as string | null,
    investigationNotes: "Report received. Preliminary review shows potential concerns.",
  });

  const [formData, setFormData] = useState(reportData);
  const [assignedReviewer, setAssignedReviewer] = useState("");

  const handleSave = () => {
    setReportData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(reportData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Deleting report:", reportData.id);
    router.push("/dashboard/whistleblowing");
  };

  const handleAssign = () => {
    setFormData({ ...formData, assignedTo: assignedReviewer, status: "Pending" });
    setReportData({ ...reportData, assignedTo: assignedReviewer, status: "Pending" });
    setIsAssignDialogOpen(false);
  };

  const handleResolve = () => {
    setFormData({ ...formData, status: "Resolved" });
    setReportData({ ...reportData, status: "Resolved" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "New":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/whistleblowing">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Whistleblowing Report</h1>
            <p className="text-gray-600 mt-1">ID: {reportData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              {!reportData.assignedTo && (
                <Button onClick={() => setIsAssignDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  Assign Reviewer
                </Button>
              )}
              {reportData.status !== "Resolved" && (
                <Button onClick={handleResolve} className="bg-green-600 hover:bg-green-700">
                  Mark Resolved
                </Button>
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

      {/* Confidentiality Alert */}
      <Card className="border-2 border-red-200 bg-red-50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-red-900">Confidential Report</h3>
              <p className="text-red-700 mt-1">
                This information is highly confidential and must be handled with utmost care. 
                Unauthorized disclosure may result in disciplinary action.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-10 h-10 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Priority</p>
                <Badge className={`mt-1 text-base px-3 py-1 ${getPriorityColor(formData.priority)}`}>
                  {formData.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={`mt-1 text-base px-3 py-1 ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <User className="w-10 h-10 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Assigned To</p>
                <p className="text-lg font-medium mt-1">
                  {formData.assignedTo || <span className="text-gray-400">Unassigned</span>}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Report Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Report Type</Label>
              {isEditing ? (
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{reportData.type}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Submitted Date</Label>
              <p className="text-lg font-medium">{formatDate(reportData.submittedDate)}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              {isEditing ? (
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              ) : (
                <Badge className={`text-base px-3 py-1 ${getPriorityColor(reportData.priority)}`}>
                  {reportData.priority}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              ) : (
                <Badge className={`text-base px-3 py-1 ${getStatusColor(reportData.status)}`}>
                  {reportData.status}
                </Badge>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{reportData.location}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reporter Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Reporter Information</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.isAnonymous ? (
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <Lock className="w-10 h-10 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-900">Anonymous Report</p>
                <p className="text-gray-600 mt-1">Reporter identity is protected</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Reporter Name</Label>
                <p className="text-lg font-medium">{reportData.reporterName}</p>
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <p className="text-lg font-medium">{reportData.reporterEmail}</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <p className="text-lg font-medium">{reportData.reporterPhone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {reportData.description}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="witnessDetails">Witness Details</Label>
              {isEditing ? (
                <Textarea
                  id="witnessDetails"
                  value={formData.witnessDetails}
                  onChange={(e) => setFormData({ ...formData, witnessDetails: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">
                  {reportData.witnessDetails}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionTaken">Action Taken</Label>
              {isEditing ? (
                <Textarea
                  id="actionTaken"
                  value={formData.actionTaken}
                  onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">
                  {reportData.actionTaken}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="investigationNotes">Investigation Notes</Label>
              {isEditing ? (
                <Textarea
                  id="investigationNotes"
                  value={formData.investigationNotes}
                  onChange={(e) => setFormData({ ...formData, investigationNotes: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">
                  {reportData.investigationNotes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assign Reviewer Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Reviewer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer">Select Reviewer</Label>
              <select
                id="reviewer"
                value={assignedReviewer}
                onChange={(e) => setAssignedReviewer(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="">Select a reviewer...</option>
                <option value="Sarah Johnson">Sarah Johnson - Compliance Officer</option>
                <option value="David Brown">David Brown - Legal Advisor</option>
                <option value="Emma Wilson">Emma Wilson - HR Manager</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} className="bg-blue-600 hover:bg-blue-700">
              Assign
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
            Are you sure you want to delete report <strong>{reportData.id}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
