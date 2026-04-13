// src/present/InputsRenderer.tsx
import React, { useEffect, useMemo, useState } from "react";
import { VAD_INPUT_CONFIGS } from "../vadInputs";
import { VAD_VARIABLES } from "../vadVariables";
import { VAD_METADATA } from "../vadMetadata";
import type { VADInputValue } from "../evalContext";

interface InputsRendererProps {
  vadNames: string[];
  onInputsChange?: (inputs: VADInputValue) => void;
  initialInputs?: VADInputValue;
}

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumberForDisplay = (value: string | number): string => {
  if (value === "" || value == null) return "";
  const str = String(value).replace(/,/g, "");
  const n = parseFloat(str);
  if (isNaN(n)) return String(value);
  return numberFormatter.format(n);
};

const buildSeedInputs = (vadNames: string[], base?: VADInputValue): VADInputValue => {
  const next: VADInputValue = {};
  vadNames.forEach((vadName) => {
    const config = VAD_INPUT_CONFIGS[vadName];
    const existing = base?.[vadName] ?? {};
    next[vadName] = {};
    if (config) {
      config.fields.forEach((field, idx) => {
        const prevEntry = existing[idx];
        let value: string | number = prevEntry?.value ?? "";

        if (prevEntry == null && field.defaultValue != null) {
          value = field.defaultValue;
        }

        if (!field.owner || field.owner === "End Customer") {
          if (field.type === "number" && value !== "") {
            value = formatNumberForDisplay(value);
          }
        } else {
          const variable = VAD_VARIABLES[vadName]?.[idx];
          if (variable && prevEntry == null) {
            value = variable.defaultValue;
          }
        }

        next[vadName][idx] = {
          value,
          uom: prevEntry?.uom ?? field.defaultUOM ?? "$",
        };
      });
    }
  });
  return next;
};

// Category badge colors
const CAT_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  "Direct Cost Reduction":    { bg: "#EBF5E1", text: "#2d6a10",  border: "#81b558" },
  "Revenue Protection":       { bg: "#FFF8E1", text: "#E65100",  border: "#fbbf24" },
  "Workforce Productivity":   { bg: "#E3F2FD", text: "#1565C0",  border: "#64b5f6" },
  "Compliance and Risk":      { bg: "#F3E5F5", text: "#6A1B9A",  border: "#ce93d8" },
  "Competitive Advantage":    { bg: "#E0F7FA", text: "#006064",  border: "#4dd0e1" },
  "Capital Efficiency":       { bg: "#FBE9E7", text: "#BF360C",  border: "#ef9a9a" },
  "Operational Efficiency":   { bg: "#E8EAF6", text: "#283593",  border: "#9fa8da" },
  "Sustainability":           { bg: "#E0F2F1", text: "#004D40",  border: "#4db6ac" },
};

