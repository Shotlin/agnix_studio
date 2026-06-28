"use client";

import { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "HOME",    href: "/" },
  { label: "STUDIO",  href: "#studio" },
  { label: "ANTAR",   href: "#antar" },
  { label: "CONTACT", href: "#contact" },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <header className="navbar" role="banner">
      <nav
        className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-12 lg:py-5"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" aria-label="Agnix Studio — home">
          <Image
            src="/assets/agnix-logo-transparent.png"
            alt="Agnix Studio"
            width={200}
            height={54}
            priority
            className="h-14 w-auto md:h-16 lg:h-20 object-contain"
          />
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-0" role="list">
          <span className="nav-sep px-4" aria-hidden="true">|</span>
          {NAV_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center" role="listitem">
              <Link
                href={link.href}
                className="nav-link px-1"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {link.label}
              </Link>
              {i < NAV_LINKS.length - 1 && (
                <span className="nav-sep px-4" aria-hidden="true">|</span>
              )}
            </span>
          ))}
        </div>

        {/* ── Social icons ── */}
        <div className="hidden md:flex items-center gap-3 ml-1">
          <span className="nav-sep pr-3" aria-hidden="true">|</span>
          <a
            href="https://www.instagram.com/agnixstudio_official"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            aria-label="Agnix Studio on Instagram"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          ref={buttonRef}
          className={`md:hidden flex flex-col gap-[5px] p-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8a96e] ${isOpen ? "ham-open" : ""}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        id={menuId}
        className={`mobile-menu ${isOpen ? "is-open" : ""}`}
        aria-hidden={!isOpen}
      >
        <nav
          className="flex flex-col px-8 py-6 gap-5"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link text-sm"
              style={{ fontFamily: "var(--font-cinzel)" }}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-5 pt-3 mt-1 border-t border-[rgba(200,169,110,0.12)]">
            <a
              href="https://www.instagram.com/agnixstudio_official"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              aria-label="Agnix Studio on Instagram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
