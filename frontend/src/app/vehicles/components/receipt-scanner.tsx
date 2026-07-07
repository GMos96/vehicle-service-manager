"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Progress, Text } from "@chakra-ui/react";
import { parseReceiptText, type ParsedReceipt } from "@/app/vehicles/receipt-parse";

type Props = {
  onExtract: (fields: ParsedReceipt) => void;
};

const MAX_SIDE = 1600;

function downscale(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))), "image/jpeg", 0.9);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

export default function ReceiptScanner({ onExtract }: Props) {
  const [status, setStatus] = useState<"idle" | "scanning" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<{ terminate(): void } | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setStatus("scanning");
    setProgress(0);

    let blobUrl: string | null = null;
    try {
      const scaled = await downscale(file);
      blobUrl = URL.createObjectURL(scaled);

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        workerPath: "/tesseract/worker.min.js",
        corePath: "/tesseract",
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });
      workerRef.current = worker;

      const result = await worker.recognize(blobUrl);
      worker.terminate();
      workerRef.current = null;

      const fields = parseReceiptText(result.data.text);
      onExtract(fields);
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    }
  }, [onExtract]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be selected again
    e.target.value = "";
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleChange}
        aria-label="Scan receipt"
      />
      <Flex gap={2} align="center" wrap="wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={status === "scanning"}
        >
          {status === "scanning" ? "Scanning…" : "Scan receipt"}
        </Button>
        {status === "done" && (
          <Text fontSize="xs" color="green.500">
            Receipt scanned — review prefilled fields below
          </Text>
        )}
        {status === "error" && (
          <Text fontSize="xs" color="red.500">
            Could not read receipt — fill in manually
          </Text>
        )}
      </Flex>
      {status === "scanning" && (
        <Box mt={2}>
          <Progress.Root value={progress} size="xs" colorPalette="accent">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </Box>
      )}
    </Box>
  );
}
