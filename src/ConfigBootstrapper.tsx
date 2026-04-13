import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Editor, Element, Frame, useEditor } from "@craftjs/core";
import { BUILD_CONFIG_STORAGE_KEY, saveBuildConfig } from "./api";
import type { ProjectBuildConfig } from "./types";
import { defaultTheme } from "./theme";
import { craftResolver } from "./builder/craft/craftResolver";
import { detectSelectedVADsFromLayout } from "./vadSelection";
import {
  ButtonBlock,
  Container,
  GridBlock,
  ImageBlock,
  LogoBlock,
  PricingTable,
  ResultCard,
  SubtitleBlock,
  TitleBlock,
  VADBlock,
  VADResultsList,
} from "./builder/craft/craftNodes";
import { VAD_INPUT_CONFIGS } from "./vadInputs";
import { useBootstrap } from "./BootstrapContext";

const DEMO_PROJECT_ID = "demo-project";
const PRODUCT_IMAGE_URL =
"https://brandportal.carrier.com/transform/4c5c844e-18c5-4abe-8b18-38dd4356fb5b/carrier-truck-supra-s10-unit-3x2-1200x800"  
const readStoredConfig = (): ProjectBuildConfig | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(BUILD_CONFIG_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProjectBuildConfig;
  } catch {
    return null;
  }
};

const getRootNodeCount = (layout: string | null | undefined): number => {
  if (!layout || typeof layout !== "string") return 0;
  try {
    const parsed = JSON.parse(layout) as { ROOT?: { nodes?: unknown } };
    const nodes = parsed?.ROOT?.nodes;
    return Array.isArray(nodes) ? nodes.length : 0;
  } catch {
    return 0;
  }
};

const isLayoutEffectivelyBlank = (layout: string | null | undefined): boolean => {
  return getRootNodeCount(layout) === 0;
};

const isVadLayoutIncomplete = (layout: string | null | undefined): boolean => {
  if (!layout || typeof layout !== "string") return true;
  if (detectSelectedVADsFromLayout(layout).length !== Object.keys(VAD_INPUT_CONFIGS).length) return true;
  // Reseed if VADs are in the old vertical-list format (new layout uses GridBlock for 2-col display)
  if (!layout.includes('"GridBlock"')) return true;
  return false;
};

type SerializeOnMountProps = {
  onSerialized: (json: string) => void;
  readyWhen?: (json: string) => boolean;
  maxAttempts?: number;
  intervalMs?: number;
};

const SerializeOnMount: React.FC<SerializeOnMountProps> = ({
  onSerialized,
  readyWhen,
  maxAttempts = 20,
  intervalMs = 50,
}) => {
  const { query } = useEditor();
  const hasSerialized = React.useRef(false);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const isReady = (json: string) => {
      if (readyWhen) return readyWhen(json);
      return !isLayoutEffectivelyBlank(json);
    };

    const attempt = () => {
      if (cancelled || hasSerialized.current) return;
      const json = query.serialize();
      // Craft may need a tick before Frame children are fully registered.
      if (isReady(json) || tries >= maxAttempts) {
        hasSerialized.current = true;
        onSerialized(json);
        return;
      }
      tries += 1;
      window.setTimeout(attempt, intervalMs);
    };

    attempt();
    return () => {
      cancelled = true;
    };
  }, [onSerialized, query, readyWhen, maxAttempts, intervalMs]);
  return null;
};

type SeedMode = "home" | "pricing" | "vads" | "results" | "roi";

