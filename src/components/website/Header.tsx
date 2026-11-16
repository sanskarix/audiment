'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalServiceType } from '@/lib/cal';

export interface HeaderProps {
  activeNav?: 'features' | 'solutions' | 'use-cases' | 'about' | 'blog' | 'docs' | 'pricing';
  ctaId?: string;
  service?: CalServiceType;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  ctaId = 'aud-nav-cta',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth > 860) setMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <header ref={headerRef} className={mobileMenuOpen ? 'open' : ''}>
      <div className="header-inner">
        <Link className="brand" href="/" onClick={closeMenu}>
          <Image src="/logos/audiment.svg" alt="Audiment" className="brand-logo-img" width={120} height={28} priority />
        </Link>

        <nav>
          <Link
            href="/#features"
            className={activeNav === 'features' ? 'active' : ''}
            onClick={closeMenu}
          >
            Features
          </Link>
          <Link
            href="/solutions"
            className={activeNav === 'solutions' ? 'active' : ''}
            onClick={closeMenu}
          >
            Solutions
          </Link>
          <Link
            href="/pricing"
            className={activeNav === 'pricing' ? 'active' : ''}
            onClick={closeMenu}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={activeNav === 'about' ? 'active' : ''}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            href="/login"
            className="mobile-only-login"
            onClick={closeMenu}
          >
            Login
          </Link>
          <div className="mobile-only-cta">
            <Link
              className="button button--orange"
              href="/signup"
              onClick={closeMenu}
              id={`${ctaId}-mobile`}
            >
              Try for Free
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <Link href="/login" className="aud-desktop-login">
            Login
          </Link>
          <div className="btn-wrapper btn-wrapper--orange">
            <span className="dot top left" />
            <span className="dot top right" />
            <span className="dot bottom left" />
            <span className="dot bottom right" />
            <span className="line horizontal top" />
            <span className="line horizontal bottom" />
            <span className="line vertical left" />
            <span className="line vertical right" />
            <Link
              className="button button--orange"
              href="/signup"
              id={ctaId}
            >
              Try for Free
            </Link>
          </div>
          <button
            type="button"
            className="menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
