"use client";
// "use client": Modal memakai portal ke document.body, jebakan fokus, listener
// keyboard (Escape/Tab), pengunci scroll pada <body>, dan mengembalikan fokus
// ke pemicu. Semua itu bergantung pada DOM browser dan efek.
//
// Acuan PRD: Bab 5.1 (token tema, `rounded-2xl` + `shadow-pop` untuk modal
// pada docs/design-tokens.md bagian 5) dan Bab 8 (aksesibilitas dasar).

import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { focusRing } from "./styles";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  /** Modal terbuka atau tidak (terkontrol oleh pemanggil). */
  open: boolean;
  /** Dipanggil saat pengguna menutup (Escape, klik latar, tombol tutup). */
  onClose: () => void;
  /** Judul dialog. Wajib: menjadi nama aksesibel (aria-labelledby). */
  title: ReactNode;
  /** Deskripsi singkat opsional (aria-describedby). */
  description?: ReactNode;
  /** Isi dialog. */
  children?: ReactNode;
  /** Slot footer opsional (tombol aksi). */
  footer?: ReactNode;
  /** Label aksesibel tombol tutup (wajib), mis. "Tutup". */
  closeLabel: string;
  /** Lebar maksimum dialog. Bawaan: "md". */
  size?: ModalSize;
  /** Tutup saat latar diklik. Bawaan: true. */
  closeOnBackdropClick?: boolean;
  /** Elemen yang menerima fokus pertama. Bawaan: elemen fokus pertama di dialog. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Kelas tambahan untuk panel dialog. */
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-3xl",
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => !el.hasAttribute("hidden") && el.getClientRects().length > 0);
}

// Penanda "sudah di klien" tanpa mismatch hydration: server mengembalikan false.
const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel,
  size = "md",
  closeOnBackdropClick = true,
  initialFocusRef,
  className,
}: ModalProps) {
  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Kunci scroll latar, pindahkan fokus ke dialog, kembalikan saat ditutup.
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const initial =
      initialFocusRef?.current ?? getFocusable(dialog)[0] ?? dialog;
    initial.focus();

    // Pengaman: bila fokus berpindah ke luar dialog (mis. lewat skrip), tarik kembali.
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !dialog.contains(event.target)) {
        (getFocusable(dialog)[0] ?? dialog).focus();
      }
    };
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      if (trigger && trigger.isConnected) trigger.focus();
    };
  }, [open, initialFocusRef]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = getFocusable(dialog);
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onBackdropMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    // Hanya klik langsung pada latar; klik di dalam panel diabaikan.
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isClient || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-on-accent/60 p-0 sm:items-center sm:p-4"
      onMouseDown={onBackdropMouseDown}
      onKeyDown={onKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          "flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden rounded-t-2xl bg-surface text-fg shadow-pop focus:outline-none sm:rounded-2xl",
          sizeClasses[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 md:px-6">
          <div className="min-w-0 py-1.5">
            <h2 id={titleId} className="text-h3 font-semibold text-fg">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-body-sm text-fg-secondary">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onClose()}
            aria-label={closeLabel}
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-fg-secondary transition-colors duration-200 hover:bg-surface-muted hover:text-fg motion-reduce:transition-none active:opacity-80",
              focusRing,
            )}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
          {children}
        </div>
        {footer ? (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface-muted px-4 py-3 md:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
