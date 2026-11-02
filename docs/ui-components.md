# Komponen UI Generik (`src/components/ui/`)

Pemilik: Claude #2 (Frontend & UI Specialist).

**Acuan PRD:** Bab 5.4 (Skeleton Loading, Empty State, Interaktivitas `hover:scale-105 transition-transform duration-200`), dengan Bab 5.1/5.3 (token, tab sticky) dan Bab 3.3 (Server Component sebagai default, `cn()`).

Komponen di sini tidak tahu apa pun tentang sepak bola: semua teks datang dari props (ambil dari `src/content/microcopy.ts` di pemanggil). Semua warna memakai token (`docs/design-tokens.md`). Tidak ada route playground.

| Komponen | Berkas | Client? |
|---|---|---|
| Button | `Button.tsx` | Tidak |
| Badge | `Badge.tsx` | Tidak |
| Card | `Card.tsx` | Tidak |
| Tabs | `Tabs.tsx` | **Ya** (state, keyboard, scroll DOM) |
| Modal | `Modal.tsx` | **Ya** (portal, focus trap, scroll lock) |
| Skeleton, SkeletonText, SkeletonCard, SkeletonTableRows | `Skeleton.tsx` | Tidak |
| EmptyState | `EmptyState.tsx` | Tidak |
| SafeImage | `SafeImage.tsx` | **Ya** (`onError` + state) |

`styles.ts` berisi kelas bersama (`focusRing`, `focusRingInset`, `hoverScale`, `hoverRow`).

## Button

```tsx
import { Button } from "@/components/ui/Button";

<Button>Simpan</Button>
<Button variant="secondary" size="sm">Batal</Button>
<Button variant="ghost" href="/groups">Lihat grup</Button>   // next/link
<Button disabled>Nonaktif</Button>
<Button fullWidth>Lebar penuh</Button>                       // tanpa skala
```

| Prop | Tipe | Bawaan |
|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` |
| `size` | `"sm" \| "md" \| "lg"` (semua tinggi sentuh ≥ 44 px) | `"md"` |
| `href` | `string` (bila ada: dirender `next/link`) | – |
| `disabled` | `boolean` (tautan nonaktif jadi `<span aria-disabled>`) | `false` |
| `fullWidth` | `boolean` | `false` |
| `iconStart` / `iconEnd` | `ReactNode` | – |
| `className`, `children` + atribut `<button>` / `<Link>` | | |

## Badge

```tsx
<Badge variant="success">Lolos</Badge>
<Badge variant="warning">Kandidat Best 3rd</Badge>
<Badge variant="danger">Tersingkir</Badge>
```

Props: `variant` (`neutral | success | warning | danger | info`, bawaan `neutral`), `children` (**wajib**, teks), `showIcon` (bawaan `true`; ikon: Check, Hourglass, X, Info), `className`. Status selalu punya teks + ikon, bukan warna saja.

## Card

```tsx
<Card as="section" header={<h3>Judul</h3>} footer={<small>Catatan</small>}>
  Isi kartu
</Card>
```

Props: `as` (`div | section | article`), `header`, `footer`, `children`, `className`, `contentClassName`. Kartu statis tidak diskalakan saat hover.

## Tabs (client)

```tsx
const items = [{ id: "A", label: "Grup A", panel: <GroupA /> }, /* ... */];

// Tak terkontrol
<Tabs items={items} ariaLabel="Pilih grup" defaultValue="A" />

// Terkontrol
<Tabs items={items} ariaLabel="Pilih grup" value={group} onValueChange={setGroup} />
```

Props: `items: { id, label, disabled?, panel? }[]`, `ariaLabel` (wajib), `renderAllPanels` (bawaan `false`; bila `true`, SEMUA panel dirender ke HTML dan panel tidak aktif diberi `hidden`, dipakai halaman SSG seperti `/groups` agar isi semua tab terbaca mesin pencari), `value` + `onValueChange` (terkontrol) **atau** `defaultValue` (tak terkontrol), `sticky` (bawaan `true`), `stickyOffsetClassName` (bawaan `top-[calc(3.5rem+1px)]` = tinggi Navbar `h-14` + border), `className`, `panelClassName`.
Keyboard: ←/→ (berputar), Home/End; roving tabindex; tab aktif otomatis tergulir ke tengah. Bila `panel` tidak diisi, Tabs hanya penyeleksi dan pemanggil merender isi sendiri.

## Modal (client)

```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Buka</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Judul" closeLabel="Tutup"
       footer={<Button onClick={() => setOpen(false)}>OK</Button>}>
  Isi
</Modal>
```

Props: `open`, `onClose`, `title` (wajib), `closeLabel` (wajib), `description`, `children`, `footer`, `size` (`sm | md | lg`), `closeOnBackdropClick` (bawaan `true`), `initialFocusRef`, `className`. Escape/klik latar menutup, fokus terjebak dan dikembalikan ke pemicu, scroll latar dikunci.

## Skeleton

```tsx
<SkeletonText lines={3} label="Memuat data" />
<SkeletonCard />
<SkeletonTableRows rows={5} columns={4} />
<Skeleton className="h-4 w-32" />
```

Shimmer (`animate-shimmer`), mati saat `prefers-reduced-motion`. `label` mengubah pembungkus jadi `role="status"` dengan teks sr-only; tanpa `label` seluruhnya `aria-hidden`. Props: `SkeletonText { lines, label, className }`, `SkeletonCard { lines, avatar, label, className }`, `SkeletonTableRows { rows, columns, label, className }` (div grid, bukan `<tr>`), `Skeleton { circle, className }`.

## EmptyState

```tsx
<EmptyState title="Pemain tidak ditemukan di daftar skuad 2026."
            message="Cek ejaan nama, atau atur ulang filter."
            action={<Button variant="secondary" onClick={reset}>Atur ulang filter</Button>} />
```

Props: `title` (wajib), `message`, `icon` (bawaan ikon Lucide `Whistle`), `action`, `headingAs` (`h2 | h3 | h4`), `className`.

## SafeImage (client)

```tsx
<SafeImage src="/players/MESSI.webp" alt="Foto Lionel Messi" width={96} height={96}
           fallbackInitials="LM" />
<SafeImage src="/flags/ARG.svg" alt="Bendera Argentina" width={32} height={22} fallbackType="flag" />
```

Props: `src`, `alt`, `width`, `height` (wajib); `sizes`, `priority`, `fallbackType` (`"player" | "flag"`, bawaan `"player"`), `fallbackInitials`, `className`. `.svg` otomatis `unoptimized`. Saat gagal atau `src` kosong tampil placeholder (siluet/inisial/ikon bendera) ber-`role="img"` dan `aria-label={alt}`. Gambar remote butuh `images.remotePatterns` di `next.config.ts`.
