'use client'

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Users, Shield, Settings, Activity, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@moha.co.tz",
    role: "Admin",
    status: "Active",
    lastLogin: new Date("2024-01-15"),
    department: "IT",
    avatar: "JD",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@moha.co.tz",
    role: "Claims Manager",
    status: "Active",
    lastLogin: new Date("2024-01-14"),
    department: "Claims",
    avatar: "JS",
  },
  {
    id: "USR-003",
    name: "Mike Johnson",
    email: "mike.johnson@moha.co.tz",
    role: "Agent",
    status: "Inactive",
    lastLogin: new Date("2024-01-05"),
    department: "Sales",
    avatar: "MJ",
  },
  {
    id: "USR-004",
    name: "Sarah Williams",
    email: "sarah.williams@moha.co.tz",
    role: "Analyst",
    status: "Active",
    lastLogin: new Date("2024-01-15"),
    department: "Analytics",
    avatar: "SW",
  },
];

const mockRoles = [
  { id: "admin", name: "Admin", description: "Full system access", permissions: ["all"] },
  { id: "claims-manager", name: "Claims Manager", description: "Manage claims and reports", permissions: ["claims", "reports"] },
  { id: "agent", name: "Agent", description: "Create quotes and policies", permissions: ["quotes", "policies"] },
  { id: "analyst", name: "Analyst", description: "View analytics and reports", permissions: ["analytics", "reports"] },
];

const mockActivityLogs = [
  { id: 1, user: "John Doe", action: "Updated claim status", timestamp: new Date("2024-01-15T10:30:00"), ip: "192.168.1.1" },
  { id: 2, user: "Jane Smith", action: "Created new quote", timestamp: new Date("2024-01-15T09:15:00"), ip: "192.168.1.2" },
  { id: 3, user: "Mike Johnson", action: "Viewed report", timestamp: new Date("2024-01-15T08:45:00"), ip: "192.168.1.3" },
  { id: 4, user: "Sarah Williams", action: "Exported data", timestamp: new Date("2024-01-14T17:20:00"), ip: "192.168.1.4" },
];

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin & Users</h1>
        <p className="text-gray-600 mt-1">Manage users, roles, and system settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.status === "Active").length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Roles</p>
                <p className="text-2xl font-bold text-purple-600">{mockRoles.length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activity Logs</p>
                <p className="text-2xl font-bold text-orange-600">{mockActivityLogs.length}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email" />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" placeholder="Enter department" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Create User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <FilterBar
                searchPlaceholder="Search users by name or email..."
                filters={[
                  {
                    label: "Status",
                    key: "status",
                    options: [
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ],
                  },
                  {
                    label: "Role",
                    key: "role",
                    options: mockRoles.map((role) => ({
                      label: role.name,
                      value: role.id,
                    })),
                  },
                ]}
              />

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-600 text-white">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.status} />
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockRoles.map((role) => (
                  <Card key={role.id} className="border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="secondary">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Edit Permissions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActivityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{formatDate(log.timestamp)}</TableCell>
                        <TableCell className="text-gray-500">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Company Name</Label>
                <Input defaultValue="Moha Insurance" className="mt-2" />
              </div>
              <div>
                <Label>Support Email</Label>
                <Input defaultValue="support@moha.co.tz" className="mt-2" />
              </div>
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" defaultValue="30" className="mt-2" />
              </div>
              <div>
                <Label>Max Login Attempts</Label>
                <Input type="number" defaultValue="5" className="mt-2" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {selectedUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <StatusBadge status={selectedUser.status} className="mt-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-lg">{selectedUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-lg">
                    <Badge variant="outline">{selectedUser.role}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-lg">{selectedUser.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-lg">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Edit User
                </Button>
                <Button variant="outline" className="flex-1">
                  Reset Password
                </Button>
                <Button variant="destructive" className="flex-1">
                  Deactivate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

