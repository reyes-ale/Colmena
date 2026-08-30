import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import imgColmenaLogoNormal1 from "../ColmenaLanding/41ac45f8c7521b60c25adadf954c316d83f63029.png";

export type SiteNavLink = { label: string; href: string };

/**
 * Shared responsive header used by the auth pages (Login / Registro).
 * `navLinks` are plain anchors so they work whether they point to a
 * same-page section (#id) or to a section on the home page (/#id).
 * `actions` is the right-side button (or buttons) for that page.
 */
export function SiteHeader({ navLinks, actions }: { navLinks: SiteNavLink[]; actions: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full shrink-0 border-b border-[#e2e8f0] bg-white" data-name="Header">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-20 lg:py-6">
        <Link to="/" aria-label="Ir al inicio" className="relative h-[52px] w-[44px] shrink-0 lg:h-[65px] lg:w-[55px]">
          <div className="flex-none rotate-[-0.29deg]">
            <div className="relative h-[52px] w-[44px] lg:h-[64px] lg:w-[55px]" data-name="colmena-logo-normal 1">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="Colmena" className="absolute h-[464.55%] left-[-175.23%] max-w-none top-[-193.61%] w-[789.1%]" src={imgColmenaLogoNormal1} />
              </div>
            </div>
          </div>
        </Link>

        <div className="hidden flex-wrap items-center gap-x-8 gap-y-4 font-medium text-[#0f172a] text-[15px] lg:flex">
          {navLinks.map(({ label, href }) => (
            <a key={label} href={href} className="cursor-pointer text-left leading-normal">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">{actions}</div>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-6 border-t border-[#e2e8f0] bg-white px-4 py-6 sm:px-6 lg:hidden">
          <div className="flex flex-col items-start gap-4 font-medium text-[#0f172a] text-[15px]">
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="cursor-pointer text-left leading-normal">
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col items-stretch gap-3">{actions}</div>
        </div>
      )}
    </div>
  );
}

// The logo itself already links home, so the auth pages' navbar carries no
// text links — just the logo on the left and the page's actions on the right.
export const AUTH_NAV_LINKS: SiteNavLink[] = [];
