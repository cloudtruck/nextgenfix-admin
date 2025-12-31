"use client"

import { AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PriceWarning } from "@/lib/api/combos"
import { Button } from "@/components/ui/button"

interface PriceWarningAlertProps {
  warning?: PriceWarning
  combosWithWarnings?: Array<{ name: string; priceWarning?: PriceWarning }>
  onCheckPrices?: () => void
  className?: string
}

export function PriceWarningAlert({ warning, combosWithWarnings, onCheckPrices, className }: PriceWarningAlertProps) {
  // Single warning mode
  if (warning && !combosWithWarnings) {
    if (!warning.hasWarning) return null

    return (
      <div className={cn(
        "flex items-start gap-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30",
        className
      )}>
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <strong className="font-semibold text-yellow-800 dark:text-yellow-200">
            Price Mismatch Detected:
          </strong>
          <p className="mt-1 text-yellow-700 dark:text-yellow-300">
            {warning.message}
          </p>
          {warning.lastChecked && (
            <span className="block text-xs mt-2 text-yellow-600 dark:text-yellow-400">
              Last checked: {new Date(warning.lastChecked).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Multiple combos mode
  if (combosWithWarnings && combosWithWarnings.length > 0) {
    return (
      <div className={cn(
        "flex items-start gap-3 p-4 rounded-md border border-yellow-200 bg-gray-500 dark:border-yellow-800 dark:bg-yellow-950/30",
        className
      )}>
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <strong className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">
              {combosWithWarnings.length} Combo{combosWithWarnings.length !== 1 ? 's' : ''} with Price Mismatches
            </strong>
            {onCheckPrices && (
              <Button
                onClick={onCheckPrices}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                Recheck All Prices
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            Menu item prices have changed. Review and update these combos to ensure accurate pricing.
          </p>
          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            Affected combos: {combosWithWarnings.map(c => c.name).join(', ')}
          </div>
        </div>
      </div>
    )
  }

  return null
}

interface PriceWarningBadgeProps {
  warning: PriceWarning | undefined
}

export function PriceWarningBadge({ warning }: PriceWarningBadgeProps) {
  if (!warning?.hasWarning) return null

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium">
      <Info className="h-3 w-3" />
      Price Mismatch
    </div>
  )
}
