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
        });

        return scanner
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 100 } },
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
        Point the camera at the barcode on the driver-door-jamb sticker.
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
