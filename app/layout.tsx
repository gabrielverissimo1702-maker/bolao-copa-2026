import type { Metadata } from 'next'

import {
  Rajdhani
} from 'next/font/google'

import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: [
    '400',
    '500',
    '600',
    '700'
  ]
})

export const metadata: Metadata = {
  title: 'Bolão da Copa',
  description: 'Bolão da Copa do Mundo'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html lang="pt-BR">

      <body className={rajdhani.className}>

        {children}

      </body>

    </html>

  )

}