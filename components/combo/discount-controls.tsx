"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ComboDiscount } from "@/lib/api/combos"

interface DiscountControlsProps {
  discount: ComboDiscount
  originalPrice: number
  onChange: (discount: ComboDiscount) => void
}

export function DiscountControls({
  discount,
  originalPrice,
  onChange
}: DiscountControlsProps) {
  const handleTypeChange = (type: 'percentage' | 'fixed' | 'none') => {
    onChange({
      ...discount,
      type,
      value: type === 'none' ? 0 : discount.value
    })
  }

  const handleValueChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    
    // Validation
    let validValue = Math.max(0, numValue)
    
    if (discount.type === 'percentage') {
      validValue = Math.min(100, validValue)
    } else if (discount.type === 'fixed') {
      validValue = Math.min(originalPrice, validValue)
    }
    
    onChange({
      ...discount,
      value: validValue
    })
  }

  const calculateDiscountAmount = () => {
    if (discount.type === 'none') return 0
    if (discount.type === 'percentage') {
      return Math.round((originalPrice * discount.value) / 100 * 100) / 100
    }
    return Math.round(discount.value * 100) / 100
  }

  const discountAmount = calculateDiscountAmount()

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold mb-3 block">Discount Type</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={discount.type === 'none' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('none')}
            className={cn(
              "flex-1",
              discount.type === 'none' && "bg-primary text-primary-foreground"
            )}
          >
            No Discount
          </Button>
          <Button
            type="button"
            variant={discount.type === 'percentage' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('percentage')}
            className={cn(
              "flex-1",
              discount.type === 'percentage' && "bg-primary text-primary-foreground"
            )}
          >
            Percentage (%)
          </Button>
          <Button
            type="button"
            variant={discount.type === 'fixed' ? 'default' : 'outline'}
            onClick={() => handleTypeChange('fixed')}
            className={cn(
              "flex-1",
              discount.type === 'fixed' && "bg-primary text-primary-foreground"
            )}
          >
            Fixed (₹)
          </Button>
        </div>
      </div>

      {discount.type !== 'none' && (
        <div className="space-y-2">
          <Label htmlFor="discount-value">
            Discount Value {discount.type === 'percentage' ? '(%)' : '(₹)'}
          </Label>
          <Input
            id="discount-value"
            type="number"
            min="0"
            max={discount.type === 'percentage' ? 100 : originalPrice}
            step={discount.type === 'percentage' ? 1 : 0.01}
            value={discount.value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={discount.type === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
          />
          <p className="text-xs text-muted-foreground">
            {discount.type === 'percentage' ? (
              <>Maximum 100%. Current discount: ₹{discountAmount}</>
            ) : (
              <>Maximum ₹{originalPrice}. Current discount: ₹{discountAmount}</>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
