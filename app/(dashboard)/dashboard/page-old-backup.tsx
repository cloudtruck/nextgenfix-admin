"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "../../../components/overview";
import { RecentOrders } from "../../../components/recent-orders";
import { getCookie } from "@/lib/utils";

import { useEffect, useState } from "react";
import {
  Line,
  Bar,
  Pie,
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
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
import { useToast } from "@/hooks/use-toast";

// Update stats type to match /api/admin/overview
type Stats = {
  users: number;
  orders: number;
  pendingChefVerifications: number;
  pendingReviews: number;
  complaints: number;
  usersChange: number;
  ordersChange: number;
  issuesChange: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    orders: 0,
    pendingChefVerifications: 0,
    pendingReviews: 0,
    complaints: 0,
    usersChange: 0,
    ordersChange: 0,
    issuesChange: 0,
  });
  const [analytics, setAnalytics] = useState<{
    trends: {
      months: string[];
      userSignups: number[];
      orders: number[];
      revenue: number[];
    };
    ordersByCategory: { category: string; count: number }[];
    orderStatusDistribution: Record<string, number>;
    averageOrderValue: number;
    repeatCustomerRate: number;
    mostPopularMenuItems: { name: string; count: number }[];
    topActiveUsers: { name: string; orderCount: number }[];
    topPerformingChefs: { name: string; orderCount: number; rating?: number }[];
  }>({
    trends: { months: [], userSignups: [], orders: [], revenue: [] },
    ordersByCategory: [],
    orderStatusDistribution: {},
    averageOrderValue: 0,
    repeatCustomerRate: 0,
    mostPopularMenuItems: [],
    topActiveUsers: [],
    topPerformingChefs: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch dashboard stats and analytics
  useEffect(() => {
    setLoading(true);
    const fetchStatsAndAnalytics = async () => {
      try {
        const token = getCookie('na_admin_token');
        // Fetch overview stats
        const statsRes = await axios.get(`${API_BASE_URL}/api/admin/overview`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setStats(statsRes.data);

        // Fetch analytics
        const analyticsRes = await axios.get(`${API_BASE_URL}/api/admin/dashboard-analytics`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setAnalytics({
          trends: analyticsRes.data.trends || { months: [], userSignups: [], orders: [], revenue: [] },
          ordersByCategory: analyticsRes.data.ordersByCategory || [],
          orderStatusDistribution: analyticsRes.data.orderStatusDistribution || {},
          averageOrderValue: analyticsRes.data.averageOrderValue ?? 0,
          repeatCustomerRate: analyticsRes.data.repeatCustomerRate ?? 0,
          mostPopularMenuItems: analyticsRes.data.mostPopularMenuItems || [],
          topActiveUsers: analyticsRes.data.topActiveUsers || [],
          topPerformingChefs: analyticsRes.data.topPerformingChefs || [],
        });
      } catch (err) {
        let message = "Failed to load dashboard data.";
        if (err && typeof err === "object") {
          if (err instanceof Error) message = err.message;
          else if (typeof (err as { message?: unknown }).message === "string") message = (err as { message: string }).message;
        }
        toast({ title: "Failed to load dashboard", description: message });
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndAnalytics();
  }, [toast]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.users}</div>
                  <p className="text-xs text-muted-foreground">{stats.usersChange >= 0 ? `+${stats.usersChange}` : stats.usersChange} from last month</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-50 to-cyan-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.complaints}</div>
                  <p className="text-xs text-muted-foreground">Menu items available</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Orders</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.orders}</div>
                  <p className="text-xs text-muted-foreground">{stats.ordersChange >= 0 ? `+${stats.ordersChange}` : stats.ordersChange} from yesterday</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : stats.complaints}</div>
                  <p className="text-xs text-muted-foreground">{stats.issuesChange >= 0 ? `+${stats.issuesChange}` : stats.issuesChange} from yesterday</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 border-0 shadow-md bg-gradient-to-br from-sky-50 to-sky-100">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3 border-0 shadow-md bg-gradient-to-br from-fuchsia-50 to-fuchsia-100">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Showing last 5 orders across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentOrders />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="col-span-1 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>System activity and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>• Order management system active</p>
                    <p>• Menu items: {stats.complaints || 0} available</p>
                    <p>• User registrations: {stats.users || 0}</p>
                    <p>• Total orders: {stats.orders || 0}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-1 border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>• Backend services: Online</p>
                    <p>• Database: Connected</p>
                    <p>• API endpoints: Active</p>
                    <p>• Admin panel: Running</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* Responsive row for Popular Items, Active Users, Top Chefs */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="flex flex-col gap-4 min-w-[320px] sm:flex-row sm:gap-2 w-full flex-wrap">
                {/* Most Popular Menu Items */}
                <Card className="flex-1 min-w-[260px] border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col min-h-[240px] px-3">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2 min-w-0">
                    <div className="bg-orange-400 text-white rounded-full p-2 shadow shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Most Popular Menu Items</CardTitle>
                      <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis">Top-selling menu items in the selected period.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="min-w-0 px-0">
                    <ul className="list-disc pl-5 space-y-1 text-base text-orange-700 break-words">
                      {analytics.mostPopularMenuItems.length === 0 ? (
                        <li>No data</li>
                      ) : (
                        analytics.mostPopularMenuItems.map((item, idx) => (
                          <li key={item.name + idx}>{item.name} <span className="text-xs text-orange-500">({item.count})</span></li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
                {/* Top Active Users */}
                <Card className="flex-1 min-w-[260px] border-0 shadow-md bg-gradient-to-br from-cyan-50 to-cyan-100 flex flex-col min-h-[240px] px-0">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2 min-w-0">
                    <div className="bg-cyan-500 text-white rounded-full p-2 shadow shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Top Active Users</CardTitle>
                      <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis">Users with the most orders or reviews.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="min-w-0 px-3">
                    <ul className="list-decimal pl-5 space-y-1 text-base text-cyan-700 break-words">
                      {analytics.topActiveUsers.length === 0 ? (
                        <li>No data</li>
                      ) : (
                        analytics.topActiveUsers.map((user, idx) => (
                          <li key={user.name + idx}>{user.name} <span className="text-xs text-cyan-500">({user.orderCount} orders)</span></li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
                {/* Top Performing Chefs */}
                <Card className="flex-1 min-w-[260px] border-0 shadow-md bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 flex flex-col min-h-[240px] px-0">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2 min-w-0">
                    <div className="bg-fuchsia-500 text-white rounded-full p-2 shadow shrink-0">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l-9-5m9 5l9-5" /></svg>
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Top Performing Chefs</CardTitle>
                      <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis">Chefs with the most orders or highest ratings.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="min-w-0 px-3">
                    <ul className="list-decimal pl-5 space-y-1 text-base text-fuchsia-700 break-words">
                      {analytics.topPerformingChefs.length === 0 ? (
                        <li>No data</li>
                      ) : (
                        analytics.topPerformingChefs.map((chef, idx) => (
                          <li key={chef.name + idx}>{chef.name} <span className="text-xs text-fuchsia-500">({chef.orderCount} orders{chef.rating !== undefined ? `, ${chef.rating}★` : ''})</span></li>
                        ))
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Trends & Charts row, make grid responsive */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-10 w-full">
              <Card className="md:col-span-7 border-0 shadow-md bg-gradient-to-br from-sky-50 to-sky-100 flex flex-col justify-between overflow-x-auto min-w-0 w-full">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <svg className="h-5 w-5 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" /></svg>
                    User/Order/Revenue Trends
                  </CardTitle>
                  <CardDescription>Line chart: User signups, orders, or revenue over time (daily/weekly/monthly).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-56 w-full min-w-0 flex items-center justify-center text-sky-400 bg-sky-50 rounded-lg border border-sky-100">
                    <div className="w-full" style={{ minWidth: 0 }}>
                      <Line
                        data={{
                          labels: analytics.trends.months.length > 0 ? analytics.trends.months : [],
                          datasets: [
                            {
                              label: 'User Signups',
                              data: analytics.trends.userSignups,
                              borderColor: '#38bdf8',
                              backgroundColor: 'rgba(56,189,248,0.2)',
                              tension: 0.4,
                            },
                            {
                              label: 'Orders',
                              data: analytics.trends.orders,
                              borderColor: '#6366f1',
                              backgroundColor: 'rgba(99,102,241,0.2)',
                              tension: 0.4,
                            },
                            {
                              label: 'Revenue',
                              data: analytics.trends.revenue,
                              borderColor: '#f59e42',
                              backgroundColor: 'rgba(245,158,66,0.2)',
                              tension: 0.4,
                              yAxisID: 'y1',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: true, position: 'top' },
                            title: { display: false },
                          },
                          scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Count' } },
                            y1: {
                              beginAtZero: true,
                              position: 'right',
                              grid: { drawOnChartArea: false },
                              title: { display: true, text: 'Revenue ($)' },
                            },
                          },
                        }}
                        height={220}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-3 flex flex-col gap-4 justify-between w-full min-w-0">
                <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 w-full min-w-0">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="bg-yellow-400 text-white rounded-full p-2 shadow">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" /></svg>
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Average Order Value</CardTitle>
                      <CardDescription>Average value of all orders placed.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2 text-yellow-600">${analytics.averageOrderValue?.toFixed(2) ?? '0.00'}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100 w-full min-w-0">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="bg-pink-400 text-white rounded-full p-2 shadow">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Repeat Customer Rate</CardTitle>
                      <CardDescription>Percentage of customers who placed more than one order.</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2 text-pink-600">{analytics.repeatCustomerRate?.toFixed(1) ?? '0.0'}%</div>
                  </CardContent>
                </Card>
              </div>
              </div>
              {/* Pie chart 60%, stacked cards 40% */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-5 w-full">
                <div className="md:col-span-3 flex flex-col justify-between w-full min-w-0">
                  <Card className="h-full border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col justify-between w-full min-w-0">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 2v10l6 6" /></svg>
                        Order Status Distribution
                      </CardTitle>
                      <CardDescription>Pie chart: Distribution of order statuses (completed, pending, cancelled).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-pink-400 bg-pink-50 rounded-lg border border-pink-100">
                        <Pie
                          data={{
                            labels: Object.keys(analytics.orderStatusDistribution),
                            datasets: [
                              {
                                label: 'Orders',
                                data: Object.values(analytics.orderStatusDistribution),
                                backgroundColor: [
                                  '#f472b6', '#fbbf24', '#60a5fa', '#a3e635', '#f87171', '#c084fc', '#f472b6',
                                ].slice(0, Object.keys(analytics.orderStatusDistribution).length),
                                borderColor: [
                                  '#be185d', '#b45309', '#1e40af', '#365314', '#991b1b', '#7c3aed', '#be185d',
                                ].slice(0, Object.keys(analytics.orderStatusDistribution).length),
                                borderWidth: 2,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { display: true, position: 'bottom' },
                              title: { display: false },
                            },
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="md:col-span-2 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 flex flex-col justify-between w-full min-w-0">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="10" x="3" y="7" rx="2" /><path d="M3 17h18" /></svg>
                      Orders by Category
                    </CardTitle>
                    <CardDescription>Bar chart: Orders by category.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-56 flex items-center justify-center text-emerald-400 bg-emerald-50 rounded-lg border border-emerald-100">
                      <Bar
                        data={{
                          labels: analytics.ordersByCategory.map((c) => c.category),
                          datasets: [
                            {
                              label: 'Orders',
                              data: analytics.ordersByCategory.map((c) => c.count),
                              backgroundColor: [
                                '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f472b6', '#60a5fa', '#f87171', '#facc15', '#a3e635', '#38bdf8', '#c084fc', '#f472b6',
                              ].slice(0, analytics.ordersByCategory.length),
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            title: { display: false },
                          },
                          scales: {
                            y: { beginAtZero: true, title: { display: true, text: 'Orders' } },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

              </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

