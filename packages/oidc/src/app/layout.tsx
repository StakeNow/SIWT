import './global.css'

export const metadata = {
  title: 'SIWT OIDC',
  description: 'siwt.xyz',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
