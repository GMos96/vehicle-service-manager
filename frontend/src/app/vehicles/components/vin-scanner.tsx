import { Box, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/core/errors";
import { isValidVinFormat } from "@/util/vin";

type Props = {
  onScan: (vin: string) => void;
  onCancel: () => void;
};

export default function VinScanner({ onScan, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    let cancelled = false;
    let controls: { stop: () => void } | undefined;

    // Cleanup must wait for this whole async chain (dynamic import +
    // decodeFromConstraints()) to settle before deciding whether to stop —
    // otherwise a fast mount/unmount (e.g. immediate Cancel) can leave the
    // camera stream dangling if the scanner starts after the effect has
    // already torn down.
    const ready = Promise.all([
      import("@zxing/browser"),
      import("@zxing/library"),
    ]).then(
      ([
        { BrowserMultiFormatOneDReader },
        { DecodeHintType, BarcodeFormat },
      ]) => {
        if (cancelled || !videoRef.current) return;

        const hints = new Map([
          [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_39]],
        ]);
        const reader = new BrowserMultiFormatOneDReader(hints, {
          delayBetweenScanAttempts: 100,
        });

        let done = false;
        return reader
          .decodeFromConstraints(
            {
              video: {
                facingMode: "environment",
                // Code 39's fine bars need real resolution to decode
                // reliably — the browser's unconstrained default is often
                // too low. 720p is a meaningful step up and, unlike 1080p,
                // negotiates reliably across real hardware and synthetic
                // test devices.
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
            },
            videoRef.current,
            (result, _error, scanControls) => {
              // No result means no barcode in frame this attempt — normal
              // scanner noise, not an error.
              if (!result || done) return;
              const vin = result.getText().trim().toUpperCase();
              if (!isValidVinFormat(vin)) {
                // Not a well-formed VIN — keep scanning rather than surface
                // a confusing error mid-scan.
                return;
              }
              done = true;
              scanControls.stop();
              onScanRef.current(vin);
            },
          )
          .then((scanControls) => {
            controls = scanControls;
            if (cancelled) scanControls.stop();
          })
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
      ready.finally(() => controls?.stop());
    };
  }, []);

  return (
    <Stack gap={3} width="100%">
      <Box
        width="100%"
        borderWidth="1px"
        borderColor="border.hairline"
        borderRadius="md"
        overflow="hidden"
      >
        <video
          ref={videoRef}
          muted
          playsInline
          style={{ width: "100%", display: "block" }}
          data-testid="vinScannerVideo"
        />
      </Box>
      <Text fontSize="xs" color="fg.subtle">
        Center just the barcode (not the surrounding text) in the camera view,
        hold steady, and make sure it&apos;s well lit.
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
