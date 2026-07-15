import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import Provider from "@/app/provider";
import VinScanner from "./vin-scanner";

function renderWithProvider(ui: ReactNode) {
  return render(ui, { wrapper: Provider });
}

const stop = vi.fn();
const controls = { stop };
const decodeFromConstraints = vi.fn();

class MockBrowserMultiFormatOneDReader {
  decodeFromConstraints = decodeFromConstraints;
}

vi.mock("@zxing/browser", () => ({
  BrowserMultiFormatOneDReader: MockBrowserMultiFormatOneDReader,
}));

vi.mock("@zxing/library", () => ({
  DecodeHintType: { POSSIBLE_FORMATS: 2 },
  BarcodeFormat: { CODE_39: 4 },
}));

vi.mock("@/core/errors", () => ({
  showErrorToast: vi.fn(),
}));

type DecodeCallback = (
  result: { getText: () => string } | null,
  error: Error | null,
  controls: { stop: () => void },
) => void;

describe("VinScanner", () => {
  beforeEach(() => {
    decodeFromConstraints.mockReset();
    stop.mockClear();
  });

  it("reports a scanned, well-formed VIN and stops the scanner", async () => {
    decodeFromConstraints.mockImplementation(
      (_constraints: unknown, _video: unknown, callback: DecodeCallback) => {
        callback({ getText: () => "1hgcm82633a004352" }, null, controls);
        return Promise.resolve(controls);
      },
    );

    const onScan = vi.fn();
    renderWithProvider(<VinScanner onScan={onScan} onCancel={vi.fn()} />);

    await waitFor(() =>
      expect(onScan).toHaveBeenCalledWith("1HGCM82633A004352"),
    );
    expect(stop).toHaveBeenCalled();
  });

  it("ignores a decoded payload that isn't a well-formed VIN", async () => {
    decodeFromConstraints.mockImplementation(
      (_constraints: unknown, _video: unknown, callback: DecodeCallback) => {
        callback({ getText: () => "NOT-A-VIN" }, null, controls);
        return Promise.resolve(controls);
      },
    );

    const onScan = vi.fn();
    renderWithProvider(<VinScanner onScan={onScan} onCancel={vi.fn()} />);

    await waitFor(() => expect(decodeFromConstraints).toHaveBeenCalled());
    expect(onScan).not.toHaveBeenCalled();
  });

  it("shows an error and cancels when the camera can't be started", async () => {
    decodeFromConstraints.mockRejectedValue(new Error("Permission denied"));
    const { showErrorToast } = await import("@/core/errors");
    const onCancel = vi.fn();

    renderWithProvider(<VinScanner onScan={vi.fn()} onCancel={onCancel} />);

    await waitFor(() => expect(onCancel).toHaveBeenCalled());
    expect(showErrorToast).toHaveBeenCalled();
  });

  it("calls onCancel when the Cancel button is clicked", async () => {
    decodeFromConstraints.mockImplementation(() => new Promise(() => {})); // never resolves
    const onCancel = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<VinScanner onScan={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByTestId("cancelScanButton"));

    expect(onCancel).toHaveBeenCalled();
  });
});
