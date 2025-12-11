import './styles/index.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata = {
  title: {
    default: 'NoteMate Personal Notes Manager',
    template: 'NoteMate Personal Notes Manager | %s',
  },
  description: 'NoteMate is your friendly personal notes manager with intuitive categorization, color-coded organization, and delightful interface for managing thoughts, school notes, and personal topics effortlessly.',
  keywords: 'notes app, personal notes, note taking, organization, study notes, thoughts manager, note categories',
  icons: {
    icon: '/images/cacto.png',
    shortcut: '/images/cacto.png',
    apple: '/images/cacto.png',
  },
  openGraph: {
    type: 'website',
    title: {
      default: 'NoteMate Personal Notes Manager',
      template: 'NoteMate Personal Notes Manager | %s',
    },
    description: 'Organize your thoughts beautifully with NoteMate - the friendly personal notes manager featuring color-coded categories and intuitive design for productive note-taking.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fnotematep3866back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.10" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.1" /></body>
    </html>
  )
}