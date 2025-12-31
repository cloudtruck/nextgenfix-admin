"use client"

import Image from "next/image"
import { X, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MenuItem } from "@/lib/api/menu"

interface SelectedItemPreviewProps {
  item: MenuItem
  quantity: number
  onQuantityChange: (newQuantity: number) => void
  onRemove: () => void
}

export function SelectedItemPreview({
  item,
  quantity,
  onQuantityChange,
  onRemove
}: SelectedItemPreviewProps) {
  const itemTotal = item.price * quantity

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors">
      {/* Item Image */}
      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-background">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-food.png'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.name}</h4>
            <p className="text-xs text-muted-foreground">
              ₹{item.price} × {quantity} = ₹{itemTotal}
            </p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Badge variant="secondary" className="px-3 py-1 font-mono">
            {quantity}
          </Badge>
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>

          {/* Remove Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
