"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";
import { Logo } from "./Logo";

const MENU_EASE = [0.21, 0.5, 0.28, 1] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const elevated = scrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll while the drawer is open, so it reads as a
  // panel dropping in front of the page rather than part of the page.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      {/* One persistent header, opening the menu fades its own background
          to solid black and swaps the hamburger icon to an X in place,
          instead of a second header (logo + X) sliding in on top of it.
          backdrop-blur-xl and the border stay on the whole time the header
          is "elevated" (scrolled OR open), only the background's opacity
          moves between those two states, so going from the scrolled blur
          straight to the open state is a single smooth fade instead of
          the blur snapping off and back on mid-transition. */}
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 ${
          elevated
            ? `backdrop-blur-xl border-b border-white/5 ${
                menuOpen ? "bg-[#080A0C]" : "bg-[#080A0C]/80"
              }`
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo className="h-7" />
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="group hidden sm:inline-flex items-center gap-2 bg-white hover:bg-[#38B685] text-black hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-500 ease-out"
            >
              Book a call
              <span className="w-5 h-5 rounded-full bg-black group-hover:bg-white flex items-center justify-center group-hover:translate-x-1 transition-all duration-500 ease-out">
                <ArrowRight className="w-3 h-3 text-white group-hover:text-[#38B685] transition-colors duration-500 ease-out" />
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden relative w-10 h-10 grid place-items-center text-white"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span
                    key="x"
                    className="absolute inset-0 grid place-items-center"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: MENU_EASE }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    className="absolute inset-0 grid place-items-center"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: MENU_EASE }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer: expands downward from behind/under the header bar rather
          than sliding the whole screen (header included) down from above. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-[#080A0C] flex flex-col lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: MENU_EASE }}
          >
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {navLinks.map((l, i) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-semibold text-white/90 hover:text-[#38B685] transition-colors py-3 border-b border-white/5"
                >
                  <span className="text-[#38B685] text-sm mr-4">
                    0{i + 1}
                  </span>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="p-8">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-center gap-2 bg-white hover:bg-[#38B685] text-black px-6 py-4 rounded-full text-base font-semibold transition-colors duration-500 ease-out"
              >
                Book a call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
