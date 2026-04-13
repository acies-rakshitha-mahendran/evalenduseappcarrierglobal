// src/present/PricingPage.tsx
import React from "react";
import { COMPONENTS } from "../coldChainData";

export type PricingRow = {
  id: string;
  selected: boolean;
  componentId: string;
  name: string;
  category: "HW" | "SW" | "CT";
  pricingType: "One-Time" | "Annual";
  upgradeType: string;
  spec: string;
  unitPrice: number;
  quantity: number;
  discount: number; // 0, 5, 10, 15, or 20
};

type CategoryTag = "ALL" | "HW" | "SW" | "CT";

const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20];
const PLACEHOLDER_COUNT = 5;

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

function catTag(cat: string): "HW" | "SW" | "CT" {
  if (cat === "Hardware") return "HW";
  if (cat === "Software") return "SW";
  return "CT";
}

const CAT_COLORS: Record<string, string> = {
  HW: "#607D3B",
  SW: "rgb(173, 203, 137)",
  CT: "rgb(111 161 130)",
};

const getDefaultQuantity = (comp: (typeof COMPONENTS)[0], fleetSize: number, agreementLength: number) =>
  comp.pricingType === "Annual" ? agreementLength : fleetSize;

type Props = {
  rows: PricingRow[];
  setRows: React.Dispatch<React.SetStateAction<PricingRow[]>>;
  fleetSize: number;
  setFleetSize: (n: number) => void;
  agreementLength: number;
  setAgreementLength: (n: number) => void;
};

