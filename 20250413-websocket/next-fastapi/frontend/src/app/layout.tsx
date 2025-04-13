import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ja">
      <body>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  )
}
