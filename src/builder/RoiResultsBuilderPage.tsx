// src/builder/RoiResultsBuilderPage.tsx
import React from "react";
import type { CraftLayout } from "../types";

type Props = {
  data: CraftLayout;
  onChange: (data: CraftLayout) => void;
  selectedVADs?: string[];
  zoom?: number;
  viewportWidth?: string;
};

// ---- Placeholder KPI Card ----
const KPICard: React.FC<{ label: string; sub?: string; highlight?: boolean }> = ({
  label,
  sub,
  highlight,
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 150,
      padding: "16px 18px",
      background: highlight ? "#EBF5FB" : "#fff",
      border: "1px solid #e0e4e8",
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#55883B",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: "#d1d5db", lineHeight: 1 }}>
      —
    </div>
    {sub && <div style={{ fontSize: 11, color: "#bbb", marginTop: 6 }}>{sub}</div>}
  </div>
);

// ---- Placeholder Summary Box ----
const SummaryBox: React.FC<{
  title: string;
  rows: { label: string; bold?: boolean }[];
}> = ({ title, rows }) => (
  <div
    style={{
      flex: 1,
      minWidth: 240,
      border: "1px solid #e0e4e8",
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div
      style={{
        padding: "7px 14px",
        background: "#55883B",
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {title}
    </div>
    <div style={{ background: "#fff" }}>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "9px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid #f0f0f0" : "none",
            background: row.bold ? "#f0f0f0" : "#fff",
          }}
        >
          <span
            style={{ fontSize: 13, color: "#333", fontWeight: row.bold ? 700 : 400 }}
          >
            {row.label}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: row.bold ? 700 : 600,
              color: "#d1d5db",
            }}
          >
            —
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const RoiResultsBuilderPage: React.FC<Props> = ({ zoom = 100 }) => {
  const scale = zoom / 100;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
      }}
    >
      {/* Sub-header */}
      <div
        style={{
          padding: "0.5rem 0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          borderBottom: "1px solid rgba(148,163,184,0.2)",
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.8 }}>ROI/TCO — layout preview</div>
        <div style={{ fontSize: 12, opacity: 0.6, maxWidth: 400, textAlign: "right" }}>
          Values populate automatically from components selected in Pricing and VAD
          inputs in present mode.
        </div>
      </div>

      {/* Preview area */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: scale !== 1 ? `${100 / scale}%` : "100%",
            padding: "1.5rem",
          }}
        >
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: 18,
                fontWeight: 700,
                color: "#55883B",
              }}
            >
              ROI/TCO and Financial Summary
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
              N-year agreement — all values calculated from pricing and VAD inputs.
            </p>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
            <KPICard
              label="Value-to-Price Ratio (Annual)"
              sub="Annual savings vs. annual recurring cost"
            />
            <KPICard
              label="Full-Term V/P Ratio"
              sub="Total savings vs. total cost of ownership"
            />
            <KPICard label="ROI" sub="Net gain as % of total cost" />
            <KPICard label="Payback Period" sub="Hardware investment payback" />
          </div>

          {/* TCO + Value boxes */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <SummaryBox
              title="Total Cost of Ownership"
              rows={[
                { label: "Hardware (One-Time)" },
                { label: "Software (Annual × N yr)" },
                { label: "Contracts (Annual × N yr)" },
                { label: "TOTAL COST", bold: true },
              ]}
            />
            <SummaryBox
              title="Value Over N-Year Agreement"
              rows={[
                { label: "Annual Savings / Truck" },
                { label: "Annual Savings / Fleet" },
                { label: "Total Savings (N yr)" },
                { label: "NET GAIN", bold: true },
              ]}
            />
          </div>

          {/* Cash Flow Table placeholder */}
          <div
            style={{
              border: "1px solid #e0e4e8",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                padding: "7px 14px",
                background: "#55883B",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Year-by-Year Cash Flow
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}
              >
                <thead>
                  <tr>
                    {["", "Year 0", "Year 1", "Year 2", "Year 3", "TOTAL"].map(
                      (h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "8px 12px",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#55883B",
                            background: i === 5 ? "#e8ecf0" : "#f0f0f0",
                            textTransform: "uppercase",
                            textAlign: i === 0 ? "left" : "center",
                            borderBottom: "1px solid #d0d7de",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {["Cost", "Value", "Net Cash Flow", "Cumulative"].map(
                    (label, ri) => (
                      <tr key={ri}>
                        <td
                          style={{
                            padding: "9px 12px",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#55883B",
                            background: "#f8f9fa",
                            borderBottom: "1px solid #e8ecf0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {label}
                        </td>
                        {[0, 1, 2, 3, 4].map((ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: "9px 12px",
                              fontSize: 12,
                              color: "#d1d5db",
                              background: ci === 4 ? "#f0f0f0" : "#fff",
                              textAlign: "right",
                              borderBottom: "1px solid #e8ecf0",
                            }}
                          >
                            —
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 18,
              fontSize: 11,
              color: "#aaa",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#55883B", fontWeight: 600 }}>Green</span> = positive
            cash flow
            <span style={{ color: "#E74C3C", fontWeight: 600 }}>Red</span> = negative
            (pre-payback)
            <span>
              Values populate automatically from pricing and VAD inputs in present mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
