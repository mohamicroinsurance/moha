# Frontend Integration Guide - Connecting UI to Backend APIs

## Overview
This guide shows how to connect your existing dashboard pages to the backend APIs.

## 🔄 General Pattern

### Before (Mock Data):
```typescript
const [data, setData] = useState(mockData);
```

### After (Real Data):
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const response = await fetch('/api/endpoint');
    const result = await response.json();
    if (result.success) {
      setData(result.data.items);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

## 📋 Example Implementations

### 1. Quotes Page - Fetch Quotes

**File**: `app/(dashboard)/dashboard/quotes/page.tsx`

```typescript
'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// ... other imports

export default function QuotesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchQuotes();
  }, [page]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quotes?page=${page}&limit=10`);
      const result = await response.json();
      
      if (result.success) {
        setQuotes(result.data.quotes);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 2. Quote Detail Page - CRUD Operations

**File**: `app/(dashboard)/dashboard/quotes/[id]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from "react";

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch quote on mount
  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      const result = await response.json();
      
      if (result.success) {
        setQuoteData(result.data);
        setFormData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update quote
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        setQuoteData(result.data);
        setIsEditing(false);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to update quote:', error);
    }
  };

  // Delete quote
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        router.push('/dashboard/quotes');
      }
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  // ... rest of component
}
```

### 3. News Management - Full CRUD

**File**: `app/(dashboard)/dashboard/news/page.tsx`

```typescript
'use client'

import { useState, useEffect } from "react";

export default function NewsManagementPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  // READ: Fetch all news
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news?status=all');
      const result = await response.json();
      
      if (result.success) {
        setNews(result.data.news);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE: Add new article
  const submitCreate = async () => {
    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          status: formData.status,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setNews([result.data, ...news]);
        setIsCreateDialogOpen(false);
        // Show success toast
      }
    } catch (error) {
      console.error('Failed to create news:', error);
    }
  };

  // UPDATE: Edit article
  const submitEdit = async () => {
    try {
      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        setNews(news.map(item => 
          item.id === selectedNews.id ? result.data : item
        ));
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update news:', error);
    }
  };

  // DELETE: Remove article
  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/news/${selectedNews.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setNews(news.filter(item => item.id !== selectedNews.id));
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  // ... rest of component
}
```

### 4. File Upload Example

**File**: Any page with file upload

```typescript
const handleFileUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'news-images'); // or 'documents', etc.

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData, // Don't set Content-Type header
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('File uploaded:', result.data.url);
      return result.data.url; // Cloudinary URL
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### 5. Claims Management

**File**: `app/(dashboard)/dashboard/claims/page.tsx`

```typescript
useEffect(() => {
  fetchClaims();
}, []);

const fetchClaims = async () => {
  try {
    const response = await fetch('/api/claims?page=1&limit=10');
    const result = await response.json();
    
    if (result.success) {
      setClaims(result.data.claims);
    }
  } catch (error) {
    console.error('Failed to fetch claims:', error);
  }
};

const handleUpdateStatus = async (claimId: string, newStatus: string) => {
  try {
    const response = await fetch(`/api/claims/${claimId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await response.json();
    
    if (result.success) {
      // Update local state
      setClaims(claims.map(c => 
        c.id === claimId ? result.data : c
      ));
    }
  } catch (error) {
    console.error('Failed to update claim:', error);
  }
};
```

## 🎨 Adding Loading States

### Create a Loading Component
```typescript
// components/ui/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
```

### Use in Pages
```typescript
if (loading) return <LoadingSpinner />;
if (!data) return <div>No data found</div>;

return (
  // Your content
);
```

## 🚨 Error Handling

### Create Toast/Alert Component
```typescript
// components/ui/toast.tsx
export function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'error' }) {
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`}>
      {message}
    </div>
  );
}
```

### Use in Operations
```typescript
const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

const handleOperation = async () => {
  try {
    // API call
    setToast({ show: true, message: 'Success!', type: 'success' });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  } catch (error) {
    setToast({ show: true, message: 'Error occurred', type: 'error' });
  }
};
```

## 📥 Public Form Submissions

### Contact Form (No Auth Required)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      // Show success message
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  } catch (error) {
    console.error('Failed to submit:', error);
  }
};
```

### Callback Request (No Auth Required)

```typescript
const handleCallbackRequest = async () => {
  try {
    const response = await fetch('/api/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        preferredTime: formData.preferredTime,
        message: formData.message,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      // Show success message
    }
  } catch (error) {
    console.error('Failed to submit:', error);
  }
};
```

## 🔐 Checking User Role

```typescript
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'ADMIN' || 
                  session?.user?.role === 'SUPER_ADMIN';

  return (
    <div>
      {isAdmin && (
        <Button>Admin Only Action</Button>
      )}
    </div>
  );
}
```

## 📊 Pagination Example

```typescript
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchData = async () => {
  const response = await fetch(`/api/quotes?page=${page}&limit=10`);
  const result = await response.json();
  
  if (result.success) {
    setQuotes(result.data.quotes);
    setTotalPages(result.data.pagination.totalPages);
  }
};

return (
  <div>
    {/* Your table */}
    
    <div className="flex gap-2 mt-4">
      <Button 
        disabled={page === 1} 
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>
      <span>Page {page} of {totalPages}</span>
      <Button 
        disabled={page === totalPages} 
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  </div>
);
```

## 🎯 Quick Start Checklist

- [ ] Replace mock data with API calls in all pages
- [ ] Add loading states while fetching
- [ ] Add error handling and user feedback
- [ ] Implement pagination where needed
- [ ] Add toast notifications for actions
- [ ] Test all CRUD operations
- [ ] Test with different user roles
- [ ] Add optimistic UI updates (optional)

## 💡 Pro Tips

1. **Use React Query** (optional) for better data fetching:
   ```bash
   npm install @tanstack/react-query
   ```

2. **Create a custom hook** for API calls:
   ```typescript
   // hooks/useApi.ts
   export function useApi(endpoint: string) {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       fetch(endpoint)
         .then(res => res.json())
         .then(result => setData(result.data))
         .catch(err => setError(err))
         .finally(() => setLoading(false));
     }, [endpoint]);

     return { data, loading, error };
   }
   ```

3. **Create an API client** for consistency:
   ```typescript
   // lib/api-client.ts
   export const api = {
     get: async (url: string) => {
       const response = await fetch(url);
       return response.json();
     },
     post: async (url: string, data: any) => {
       const response = await fetch(url, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
       });
       return response.json();
     },
     // ... put, delete methods
   };
   ```

## 🎉 You're All Set!

The backend is fully functional and ready to receive requests. Just update your frontend components to call the APIs instead of using mock data!

---

**Need more examples?** Check the API documentation in `BACKEND_README.md`
