"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE_STORAGE_KEY = "equipmentCatalogPageSize";

export function EquipmentPageSizeSelector({ currentPageSize }: { currentPageSize: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("pageSize")) return;
    const storedPageSize = sessionStorage.getItem(PAGE_SIZE_STORAGE_KEY);
    if (!storedPageSize) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", storedPageSize);
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  return (
    <label className="flex flex-col gap-1 text-sm font-bold text-slate-600 sm:flex-row sm:items-center">
      <span>Rows</span>
      <select
        aria-label="Rows per page"
        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-950"
        value={currentPageSize}
        onChange={(event) => {
          const nextPageSize = event.target.value;
          sessionStorage.setItem(PAGE_SIZE_STORAGE_KEY, nextPageSize);
          const params = new URLSearchParams(searchParams.toString());
          params.set("pageSize", nextPageSize);
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="all">All</option>
      </select>
    </label>
  );
}

export function EquipmentBackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 700);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      aria-label="Back to top of equipment catalog"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-red-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-400/40 focus:outline-none focus:ring-4 focus:ring-red-300"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6" strokeLinecap="round" /></svg>
    </button>
  );
}
