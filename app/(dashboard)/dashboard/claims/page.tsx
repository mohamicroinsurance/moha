'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { StatusBadge } from "@/components/dashboard/status-badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Download, FileText, ArrowUpDown, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClaims, setTotalClaims] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchClaims();
  }, [page, statusFilter]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/claims?${params}`);
      const result = await response.json();

      if (result.success) {
        setClaims(result.data.claims);
        setTotalPages(result.data.pagination.totalPages);
        setTotalClaims(result.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch claims:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (claim: any) => {
    router.push(`/dashboard/claims/${claim.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
        <p className="text-gray-600 mt-1">View and manage all insurance claims</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Claims</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{totalClaims}</p>
                )}
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-yellow-600">
                    {claims.filter((c) => c.status === "PENDING").length}
                  </p>
                )}
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                {loading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    {claims.filter((c) => c.status === "APPROVED").length}
                  </p>
                )}
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(
                      claims.reduce((sum, c) => sum + c.amount, 0)
                    )}
                  </p>
                )}
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Claims</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchClaims}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <FilterBar
            searchPlaceholder="Search claims by ID, customer name, or policy number..."
            filters={[
              {
                label: "Status",
                key: "status",
                options: [
                  { label: "Pending", value: "pending" },
                  { label: "Approved", value: "approved" },
                  { label: "Rejected", value: "rejected" },
                  { label: "Under Review", value: "under-review" },
                ],
              },
              {
                label: "Type",
                key: "type",
                options: [
                  { label: "Motor Insurance", value: "motor" },
                  { label: "Health Insurance", value: "health" },
                  { label: "Home Insurance", value: "home" },
                  { label: "Travel Insurance", value: "travel" },
                ],
              },
            ]}
          />

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Claim ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                      <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-8 w-16 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : claims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No claims found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.id.slice(0, 13).toUpperCase()}</TableCell>
                      <TableCell>{claim.customerName}</TableCell>
                      <TableCell>{claim.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={claim.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(claim.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(claim.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(claim)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
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
              Showing {claims.length} of {totalClaims} claims (Page {page} of {totalPages})
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Details - {selectedClaim?.id}</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Claim ID</label>
                  <p className="text-lg font-semibold">{selectedClaim.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedClaim.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Name</label>
                  <p className="text-lg">{selectedClaim.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Policy Number</label>
                  <p className="text-lg">{selectedClaim.policyNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Claim Type</label>
                  <p className="text-lg">{selectedClaim.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Claim Amount</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(selectedClaim.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Incident Date</label>
                  <p className="text-lg">
                    {selectedClaim.incidentDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Claim Date</label>
                  <p className="text-lg">
                    {selectedClaim.date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-lg mt-1 p-4 bg-gray-50 rounded-lg">
                  {selectedClaim.description}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Update Status
                </Button>
                <Button variant="outline" className="flex-1">
                  Download Documents
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

