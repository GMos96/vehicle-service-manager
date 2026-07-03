# Research: `html5-qrcode` for VIN Barcode Scanning

**Context:** `docs/audit.md` (Feature Opportunity #5, "VIN Decode & Recall Visibility") proposes accepting
a VIN at vehicle creation and auto-populating year/make/model/trim via the NHTSA VIN decode API. Typing
a 17-character VIN correctly is itself a friction/error source. The fast follow evaluated here is: let the
user scan the VIN barcode (dashboard plate, door-jamb sticker, title/registration) with their phone camera
instead of typing it, then feed the decoded string into the same VIN-decode flow.

## Library Overview

- **Package:** [`html5-qrcode`](https://www.npmjs.com/package/html5-qrcode) — v2.3.8, Apache-2.0, zero
  production dependencies.
- Cross-platform JS library for scanning QR codes **and 1D/2D barcodes** from a device camera or an
  uploaded image, running entirely client-side (no data leaves the browser).
- Two API surfaces:
  - **`Html5QrcodeScanner`** — drop-in scanner widget with its own UI (camera picker, torch/zoom
    buttons, file-upload fallback). Fastest to integrate.
  - **`Html5Qrcode`** — low-level API for a fully custom UI (manual `start()`/`stop()`, camera
    enumeration via `Html5Qrcode.getCameras()`). Better fit if we want the scan surface to look like the
    rest of the app (Chakra `Dialog`) instead of the library's injected DOM.
- Can optionally delegate to the browser's native `BarcodeDetector` API when available
  (`useBarCodeDetectorIfSupported: true`) for better performance, falling back to the bundled
  ZXing-based decoder otherwise.

## VIN barcode format compatibility

VINs are historically encoded as **Code 39** (the only symbology explicitly tied to VIN encoding by
DOT/ISO 3779 conventions) on dashboard plates, door-jamb stickers, and title/registration paperwork. Some
newer window stickers/documents also carry the VIN in **PDF417** or **QR** alongside Code 39. `html5-qrcode`
supports all of these out of the box via `Html5QrcodeSupportedFormats`:

```
QR_CODE, AZTEC, CODABAR, CODE_39, CODE_93, CODE_128, DATA_MATRIX,
MAXICODE, ITF, EAN_13, EAN_8, PDF_417, RSS_14, RSS_EXPANDED, UPC_A, UPC_E, ...
```

We'd restrict `formatsToSupport` to `[CODE_39, PDF_417, QR_CODE]` — narrowing the format set improves scan
speed/accuracy and avoids accidental matches against retail barcodes (EAN/UPC) that could appear in the
same camera frame (e.g., a sticker sharing space with a product barcode).

## Integration shape (Next.js App Router)

- **Client-only.** The library touches `navigator.mediaDevices` and the DOM directly, so any component
  using it needs `"use client"` and must not run during SSR/build. Load it with `next/dynamic` and
  `ssr: false`, or lazily `import("html5-qrcode")` inside a `useEffect`, so it never executes on the
  server.
- **Lifecycle.** Use the low-level `Html5Qrcode` API inside a Chakra `Dialog` (matches existing
  `dialog.tsx`/`dialog-button.tsx` patterns): `start()` when the dialog opens, `stop()`/`clear()` in the
  effect cleanup and on successful scan, so the camera stream is always released — leaving a camera stream
  open after unmount is the most common integration bug reported against this library.
- **Permissions/HTTPS.** Camera access requires a secure context (HTTPS, or `localhost` in dev) and an
  explicit permission grant; `getCameras()`/`start()` reject with `NotAllowedError` on denial —surface
  that as a toast via the existing toast-based error handling flow and fall back to manual VIN entry
  rather than blocking the form.
- **Where it plugs in:** the vehicle-creation form gets a "Scan VIN" button next to the VIN input,
  opening the scanner dialog; `onScanSuccess(decodedText)` fills the VIN field and closes the dialog,
  after which the existing/planned NHTSA decode call runs unchanged. Scanning is additive — manual entry
  stays the default path — so this has no backend or schema impact by itself.
- **Validation:** decoded text should still pass through the same VIN format check (17 chars, no I/O/Q)
  before the decode call fires, since a misread barcode or a stray QR code in frame can produce garbage.

## Bundle/perf notes

- No runtime dependencies; the package itself is moderate in size (bundled ZXing decoder), so it should be
  code-split (dynamic import, per above) rather than pulled into the main bundle — it's only needed on the
  one form that adds a vehicle.
- `fps` (default 2, we'd want ~10) and `qrbox` region size are the main tunables for scan responsiveness;
  a smaller/wider `qrbox` (e.g. `{ width: 400, height: 120 }`) suits the narrow strip shape Code 39 VIN
  barcodes are usually printed in, versus the default square.

## Alternatives considered

| Library | Notes |
|---|---|
| `@yudiel/react-qr-scanner` | Thinner React wrapper, simpler hook API, but narrower format support — worth a look if we want less integration code, at the cost of control. |
| `react-qr-barcode-scanner` | Also wraps ZXing; similar tradeoffs to the above. |
| Native `BarcodeDetector` directly | Avoids any library, but Safari/Firefox support is inconsistent — `html5-qrcode`'s `useBarCodeDetectorIfSupported` flag already gives us this as a free performance win with a polyfill fallback, so hand-rolling it buys nothing extra. |

**Recommendation:** `html5-qrcode` is the right fit — it's the most battle-tested option, has zero
dependencies, explicitly supports Code 39/PDF417 (the actual VIN barcode formats), and its low-level API
lets the scan UI match the rest of the app rather than being visually bolted on.

## Sources
- [html5-qrcode on npm](https://www.npmjs.com/package/html5-qrcode)
- [mebjas/html5-qrcode on GitHub](https://github.com/mebjas/html5-qrcode)
- [QR and barcode scanner in React — Minhaz's Blog](https://blog.minhazav.dev/Qr-code-and-barcode-scanner-in-react/)
- [Code 39 VIN Barcodes — Laser Appraiser](https://laserappraiser.com/vin-barcode-type/code-39)
- [Scanning VIN Using Barcode Reader — Dynamsoft Blog](https://www.dynamsoft.com/blog/imaging/barcode/scanning-vin-codes-barcode-reader/)
