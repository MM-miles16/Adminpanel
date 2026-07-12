import '../styles/globals.css'
import '../styles/hub-portal.css'
import Sidebar from '../components/Sidebar'
import AuthWrapper from '../components/AuthWrapper'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Toaster position="top-center" />
        <AuthWrapper>
          <div className="frame">
            <Sidebar />

            <div className="panel">
              {children}
            </div>
          </div>
        </AuthWrapper>
      </body>
    </html>
  )
}