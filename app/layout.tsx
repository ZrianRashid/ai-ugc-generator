import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'UGC Studio - AI Video Generator',
  description: 'Generate professional UGC videos with AI. Create engaging content for your brand in minutes.',
  keywords: ['AI video', 'UGC', 'content creation', 'video generator', 'marketing'],
  openGraph: {
    title: 'UGC Studio - AI Video Generator',
    description: 'Generate professional UGC videos with AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1a1a24',
                  color: '#fafafa',
                  border: '1px solid #27272a',
                },
                success: {
                  iconTheme: {
                    primary: '#22d3ee',
                    secondary: '#0a0a0f',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#0a0a0f',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
