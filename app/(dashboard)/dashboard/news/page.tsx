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
import { Eye, Edit, Trash2, Plus, Newspaper, Calendar, User, Loader2, Upload, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  publishedDate: string;
  status: "PUBLISHED" | "DRAFT";
  category: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    content: "",
    category: "Company",
    status: "DRAFT",
    imageUrl: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch news');
      }

      const data = await response.json();
      setNews(data.data.news);
    } catch (error: any) {
      console.error('Fetch news error:', error);
      
      if (error.message?.includes("Can't reach database") || 
          error.message?.includes("database") ||
          error.message?.includes("Connection")) {
        toast.error('Database Connection Error', {
          description: 'Unable to connect to the database. Please check your connection.',
          duration: 5000,
        });
      } else {
        toast.error('Error Loading News', {
          description: error.message || 'Failed to load news articles',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: NewsItem) => {
    setSelectedNews(item);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (item: NewsItem) => {
    setSelectedNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      status: item.status,
      imageUrl: item.imageUrl,
    });
    setImagePreview(item.imageUrl || null);
    setImageFile(null);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: NewsItem) => {
    setSelectedNews(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNews) return;

    try {
      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete news');
      }

      toast.success('News article deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete news article');
    }
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      content: "",
      category: "Company",
      status: "DRAFT",
      imageUrl: null,
    });
    setImageFile(null);
    setImagePreview(null);
    setIsCreateDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB for authenticated users)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPG, PNG, or WebP images');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: null });
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.imageUrl || null;

    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      uploadFormData.append('folder', 'moha-insurance/news');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data.data.url;
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const submitCreate = async () => {
    // Validation
    if (!formData.title?.trim() || !formData.content?.trim() || !formData.category?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.title.length < 5) {
      toast.error('Title must be at least 5 characters long');
      return;
    }

    if (formData.content.length < 50) {
      toast.error('Content must be at least 50 characters long');
      return;
    }

    try {
      setIsSaving(true);

      // Upload image if present
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          status: formData.status,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create news');
      }

      toast.success('News article created successfully');
      setIsCreateDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      console.error('Create error:', error);
      toast.error(error.message || 'Failed to create news article');
    } finally {
      setIsSaving(false);
    }
  };

  const submitEdit = async () => {
    if (!selectedNews) return;

    // Validation
    if (!formData.title?.trim() || !formData.content?.trim() || !formData.category?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.title.length < 5) {
      toast.error('Title must be at least 5 characters long');
      return;
    }

    if (formData.content.length < 50) {
      toast.error('Content must be at least 50 characters long');
      return;
    }

    try {
      setIsSaving(true);

      // Upload image if a new one is selected
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          status: formData.status,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update news');
      }

      toast.success('News article updated successfully');
      setIsEditDialogOpen(false);
      fetchNews();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update news article');
    } finally {
      setIsSaving(false);
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
      total: news.length,
      published: news.filter(n => n.status === 'PUBLISHED').length,
      drafts: news.filter(n => n.status === 'DRAFT').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage news articles</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchNews} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add News
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total News</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <Newspaper className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{counts.published}</p>
              </div>
              <Newspaper className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{counts.drafts}</p>
              </div>
              <Newspaper className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All News Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-gray-500 mt-2">Loading news articles...</p>
                    </TableCell>
                  </TableRow>
                ) : news.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Newspaper className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No news articles found</p>
                        <Button onClick={handleCreate} variant="outline" className="mt-2">
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Article
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  news.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-sm text-gray-500 truncate">{item.content.substring(0, 60)}...</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "PUBLISHED" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.publishedDate)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item)}
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
              Showing {news.length} article{news.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>News Article Details</DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              {selectedNews.imageUrl && (
                <img 
                  src={selectedNews.imageUrl} 
                  alt={selectedNews.title} 
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedNews.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedNews.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedNews.publishedDate)}
                  </div>
                  <Badge variant={selectedNews.status === "PUBLISHED" ? "default" : "secondary"}>
                    {selectedNews.status}
                  </Badge>
                  <Badge variant="outline">{selectedNews.category}</Badge>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedNews.content}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          setImageFile(null);
          setImagePreview(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? "Create New Article" : "Edit Article"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter article title (min 5 characters)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Company, Product, Industry"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "PUBLISHED" | "DRAFT" })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Featured Image (Optional)</Label>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="image"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (MAX. 10MB)</p>
                  </label>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter article content (min 50 characters)"
                rows={10}
              />
              <p className="text-xs text-gray-500">
                {formData.content?.length || 0} characters (min 50 required)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateDialogOpen(false);
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={isCreateDialogOpen ? submitCreate : submitEdit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSaving || isUploading}
            >
              {isSaving || isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUploading ? 'Uploading Image...' : 'Saving...'}
                </>
              ) : (
                isCreateDialogOpen ? 'Create Article' : 'Save Changes'
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
            Are you sure you want to delete <strong>{selectedNews?.title}</strong>? This action cannot be undone.
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
