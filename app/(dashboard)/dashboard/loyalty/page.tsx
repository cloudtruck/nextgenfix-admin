"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Bar,
  Line,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useToast } from "@/hooks/use-toast";
import { DateRangeSelector } from "@/components/date-range-selector";
import * as analyticsApi from "@/lib/api/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MetricCard = ({ title, value, subtitle, trend }: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { type: string; value: string };
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {trend && (
        <div className={`text-xs mt-2 ${trend.type === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {trend.value}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function LoyaltyAnalyticsPage() {
  const [loyaltyData, setLoyaltyData] = useState({
    totalUsers: 0,
    enrolledInLoyalty: 0,
    enrollmentRate: 0,
    tierBreakdown: [] as Array<{ tier: string; count: number; percentage: string }>,
    totalPointsEarned: 0,
    avgPointsPerUser: 0,
    pointsTrend: [] as Array<{ date: string; pointsEarned: number; orders: number }>,
    referralStats: {
      totalReferrals: 0,
      successfulReferrals: 0,
      conversionRate: 0
    }
  });

  const safeNumber = (value: number | null | undefined): number => value ?? 0;

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const { toast } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    const fetchLoyaltyAnalytics = async () => {
      try {
        const response = await analyticsApi.getLoyaltyAnalytics(period as analyticsApi.TimePeriod);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any;

        setLoyaltyData({
          totalUsers: data?.totalUsers ?? 0,
          enrolledInLoyalty: data?.enrolledInLoyalty ?? 0,
          enrollmentRate: data?.enrollmentRate ?? 0,
          tierBreakdown: data?.tierBreakdown ?? data?.tierDistribution ?? [],
          totalPointsEarned: data?.totalPointsEarned ?? 0,
          avgPointsPerUser: data?.avgPointsPerUser ?? 0,
          pointsTrend: data?.pointsTrend ?? [],
          referralStats: {
            totalReferrals: data?.referralStats?.totalReferrals ?? 0,
            successfulReferrals: data?.referralStats?.successfulReferrals ?? 0,
            conversionRate: data?.referralStats?.conversionRate ?? 0
          }
        });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Error fetching loyalty analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load loyalty analytics",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyAnalytics();
    return () => controller.abort();
  }, [toast, period]);

  const enrolledCount = loyaltyData.enrolledInLoyalty;
  const totalCount = loyaltyData.totalUsers;
  const notEnrolled = Math.max(totalCount - enrolledCount, 0);

  const tierDistributionChart = {
    labels: loyaltyData.tierBreakdown.map(item => item.tier),
    datasets: [{
      label: 'Users',
      data: loyaltyData.tierBreakdown.map(item => item.count),
      backgroundColor: [
        'rgba(255, 215, 0, 0.8)',
        'rgba(192, 192, 192, 0.8)',
        'rgba(205, 127, 50, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
      borderWidth: 1,
    }],
  };

  const pointsTrendChart = {
    labels: loyaltyData.pointsTrend.length > 0
      ? loyaltyData.pointsTrend.map(item => item.date)
      : ["No Data"],
    datasets: [
      {
        label: 'Points Earned',
        data: loyaltyData.pointsTrend.length > 0
          ? loyaltyData.pointsTrend.map(item => item.pointsEarned)
          : [0],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Orders',
        data: loyaltyData.pointsTrend.length > 0
          ? loyaltyData.pointsTrend.map(item => item.orders)
          : [0],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      }
    ],
  };

  const enrollmentChart = {
    labels: ['Enrolled', 'Not Enrolled'],
    datasets: [{
      label: 'Users',
      data: [enrolledCount, notEnrolled],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 1,
    }],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading loyalty analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Program Analytics</h1>
          <p className="text-muted-foreground">Track loyalty program performance, tier distribution, and referral activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <DateRangeSelector period={period} onPeriodChange={setPeriod} />
        </div>
      </div>

      {/* Loyalty Overview Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Loyalty Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Users"
            value={loyaltyData.totalUsers.toLocaleString()}
            subtitle="Registered users"
          />
          <MetricCard
            title="Enrolled in Loyalty"
            value={loyaltyData.enrolledInLoyalty.toLocaleString()}
            subtitle="Active loyalty members"
          />
          <MetricCard
            title="Enrollment Rate"
            value={`${safeNumber(loyaltyData.enrollmentRate).toFixed(1)}%`}
            subtitle="Of total users"
          />
          <MetricCard
            title="Total Points Earned"
            value={loyaltyData.totalPointsEarned.toLocaleString()}
            subtitle="Across all users"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Enrollment</CardTitle>
              <CardDescription>Enrolled vs non-enrolled users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Doughnut
                  key={`enrollment-${period}`}
                  data={enrollmentChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' as const },
                      title: { display: false },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tier Distribution</CardTitle>
              <CardDescription>Users by loyalty tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Bar
                  key={`tier-${period}`}
                  data={tierDistributionChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Points & Referrals Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Points & Referrals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Avg Points per User"
            value={safeNumber(loyaltyData.avgPointsPerUser).toFixed(0)}
            subtitle="Average loyalty points"
          />
          <MetricCard
            title="Total Referrals"
            value={loyaltyData.referralStats.totalReferrals.toLocaleString()}
            subtitle="Referral attempts"
          />
          <MetricCard
            title="Successful Referrals"
            value={loyaltyData.referralStats.successfulReferrals.toLocaleString()}
            subtitle="Converted referrals"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Points Earned Trend</CardTitle>
              <CardDescription>Daily points earned and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <Line
                  key={`points-${period}`}
                  data={pointsTrendChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' as const },
                      title: { display: false },
                    },
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Points Earned'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Orders'
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Performance</CardTitle>
              <CardDescription>Referral conversion metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {safeNumber(loyaltyData.referralStats.conversionRate).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Referrals</span>
                  <span className="font-medium">{loyaltyData.referralStats.totalReferrals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Successful</span>
                  <span className="font-medium text-green-600">{loyaltyData.referralStats.successfulReferrals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Failed</span>
                  <span className="font-medium text-red-600">
                    {Math.max(loyaltyData.referralStats.totalReferrals - loyaltyData.referralStats.successfulReferrals, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

