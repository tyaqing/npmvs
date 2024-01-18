import './globals.css'
import '../biz/day'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/app/providers'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'npmVS | Npm Package Compare',
  description: 'Npm Package Compare',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={`px-4 flex-1 w-[100vw] xl:w-[1280px] py-4 flex flex-col xl:mx-auto`}>
          {/*头部*/}
          <Header />
          {/*主体*/}
          <main className={'flex-1 w-full mx-auto'}>
            <Providers>{children}</Providers>
          </main>
          {/*底部*/}
          <Footer />
        </div>
      </body>
    </html>
  )
}
