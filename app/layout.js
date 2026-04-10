import '../styles/globals.css'
import Sidebar from '../components/Sidebar'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>

        <div className="frame">
          <Sidebar />

          <div className="panel">
            {children}
          </div>
        </div>

      </body>
    </html>
  )
}