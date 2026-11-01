import { cn } from "@/lib/utils";
import { t } from "@/content/microcopy";
import { NAV_ITEMS } from "./navItems";
import { focusRing, hoverScale } from "./styles";
import Link from "next/link";

/**
 * Footer sederhana (Server Component, tanpa logika): nama proyek, catatan data
 * statis beserta sumbernya, dan navigasi kedua. Tidak memakai tahun berjalan
 * (new Date()) karena tidak ada di microcopy dan memerlukan penanganan khusus
 * pada Cache Components.
 *
 * `footer.disclaimer` dari microcopy sengaja TIDAK dipasang: teks itu berstatus
 * "BUTUH PERSETUJUAN pengguna (klaim hukum)".
 */
export function Footer() {
  const linkClass = cn(
    "inline-flex min-h-11 origin-left items-center rounded-lg text-body-sm text-fg-secondary hover:text-fg",
    focusRing,
    hoverScale,
  );

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row md:items-start md:justify-between md:px-6 lg:px-8">
        <div className="min-w-0 space-y-1">
          <p className="font-bold text-h3 text-fg">{t("nav.brand")}</p>
          <p className="text-body-sm text-fg-secondary">{t("footer.dataNote")}</p>
          <p className="text-body-sm text-fg-secondary">
            {t("footer.source")}
          </p>
        </div>

        <nav aria-label={t("aria.nav.footer")}>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
