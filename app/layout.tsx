import './globals.css'

import { Poppins }
from 'next/font/google'
const poppins =
  Poppins({

    subsets: ['latin'],

    weight: [
      '400',
      '500',
      '600',
      '700',
      '800'
    ]

  })

import {
  Bebas_Neue,
  Inter
} from 'next/font/google'

const bebas =
  Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-bebas'
  })

const inter =
  Inter({
    subsets: ['latin'],
    variable: '--font-inter'
  })

export const metadata = {

  title:
    'Bolão Copa 2026',

  description:
    'Bolão oficial da Copa do Mundo 2026'

    

}

export default function RootLayout({

  
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  return (

    <html lang="pt-BR">

      <body
        className={`
          ${bebas.variable}
          ${inter.variable}
          antialiased
        `}
      >

        {children}

      </body>

    </html>

  )

}