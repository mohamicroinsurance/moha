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
import { ArrowLeft, Edit, Trash2, Save, CheckCircle, X, FileCheck } from "lucide-react";
import Link from "next/link";

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Mock data - in real app, fetch based on id
  const [quoteData, setQuoteData] = useState({
    id: id || "QUO-2024-001",
    customerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+255 123 456 789",
    productType: "Motor Insurance",
    amount: 850000,
    status: "Active",
    createdDate: new Date("2024-01-10"),
    expiryDate: new Date("2024-02-10"),
    vehicleMake: "Toyota",
    vehicleModel: "Corolla",
    vehicleYear: "2020",
    vehicleRegNo: "T 123 ABC",
    notes: "Customer interested in comprehensive coverage",
  });

  const [formData, setFormData] = useState(quoteData);

  const handleSave = () => {
    setQuoteData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(quoteData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Deleting quote:", quoteData.id);
    router.push("/dashboard/quotes");
  };

  const handleConvert = () => {
    console.log("Converting to policy:", quoteData.id);
    setQuoteData({ ...quoteData, status: "Converted" });
    setFormData({ ...formData, status: "Converted" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quotes">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quote Details</h1>
            <p className="text-gray-600 mt-1">ID: {quoteData.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              {quoteData.status === "Active" && (
                <Button onClick={handleConvert} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Convert to Policy
                </Button>
              )}
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive">
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

      {/* Status Badge */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileCheck className="w-12 h-12 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <Badge className="mt-1 text-base px-3 py-1">
                  {formData.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Quote Amount</p>
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
                <p className="text-lg font-medium">{quoteData.customerName}</p>
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
                <p className="text-lg font-medium">{quoteData.email}</p>
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
                <p className="text-lg font-medium">{quoteData.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              {isEditing ? (
                <Input
                  id="productType"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{quoteData.productType}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vehicleMake">Vehicle Make</Label>
              {isEditing ? (
                <Input
                  id="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{quoteData.vehicleMake}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              {isEditing ? (
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{quoteData.vehicleModel}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Vehicle Year</Label>
              {isEditing ? (
                <Input
                  id="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{quoteData.vehicleYear}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleRegNo">Registration Number</Label>
              {isEditing ? (
                <Input
                  id="vehicleRegNo"
                  value={formData.vehicleRegNo}
                  onChange={(e) => setFormData({ ...formData, vehicleRegNo: e.target.value })}
                />
              ) : (
                <p className="text-lg font-medium">{quoteData.vehicleRegNo}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quote Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Quote Amount</Label>
              {isEditing ? (
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              ) : (
                <p className="text-lg font-medium">{formatCurrency(quoteData.amount)}</p>
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
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Converted">Converted</option>
                  <option value="Pending">Pending</option>
                </select>
              ) : (
                <Badge className="text-base px-3 py-1">{quoteData.status}</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label>Created Date</Label>
              <p className="text-lg font-medium">{formatDate(quoteData.createdDate)}</p>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <p className="text-lg font-medium">{formatDate(quoteData.expiryDate)}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              ) : (
                <p className="text-lg font-medium p-4 bg-gray-50 rounded-lg">{quoteData.notes}</p>
              )}
            </div>
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
            Are you sure you want to delete quote <strong>{quoteData.id}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Quote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
