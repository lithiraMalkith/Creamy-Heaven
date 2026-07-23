import type { Metadata } from 'next'
import { cormorant, manrope } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Creamy Heaven — Admin',
  description: 'Creamy Heaven cakes & desserts admin panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="min-h-full flex flex-col font-body bg-brand-cream text-brand-black">
        {children}
      </body>
    </html>
  )
}
