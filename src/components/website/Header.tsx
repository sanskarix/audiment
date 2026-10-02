'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getCalAttributes, CalServiceType } from '@/lib/cal';

export interface HeaderProps {
  activeNav?: 'features' | 'solutions' | 'use-cases' | 'about' | 'blog';
  ctaId?: string;
  service?: CalServiceType;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  ctaId = 'aud-nav-cta',
  service = 'general',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const calAttrs = getCalAttributes(service);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={mobileMenuOpen ? 'open' : ''}>
      <div className="header-inner">
        <Link className="brand" href="/" onClick={closeMenu}>
          <img src="/logos/audiment.svg" alt="Audiment" className="brand-logo-img" />
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
            href="/use-cases"
            className={activeNav === 'use-cases' ? 'active' : ''}
            onClick={closeMenu}
          >
            Use cases
          </Link>
          <Link
            href="/about"
            className={activeNav === 'about' ? 'active' : ''}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            href="/blog"
            className={activeNav === 'blog' ? 'active' : ''}
            onClick={closeMenu}
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="mobile-only-login"
            onClick={closeMenu}
          >
            Sign in
          </Link>
          <div className="mobile-only-cta">
            <a
              className="button button--orange"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
              }}
              id={`${ctaId}-mobile`}
              {...calAttrs}
            >
              Book a call
            </a>
          </div>
        </nav>

        <div className="header-actions">
          <Link href="/login" className="aud-desktop-login">
            Sign in
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
            <a
              className="button button--orange"
              href="#"
              onClick={(e) => e.preventDefault()}
              id={ctaId}
              {...calAttrs}
            >
              Book a call
            </a>
          </div>
          <button
            type="button"
            className="menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
