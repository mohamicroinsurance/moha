'use client'

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  FileCheck, 
  Shield, 
  Briefcase,
  TrendingUp,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DashboardStats {
  claims: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  quotes: {
    total: number;
    active: number;
    expired: number;
    converted: number;
  };
  reports: {
    total: number;
    new: number;
    pending: number;
    resolved: number;
  };
  applications: {
    total: number;
    new: number;
    inReview: number;
    approved: number;
    rejected: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch dashboard data' }));
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        const data = await response.json();
        setStats(data);
      } catch (error: any) {
        console.error('Dashboard fetch error:', error);
        
        // Check if it's a database connection error
        if (error.message?.includes("Can't reach database") || 
            error.message?.includes("database") ||
            error.message?.includes("Connection")) {
          toast.error('Database Connection Error', {
            description: 'Unable to connect to the database. Please check your connection settings.',
            duration: 5000,
          });
        } else {
          toast.error('Error Loading Dashboard', {
            description: error.message || 'An unexpected error occurred',
            duration: 4000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const recentActivities = [
    { id: 1, type: "claim", action: "New claim submitted", user: "John Doe", time: "2 minutes ago", status: "pending" },
    { id: 2, type: "quote", action: "Quote converted to policy", user: "Jane Smith", time: "15 minutes ago", status: "approved" },
    { id: 3, type: "report", action: "New whistleblowing report", user: "Anonymous", time: "1 hour ago", status: "new" },
    { id: 4, type: "application", action: "Job application received", user: "Mike Johnson", time: "2 hours ago", status: "new" },
    { id: 5, type: "claim", action: "Claim approved", user: "Sarah Williams", time: "3 hours ago", status: "approved" },
  ];

  const quickActions = [
    { title: "Review Claims", description: "Process pending claims", href: "/dashboard/claims", icon: FileText, color: "from-orange-500 to-orange-600" },
    { title: "Manage Quotes", description: "View and convert quotes", href: "/dashboard/quotes", icon: FileCheck, color: "from-blue-500 to-blue-600" },
    { title: "Reports", description: "Review whistleblowing reports", href: "/dashboard/whistleblowing", icon: Shield, color: "from-red-500 to-red-600" },
    { title: "Applications", description: "Review job applications", href: "/dashboard/applications", icon: Briefcase, color: "from-green-500 to-green-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-xl border border-blue-100">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-700 mt-2 font-medium">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Claims"
              value={stats?.claims.total.toString() || "0"}
              icon={FileText}
              change="+12% from last month"
              changeType="positive"
              description={`Pending: ${stats?.claims.pending || 0} | Approved: ${stats?.claims.approved || 0} | Rejected: ${stats?.claims.rejected || 0}`}
              iconColor="text-orange-600"
            />
            <StatsCard
              title="Total Quotes"
              value={stats?.quotes.total.toString() || "0"}
              icon={FileCheck}
              change="+8% from last month"
              changeType="positive"
              description={`Active: ${stats?.quotes.active || 0} | Expired: ${stats?.quotes.expired || 0} | Converted: ${stats?.quotes.converted || 0}`}
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Whistleblowing Reports"
              value={stats?.reports.total.toString() || "0"}
              icon={Shield}
              change="5 new this week"
              changeType="neutral"
              description={`New: ${stats?.reports.new || 0} | Pending: ${stats?.reports.pending || 0} | Resolved: ${stats?.reports.resolved || 0}`}
              iconColor="text-red-600"
            />
            <StatsCard
              title="Job Applications"
              value={stats?.applications.total.toString() || "0"}
              icon={Briefcase}
              change="+15% from last month"
              changeType="positive"
              description={`New: ${stats?.applications.new || 0} | In Review: ${stats?.applications.inReview || 0} | Approved: ${stats?.applications.approved || 0} | Rejected: ${stats?.applications.rejected || 0}`}
              iconColor="text-green-600"
            />
          </>
        )}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={action.href}>
                    <Card className="hover:shadow-lg hover:scale-105 transition-all cursor-pointer border-0 shadow-md group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`bg-gradient-to-br ${action.color} p-3 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-1">
                    {activity.type === "claim" && <FileText className="w-4 h-4 text-blue-600" />}
                    {activity.type === "quote" && <FileCheck className="w-4 h-4 text-green-600" />}
                    {activity.type === "report" && <Shield className="w-4 h-4 text-red-600" />}
                    {activity.type === "application" && <Briefcase className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                  <div>
                    {activity.status === "pending" && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    )}
                    {activity.status === "approved" && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Approved
                      </Badge>
                    )}
                    {activity.status === "new" && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        New
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts/Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Claims Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="font-semibold">45</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "4%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <span className="font-semibold">1,089</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "88%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <span className="font-semibold">100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "8%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Applications Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-gray-600">New</span>
                </div>
                <span className="font-semibold">28</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                  <span className="text-sm text-gray-600">In Review</span>
                </div>
                <span className="font-semibold">67</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "47%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <span className="font-semibold">32</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "23%" }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <span className="text-sm text-gray-600">Rejected</span>
                </div>
                <span className="font-semibold">15</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

