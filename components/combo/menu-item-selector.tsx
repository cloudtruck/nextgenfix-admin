"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/lib/api/menu"

interface MenuItemSelectorProps {
  menuItems: MenuItem[]
  selectedItemIds: string[]
  onSelectItem: (item: MenuItem) => void
  disabled?: boolean
}

export function MenuItemSelector({
  menuItems,
  selectedItemIds,
  onSelectItem,
  disabled = false
}: MenuItemSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter menu items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems
    
    const query = searchQuery.toLowerCase()
    return menuItems.filter(item => {
      const name = item.name?.toLowerCase() || ''
      const category = item.category?.toLowerCase() || ''
      
      // Handle description which can be string or object
      let description = ''
      if (typeof item.description === 'string') {
        description = item.description.toLowerCase()
      } else if (item.description && typeof item.description === 'object' && 'text' in item.description) {
        description = (item.description as { text: string }).text.toLowerCase()
      }
      
      return name.includes(query) || description.includes(query) || category.includes(query)
    })
  }, [menuItems, searchQuery])

  const handleSelect = (item: MenuItem) => {
    onSelectItem(item)
    setOpen(false)
    setSearchQuery("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Select menu items to add...
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No items found
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedItemIds.includes(item._id)
              return (
                <button
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "w-full flex items-start gap-3 p-2 rounded-sm hover:bg-accent text-left transition-colors",
                    isSelected && "bg-accent/50"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="text-sm font-semibold text-primary">
                        ₹{item.price}
                      </span>
                    </div>
                    {item.category && (
                      <span className="text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })
          )}
        </div>
        {filteredItems.length > 0 && (
          <div className="p-2 border-t text-xs text-muted-foreground text-center">
            {filteredItems.length} item{filteredItems.length !== 1 && 's'} available
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
