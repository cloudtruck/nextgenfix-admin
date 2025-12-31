/**
 * Analytics Date Range Selector Component
 * 
 * Allows users to select time periods for analytics data
 */

"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { TimePeriod } from "@/lib/analyticsApi";

export interface DateRangeSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  className?: string;
}

const periodLabels: Record<TimePeriod, string> = {
  '1d': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '1y': 'Last year',
};

export function DateRangeSelector({ value, onChange, className }: DateRangeSelectorProps) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={(val) => onChange(val as TimePeriod)}>
        <SelectTrigger className="w-[180px]">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1d">{periodLabels['1d']}</SelectItem>
          <SelectItem value="7d">{periodLabels['7d']}</SelectItem>
          <SelectItem value="30d">{periodLabels['30d']}</SelectItem>
          <SelectItem value="90d">{periodLabels['90d']}</SelectItem>
          <SelectItem value="1y">{periodLabels['1y']}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
