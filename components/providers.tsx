'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from '@/components/theme-provider'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        {children}
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' ? (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          buttonPosition="bottom-left"
          position="bottom"
          styleNonce={undefined}
          client={queryClient}
        />
      ) : null}
    </QueryClientProvider>
  )
}
