import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/redux/Providers'
import GlobalConnectingPopup from '@/components/GlobalConnectingPopup';
import AuthLoader from '@/components/AuthLoader';  // Import the AuthLoader
import { Toaster } from "@/components/ui/toaster"

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'JyotishConnect - Modern Vedic Astrology Platform',
  description: 'Connect with top astrologers for personalized Vedic readings and spiritual guidance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${roboto.variable} font-sans`}>
        <ReduxProvider>
          <AuthLoader>
            <GlobalConnectingPopup />
            {children}
            <Toaster />
          </AuthLoader>
        </ReduxProvider>
      </body>
    </html>
  )
}