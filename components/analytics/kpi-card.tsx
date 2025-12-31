/**
 * KPI Card Component
 * 
 * Displays a key performance indicator with:
 * - Title
 * - Value
 * - Change percentage (vs previous period)
 * - Trend indicator (up/down/stable)
 * - Optional subtitle/description
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage';
  loading?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  subtitle,
  icon,
  trend,
  format = 'number',
  loading = false,
  className,
}: KPICardProps) {
  
  // Format the value based on type
  const formattedValue = (() => {
    if (loading) return '---';
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value.toLocaleString('en-US');
    }
  })();

  // Determine trend direction from change value if not explicitly provided
  const trendDirection = trend || (change !== undefined
    ? change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    : undefined);

  // Get trend color
  const getTrendColor = () => {
    if (!trendDirection) return 'text-muted-foreground';
    switch (trendDirection) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Get trend icon
  const TrendIcon = () => {
    if (!trendDirection || loading) return null;
    switch (trendDirection) {
      case 'up':
        return <ArrowUp className="h-4 w-4" />;
      case 'down':
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  // Get background gradient based on trend
  const getGradient = () => {
    if (!trendDirection) return 'from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800';
    switch (trendDirection) {
      case 'up':
        return 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900';
      case 'down':
        return 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900';
      default:
        return 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900';
    }
  };

  return (
    <Card className={cn("border-0 shadow-md bg-gradient-to-br", getGradient(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            ) : (
              formattedValue
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          
          {change !== undefined && !loading && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor())}>
              <TrendIcon />
              <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
              <span className="text-muted-foreground font-normal">{changeLabel}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * KPI Grid Component
 * Wrapper for displaying multiple KPI cards in a responsive grid
 */
export interface KPIGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function KPIGrid({ children, columns = 4, className }: KPIGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

/**
 * Loading KPI Card
 * Skeleton loading state for KPI cards
 */
export function LoadingKPICard() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
