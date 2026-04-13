import React from "react";
import { InputsRenderer } from "./InputsRenderer";
import type { VADInputValue } from "../evalContext";

type Props = {
  vadNames: string[];
  onCalculate: () => void;
  onInputsChange?: (inputs: VADInputValue) => void;
  initialInputs?: VADInputValue;
  fleetSize?: number;
};

export const InputPage: React.FC<Props> = ({
  vadNames = [],
  onCalculate,
  onInputsChange,
  initialInputs,
  fleetSize: _fleetSize,
}) => {
  return (
    <div
      className="present-body"
      style={{ padding: "1.25rem 1.5rem" }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
          Value Driver Inputs
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          Enter the customer-specific data for each selected value accrual driver. All calculations update automatically.
        </p>
      </div>

      {/* Info banner */}
      {vadNames.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            background: "linear-gradient(135deg, #f0f9eb, #eaf4e2)",
            borderRadius: 10,
            border: "1px solid rgba(85,136,59,0.2)",
            marginBottom: 20,
            fontSize: 12,
            color: "#334155",
          }}
        >
          <span style={{ fontSize: 16 }}>📊</span>
          <span>
            <strong style={{ color: "#55883B" }}>{vadNames.length} value drivers</strong> selected.
            Fill in the fields below, then click <strong>Calculate</strong> to see your ROI results.
          </span>
        </div>
      )}

      {vadNames && vadNames.length > 0 ? (
        <InputsRenderer
          vadNames={vadNames}
          onInputsChange={onInputsChange}
          initialInputs={initialInputs}
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#f8fafc",
            borderRadius: 14,
            border: "2px dashed rgba(148,163,184,0.3)",
            color: "#94a3b8",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No Value Drivers Selected</div>
          <div style={{ fontSize: 13 }}>
            Go to the Build tab → Inputs page and drag VADs onto the canvas, then publish.
          </div>
        </div>
      )}

      {/* Calculate button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <button
          onClick={onCalculate}
          style={{
            padding: "0.65rem 2rem",
            borderRadius: 999,
            border: "none",
            background: "linear-gradient(135deg, #55883B, #3d6b27)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(85,136,59,0.4)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(85,136,59,0.55)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 15px rgba(85,136,59,0.4)")}
        >
          Calculate →
        </button>
      </div>
    </div>
  );
};