export const PricingPage: React.FC<Props> = ({
  rows,
  setRows,
  fleetSize,
  setFleetSize,
  agreementLength,
  setAgreementLength,
}) => {
  const [activeCategory, setActiveCategory] = React.useState<CategoryTag>("ALL");
  const [searchText, setSearchText] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const filteredComponents = COMPONENTS.filter((comp) => {
    const isAdded = rows.some((r) => r.componentId === comp.id);
    const tag = catTag(comp.category);
    const matchesCat = activeCategory === "ALL" || tag === activeCategory;
    const matchesText =
      comp.name.toLowerCase().includes(searchText.toLowerCase()) ||
      comp.id.toLowerCase().includes(searchText.toLowerCase());
    return !isAdded && matchesCat && matchesText;
  });

  const displayRows = rows.filter((row) =>
    activeCategory === "ALL" ? true : row.category === activeCategory
  );

  const total = displayRows.reduce(
    (sum, r) => sum + r.unitPrice * r.quantity * (1 - r.discount / 100),
    0
  );

  const placeholderCount = Math.max(0, PLACEHOLDER_COUNT - displayRows.length);

  const showDropdown = isSearchOpen && filteredComponents.length > 0;

  const addRow = (comp: (typeof COMPONENTS)[0]) => {
    const defaultSpec = comp.options[0];
    const newRow: PricingRow = {
      id: `row-${Date.now()}-${Math.random()}`,
      selected: false,
      componentId: comp.id,
      name: comp.name,
      category: catTag(comp.category),
      pricingType: comp.pricingType,
      upgradeType: comp.upgradeType === "Replacement" ? "Repl" : "New",
      spec: defaultSpec.value,
      unitPrice: defaultSpec.price,
      quantity: getDefaultQuantity(comp, fleetSize, agreementLength),
      discount: 0,
    };
    setRows((prev) => [...prev, newRow]);
    setSearchText("");
    setIsSearchOpen(false);
  };

  const updateRow = (id: string, field: keyof PricingRow, value: PricingRow[keyof PricingRow]) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === "spec") {
          const comp = COMPONENTS.find((c) => c.id === r.componentId);
          const opt = comp?.options.find((o) => o.value === (value as string));
          return { ...r, spec: value as string, unitPrice: opt?.price ?? r.unitPrice };
        }
        return { ...r, [field]: value };
      })
    );
  };

  const toggleRowSelected = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  const allSelected = displayRows.length > 0 && displayRows.every((r) => r.selected);
  const anySelected = displayRows.some((r) => r.selected);

  const toggleSelectAll = () => {
    setRows((prev) =>
      prev.map((r) =>
        displayRows.some((visibleRow) => visibleRow.id === r.id)
          ? { ...r, selected: !allSelected }
          : r
      )
    );
  };

  const deleteSelected = () => {
    setRows((prev) => prev.filter((r) => !r.selected));
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "0.85rem 0.75rem",
    color: "#475569",
    fontWeight: 700,
    fontSize: 12,
    borderBottom: "2px solid rgba(148, 163, 184, 0.45)",
    background: "rgba(248, 250, 252, 0.9)",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.75rem 0.75rem",
    borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
    color: "#0f172a",
    verticalAlign: "middle",
    fontSize: 13,
  };

  return (
    <div className="present-body" style={{ overflowY: "auto" }}>
      <div
        className="glass-card"
        style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* ── Common Inputs ─────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            padding: "14px 18px",
            background: "#fffff",
            borderRadius: 8,
            border: "1px solid rgba(85, 136, 59, 0.25)",
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Fleet Size (No. of Trucks)
            </label>
            <input
              type="number"
              min={1}
              max={9999}
              value={fleetSize}
              onChange={(e) => {
                const n = Math.max(1, parseInt(e.target.value) || 1);
                setFleetSize(n);
              }}
              style={{
                width: 135,
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                border: "1px solid rgba(148, 163, 184, 0.5)",
                fontSize: 15,
                fontWeight: 700,
                background: "#fff",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Agreement Length
            </label>
            <select
              value={agreementLength}
              onChange={(e) => setAgreementLength(parseInt(e.target.value))}
              style={{
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                border: "1px solid rgba(148, 163, 184, 0.5)",
                fontSize: 15,
                fontWeight: 700,
                background: "#fff",
                minWidth: 130,
              }}
            >
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  {y} {y === 1 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: 12, color: "#55883B", fontWeight: 600, paddingBottom: 8 }}>
            These values are used across ROI calculations
          </div>
        </div>

        {/* ── Toolbar ───────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* Search */}
          <div style={{ flex: "1 1 280px", minWidth: 240, maxWidth: 420 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#334155",
                display: "block",
                marginBottom: 4,
              }}
            >
              Add Component
            </label>
            <div
              style={{ position: "relative" }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={(e) => {
                const related = e.relatedTarget as Node | null;
                if (!related || !e.currentTarget.contains(related)) {
                  setIsSearchOpen(false);
                }
              }}
            >
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={() => setIsSearchOpen(true)}
                placeholder="Search and add components..."
                style={{
                  width: "100%",
                  padding: "0.7rem 0.9rem",
                  borderRadius: 12,
                  border: "1px solid rgba(148, 163, 184, 0.6)",
                  background: "#fff",
                  color: "#0f172a",
                  fontSize: 14,
                  boxSizing: "border-box",
                }}
              />
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    borderRadius: 14,
                    border: "1px solid rgba(148, 163, 184, 0.4)",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                    padding: "0.4rem",
                    maxHeight: 320,
                    overflowY: "auto",
                    zIndex: 50,
                  }}
                >
                  {filteredComponents.map((comp) => {
                    const tag = catTag(comp.category);
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addRow(comp);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          border: "none",
                          background: "transparent",
                          padding: "0.65rem 0.9rem",
                          borderRadius: 10,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 2,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f1f5f9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span
                          style={{
                            background: CAT_COLORS[tag],
                            color: "#fff",
                            borderRadius: 4,
                            padding: "2px 7px",
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {tag}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}
                          >
                            {comp.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>
                            {comp.upgradeType} · {comp.options[0].value} — from{" "}
                            {formatCurrency(comp.options[0].price)}
                            {comp.pricingType === "Annual" ? "/yr" : ""}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 20,
                            color: "#55883B",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          +
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Category filters + Delete */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {(["ALL", "HW", "SW", "CT"] as CategoryTag[]).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveCategory(tag)}
                style={{
                  borderRadius: 999,
                  border:
                    activeCategory === tag
                      ? "1px solid #55883B"
                      : "1px solid rgba(148, 163, 184, 0.5)",
                  background: activeCategory === tag ? "#55883B" : "#fff",
                  color: activeCategory === tag ? "#fff" : "#0f172a",
                  padding: "0.55rem 0.85rem",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {{ ALL: "All", HW: "Hardware", SW: "Software", CT: "Contract" }[tag]}
              </button>
            ))}
            <button
              type="button"
              onClick={deleteSelected}
              disabled={!anySelected}
              style={{
                borderRadius: 8,
                border: "1px solid rgba(148, 163, 184, 0.5)",
                background: anySelected ? "#dc2626" : "#f8fafc",
                color: anySelected ? "#fff" : "#94a3b8",
                padding: "0.55rem 0.85rem",
                cursor: anySelected ? "pointer" : "not-allowed",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────── */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}>
            <colgroup>
              <col style={{ width: 36 }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: 56 }} />
              <col style={{ width: 60 }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: 110 }} />
              <col style={{ width: 72 }} />
              <col style={{ width: 80 }} />
              <col style={{ width: 110 }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ ...thStyle, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    disabled={rows.length === 0}
                    style={{ width: 14, height: 14 }}
                  />
                </th>
                {["Component", "Cat", "Type", "Spec Level", "Unit Price", "Qty", "Disc %", "Amount"].map(
                  (h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => {
                const comp = COMPONENTS.find((c) => c.id === row.componentId);
                const specOptions = comp?.options ?? [];
                const amount = row.unitPrice * row.quantity * (1 - row.discount / 100);

                return (
                  <tr
                    key={row.id}
                    style={{
                      background: row.selected ? "rgba(85, 136, 59, 0.06)" : "#fff",
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => toggleRowSelected(row.id)}
                        style={{ width: 14, height: 14 }}
                      />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{row.name}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: CAT_COLORS[row.category],
                          color: "#fff",
                          borderRadius: 4,
                          padding: "2px 7px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {row.category}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: "#64748b" }}>{row.upgradeType}</td>
                    <td style={tdStyle}>
                      <select
                        value={row.spec}
                        onChange={(e) => updateRow(row.id, "spec", e.target.value)}
                        style={{
                          border: "1px solid rgba(148, 163, 184, 0.5)",
                          borderRadius: 6,
                          padding: "4px 8px",
                          fontSize: 12,
                          background: "#f8fafc",
                          cursor: "pointer",
                          minWidth: 170,
                        }}
                      >
                        {specOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.value} — {formatCurrency(opt.price)}
                            {row.pricingType === "Annual" ? "/yr" : ""}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ ...tdStyle, color: "#334155", fontWeight: 600 }}>
                      {formatCurrency(row.unitPrice)}
                      {row.pricingType === "Annual" && (
                        <span style={{ fontSize: 10, color: "#94a3b8", marginLeft: 3 }}>
                          /yr/truck
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        min={1}
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                        }
                        style={{
                          width: 60,
                          border: "1px solid rgba(148, 163, 184, 0.4)",
                          borderRadius: 6,
                          padding: "4px 6px",
                          fontSize: 12,
                          textAlign: "right",
                          background: "#fff",
                        }}
                      />
                    </td>
                    <td style={tdStyle}>
                      <select
                        value={row.discount}
                        onChange={(e) =>
                          updateRow(row.id, "discount", parseInt(e.target.value))
                        }
                        style={{
                          border: "1px solid rgba(148, 163, 184, 0.5)",
                          borderRadius: 6,
                          padding: "4px 8px",
                          fontSize: 12,
                          background: "#f8fafc",
                        }}
                      >
                        {DISCOUNT_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}%
                          </option>
                        ))}
                      </select>
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 700,
                        color: "#0f172a",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                );
              })}

              {/* Placeholder rows */}
              {Array.from({ length: placeholderCount }).map((_, i) => (
                <tr key={`ph-${i}`} style={{ opacity: 0.28 }}>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <input type="checkbox" disabled style={{ width: 14, height: 14 }} />
                  </td>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td
                      key={j}
                      style={{ ...tdStyle, color: "#94a3b8", fontStyle: "italic" }}
                    >
                      —
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: "#f8fafc" }}>
                <td
                  colSpan={8}
                  style={{
                    padding: "0.9rem 0.75rem",
                    textAlign: "right",
                    color: "#334155",
                    fontWeight: 700,
                    fontSize: 13,
                    borderTop: "2px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    padding: "0.9rem 0.75rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    fontSize: 14,
                    textAlign: "right",
                    borderTop: "2px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {rows.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "0.5rem 1rem",
              fontSize: 13,
              color: "#94a3b8",
            }}
          >
            Search and add components above to build your solution
          </div>
        ) : displayRows.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "0.5rem 1rem",
              fontSize: 13,
              color: "#94a3b8",
            }}
          >
            No components match the selected category and search filter.
          </div>
        ) : null}
      </div>
    </div>
  );
};
