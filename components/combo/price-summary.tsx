"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ComboDiscount } from "@/lib/api/combos"

interface PriceSummaryProps {
  originalPrice: number
  discount: ComboDiscount
  showBreakdown?: boolean
}

export function PriceSummary({
  originalPrice,
  discount,
  showBreakdown = true
}: PriceSummaryProps) {
  const calculateDiscountAmount = () => {
    if (discount.type === 'none') return 0
    if (discount.type === 'percentage') {
      return Math.round((originalPrice * discount.value) / 100 * 100) / 100
    }
    return Math.round(discount.value * 100) / 100
  }

  const discountAmount = calculateDiscountAmount()
  const finalPrice = Math.max(0, Math.round((originalPrice - discountAmount) * 100) / 100)

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base mb-3">Price Summary</h3>
        
        <div className="space-y-2">
          {/* Original Price */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Original Total:</span>
            <span className="font-medium">₹{originalPrice.toFixed(2)}</span>
          </div>

          {/* Discount */}
          {discount.type !== 'none' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Discount {discount.type === 'percentage' && `(${discount.value}%)`}:
                </span>
                <span className="font-medium text-green-600">
                  -₹{discountAmount.toFixed(2)}
                </span>
              </div>
              
              {showBreakdown && (
                <p className="text-xs text-muted-foreground italic">
                  {discount.type === 'percentage'
                    ? `${discount.value}% of ₹${originalPrice.toFixed(2)}`
                    : `Fixed discount of ₹${discount.value.toFixed(2)}`
                  }
                </p>
              )}
            </>
          )}

          <div className="border-t border-border my-2" />

          {/* Final Price */}
          <div className="flex justify-between text-base">
            <span className="font-semibold">Final Price:</span>
            <span className="font-bold text-lg text-primary">
              ₹{finalPrice.toFixed(2)}
            </span>
          </div>

          {/* Savings Indicator */}
          {/* {discountAmount > 0 && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-950 rounded text-center">
              <p className="text-xs font-medium text-green-700 dark:text-green-300">
                You save ₹{discountAmount.toFixed(2)} ({Math.round((discountAmount / originalPrice) * 100)}%)
              </p>
            </div>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
}
