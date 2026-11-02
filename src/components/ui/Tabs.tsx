"use client";
// "use client": Tabs memegang state tab aktif, menangani keyboard (panah,
// Home/End), dan menggulirkan tab aktif ke tampilan lewat DOM (ref + effect).
// Ketiganya hanya bisa berjalan di browser.
//
// Acuan PRD: Bab 5.3 (tab kategori Grup A–L bersifat sticky dan mobile-first)
// dan Bab 5.1 (aksen Cyan = interaktif).

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { focusRingInset } from "./styles";

export interface TabsItem {
  /** Pengenal unik tab (mis. "A"). Dipakai sebagai value. */
  id: string;
  /** Label yang tampil di tab. */
  label: ReactNode;
  /** Nonaktifkan tab (dilewati navigasi keyboard). */
  disabled?: boolean;
  /** Isi panel. Opsional: Tabs juga bisa dipakai hanya sebagai penyeleksi. */
  panel?: ReactNode;
}

interface TabsCommonProps {
  /** Daftar tab, urutan tampil sama dengan urutan array. */
  items: readonly TabsItem[];
  /** Label aksesibel untuk tablist (wajib), mis. "Pilih grup". */
  ariaLabel: string;
  /**
   * Tempel (sticky) di bawah Navbar. Bawaan: true. Navbar saat ini `h-14`,
   * jadi offset bawaan 3,5 rem + 1 px (border bawah Navbar); ubah lewat `stickyOffsetClassName` bila tinggi
   * Navbar berubah.
   */
  sticky?: boolean;
  /** Kelas offset sticky. Bawaan: tinggi Navbar (h-14) + border 1 px. */
  stickyOffsetClassName?: string;
  /** Kelas tambahan untuk pembungkus terluar. */
  className?: string;
  /** Kelas tambahan untuk area panel. */
  panelClassName?: string;
}

/** Mode terkontrol: induk memegang nilai tab aktif. */
export interface TabsControlledProps extends TabsCommonProps {
  value: string;
  onValueChange: (id: string) => void;
  defaultValue?: never;
}

/** Mode tak terkontrol: Tabs memegang nilainya sendiri. */
export interface TabsUncontrolledProps extends TabsCommonProps {
  value?: undefined;
  /** Tab awal. Bawaan: tab pertama yang tidak dinonaktifkan. */
  defaultValue?: string;
  /** Dipanggil saat tab berganti (opsional). */
  onValueChange?: (id: string) => void;
}

export type TabsProps = TabsControlledProps | TabsUncontrolledProps;

function firstEnabledId(items: readonly TabsItem[]): string {
  return items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
}

export function Tabs(props: TabsProps) {
  const {
    items,
    ariaLabel,
    sticky = true,
    stickyOffsetClassName = "top-[calc(3.5rem+1px)]",
    className,
    panelClassName,
  } = props;

  const baseId = useId();
  const [internalValue, setInternalValue] = useState<string>(
    () => props.defaultValue ?? firstEnabledId(items),
  );
  const isControlled = props.value !== undefined;
  const activeId = isControlled ? props.value : internalValue;

  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const hasScrolledRef = useRef(false);
  const onValueChange = props.onValueChange;

  const select = useCallback(
    (id: string) => {
      if (!isControlled) setInternalValue(id);
      onValueChange?.(id);
    },
    [isControlled, onValueChange],
  );

  // Gulirkan tab aktif ke tengah tablist. Dilakukan lewat scrollTo pada wadah
  // (bukan scrollIntoView) agar halaman tidak ikut tergulir vertikal.
  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current.get(activeId);
    if (!list || !tab) return;
    const target = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollTo({
      left: Math.max(0, target),
      // Tanpa animasi pada render pertama dan bila pengguna meminta gerak minimal.
      behavior: reduceMotion || !hasScrolledRef.current ? "auto" : "smooth",
    });
    hasScrolledRef.current = true;
  }, [activeId]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const currentIndex = enabled.findIndex((item) => item.id === activeId);

    let next: TabsItem | undefined;
    switch (event.key) {
      case "ArrowRight":
        next = enabled[(currentIndex + 1) % enabled.length];
        break;
      case "ArrowLeft":
        next = enabled[(currentIndex - 1 + enabled.length) % enabled.length];
        break;
      case "Home":
        next = enabled[0];
        break;
      case "End":
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    if (!next) return;
    select(next.id);
    tabRefs.current.get(next.id)?.focus();
  };

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;
  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          // z-30 di bawah Navbar (z-40). bg-canvas agar konten tidak tembus.
          sticky && cn("sticky z-30 bg-canvas", stickyOffsetClassName),
          "border-b border-line",
        )}
      >
        <div
          ref={listRef}
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="relative flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const selected = item.id === activeId;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  if (node) tabRefs.current.set(item.id, node);
                  else tabRefs.current.delete(item.id);
                }}
                type="button"
                role="tab"
                id={tabId(item.id)}
                aria-selected={selected}
                aria-controls={
                  selected && item.panel !== undefined
                    ? panelId(item.id)
                    : undefined
                }
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                onClick={() => select(item.id)}
                className={cn(
                  "group relative inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-4 text-body-sm font-semibold",
                  "border-b-2 transition-colors duration-200 motion-reduce:transition-none active:opacity-80",
                  focusRingInset,
                  selected
                    ? "border-accent-cyan-ink text-accent-cyan-ink"
                    : "border-transparent text-fg-secondary hover:bg-surface-muted hover:text-fg",
                  item.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {/* Skala dipasang pada label (bukan tombol) agar tidak terpotong
                    oleh overflow-x-auto pada tablist. */}
                <span
                  className={cn(
                    "inline-block transition-transform duration-200 motion-reduce:transition-none",
                    !item.disabled &&
                      "group-hover:scale-105 motion-reduce:group-hover:scale-100",
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {activeItem && activeItem.panel !== undefined ? (
        <div
          role="tabpanel"
          id={panelId(activeItem.id)}
          aria-labelledby={tabId(activeItem.id)}
          tabIndex={0}
          className={cn(
            "pt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan-ink",
            panelClassName,
          )}
        >
          {activeItem.panel}
        </div>
      ) : null}
    </div>
  );
}
