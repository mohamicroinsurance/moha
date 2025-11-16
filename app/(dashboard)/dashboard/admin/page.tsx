'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Users, Shield, Loader2, RefreshCw, Trash2, Power, PowerOff, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  phone: string | null;
  image: string | null;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetchUsers();
  }, [status]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data.users);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Fetch users error:', error);
      
      if (errorMessage.includes("Can't reach database") || 
          errorMessage.includes("database") ||
          errorMessage.includes("Connection")) {
        toast.error('Database Connection Error', {
          description: 'Unable to connect to the database. Please check your connection.',
          duration: 5000,
        });
      } else if (errorMessage.includes("Forbidden")) {
        toast.error('Access Denied', {
          description: 'You do not have permission to access this page.',
          duration: 4000,
        });
      } else {
        toast.error('Error Loading Users', {
          description: errorMessage || 'Failed to load users',
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (user: UserData) => {
    if (user.id === session?.user?.id) {
      toast.error('Cannot delete your own account');
      return;
    }
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleStatusClick = (user: UserData) => {
    if (user.id === session?.user?.id) {
      toast.error('Cannot deactivate your own account');
      return;
    }
    setSelectedUser(user);
    setIsToggleStatusDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setIsProcessing(true);
      if (!selectedUser?.id || typeof selectedUser.id !== 'string') {
        toast.error('Invalid user id. Please refresh and try again.');
        console.warn('Delete action blocked: invalid selectedUser.id', selectedUser);
        return;
      }
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      toast.success('User deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Delete error:', error);
      
      if (errorMessage.includes("Cannot delete your own account")) {
        toast.error('Cannot delete your own account');
      } else if (errorMessage.includes("cannot delete other admin accounts")) {
        toast.error('Permission Denied', {
          description: 'Admins cannot delete other admin accounts',
        });
      } else {
        toast.error('Delete Failed', {
          description: errorMessage || 'Failed to delete user',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      setIsProcessing(true);
      const newStatus = !selectedUser.isActive;
      if (!selectedUser?.id || typeof selectedUser.id !== 'string') {
        toast.error('Invalid user id. Please refresh and try again.');
        console.warn('Toggle action blocked: invalid selectedUser.id', selectedUser);
        return;
      }
      
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user status');
      }

      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setIsToggleStatusDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Toggle status error:', error);
      
      if (errorMessage.includes("Cannot deactivate your own account")) {
        toast.error('Cannot deactivate your own account');
      } else if (errorMessage.includes("cannot modify other admin accounts")) {
        toast.error('Permission Denied', {
          description: 'Admins cannot modify other admin accounts',
        });
      } else {
        toast.error('Update Failed', {
          description: errorMessage || 'Failed to update user status',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusCounts = () => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      admins: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
    };
  };

  const counts = getStatusCounts();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Loading session...</span>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and their permissions</p>
        </div>
        <Button onClick={fetchUsers} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
                )}
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">{counts.active}</p>
                )}
              </div>
              <Power className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-red-600">{counts.inactive}</p>
                )}
              </div>
              <PowerOff className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-purple-600">{counts.admins}</p>
                )}
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></TableCell>
                      <TableCell><div className="h-8 w-24 bg-gray-200 animate-pulse rounded ml-auto"></div></TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 font-medium">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-600 text-white">
                              {getInitials(user.name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name || 'N/A'}</p>
                            {user.id === session?.user?.id && (
                              <Badge variant="outline" className="mt-1 text-xs">You</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-green-600" : "bg-gray-500"}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(user)}
                            title="View details"
                          >
                            <User className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatusClick(user)}
                            disabled={user.id === session?.user?.id}
                            title={user.isActive ? "Deactivate" : "Activate"}
                            className={user.isActive ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                          >
                            {user.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(user)}
                            disabled={user.id === session?.user?.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete user"
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
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {getInitials(selectedUser.name, selectedUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name || 'No name'}</h3>
                  <p className="text-gray-600">{selectedUser.email || 'No email'}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={getRoleBadgeColor(selectedUser.role)}>
                      {selectedUser.role.replace('_', ' ')}
                    </Badge>
                    <Badge variant={selectedUser.isActive ? "default" : "secondary"} className={selectedUser.isActive ? "bg-green-600" : "bg-gray-500"}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-lg font-mono text-sm">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-lg">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Verified</label>
                  <p className="text-lg">{selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-lg">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-lg">{formatDate(selectedUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete user <strong>{selectedUser?.name || selectedUser?.email}</strong>? 
            This action cannot be undone. All associated data will be permanently deleted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog open={isToggleStatusDialogOpen} onOpenChange={setIsToggleStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {selectedUser?.isActive ? 'Deactivation' : 'Activation'}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to {selectedUser?.isActive ? 'deactivate' : 'activate'} user{' '}
            <strong>{selectedUser?.name || selectedUser?.email}</strong>?
            {selectedUser?.isActive && (
              <span className="block mt-2 text-orange-600 font-medium">
                The user will not be able to log in once deactivated.
              </span>
            )}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsToggleStatusDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={confirmToggleStatus} 
              disabled={isProcessing}
              className={selectedUser?.isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                selectedUser?.isActive ? 'Deactivate User' : 'Activate User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
