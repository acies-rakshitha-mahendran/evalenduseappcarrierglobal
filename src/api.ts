import type {
  ProjectBuildConfig,
  VADId,
  VADInputValues,
  EvalResults,
} from "./types";

const STORAGE_KEY = "eval-craft-builder-config";
export const BUILD_CONFIG_STORAGE_KEY = STORAGE_KEY;

export async function saveBuildConfig(
  config: ProjectBuildConfig
): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function loadBuildConfig(
  projectId: string
): Promise<ProjectBuildConfig | null> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ProjectBuildConfig;
    if (parsed.projectId !== projectId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function calculateFromEval(
  vads: VADId[],
  inputs: Record<VADId, VADInputValues>
): Promise<EvalResults> {
  const result: EvalResults = {};
  vads.forEach((id) => {
    const vals = inputs[id] || {};
    const sum = Object.values(vals).reduce<number>((acc, v) => {
      if (typeof v === "number") return acc + v;
      const n = parseFloat(String(v));
      return acc + (isNaN(n) ? 0 : n);
    }, 0);
    result[id] = sum;
  });
  return new Promise((resolve) => setTimeout(() => resolve(result), 400));
}