const SeedLayout: React.FC<{ mode: SeedMode; onSerialized: (json: string) => void }> = ({
  mode,
  onSerialized,
}) => {
  const allVads = useMemo(() => Object.keys(VAD_INPUT_CONFIGS), []);

  const readyWhen = useCallback((json: string) => {
    if (mode === "vads") {
      return allVads.every((vadName) => json.includes(`"title":"${vadName}"`));
    }
    return !isLayoutEffectivelyBlank(json);
  }, [mode, allVads]);

  const frame = (() => {
    if (mode === "home") {
      return (
        <Element
          is={Container}
          canvas
          padding={28}
          align="left"
          borderRadius={28}
          minHeight={880}
          backgroundColor="radial-gradient(circle at 12% 12%, rgba(85,136,59,0.18), rgba(255,255,255,0) 55%), radial-gradient(circle at 90% 30%, rgba(56,189,248,0.14), rgba(255,255,255,0) 55%), linear-gradient(135deg, rgba(2,6,23,0.02), rgba(85,136,59,0.05))"
        >
          <LogoBlock text="Carrier Global" />
          <div style={{ height: 14 }} />
          <TitleBlock
            text="Leading the future of intelligent climate and energy solutions."
            fontSize={28}
            color="#0f172a"
          />
          <SubtitleBlock
            text="Transitioning PET Beverage Packaging for ABC Corp."
            fontSize={13}
            color="#334155"
          />

          <div style={{ height: 16 }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 0.9fr)",
              gap: 18,
              alignItems: "center",
            }}
          >
            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(85,136,59,0.18)",
                background: "rgba(255,255,255,0.78)",
                boxShadow: "0 18px 55px rgba(2,6,23,0.08)",
                padding: 18,
              }}
            >
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#166534",
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}
                >
                  Roll Fed Labels
                </span>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#0f172a",
                    background: "rgba(15,23,42,0.04)",
                    border: "1px solid rgba(15,23,42,0.10)",
                  }}
                >
                  Certified Sustainable
                </span>
              </div>

              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#0f172a", opacity: 0.88 }}>
                recycLABEL™ is designed to help enable recycling, reduce waste, and improve manufacturing throughput—without compromising label performance.
              </div>

              <div style={{ height: 14 }} />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
                {[
                  { k: "Enable", v: "Recycling" },
                  { k: "Eliminate", v: "Waste" },
                  { k: "Improve", v: "Throughput" },
                ].map((item) => (
                  <div
                    key={item.k}
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.35)",
                      background: "rgba(255,255,255,0.65)",
                      padding: 10,
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#55883B" }}>{item.k}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{item.v}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: 16 }} />
              <ButtonBlock label="START YOUR SUSTAINABILITY JOURNEY" fontSize={12} padding={12} borderRadius={999} />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <ImageBlock src={PRODUCT_IMAGE_URL} alt="recycLABEL roll-fed bottle" />
            </div>
          </div>
        </Element>
      );
    }

    if (mode === "vads") {
      return (
        <Element is={Container} canvas padding={28} align="left" borderRadius={24} minHeight={600}>
          <TitleBlock text="VAD's Selection" fontSize={26} color="#0f172a" />
          <SubtitleBlock
            text="All Value Added Drivers (VADs) are included by default. Remove any VADs you don’t want to collect inputs for."
            fontSize={13}
            color="#334155"
          />
          <div style={{ height: 10 }} />
          <GridBlock columns={2}>
            {allVads.map((vadName) => (
              <VADBlock key={vadName} title={vadName} />
            ))}
          </GridBlock>
        </Element>
      );
    }

    if (mode === "pricing") {
      return (
        <Element is={Container} canvas padding={28} align="left" borderRadius={24} minHeight={880}>
          <TitleBlock text="Solutions Configuration" fontSize={26} color="#0f172a" />
          <SubtitleBlock
            text="Collect pricing inputs and show pricing details for the published experience."
            fontSize={13}
            color="#334155"
          />
          <div style={{ height: 10 }} />
          <PricingTable />
        </Element>
      );
    }

    if (mode === "roi") {
      return (
        <Element is={Container} canvas padding={28} align="left" borderRadius={24} minHeight={880}>
          <TitleBlock text="ROI/TCO" fontSize={26} color="#0f172a" />
          <SubtitleBlock
            text="A dedicated ROI and total cost of ownership layout for the published experience."
            fontSize={13}
            color="#334155"
          />
          <div style={{ height: 10 }} />

          <GridBlock columns={3}>
            <ResultCard label="VALUE-TO-PRICE RATIO (Annual)" value="Enter value" />
            <ResultCard label="PAYBACK PERIOD" value="Enter value" />
            <ResultCard label="FULL-TERM V/P RATIO" value="Enter value" />
          </GridBlock>

          <GridBlock columns={3}>
            <SubtitleBlock
              text="You pay $1, you get $X in savings"
              fontSize={12}
              color="#475569"
            />
            <SubtitleBlock
              text="Hardware recovered through savings"
              fontSize={12}
              color="#475569"
            />
            <SubtitleBlock
              text="Total savings / total cost over agreement"
              fontSize={12}
              color="#475569"
            />
          </GridBlock>

          <div style={{ height: 20 }} />
          <TitleBlock text="TOTAL COST OF OWNERSHIP" fontSize={20} color="#0f172a" />
          <SubtitleBlock
            text="A summary of one-time and recurring implementation costs over the agreement term."
            fontSize={12}
            color="#334155"
          />
          <GridBlock columns={2}>
            <ResultCard label="Hardware (One-Time)" value="Enter value" />
            <ResultCard label="Software (Annual x Agreement)" value="Enter value" />
            <ResultCard label="Contracts (Annual x Agreement)" value="Enter value" />
            <ResultCard label="TOTAL COST" value="Enter value" />
          </GridBlock>

          <div style={{ height: 20 }} />
          <TitleBlock text="VALUE OVER AGREEMENT LIFE" fontSize={20} color="#0f172a" />
          <SubtitleBlock
            text="Expected savings and financial impact over the agreement period."
            fontSize={12}
            color="#334155"
          />
          <GridBlock columns={2}>
            <ResultCard label="Annual Savings / Truck" value="Enter value" />
            <ResultCard label="Annual Savings / Fleet" value="Enter value" />
            <ResultCard label="Total Savings (Fleet)" value="Enter value" />
            <ResultCard label="NET GAIN" value="Enter value" />
            <ResultCard label="ROI %" value="Enter value" />
          </GridBlock>

          <div style={{ height: 20 }} />
          <TitleBlock text="YEAR-BY-YEAR CASH FLOW" fontSize={20} color="#0f172a" />
          <SubtitleBlock
            text={`Year	Year 0	Year 1	Year 2	Year 3	Year 4	Year 5	TOTAL
Cost	—	—	—	—	—	—	—
Value	—	—	—	—	—	—	—
Net	—	—	—	—	—	—	—
Cumulative	—	—	—	—	—	—	—`}
            fontSize={12}
            color="#334155"
          />

          <div style={{ height: 20 }} />
          <TitleBlock text="SENSITIVITY" fontSize={20} color="#0f172a" />
          <SubtitleBlock
            text={`Scenario	Downtime $/Hr	Spoilage %	Cargo $	Total Savings	V/P	Payback	ROI
Conservative	—	—	—	—	—	—	—
Base Case	—	—	—	—	—	—	—
Optimistic	—	—	—	—	—	—	—`}
            fontSize={12}
            color="#334155"
          />
        </Element>
      );
    }

    return (
      <Element is={Container} canvas padding={28} align="left" borderRadius={24} minHeight={880}>
        <TitleBlock text="Value Estimation" fontSize={26} color="#0f172a" />
        <SubtitleBlock
          text="Review results and refine inputs. Updates reflect immediately as inputs change."
          fontSize={13}
          color="#334155"
        />
        <div style={{ height: 10 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
          <ResultCard label="Annual Value" value="Enter value" />
          <ResultCard label="Annual Investments" value="Enter value" />
          <ResultCard label="Net Benefit" value="Enter value" />
          <ResultCard label="Annual ROI" value="Enter value" />
        </div>
        <VADResultsList columns={2} />
      </Element>
    );
  })();

  return (
    <div
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        width: 1400,
        height: 900,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <Editor enabled={false} resolver={craftResolver}>
        <SerializeOnMount onSerialized={onSerialized} readyWhen={readyWhen} maxAttempts={40} intervalMs={50} />
        <Frame>{frame}</Frame>
      </Editor>
    </div>
  );
};

