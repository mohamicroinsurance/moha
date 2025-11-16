'use client'

import { useState, useEffect } from "react";
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
import { ArrowLeft, Edit, Trash2, Save, X, FileText, Upload, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function ClaimDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [claimId, setClaimId] = useState<string>("");
  
  const [claimData, setClaimData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setClaimId(resolvedParams.id);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (claimId) {
      fetchClaim();
    }
  }, [claimId]);

  const fetchClaim = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/claims/${claimId}`);
      const result = await response.json();

      if (result.success) {
        setClaimData(result.data);
        setFormData(result.data);
      } else {
        setError(result.error || "Failed to fetch claim");
      }
    } catch (error) {
      console.error("Failed to fetch claim:", error);
      setError("Failed to fetch claim data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/claims/${claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setClaimData(result.data);
        setFormData(result.data);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update claim");
      }
    } catch (error) {
      console.error("Failed to update claim:", error);
      setError("Failed to update claim");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(claimData);
    setIsEditing(false);
    setError("");
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`/api/claims/${claimId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard/claims");
      } else {
        setError(result.error || "Failed to delete claim");
      }
    } catch (error) {
      console.error("Failed to delete claim:", error);
      setError("Failed to delete claim");
    } finally {
      setDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/claims/${claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        setClaimData(result.data);
        setFormData(result.data);
      } else {
        setError(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !claimData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!claimData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/claims">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
            <p className="text-gray-600 mt-1">ID: {claimData.id.slice(0, 13).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              {claimData.status === "PENDING" && (
                <>
                  <Button 
                    onClick={() => handleStatusChange("APPROVED")} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Approve Claim
                  </Button>
                  <Button 
                    onClick={() => handleStatusChange("REJECTED")} 
                    variant="destructive"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Reject Claim
                  </Button>
                </>
              )}
              <Button onClick={() => setIsEditing(true)} variant="outline" disabled={saving}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setIsDeleteDialogOpen(true)} variant="outline" className="text-red-600" disabled={saving}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-12 h-12 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Claim Status</p>
                <Badge className={`mt-1 text-base px-3 py-1 ${getStatusColor(formData.status)}`}>
                  {formData.status ? formData.status.replace(/_/g, ' ') : 'N/A'}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Claim Amount</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(formData.amount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              {isEditing ? (
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{claimData.customerName}</p>
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
                <p className="text-lg font-medium">{claimData.email}</p>
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
                <p className="text-lg font-medium">{claimData.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              {isEditing ? (
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{claimData.policyNumber}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Incident Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Claim Type</Label>
              {isEditing ? (
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{claimData.type}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Incident Date</Label>
              <p className="text-lg font-medium">{formatDate(claimData.incidentDate)}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="incidentLocation">Incident Location</Label>
              {isEditing ? (
                <Input
                  id="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{claimData.incidentLocation}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Incident Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">{claimData.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Claim Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Claim Amount</Label>
              {isEditing ? (
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              ) : (
                <p className="text-lg font-medium">{formatCurrency(claimData.amount)}</p>
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
                  <option value="PENDING">Pending</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              ) : (
                <Badge className={`text-base px-3 py-1 ${getStatusColor(claimData.status)}`}>
                  {claimData.status.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label>Claim Date</Label>
              <p className="text-lg font-medium">{formatDate(claimData.createdAt)}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Processing Notes</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">{claimData.notes}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claimData.documents && claimData.documents.length > 0 ? (
              claimData.documents.map((doc: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-sm truncate">{doc.split('/').pop()}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={doc} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </a>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No documents uploaded</p>
            )}
            <Button variant="outline" className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Upload Additional Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete claim <strong>{claimData.id}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Delete Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
