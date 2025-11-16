'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Eye, Edit, Trash2, Plus, FileText, Download, Upload, Loader2, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploaderId: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export default function DocumentsManagementPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    fileUrl: "",
    fileSize: "",
    fileType: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/documents');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.data.documents);
    } catch (error: any) {
      console.error('Fetch documents error:', error);
      
      if (error.message?.includes("Can't reach database") || 
          error.message?.includes("database") ||
          error.message?.includes("Connection")) {
        toast.error('Database Connection Error', {
          description: 'Unable to connect to the database. Please check your connection.',
          duration: 5000,
        });
      } else {
        toast.error('Error Loading Documents', {
          description: error.message || 'Failed to load documents',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (doc: Document) => {
    setSelectedDoc(doc);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDoc(doc);
    setFormData({
      title: doc.title,
      description: doc.description,
      category: doc.category,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      fileType: doc.fileType,
    });
    setFile(null);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setSelectedDoc(doc);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDoc) return;

    try {
      const response = await fetch(`/api/documents/${selectedDoc.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }

      toast.success('Document deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchDocuments();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete document');
    }
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      description: "",
      category: "General",
      fileUrl: "",
      fileSize: "",
      fileType: "",
    });
    setFile(null);
    setIsCreateDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async (): Promise<{url: string, size: string, type: string} | null> => {
    if (!file) return null;

    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'moha-insurance/documents');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      return {
        url: data.data.url,
        size: `${(data.data.size / 1024 / 1024).toFixed(2)} MB`,
        type: data.data.type,
      };
    } catch (error: any) {
      console.error('File upload error:', error);
      toast.error(error.message || 'Failed to upload file');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      // Increment download count
      await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
      });

      // Open file in new tab
      window.open(doc.fileUrl, '_blank');
      
      // Update local state
      setDocuments(documents.map(d => 
        d.id === doc.id ? { ...d, downloads: d.downloads + 1 } : d
      ));

      toast.success('Document downloaded');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Failed to track download');
    }
  };

  const submitCreate = async () => {
    // Validation
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.category?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (formData.title.length < 3) {
      toast.error('Title must be at least 3 characters long');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }

    try {
      setIsSaving(true);

      // Upload file
      const fileData = await uploadFile();
      if (!fileData) {
        throw new Error('Failed to upload file');
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          fileUrl: fileData.url,
          fileSize: fileData.size,
          fileType: fileData.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create document');
      }

      toast.success('Document uploaded successfully');
      setIsCreateDialogOpen(false);
      fetchDocuments();
    } catch (error: any) {
      console.error('Create error:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setIsSaving(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedDoc) return;

    // Validation
    if (!formData.title?.trim() || !formData.description?.trim() || !formData.category?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.title.length < 3) {
      toast.error('Title must be at least 3 characters long');
      return;
    }

    if (formData.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(`/api/documents/${selectedDoc.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update document');
      }

      toast.success('Document updated successfully');
      setIsEditDialogOpen(false);
      fetchDocuments();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update document');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStats = () => {
    const totalSize = documents.reduce((sum, doc) => {
      const size = parseFloat(doc.fileSize);
      return sum + (doc.fileSize.includes('MB') ? size : size / 1024);
    }, 0);

    return {
      total: documents.length,
      totalDownloads: documents.reduce((sum, doc) => sum + doc.downloads, 0),
      categories: new Set(documents.map(d => d.category)).size,
      totalSize: totalSize.toFixed(1),
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents Management</h1>
          <p className="text-gray-600 mt-1">Upload, manage, and share documents</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchDocuments} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalDownloads}</p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-purple-600">{stats.categories}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalSize} MB</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-gray-500 mt-2">Loading documents...</p>
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No documents found</p>
                        <Button onClick={handleCreate} variant="outline" className="mt-2">
                          <Plus className="w-4 h-4 mr-2" />
                          Upload First Document
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="max-w-xs">
                        <p className="font-medium truncate">{doc.title}</p>
                        <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.category}</Badge>
                      </TableCell>
                      <TableCell>{doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'}</TableCell>
                      <TableCell>{doc.fileSize}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-600">{doc.downloads}</span>
                      </TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(doc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(doc)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(doc)}
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
              Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Title</label>
                  <p className="text-lg font-semibold">{selectedDoc.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="text-lg"><Badge variant="outline">{selectedDoc.category}</Badge></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Type</label>
                  <p className="text-lg">{selectedDoc.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Size</label>
                  <p className="text-lg">{selectedDoc.fileSize}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Downloads</label>
                  <p className="text-lg font-semibold text-blue-600">{selectedDoc.downloads}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                  <p className="text-lg">{selectedDoc.uploadedBy}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-lg mt-1 p-4 bg-gray-50 rounded-lg">{selectedDoc.description}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handleDownload(selectedDoc)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Document
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter document title (min 3 characters)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Financial, Marketing, Guide"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter document description (min 10 characters)"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Upload File *</Label>
              {file ? (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={removeFile}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload file</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</p>
                  </label>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitCreate} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSaving || isUploading}
            >
              {isSaving || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                'Upload Document'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Document Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Financial, Marketing, Guide"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter document description"
                rows={4}
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Note: File cannot be changed after upload. To replace the file, delete this document and upload a new one.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitEdit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
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
            Are you sure you want to delete <strong>{selectedDoc?.title}</strong>? This action cannot be undone.
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
