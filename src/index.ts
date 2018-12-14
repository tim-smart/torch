export class Torch {
  private mediaStreamTrack?: MediaStreamTrack;
  private enabled = false;

  public async setup() {
    if (!("mediaDevices" in navigator)) {
      throw new Error("Environment does not support mediaDevices");
    }
    if (!("ImageCapture" in window)) {
      throw new Error("Environment does not support ImageCapture");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "environment"
      }
    });

    const tracks = stream.getVideoTracks();
    if (tracks.length === 0) {
      throw new Error("Could not find rear camera");
    }

    this.mediaStreamTrack = tracks[0];
  }

  public async toggle(enableFlash = !this.enabled) {
    // tslint:disable no-object-literal-type-assertion
    if (!this.mediaStreamTrack) {
      return;
    }
    const constraint = { torch: enableFlash } as MediaTrackConstraintSet;

    // Silently fail if we have to, but log to console.
    // tslint:disable no-console
    try {
      await this.mediaStreamTrack.applyConstraints({
        advanced: [constraint]
      });
      this.enabled = enableFlash;
    } catch (err) {
      console.error("Ignoring error:", err);
    }
  }

  public on() {
    return this.toggle(true);
  }

  public off() {
    return this.toggle(false);
  }

  public stop() {
    if (!this.mediaStreamTrack) {
      return;
    }

    this.mediaStreamTrack.stop();
    this.mediaStreamTrack = undefined;
  }
}

export async function createTorch(): Promise<Torch> {
  const torch = new Torch();
  await torch.setup();
  return torch;
}
