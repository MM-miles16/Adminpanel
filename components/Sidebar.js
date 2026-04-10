'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const path = usePathname()

  return (
    <div className="sidebar">

      <div>
        <div className="logo">
          <img src="/logo.png" className="logo-img" />
        </div>

        <div className="menu">

          <Link href="/" className={`item ${path === '/' ? 'active' : ''}`}>
            Home
          </Link>

          <Link href="/cars" className={`item ${path === '/cars' ? 'active' : ''}`}>
            Cars
          </Link>

          <Link href="/bookings" className={`item ${path === '/bookings' ? 'active' : ''}`}>
            Bookings
          </Link>

          <Link href="/maintainance" className={`item ${path === '/maintainance' ? 'active' : ''}`}>
            Maintainace
          </Link>

          <Link href="/paused" className={`item ${path === '/paused' ? 'active' : ''}`}>
            Paused Cars
          </Link>

          

        </div>
      </div>

      <button className="logout">Logout</button>

    </div>
  )
}