export const InputsRenderer: React.FC<InputsRendererProps> = ({ vadNames, onInputsChange, initialInputs }) => {
  const initialSeed = useMemo(() => buildSeedInputs(vadNames, initialInputs), [vadNames, initialInputs]);
  const [inputs, setInputs] = useState<VADInputValue>(initialSeed);

  const propagatedRef = React.useRef(false);
  useEffect(() => {
    if (!propagatedRef.current) {
      propagatedRef.current = true;
      onInputsChange?.(initialSeed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = buildSeedInputs(vadNames, initialInputs ?? inputs);
    setInputs(next);
    onInputsChange?.(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vadNames]);

  const handleValueChange = (vadName: string, fieldIndex: number, value: string | number) => {
    setInputs((prev) => {
      const updated: VADInputValue = { ...prev };
      updated[vadName] = { ...(updated[vadName] ?? {}) };
      updated[vadName][fieldIndex] = { ...(updated[vadName][fieldIndex] ?? { value: "", uom: "$" }) };
      updated[vadName][fieldIndex].value = value;
      onInputsChange?.(updated);
      return updated;
    });
  };

  const handleUOMChange = (vadName: string, fieldIndex: number, uom: string) => {
    setInputs((prev) => {
      const updated: VADInputValue = { ...prev };
      updated[vadName] = { ...(updated[vadName] ?? {}) };
      updated[vadName][fieldIndex] = { ...(updated[vadName][fieldIndex] ?? { value: "", uom: "$" }) };
      updated[vadName][fieldIndex].uom = uom;
      onInputsChange?.(updated);
      return updated;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {vadNames.map((vadName, cardIdx) => {
        const config = VAD_INPUT_CONFIGS[vadName];
        if (!config) return null;

        const meta = VAD_METADATA[vadName];
        const catStyle = meta?.category
          ? (CAT_BADGE[meta.category] ?? { bg: "#f8fafc", text: "#334155", border: "#e2e8f0" })
          : { bg: "#f8fafc", text: "#334155", border: "#e2e8f0" };

        const customerFields = config.fields
          .map((field, actualIndex) => ({ field, actualIndex }))
          .filter(({ field }) => field.owner === "End Customer");

        return (
          <div
            key={vadName}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(148,163,184,0.16)",
              boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            {/* Card header */}
            <div
              style={{
                padding: "10px 16px",
                background: "linear-gradient(135deg, #f8fafc, #f0f7ea)",
                borderBottom: "1px solid rgba(85,136,59,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: "linear-gradient(135deg, #55883B, #3d6b27)",
                color: "#fff", fontWeight: 700, fontSize: 11,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 2px 5px rgba(85,136,59,0.3)",
              }}>
                {cardIdx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{vadName}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 3 }}>
                  {meta?.category && (
                    <span style={{
                      background: catStyle.bg, color: catStyle.text,
                      border: `1px solid ${catStyle.border}`,
                      borderRadius: 4, padding: "1px 7px", fontSize: 9, fontWeight: 700,
                    }}>
                      {meta.category}
                    </span>
                  )}
                  {meta?.weight && (
                    <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>
                      Weight: {meta.weight}
                    </span>
                  )}
                  {meta?.description && (
                    <span style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4 }}>
                      — {meta.description}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Input fields grid — max 2 per row, full-width inputs */}
            <div style={{
              padding: "14px 16px",
              display: "grid",
              gridTemplateColumns: customerFields.length === 1
                ? "1fr"
                : "repeat(2, 1fr)",
              gap: "12px 20px",
            }}>
              {customerFields.map(({ field, actualIndex }) => (
                <div key={`${vadName}-${actualIndex}`} style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{
                    display: "block", fontSize: 11, fontWeight: 700,
                    color: "#334155", marginBottom: 5, letterSpacing: "0.02em",
                  }}>
                    {field.label}
                  </label>
                  {field.description && (
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 6, lineHeight: 1.4 }}>
                      {field.description}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, flex: 1 }}>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={field.placeholder}
                      value={inputs[vadName]?.[actualIndex]?.value || ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const cleaned = raw.replace(/,/g, "");
                        if (cleaned === "") { handleValueChange(vadName, actualIndex, ""); return; }
                        const n = parseFloat(cleaned);
                        handleValueChange(vadName, actualIndex, isNaN(n) ? raw : formatNumberForDisplay(n));
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      style={{
                        flex: 1,
                        padding: "0.55rem 0.75rem",
                        borderRadius: 8,
                        border: "1.5px solid rgba(85,136,59,0.22)",
                        fontSize: 13,
                        fontFamily: "inherit",
                        background: "#fafffe",
                        color: "#0f172a",
                        minWidth: 0,
                        width: "100%",
                      }}
                    />
                    {field.options && (
                      <select
                        value={inputs[vadName]?.[actualIndex]?.uom || field.defaultUOM || "$"}
                        onChange={(e) => handleUOMChange(vadName, actualIndex, e.target.value)}
                        style={{
                          padding: "0.5rem 0.5rem",
                          borderRadius: 8,
                          border: "1.5px solid rgba(85,136,59,0.22)",
                          fontSize: 11,
                          fontFamily: "inherit",
                          background: "#f0f7ea",
                          color: "#334155",
                          flexShrink: 0,
                          minWidth: 55,
                          maxWidth: 80,
                          fontWeight: 600,
                        }}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
