import type { CraftLayout } from "./types";
import { VAD_INPUT_CONFIGS } from "./vadInputs";

export function detectSelectedVADsFromLayout(layout: CraftLayout): string[] {
  if (!layout || typeof layout !== "string") return [];

  const known = Object.keys(VAD_INPUT_CONFIGS);
  const selected: string[] = [];

  for (const name of known) {
    if (layout.includes(`"title":"${name}"`)) {
      selected.push(name);
    }
  }

  return selected;
}

