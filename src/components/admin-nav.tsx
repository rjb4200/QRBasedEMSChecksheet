"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const WFD_LOGO_SRC = "/images/WFD_Logo_1848.jpg";

const TOP_LINKS = [
  { href: "/admin", label: "Fleet" },
  { href: "/admin/archives", label: "Records" },
  { href: "/admin/issues", label: "Issues" },
  { href: "/admin/system-log", label: "System Log" },
] as const;

const ADMIN_LINKS = [
  { href: "/admin/units", label: "Units" },
  { href: "/admin/kits", label: "Kits" },
  { href: "/admin/equipment", label: "Equipment" },
  { href: "/admin/users", label: "Users" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function isAdminActive(pathname: string) {
  return ADMIN_LINKS.some(({ href }) => isActive(pathname, href));
}

function linkClasses(active: boolean) {
  return active
    ? "rounded-2xl bg-red-700 px-4 py-3 font-bold text-white shadow-sm"
    : "rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm";
}

export function AdminNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white px-5 py-4 print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="flex items-center gap-3 text-slate-950" href="/admin">
          <img alt="Winchester Fire Department logo" className="h-10 w-10 rounded-xl object-contain" src={WFD_LOGO_SRC} />
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.2em] text-red-700">qrCheckoff</span>
            <span className="block text-xs font-bold text-slate-500">Winchester Fire Department</span>
          </span>
        </Link>
        <nav className="flex flex-wrap gap-2">
          {TOP_LINKS.map(({ href, label }) => (
            <Link key={href} className={linkClasses(isActive(pathname, href))} href={href}>{label}</Link>
          ))}
          <div className="relative">
            <button
              ref={buttonRef}
              aria-expanded={menuOpen}
              className={linkClasses(isAdminActive(pathname))}
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
            >
              ☰
            </button>
            {menuOpen && (
              <div ref={menuRef} className="absolute left-0 top-full mt-1 flex w-40 flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg z-10 sm:left-auto sm:right-0">
                {ADMIN_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    className={`rounded-xl px-4 py-2 text-sm font-bold ${isActive(pathname, href) ? "bg-red-700 text-white" : "text-slate-700 hover:bg-slate-100"}`}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
