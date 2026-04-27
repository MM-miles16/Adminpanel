'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 🔥 MOBILE TOP BAR (ONLY LOGO + HAMBURGER) */}
      <div className="mobile-nav">

        <img src="/logo.png" className="logo-img mobile-logo" />

        <div
          className={`hamburger ${open ? 'active' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

      {/* 🔥 SIDEBAR */}
      <div className={`sidebar ${open ? 'open' : ''}`}>

        <div>
          <div className="logo desktop-logo">
            <img src="/logo.png" className="logo-img" />
          </div>

          <div className="menu">

            <Link href="/" className={`item ${path==='/'?'active':''}`} onClick={()=>setOpen(false)}>Home</Link>

            <Link href="/cars" className={`item ${path==='/cars'?'active':''}`} onClick={()=>setOpen(false)}>Cars</Link>

            <Link href="/bookings" className={`item ${path==='/bookings'?'active':''}`} onClick={()=>setOpen(false)}>Bookings</Link>

            <Link href="/maintainance" className={`item ${path==='/maintainance'?'active':''}`} onClick={()=>setOpen(false)}>Maintainace</Link>

            <Link href="/paused" className={`item ${path==='/paused'?'active':''}`} onClick={()=>setOpen(false)}>Paused Cars</Link>

          </div>
        </div>

        <button className="logout">Logout</button>

      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  )
}