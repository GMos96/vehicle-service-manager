import { Box, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/core/errors";
import { isValidVinFormat } from "@/util/vin";

const VIEWPORT_ID = "vin-scanner-viewport";

type Props = {
  onScan: (vin: string) => void;
  onCancel: () => void;
};

export default function VinScanner({ onScan, onCancel }: Props) {
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    let cancelled = false;
    let scanner: any;

    // Cleanup must wait for this whole async chain (dynamic import + start())
    // to settle before deciding whether to stop/clear — otherwise a fast
    // mount/unmount (e.g. immediate Cancel) can leave the camera stream
    // dangling if start() resolves after the effect has already torn down.
    const ready = import("html5-qrcode").then(
      ({ Html5Qrcode, Html5QrcodeSupportedFormats }) => {
        if (cancelled) return;

        scanner = new Html5Qrcode(VIEWPORT_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39],
          verbose: false,
          // No-op where the native BarcodeDetector API isn't available (e.g.
          // iOS WebKit), but noticeably faster/more accurate where it is.
          experimentalFeatures: { useBarCodeDetectorIfSupported: true },
        });

        return scanner
          .start(
            {
              facingMode: "environment",
              // Code 39's fine bars need real resolution to decode reliably —
              // the browser's unconstrained default is often too low. 720p
              // is a meaningful step up and, unlike 1080p, negotiates
              // reliably across real hardware and synthetic test devices.
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            {
              fps: 10,
              // A linear barcode is wide and short, not square like a QR
              // code — size the scan region to match, relative to the
              // actual viewfinder rather than a fixed pixel box.
              qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                const width = Math.floor(
                  Math.min(viewfinderWidth * 0.9, viewfinderHeight * 2, 500),
                );
                return { width, height: Math.floor(width * 0.3) };
              },
            },
            (decodedText: string) => {
              const vin = decodedText.trim().toUpperCase();
              if (!isValidVinFormat(vin)) {
                // Not a well-formed VIN — keep scanning rather than surface a
                // confusing error mid-scan.
                return;
              }
              scanner.stop().then(() => onScanRef.current(vin));
            },
            () => {
              // Fires continuously when no code is in frame this tick —
              // normal scanner noise, not an error.
            },
          )
          .catch(() => {
            if (cancelled) return;
            showErrorToast(
              "Could not access the camera. Check permissions and try again.",
            );
            onCancelRef.current();
          });
      },
    );

    return () => {
      cancelled = true;
      ready.finally(() => {
        if (scanner?.isScanning) {
          scanner.stop().then(() => scanner.clear());
        } else {
          scanner?.clear();
        }
      });
    };
  }, []);

  return (
    <Stack gap={3} width="100%">
      <Box
        id={VIEWPORT_ID}
        width="100%"
        borderWidth="1px"
        borderColor="border.hairline"
        borderRadius="md"
        overflow="hidden"
      ></Box>
      <Text fontSize="xs" color="fg.subtle">
        Fill the highlighted box with just the barcode (not the surrounding
        text), hold steady, and make sure it&apos;s well lit.
      </Text>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        data-testid="cancelScanButton"
      >
        Cancel
      </Button>
    </Stack>
  );
}
