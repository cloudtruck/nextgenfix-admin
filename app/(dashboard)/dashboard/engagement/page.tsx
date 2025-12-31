"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  Line
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

// Metric Card Component
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

export default function EngagementAnalyticsPage() {
  const [sessionData, setSessionData] = useState({
    totalSessions: 0,
    avgSessionDuration: 0,
    totalPageViews: 0,
    avgPageViewsPerSession: 0,
    uniqueUsersCount: 0,
    bounceRate: 0,
    durationDistribution: [] as Array<{ range: string, count: number }>
  });

  const [favoritesData, setFavoritesData] = useState({
    totalFavorites: 0,
    totalUnfavorites: 0,
    avgFavoritesPerProduct: 0,
    mostFavoritedProducts: [] as Array<{ name?: string, favorites: number }>,
    favoritesTrend: [] as Array<{ date: string, favorites: number, unfavorites: number, netFavorites: number }>
  });

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const { toast } = useToast();

  useEffect(() => {
    const fetchEngagementAnalytics = async () => {
      try {
        const [sessionResponse, favoritesResponse] = await Promise.all([
          analyticsApi.getSessionAnalytics(period as analyticsApi.TimePeriod),
          analyticsApi.getFavoritesAnalytics(period as analyticsApi.TimePeriod)
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSessionData(sessionResponse.data as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFavoritesData(favoritesResponse.data as any);

      } catch (error) {
        console.error('Error fetching engagement analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load engagement analytics",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEngagementAnalytics();
  }, [period, toast]);

  // Memoized charts to prevent Chart.js from shrinking due to re-renders
  const sessionDurationChart = useMemo(() => ({
    labels: sessionData.durationDistribution.map(item => item.range),
    datasets: [{
      label: 'Sessions',
      data: sessionData.durationDistribution.map(item => item.count),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }],
  }), [sessionData]);

  const favoritesTrendChart = useMemo(() => ({
    labels: favoritesData.favoritesTrend.map(item => item.date),
    datasets: [
      {
        label: 'Favorites Added',
        data: favoritesData.favoritesTrend.map(item => item.favorites),
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Favorites Removed',
        data: favoritesData.favoritesTrend.map(item => item.unfavorites),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ],
  }), [favoritesData]);

  const topFavoritesChart = useMemo(() => {
    const sorted = [...favoritesData.mostFavoritedProducts]
      .filter(p => p && typeof p.favorites === 'number')
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, 10);

    return {
      labels: sorted.map(p => p.name || 'Unknown'),
      datasets: [{
        label: 'Favorites Count',
        data: sorted.map(p => p.favorites),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(255, 99, 255, 0.8)',
          'rgba(99, 255, 132, 0.8)',
        ],
        borderWidth: 1,
      }],
    };
  }, [favoritesData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading engagement analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Engagement Analytics</h1>
          <p className="text-muted-foreground">Track user engagement, session behavior, and favorites activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <DateRangeSelector period={period} onPeriodChange={setPeriod} />
        </div>
      </div>

      {/* Session Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Session Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Sessions" value={sessionData.totalSessions.toLocaleString()} subtitle="All user sessions" />
          <MetricCard
            title="Avg Session Duration"
            value={`${Math.round(sessionData.avgSessionDuration / 60)}m ${Math.round(sessionData.avgSessionDuration % 60)}s`}
            subtitle="Average time per session"
          />
          <MetricCard title="Total Page Views" value={sessionData.totalPageViews.toLocaleString()} subtitle="Across all sessions" />
          <MetricCard title="Bounce Rate" value={`${sessionData.bounceRate}%`} subtitle="Single-page sessions" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Duration Distribution</CardTitle>
              <CardDescription>Breakdown of session lengths</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              <Bar
                key={`session-${period}`}
                data={sessionDurationChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Favorites Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Favorites Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard title="Total Favorites" value={favoritesData.totalFavorites.toLocaleString()} subtitle="Items added to favorites" />
          <MetricCard title="Total Unfavorites" value={favoritesData.totalUnfavorites.toLocaleString()} subtitle="Items removed from favorites" />
          <MetricCard title="Avg Favorites per Product" value={favoritesData.avgFavoritesPerProduct.toFixed(1)} subtitle="Average favorites count" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Favorites Trend</CardTitle>
              <CardDescription>Additions vs removals over time</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              <Line
                key={`trend-${period}`}
                data={favoritesTrendChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Favorited Products</CardTitle>
              <CardDescription>Top 10 products by favorites count</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              <Bar
                key={`topfav-${period}`}
                data={topFavoritesChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

