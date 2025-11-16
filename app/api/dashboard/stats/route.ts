import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all stats in parallel to reduce database query time
    const [
      claimStats,
      quoteStats,
      reportStats,
      applicationStats
    ] = await Promise.all([
      // Claims stats
      prisma.claim.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      // Quotes stats
      prisma.quote.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      // Whistleblowing reports stats
      prisma.whistleblowingReport.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      // Applications stats
      prisma.application.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    // Process claims stats
    const claims = {
      total: claimStats.reduce((sum, item) => sum + item._count.status, 0),
      pending: claimStats.find(s => s.status === 'PENDING')?._count.status || 0,
      approved: claimStats.find(s => s.status === 'APPROVED')?._count.status || 0,
      rejected: claimStats.find(s => s.status === 'REJECTED')?._count.status || 0,
    };

    // Process quotes stats
    const quotes = {
      total: quoteStats.reduce((sum, item) => sum + item._count.status, 0),
      active: quoteStats.find(s => s.status === 'ACTIVE')?._count.status || 0,
      expired: quoteStats.find(s => s.status === 'EXPIRED')?._count.status || 0,
      converted: quoteStats.find(s => s.status === 'CONVERTED')?._count.status || 0,
    };

    // Process reports stats
    const reports = {
      total: reportStats.reduce((sum, item) => sum + item._count.status, 0),
      new: reportStats.find(s => s.status === 'NEW')?._count.status || 0,
      pending: reportStats.find(s => s.status === 'PENDING')?._count.status || 0,
      resolved: reportStats.find(s => s.status === 'RESOLVED')?._count.status || 0,
    };

    // Process applications stats
    const applications = {
      total: applicationStats.reduce((sum, item) => sum + item._count.status, 0),
      new: applicationStats.find(s => s.status === 'NEW')?._count.status || 0,
      inReview: applicationStats.find(s => s.status === 'IN_REVIEW')?._count.status || 0,
      approved: applicationStats.find(s => s.status === 'APPROVED')?._count.status || 0,
      rejected: applicationStats.find(s => s.status === 'REJECTED')?._count.status || 0,
    };

    return NextResponse.json({
      claims,
      quotes,
      reports,
      applications
    });

  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    
    // Check if it's a database connection error
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Can't reach database server. Please check your database connection." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
