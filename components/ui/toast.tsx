"use client";
import * as React from "react";
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement;

// Production Toast function using Sonner
export function Toast({ id, title, description, action, open, onOpenChange }: ToastProps) {
  React.useEffect(() => {
    if (open) {
      sonnerToast(
        <div>
          {title && <div className="font-semibold mb-1">{title}</div>}
          {description && <div className="text-sm text-muted-foreground">{description}</div>}
          {action && <div className="mt-2">{action}</div>}
        </div>,
        {
          id,
          // Show toast for 2 seconds (2000ms) by default
          duration: 2000,
          onAutoClose: () => onOpenChange?.(false),
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);
  return null;
}
