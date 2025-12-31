"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "./toast"

export default function ToastManager() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          title={t.title}
          description={t.description}
          action={t.action}
          open={t.open}
          onOpenChange={t.onOpenChange}
        />
      ))}
    </>
  )
}
