'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dialog";
import { Eye, Download, FileCheck, CheckCircle, Loader2, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Quote {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  productType: string;
  amount: number;
  status: string;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: string | null;
  vehicleRegNo?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
}

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quotes, searchQuery, statusFilter, productFilter]);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/quotes');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch quotes');
      }

      const data = await response.json();
      setQuotes(data.data.quotes);
    } catch (error: any) {
      console.error('Fetch quotes error:', error);
      
      if (error.message?.includes("Can't reach database") || 
          error.message?.includes("database") ||
          error.message?.includes("Connection")) {
        toast.error('Database Connection Error', {
          description: 'Unable to connect to the database. Please check your connection.',
          duration: 5000,
        });
      } else {
        toast.error('Error Loading Quotes', {
          description: error.message || 'Failed to load quotes',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...quotes];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(quote => 
        quote.id.toLowerCase().includes(query) ||
        quote.customerName.toLowerCase().includes(query) ||
        quote.email.toLowerCase().includes(query) ||
        quote.phone.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(quote => 
        quote.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Product filter
    if (productFilter !== "all") {
      filtered = filtered.filter(quote => 
        quote.productType.toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  };

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
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
      total: quotes.length,
      active: quotes.filter(q => q.status === 'ACTIVE').length,
      expired: quotes.filter(q => q.status === 'EXPIRED').length,
      converted: quotes.filter(q => q.status === 'CONVERTED').length,
      pending: quotes.filter(q => q.status === 'PENDING').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes Management</h1>
          <p className="text-gray-600 mt-1">View and manage all insurance quotes</p>
        </div>
        <Button onClick={fetchQuotes} variant="outline" disabled={isLoading}>
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
                <p className="text-sm text-gray-600">Total Quotes</p>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
                )}
              </div>
              <FileCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">{counts.active}</p>
                )}
              </div>
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
                )}
              </div>
              <FileCheck className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-red-600">{counts.expired}</p>
                )}
              </div>
              <FileCheck className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-purple-600">{counts.converted}</p>
                )}
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Custom Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by ID, customer name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="motor">Motor Insurance</SelectItem>
                  <SelectItem value="health">Health Insurance</SelectItem>
                  <SelectItem value="home">Home Insurance</SelectItem>
                  <SelectItem value="travel">Travel Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Quote ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                      <TableCell><div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-8 w-16 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : filteredQuotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileCheck className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No quotes found</p>
                        <p className="text-sm text-gray-400">
                          {searchQuery || statusFilter !== "all" || productFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "No quotes available yet"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id.slice(0, 13).toUpperCase()}</TableCell>
                      <TableCell>{quote.customerName}</TableCell>
                      <TableCell>{quote.productType}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(quote.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={quote.status} />
                      </TableCell>
                      <TableCell>{formatDate(quote.createdAt)}</TableCell>
                      <TableCell>{formatDate(quote.expiryDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(quote)}
                          >
                            <Eye className="w-4 h-4" />
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
              Showing {filteredQuotes.length} of {quotes.length} quotes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details - {selectedQuote?.id.slice(0, 13).toUpperCase()}</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Quote ID</label>
                  <p className="text-lg font-semibold">{selectedQuote.id.slice(0, 13).toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedQuote.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Name</label>
                  <p className="text-lg">{selectedQuote.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Product Type</label>
                  <p className="text-lg">{selectedQuote.productType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{selectedQuote.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-lg">{selectedQuote.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Quote Amount</label>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(selectedQuote.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created Date</label>
                  <p className="text-lg">{formatDate(selectedQuote.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expiry Date</label>
                  <p className="text-lg">{formatDate(selectedQuote.expiryDate)}</p>
                </div>
              </div>

              {/* Vehicle Details (for motor insurance) */}
              {(selectedQuote.vehicleMake || selectedQuote.vehicleModel || selectedQuote.vehicleYear || selectedQuote.vehicleRegNo) && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedQuote.vehicleMake && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Make</label>
                        <p className="text-lg">{selectedQuote.vehicleMake}</p>
                      </div>
                    )}
                    {selectedQuote.vehicleModel && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Model</label>
                        <p className="text-lg">{selectedQuote.vehicleModel}</p>
                      </div>
                    )}
                    {selectedQuote.vehicleYear && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Year</label>
                        <p className="text-lg">{selectedQuote.vehicleYear}</p>
                      </div>
                    )}
                    {selectedQuote.vehicleRegNo && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Registration No</label>
                        <p className="text-lg font-semibold">{selectedQuote.vehicleRegNo}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedQuote.notes && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-lg mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                    {selectedQuote.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

