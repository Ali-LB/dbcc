"use client";
import { SessionProvider } from "next-auth/react";
import { UserNav } from "@/components/ui/user-nav";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  DotsThreeVertical,
  InstagramLogo,
  XLogo,
  CoffeeBean,
  List,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import type { Post } from "@/generated/prisma";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!showDropdown) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showDropdown]);

  async function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const res = await fetch(`/api/posts/search?q=${encodeURIComponent(value)}`);
    const data = await res.json();
    setSearchResults(data);
    setSearchLoading(false);
  }

  return (
    <SessionProvider>
      <header className="bg-[#7f5539] text-[#e6ccb2] p-4">
        <nav className="container mx-auto flex items-center justify-between relative">
          {/* Left: Title (mobile) / Nav items (desktop) */}
          <div className="flex items-center gap-4">
            {/* Mobile: Title on left */}
            <div className="lg:hidden">
              <span className="text-xl font-bold tracking-wide">
                Dearborn Coffee Club
              </span>
            </div>
            {/* Desktop: Nav items */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/" className="font-medium hover:underline">
                Home
              </Link>
              <Link
                href="https://www.buymeacoffee.com/yourbmac"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                BMAC
              </Link>
              <Link href="/about" className="font-medium hover:underline">
                About
              </Link>
              <Link href="/map" className="font-medium hover:underline">
                Map
              </Link>
              <Link href="/events" className="font-medium hover:underline">
                Events
              </Link>
            </div>
          </div>
          {/* Center: Title (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <span className="text-2xl font-bold tracking-wide">
              Dearborn Coffee Club
            </span>
          </div>
          {/* Right: Desktop nav */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <UserNav />
            <button
              className="hover:text-gray-300"
              onClick={() => setShowSearch((s) => !s)}
              aria-label="Search"
            >
              <MagnifyingGlass size={22} weight="bold" />
            </button>
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                className="hover:text-gray-300 flex items-center justify-center"
                style={{ padding: 0 }}
                onClick={() => setShowDropdown((d) => !d)}
                aria-label="More"
              >
                <DotsThreeVertical size={22} weight="bold" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-gray-900 rounded shadow-lg z-50">
                  <Link
                    href="/posts"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Posts
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Right: Mobile hamburger */}
          <div className="lg:hidden ml-auto flex items-center">
            <button
              className="hover:text-gray-300"
              onClick={() => setShowMobileMenu((m) => !m)}
              aria-label="Open menu"
            >
              <List size={28} weight="bold" />
            </button>
            {showMobileMenu && (
              <div className="absolute right-2 top-14 w-64 bg-white text-gray-900 rounded shadow-lg z-50">
                <nav>
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        href="/"
                        className="block px-4 py-3 hover:bg-gray-100 text-right border-b border-gray-200"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://www.buymeacoffee.com/yourbmac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 hover:bg-gray-100 text-right border-b border-gray-200"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        BMAC
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        className="block px-4 py-3 hover:bg-gray-100 text-right border-b border-gray-200"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/map"
                        className="block px-4 py-3 hover:bg-gray-100 text-right border-b border-gray-200"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Map
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/events"
                        className="block px-4 py-3 hover:bg-gray-100 text-right border-b border-gray-200"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Events
                      </Link>
                    </li>
                    <li className="header-nav-dropdown">
                      <div className="flex items-center justify-end px-4 py-3 hover:bg-gray-100 border-b border-gray-200">
                        <DotsThreeVertical size={20} weight="bold" />
                      </div>
                      <ul className="bg-gray-50">
                        <li>
                          <Link
                            href="/posts"
                            className="block px-6 py-2 hover:bg-gray-100 text-right text-sm"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Posts
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="flex flex-col border-t border-gray-200">
                    <li className="signup global-button">
                      <div className="flex justify-end px-4 py-3">
                        <UserNav />
                      </div>
                    </li>
                    <li id="search-open" className="header-search">
                      <button
                        className="flex items-center justify-end gap-2 px-4 py-3 hover:bg-gray-100 w-full text-right"
                        onClick={() => {
                          setShowSearch(true);
                          setShowMobileMenu(false);
                        }}
                      >
                        <span>Search</span>
                        <MagnifyingGlass size={20} weight="bold" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </nav>
        {/* Search Input Modal */}
        {showSearch && (
          <div className="absolute top-16 left-0 w-full bg-gray-900 bg-opacity-90 p-4 z-50 flex flex-col items-center">
            <div className="w-full max-w-md flex items-center gap-2">
              <input
                type="text"
                placeholder="Search posts by keyword..."
                className="w-full px-4 py-2 rounded border border-gray-300 text-gray-900"
                autoFocus
                value={searchTerm}
                onChange={handleSearchInput}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  setShowSearch(false);
                  setSearchTerm("");
                  setSearchResults([]);
                }}
              >
                Close
              </button>
            </div>
            <div className="w-full max-w-md mt-2 bg-white rounded shadow-lg text-gray-900">
              {searchLoading && (
                <div className="p-4 text-center text-gray-500">
                  Searching...
                </div>
              )}
              {!searchLoading && searchResults.length > 0 && (
                <ul>
                  {searchResults.map((post) => (
                    <li
                      key={post.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchTerm("");
                        setSearchResults([]);
                        router.push(`/posts/${post.id}`);
                      }}
                    >
                      <div className="font-semibold">{post.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">
                        {post.description}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!searchLoading && searchTerm && searchResults.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No results found.
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="container mx-auto p-4">{children}</main>
      <footer className="footer-section global-footer bg-[#7f5539] text-[#e6ccb2] py-8 mt-8">
        <div className="footer-wrap max-w-4xl mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-8">
          <div className="footer-data flex flex-col items-center md:items-start">
            <div className="footer-logo mb-3">
              <Link
                href="/"
                className="is-title text-2xl font-bold tracking-wide hover:text-[#e6ccb2]/80"
              >
                dbcoffeeclub
              </Link>
            </div>
            <p className="footer-description text-[#e6ccb2]/70 mb-4">
              Have a Drink, Read Some Stuff
            </p>
            <div className="footer-icons flex gap-4 mt-2">
              {/* X (Twitter) icon */}
              <a
                href="https://x.com/yourprofile"
                aria-label="link X"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e6ccb2]"
              >
                <XLogo className="w-6 h-6" weight="fill" />
              </a>
              {/* Coffee Bean icon */}
              <a
                href="#"
                aria-label="link Coffee Bean"
                className="hover:text-[#e6ccb2]"
              >
                <CoffeeBean className="w-6 h-6" weight="fill" />
              </a>
              {/* Instagram icon */}
              <a
                href="https://instagram.com/yourprofile"
                aria-label="link Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e6ccb2]"
              >
                <InstagramLogo className="w-6 h-6" weight="fill" />
              </a>
            </div>
          </div>
          <div className="footer-nav flex flex-col items-center md:items-end gap-2">
            {/* Add any additional footer navigation links here if needed */}
          </div>
        </div>
        <div className="footer-copyright text-center text-[#e6ccb2]/60 mt-8 text-sm">
          dbcoffeeclub © {new Date().getFullYear()}. All Rights Reserved.
          Published with{" "}
          <a
            href="https://nextjs.org/"
            className="underline hover:text-[#e6ccb2]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>
          .
        </div>
      </footer>
    </SessionProvider>
  );
}
