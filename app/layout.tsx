import React from 'react'
import './globals.css'
import Providers from '@/components/providers'
import { AuthGuard } from '@/components/auth-guard'
// import { Amplify } from 'aws-amplify';
// import outputs from '@/amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';

// Amplify.configure(outputs);

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html>
      <body>
        <Providers>
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout