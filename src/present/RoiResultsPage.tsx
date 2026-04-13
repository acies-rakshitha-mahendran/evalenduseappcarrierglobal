// src/present/RoiResultsPage.tsx
import React from "react";
import type { VADInputValue } from "../evalContext";
import type { SolutionsState } from "./SolutionsPage";

type Props = {
  results: Record<string, number> | null;
  layout: string | null;
  selectedVADs: string[];
  inputs: VADInputValue;
  solutionsState: SolutionsState;
};

const fmtCurrency = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const fmtRatio    = (n: number) => (isFinite(n) && n > 0 ? n.toFixed(2) + "x" : "—");
const fmtPercent  = (n: number) => (isFinite(n) ? (n * 100).toFixed(1) + "%" : "—");
const fmtMonths   = (n: number) => (isFinite(n) && n > 0 ? n.toFixed(1) + " mo" : "—");

// ---- KPI Card ----
const KPICard: React.FC<{ label: string; value: string; sub?: string; highlight?: boolean }> = ({
  label, value, sub, highlight,
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 160,
      padding: "18px 20px",
      background: highlight ? "#f0f9eb" : "#fff",
      border: "1px solid rgba(85,136,59,0.2)",
      borderRadius: 12,
      boxShadow: "0 2px 12px rgba(85,136,59,0.07)",
    }}
  >
    <div style={{ fontSize: 10, fontWeight: 700, color: "#55883B", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
      {label}
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#55883B", lineHeight: 1 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{sub}</div>}
  </div>
);

// ---- Summary Box ----
const SummaryBox: React.FC<{
  title: string;
  titleBg?: string;
  rows: { label: string; value: string; bold?: boolean; green?: boolean }[];
}> = ({ title, titleBg = "#55883B", rows }) => (
  <div style={{ flex: 1, minWidth: 260, border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
    <div style={{ padding: "8px 16px", background: titleBg, color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
      {title}
    </div>
    <div style={{ background: "#fff" }}>
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid #f0f4f0" : "none",
            background: row.bold ? "#f8fafc" : "#fff",
          }}
        >
          <span style={{ fontSize: 13, color: "#475569", fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
          <span style={{ fontSize: 13, fontWeight: row.bold ? 800 : 600, color: row.green ? "#55883B" : row.bold ? "#0f172a" : "#334155" }}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ---- Cash Flow Table ----
type CFRow = { year: number; cost: number; value: number; net: number; cumulative: number };
type CFTotalRow = { cost: number; value: number; net: number; cumulative: number };

const CashFlowTable: React.FC<{ rows: CFRow[]; totalRow: CFTotalRow }> = ({ rows, totalRow }) => {
  const hdrStyle: React.CSSProperties = {
    padding: "9px 12px",
    fontSize: 11,
    fontWeight: 700,
    color: "#55883B",
    background: "#f0f7ea",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    textAlign: "center",
    borderBottom: "2px solid rgba(85,136,59,0.15)",
    whiteSpace: "nowrap",
  };
  const lblStyle: React.CSSProperties = {
    padding: "9px 14px",
    fontSize: 12,
    fontWeight: 700,
    color: "#334155",
    background: "#fafafa",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
  };
  const cell = (value: number, isCumulative: boolean, isTotalCol: boolean): React.CSSProperties => ({
    padding: "9px 12px",
    fontSize: 12,
    fontWeight: isTotalCol ? 700 : 400,
    color: isCumulative ? (value >= 0 ? "#55883B" : "#dc2626") : (value > 0 ? "#55883B" : "#334155"),
    background: isTotalCol ? "#f0f7ea" : "#fff",
    textAlign: "right",
    borderBottom: "1px solid #f0f4f0",
  });

  const rowDefs: { label: string; key: keyof CFRow }[] = [
    { label: "Cost",         key: "cost"       },
    { label: "Value",        key: "value"      },
    { label: "Net Cash Flow",key: "net"        },
    { label: "Cumulative",   key: "cumulative" },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
        <thead>
          <tr>
            <th style={{ ...hdrStyle, textAlign: "left", width: 130 }}>&nbsp;</th>
            {rows.map((r) => <th key={r.year} style={hdrStyle}>Year {r.year}</th>)}
            <th style={{ ...hdrStyle, background: "#e8f0e3" }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {rowDefs.map(({ label, key }) => (
            <tr key={key}>
              <td style={lblStyle}>{label}</td>
              {rows.map((r) => {
                const v = r[key] as number;
                return <td key={r.year} style={cell(v, key === "cumulative", false)}>{fmtCurrency(Math.abs(v))}</td>;
              })}
              <td style={cell(totalRow[key as keyof CFTotalRow], key === "cumulative", true)}>
                {fmtCurrency(Math.abs(totalRow[key as keyof CFTotalRow]))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---- Main Component ----
export const RoiResultsPage: React.FC<Props> = ({
  results,
  layout: _layout,
  selectedVADs,
  inputs: _inputs,
  solutionsState,
}) => {
  const {
    fleetSize,
    agreementLength,
    hwAfterDiscount,
    swAnnualRecurring,
    ctAnnualRecurring,
    annualRecurring,
    totalCost5yr,
  } = solutionsState;

  const totalAnnualSavings   = results?.["Total Annual Value"] ?? 0;
  const savingsPerUnit       = fleetSize > 0 ? totalAnnualSavings / fleetSize : 0;
  const totalSavingsOverTerm = totalAnnualSavings * agreementLength;
  const netGain              = totalSavingsOverTerm - totalCost5yr;
  const vpRatioAnnual        = annualRecurring > 0 ? totalAnnualSavings / annualRecurring : 0;
  const vpRatioFullTerm      = totalCost5yr > 0 ? totalSavingsOverTerm / totalCost5yr : 0;
  const roiPercent           = totalCost5yr > 0 ? netGain / totalCost5yr : 0;
  const paybackMonths        = hwAfterDiscount > 0 && totalAnnualSavings > 0
    ? (hwAfterDiscount / totalAnnualSavings) * 12 : 0;

  const swAnnual = swAnnualRecurring;
  const ctAnnual = ctAnnualRecurring;
  const tcoSoftware = swAnnual * agreementLength;
  const tcoContracts = ctAnnual * agreementLength;
  const tcoTotal = hwAfterDiscount + tcoSoftware + tcoContracts;

  const tcoRows = [
    { label: "Hardware (One-Time)",            value: fmtCurrency(hwAfterDiscount) },
    { label: `Software (Annual × ${agreementLength} yr)`, value: fmtCurrency(tcoSoftware) },
    { label: `Maintenance Contract (Annual × ${agreementLength} yr)`, value: fmtCurrency(tcoContracts) },
    { label: "TOTAL COST",                     value: fmtCurrency(tcoTotal), bold: true },
  ];
  const totalAnnualRecurring = swAnnual + ctAnnual;

  const valueRows = [
    { label: "Annual Savings / Unit",   value: fmtCurrency(savingsPerUnit) },
    { label: "Annual Savings / Fleet",  value: fmtCurrency(totalAnnualSavings) },
    { label: "Total Savings Over Term", value: fmtCurrency(totalSavingsOverTerm) },
    { label: "NET GAIN",                value: fmtCurrency(netGain), bold: true, green: netGain >= 0 },
  ];

  // Cash flow
  const cfRows: CFRow[] = [];
  cfRows.push({ year: 0, cost: hwAfterDiscount, value: 0, net: -hwAfterDiscount, cumulative: -hwAfterDiscount });
  let cumulative = -hwAfterDiscount;
  for (let yr = 1; yr <= agreementLength; yr++) {
    const net = totalAnnualSavings - totalAnnualRecurring;
    cumulative += net;
    cfRows.push({ year: yr, cost: totalAnnualRecurring, value: totalAnnualSavings, net, cumulative });
  }
  const cfTotalRow: CFTotalRow = {
    cost: hwAfterDiscount + totalAnnualRecurring * agreementLength,
    value: totalSavingsOverTerm,
    net: netGain,
    cumulative,
  };

  return (
    <div className="present-body" style={{ padding: "1.5rem", flex: 1, minHeight: 0, overflowY: "visible" }}>
      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          ROI and Financial Summary
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          {agreementLength}-year agreement · fleet of {fleetSize} units · all values reflect fleet-level totals with applied discounts.
        </p>
      </div>

      {/* Row 1: KPI Cards */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <KPICard label="Value-to-Price (Annual)"          value={fmtRatio(vpRatioAnnual)}   sub="You pay $1, you get $X in savings" />
        <KPICard label={`Full-Term V/P (${agreementLength} yr)`} value={fmtRatio(vpRatioFullTerm)} sub="Total savings / total cost over agreement" />
        <KPICard label="ROI"                              value={fmtPercent(roiPercent)}    sub="Net gain as % of total cost" />
        <KPICard label="Payback Period"                   value={fmtMonths(paybackMonths)}  sub="HW recovered through savings" />
      </div>

      {/* Row 2: TCO + Value boxes */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <SummaryBox title="Total Cost of Ownership" rows={tcoRows} />
        <SummaryBox title="Value Over Agreement Life" titleBg="#55883B" rows={valueRows} />
      </div>

      {/* Row 3: Cash Flow Table */}
      <div style={{ border: "1px solid rgba(85,136,59,0.15)", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "8px 16px", background: "#55883B", color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Year-by-Year Cash Flow
        </div>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <CashFlowTable rows={cfRows} totalRow={cfTotalRow} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 14, display: "flex", gap: 18, fontSize: 11, color: "#94a3b8", flexWrap: "wrap" }}>
        <span><span style={{ color: "#55883B", fontWeight: 700 }}>Green</span> = positive cash flow or net gain</span>
        <span><span style={{ color: "#dc2626", fontWeight: 700 }}>Red</span> = negative (pre-payback period)</span>
        <span>Year 0 = HW investment · Years 1–{agreementLength} = annual recurring costs vs. savings</span>
      </div>

      {totalAnnualSavings === 0 && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef3c7", borderRadius: 8, fontSize: 13, color: "#92400e" }}>
          No VAD savings calculated yet. Go to Value Drivers and enter customer inputs, then click Calculate.
        </div>
      )}
    </div>
  );
};
