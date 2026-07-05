import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import Provider from "@/app/provider";
import VinScanner from "./vin-scanner";

function renderWithProvider(ui: ReactNode) {
  return render(ui, { wrapper: Provider });
}

const start = vi.fn();
const stop = vi.fn().mockResolvedValue(undefined);
const clear = vi.fn();

class MockHtml5Qrcode {
  start = start;
  stop = stop;
  clear = clear;
  get isScanning() {
    return true;
  }
}

vi.mock("html5-qrcode", () => {
  return {
    Html5QrcodeSupportedFormats: { CODE_39: 3 },
    Html5Qrcode: MockHtml5Qrcode,
  };
});

vi.mock("@/core/errors", () => ({
  showErrorToast: vi.fn(),
}));

describe("VinScanner", () => {
  beforeEach(() => {
    start.mockReset();
    stop.mockClear();
    clear.mockClear();
  });

  it("reports a scanned, well-formed VIN and stops the scanner", async () => {
    start.mockImplementation(
      (
        _camera: unknown,
        _config: unknown,
        onSuccess: (decodedText: string) => void,
      ) => {
        onSuccess("1hgcm82633a004352");
        return Promise.resolve(null);
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
    start.mockImplementation(
      (
        _camera: unknown,
        _config: unknown,
        onSuccess: (decodedText: string) => void,
      ) => {
        onSuccess("NOT-A-VIN");
        return Promise.resolve(null);
      },
    );

    const onScan = vi.fn();
    renderWithProvider(<VinScanner onScan={onScan} onCancel={vi.fn()} />);

    await waitFor(() => expect(start).toHaveBeenCalled());
    expect(onScan).not.toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });

  it("shows an error and cancels when the camera can't be started", async () => {
    start.mockRejectedValue(new Error("Permission denied"));
    const { showErrorToast } = await import("@/core/errors");
    const onCancel = vi.fn();

    renderWithProvider(<VinScanner onScan={vi.fn()} onCancel={onCancel} />);

    await waitFor(() => expect(onCancel).toHaveBeenCalled());
    expect(showErrorToast).toHaveBeenCalled();
  });

  it("calls onCancel when the Cancel button is clicked", async () => {
    start.mockImplementation(() => new Promise(() => {})); // never resolves
    const onCancel = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<VinScanner onScan={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByTestId("cancelScanButton"));

    expect(onCancel).toHaveBeenCalled();
  });
});
