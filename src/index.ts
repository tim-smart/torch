// tslint:disable max-classes-per-file no-console

interface IPhotoCapabilities {
  fillLightMode: Array<"auto" | "off" | "flash">;
}

declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  public getPhotoCapabilities(): Promise<IPhotoCapabilities>;
}

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
    stream.onactive = () => console.log("active");

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
    try {
      await this.mediaStreamTrack.applyConstraints({
        advanced: [constraint]
      });
      this.enabled = enableFlash;
    } catch (err) {
      console.error(err);
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
