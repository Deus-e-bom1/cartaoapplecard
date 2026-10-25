import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelfieCapture } from "@/components/SelfieCapture";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Transient selfie capture", () => {
  it("stops the camera when leaving the screen", async () => {
    const stop = vi.fn();
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const view = render(<SelfieCapture />);
    await waitFor(() => expect(getUserMedia).toHaveBeenCalledWith({ video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } }, audio: false }));
    view.unmount();
    expect(stop).toHaveBeenCalledTimes(1);
  });

  it("does not capture before camera readiness and stops camera after capture", async () => {
    const onContinue = vi.fn();
    const stop = vi.fn();
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] }) } });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ translate: vi.fn(), scale: vi.fn(), drawImage } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,test");
    const view = render(<SelfieCapture onContinue={onContinue} />);
    expect(screen.getByRole("button", { name: "Capturar foto" })).toBeDisabled();
    expect(onContinue).not.toHaveBeenCalled();
    const video = view.container.querySelector("video");
    if (!video) throw new Error("Camera missing");
    Object.defineProperty(video, "videoWidth", { value: 720 });
    Object.defineProperty(video, "videoHeight", { value: 960 });
    await waitFor(() => expect(video.srcObject).toBeTruthy());
    fireEvent.loadedData(video);
    fireEvent.click(screen.getByRole("button", { name: "Capturar foto" }));
    expect(drawImage).toHaveBeenCalledWith(video, 0, 0);
    expect(stop).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("img", { name: "Selfie capturada" })).toHaveAttribute("src", "data:image/jpeg;base64,test");
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});