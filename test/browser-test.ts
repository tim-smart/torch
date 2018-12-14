// tslint:disable no-console
import { createTorch } from "../src/index";

async function sleep(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

async function main() {
  try {
    const torch = await createTorch();
    await sleep(2000);
    await torch.on();
    await sleep(2000);
    await torch.off();
    await sleep(2000);
    await torch.on();
    await sleep(2000);
    await torch.off();
    await sleep(2000);
    await torch.on();
    await sleep(2000);

    torch.stop();
  } catch (err) {
    console.error(err);
  }
}

window.addEventListener("load", main);
