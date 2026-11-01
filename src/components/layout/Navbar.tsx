import Link from "next/link";
import { cn } from "@/lib/utils";
import { t } from "@/content/microcopy";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { NAV_ITEMS } from "./navItems";
import { focusRing, hoverScale } from "./styles";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Kerangka Navbar (Server Component). Bagian interaktif dipisah menjadi
 * komponen client kecil: NavLink (tautan aktif), MobileMenu (panel), dan
 * ThemeToggle. Sticky agar tetap terlihat saat halaman digulir (PRD 5.3).
 */
export function Navbar() {
  const items = NAV_ITEMS.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface shadow-card">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-cyan focus:px-4 focus:py-2 focus:text-body-sm focus:font-semibold focus:text-on-accent"
      >
        {t("nav.skipToContent")}
      </a>

      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "inline-flex min-h-11 min-w-0 origin-left items-center rounded-lg font-bold text-h3 text-fg",
            focusRing,
            hoverScale,
          )}
        >
          <span className="truncate">{t("nav.brand")}</span>
        </Link>

        <nav aria-label={t("aria.nav.main")} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className={hoverScale}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <MobileMenu
            items={items}
            openLabel={t("aria.menu.open")}
            closeLabel={t("aria.menu.close")}
            navLabel={t("aria.nav.main")}
          />
        </div>
      </div>
    </header>
  );
}
