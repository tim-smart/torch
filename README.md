# @tim-smart/torch

A small library to toggle the flash on a smartphone on/off.

## API

Use the `createTorch` function to create a new `Torch` instance and call `setup`
all in one go.

```typescript
export declare class Torch {
  setup(): Promise<void>;

  toggle(enableFlash?: boolean): Promise<void>;
  on(): Promise<void>;
  off(): Promise<void>;
  stop(): void;
}
export declare function createTorch(): Promise<Torch>;
```

## Usage

```typescript
import { createTorch } from "@tim-smart/torch";

(async () => {
  const torch = await createTorch();
  await torch.on();
  setTimeout(() => torch.stop(), 5000);
})();
```