export const ConfigBootstrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { notifyBootstrapComplete } = useBootstrap();
  const [existing] = useState<ProjectBuildConfig | null>(() => readStoredConfig());
  const needsSeed = (cfg: ProjectBuildConfig | null) => {
    if (!cfg || cfg.projectId !== DEMO_PROJECT_ID) return true;
    if (!cfg.homeLayout || isLayoutEffectivelyBlank(cfg.homeLayout)) return true;
    if (!cfg.pricingLayout || isLayoutEffectivelyBlank(cfg.pricingLayout)) return true;
    if (!cfg.vadLayout || isLayoutEffectivelyBlank(cfg.vadLayout) || isVadLayoutIncomplete(cfg.vadLayout)) return true;
    if (!cfg.resultsLayout || isLayoutEffectivelyBlank(cfg.resultsLayout) || (typeof cfg.resultsLayout === 'string' && cfg.resultsLayout.includes('"SliderCard"'))) return true;
    if (!cfg.roiLayout || isLayoutEffectivelyBlank(cfg.roiLayout)) return true;
    return false;
  };

  const [ready, setReady] = useState<boolean>(() => {
    const cfg = readStoredConfig();
    return !needsSeed(cfg);
  });

  const [seed, setSeed] = useState<{
    home?: string;
    pricing?: string;
    vads?: string;
    results?: string;
    roi?: string;
  }>({});

  useEffect(() => {
    if (ready) return;
    const base = existing;
    const needsHome = !base?.homeLayout;
    const needsPricing = !base?.pricingLayout;
    const needsVads = !base?.vadLayout || isLayoutEffectivelyBlank(base.vadLayout) || isVadLayoutIncomplete(base.vadLayout);
    const needsResults = !base?.resultsLayout || isLayoutEffectivelyBlank(base.resultsLayout) || (typeof base.resultsLayout === 'string' && base.resultsLayout.includes('"SliderCard"'));
    const needsRoi = !base?.roiLayout;

    if (
      (needsHome && !seed.home) ||
      (needsPricing && !seed.pricing) ||
      (needsVads && !seed.vads) ||
      (needsResults && !seed.results) ||
      (needsRoi && !seed.roi)
    )
      return;

    const cfg: ProjectBuildConfig = {
      projectId: DEMO_PROJECT_ID,
      theme: base?.theme ?? defaultTheme,
      homeLayout: base?.homeLayout ?? seed.home ?? null,
      pricingLayout: base?.pricingLayout ?? seed.pricing ?? null,
      vadLayout: needsVads ? (seed.vads ?? null) : (base?.vadLayout ?? null),
      resultsLayout: needsResults ? (seed.results ?? null) : (base?.resultsLayout ?? null),
      roiLayout: base?.roiLayout ?? seed.roi ?? null,
    };

    saveBuildConfig(cfg).then(() => {
      setReady(true);
      // Notify that bootstrap is complete so BuildApp can reload
      notifyBootstrapComplete();
    });
  }, [existing, ready, seed.home, seed.pricing, seed.vads, seed.results, seed.roi, notifyBootstrapComplete]);

  if (ready) return <>{children}</>;

  const needsHome = !existing?.homeLayout || isLayoutEffectivelyBlank(existing.homeLayout);
  const needsPricing = !existing?.pricingLayout || isLayoutEffectivelyBlank(existing.pricingLayout);
  const needsVads = !existing?.vadLayout || isLayoutEffectivelyBlank(existing.vadLayout) || isVadLayoutIncomplete(existing.vadLayout);
  const needsResults = !existing?.resultsLayout || isLayoutEffectivelyBlank(existing.resultsLayout) || (typeof existing.resultsLayout === 'string' && existing.resultsLayout.includes('"SliderCard"'));
  const needsRoi = !existing?.roiLayout || isLayoutEffectivelyBlank(existing.roiLayout);

  return (
    <>
      {needsHome ? (
        <SeedLayout
          mode="home"
          onSerialized={(json) =>
            setSeed((s) =>
              s.home === json ? s : { ...s, home: json }
            )
          }
        />
      ) : null}
      {needsPricing ? (
        <SeedLayout
          mode="pricing"
          onSerialized={(json) =>
            setSeed((s) =>
              s.pricing === json ? s : { ...s, pricing: json }
            )
          }
        />
      ) : null}
      {needsVads ? (
        <SeedLayout
          mode="vads"
          onSerialized={(json) =>
            setSeed((s) =>
              s.vads === json ? s : { ...s, vads: json }
            )
          }
        />
      ) : null}
      {needsResults ? (
        <SeedLayout
          mode="results"
          onSerialized={(json) =>
            setSeed((s) =>
              s.results === json ? s : { ...s, results: json }
            )
          }
        />
      ) : null}
      {needsRoi ? (
        <SeedLayout
          mode="roi"
          onSerialized={(json) =>
            setSeed((s) =>
              s.roi === json ? s : { ...s, roi: json }
            )
          }
        />
      ) : null}
      <div style={{ padding: 24, fontSize: 13, opacity: 0.8 }}>Preparing demo…</div>
    </>
  );
};

