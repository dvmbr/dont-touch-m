"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/001", label: "001" },
  { href: "/002", label: "002" },
];

/**
 * Client component that renders the navigation for both desktop and mobile views.
 */
export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuLabel = isOpen ? "Close navigation" : "Open navigation";

  const toggleMenu = () => setIsOpen((open) => !open);

  const closeMenu = () => setIsOpen(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !isOpen) return;

    closeMenu();
    menuButtonRef.current?.focus();
  };

  return (
    <>
      {/* Desktop navigation */}
      <nav className="sm:flex space-x-4 py-2 px-4 hidden">
        {renderNavLinks()}
      </nav>

      {/* Mobile navigation */}
      <nav
        aria-label="Mobile navigation"
        className="relative px-4 py-2 sm:hidden"
        onKeyDown={handleKeyDown}
      >
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuLabel}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={toggleMenu}
          className="ml-auto flex size-11 items-center justify-center rounded hover:bg-ho focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
        >
          <MenuIcon isOpen={isOpen} />
        </button>
        <div
          id="mobile-navigation"
          hidden={!isOpen}
          className="absolute inset-x-0 top-full z-50 border-b border-bo bg-bg px-8 pb-4"
        >
          <div className="flex flex-col gap-2">{renderNavLinks(closeMenu)}</div>
        </div>
      </nav>
    </>
  );
}

/**
 * Renders the menu icon for the mobile navigation, switching between hamburger and close icons based on the `isOpen` state.
 * @param isOpen - A boolean indicating whether the mobile navigation menu is open.
 */
function MenuIcon({ isOpen }: { isOpen: boolean }) {
  const hamburger = "M4 6h16M4 12h16M4 18h16";
  const close = "M6 6l12 12M6 18L18 6";

  const path = isOpen ? close : hamburger;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="size-6"
    >
      <path d={path} />
    </svg>
  );
}

function renderNavLinks(onClick?: () => void) {
  return navLinks.map(({ href, label }) => (
    <NavLink key={href} href={href} onClick={onClick}>
      {label}
    </NavLink>
  ));
}

/**
 * Renders a navigation link with optional click handling.
 * @param href - The URL the link points to.
 * @param children - The content to be displayed within the link.
 * @param [onClick] - An optional callback function to handle click events on the link.
 */
function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const stateClassName = isActive
    ? "border-transparent bg-ho font-semibold sm:border-fg sm:bg-transparent"
    : "border-transparent hover:bg-ho active:bg-sf sm:hover:border-fg sm:hover:bg-transparent sm:active:bg-transparent";
  const className = `rounded border-b px-4 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg sm:rounded-none ${stateClassName}`;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}
