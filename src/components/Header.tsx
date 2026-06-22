'use client';

import { LayoutGrid, BarChart2, Gamepad2, Image as ImageIcon, Wand2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="header">
      <div className="container header-content">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={28} color="#9d4edd" />
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0, color: '#f4f4f5', background: 'none', WebkitTextFillColor: 'initial' }}>VSPO! Cosplay Hub</h1>
        </Link>
        <nav className="nav-links">
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LayoutGrid size={18} /> Gallery
          </Link>
          <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart2 size={18} /> Dashboard
          </Link>
          <Link href="/quiz" className={`nav-link ${pathname === '/quiz' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Gamepad2 size={18} /> Quiz
          </Link>
          <Link href="/analysis" className={`nav-link ${pathname === '/analysis' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Wand2 size={18} /> AI Analysis
          </Link>
        </nav>
      </div>
    </header>
  );
}
