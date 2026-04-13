import React from "react";
import { useNode, useEditor } from "@craftjs/core";
import { VAD_METADATA } from "../../vadMetadata";
import { ResultsContext } from "../../resultsContext";
import { EvalContext } from "../../evalContext";
import { VAD_INPUT_CONFIGS } from "../../vadInputs";
import { VAD_VARIABLES } from "../../vadVariables";
import heroImage from "../../assets/pic.png";

type BaseProps = {
  children?: React.ReactNode;
};

export const Container: React.FC<
  BaseProps & {
    padding?: number;
    align?: "left" | "center" | "right";
    backgroundColor?: string;
    borderRadius?: number;
    minHeight?: number;
    width?: number;
    height?: number;
  }
> = ({
  children,
  padding = 24,
  align = "left",
  backgroundColor,
  borderRadius = 20,
  minHeight = 400,
  width,
  height,
}) => {
  const { connectors } = useNode();
  
  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        padding,
        borderRadius,
        border: "1px solid rgba(85,136,59,0.3)",
        background: backgroundColor ?? "transparent",
        boxShadow: "0 16px 45px rgba(0,0,0,0.1)",
        textAlign: (align as "left" | "center" | "right" | "justify" | "initial"),
        minHeight,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Container as any).craft = {
  displayName: "Container",
  props: { padding: 24, align: "left", borderRadius: 20, minHeight: 400 },
};

export const TitleBlock: React.FC<{
  text?: string;
  align?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
}> = ({
  text = "Enter title",
  align = "left",
  fontSize = 32,
  color = "#000000",
  backgroundColor,
  width,
  height,
}) => {
  const { connectors } = useNode();
  const textAlign: "left" | "center" | "right" =
    align === "center" || align === "right" ? (align as "center" | "right") : "left";

  return (
    <h1
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        margin: 0,
        marginBottom: 12,
        fontSize,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        backgroundColor,
        textAlign,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        cursor: "pointer",
      }}
    >
      {text}
    </h1>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(TitleBlock as any).craft = {
  displayName: "Title",
  props: { text: "Enter title", align: "left", fontSize: 32, color: "#000000" },
  related: {},
};

export const SubtitleBlock: React.FC<{ text?: string; fontSize?: number; color?: string; backgroundColor?: string }> = ({
  text = "Enter subtitle",
  fontSize = 14,
  color = "#000000",
  backgroundColor,
}) => {
  const { connectors } = useNode();
  
  return (
    <p
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        margin: 0,
        marginBottom: 18,
        fontSize,
        color,
        backgroundColor,
        whiteSpace: "pre-wrap",
        lineHeight: 1.6,
        cursor: "pointer",
      }}
    >
      {text}
    </p>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SubtitleBlock as any).craft = {
  displayName: "Subtitle",
  props: { text: "Enter subtitle", fontSize: 14, color: "#000000" },
};

export const ButtonBlock: React.FC<{ label?: string; fontSize?: number; color?: string; backgroundColor?: string; padding?: number; borderRadius?: number }> = ({
  label = "Enter button label",
  fontSize = 14,
  color = "#ffffff",
  backgroundColor = "#55883B",
  padding = 10,
  borderRadius = 8,
}) => {
  const { connectors } = useNode();
  
  return (
    <button 
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        padding,
        borderRadius,
        border: "none",
        backgroundColor,
        color,
        fontSize,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        width: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {label}
    </button>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ButtonBlock as any).craft = {
  displayName: "Button",
  props: { label: "Enter button label", fontSize: 14, color: "#ffffff", backgroundColor: "#55883B", padding: 10 },
};

export const LogoBlock: React.FC<{ text?: string; fontSize?: number; color?: string; backgroundColor?: string; width?: number; height?: number }> = ({ 
  text = "Enter logo text",
  fontSize = 13,
  color = "#000000",
  backgroundColor,
  width,
  height,
}) => {
  const { connectors } = useNode();
  
  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(85,136,59,0.7)",
        background: backgroundColor || "radial-gradient(circle at top left, rgba(85,136,59,0.1), rgba(85,136,59,0.05))",
        fontSize,
        color,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          background:
            "radial-gradient(circle at top left, #55883B, #3d6029 65%)",
          boxShadow: "0 8px 18px rgba(85,136,59,0.6)",
        }}
      />
      <span>{text}</span>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(LogoBlock as any).craft = {
  displayName: "Logo",
  props: { text: "Enter logo text", fontSize: 13, color: "#000000" },
};

export const IconBadge: React.FC<{ label?: string }> = ({ label = "Icon label" }) => {
  const { connectors } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        background: "rgba(15,23,42,0.04)",
        border: "1px solid rgba(148,163,184,0.6)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "999px",
          background:
            "radial-gradient(circle at 30% 0, #4ade80, #15803d 70%)",
          boxShadow: "0 6px 14px rgba(22,163,74,0.55)",
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(IconBadge as any).craft = {
  displayName: "IconBadge",
  props: { label: "Icon label" },
};

export const ImageBlock: React.FC<{ src?: string; alt?: string; width?: number; height?: number }> = ({
  src = "https://via.placeholder.com/400x200/1e3a8a/e5e7eb?text=Image",
  alt = "Placeholder",
  width,
  height,
}) => {
  const { connectors } = useNode();
  
  return (
    <img
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      src={src}
      alt={alt}
      style={{
        maxWidth: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "auto",
        maxHeight: 420,
        objectFit: "cover",
        borderRadius: 12,
        border: "1px solid rgba(148,163,184,0.5)",
        cursor: "pointer",
      }}
    />
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ImageBlock as any).craft = {
  displayName: "Image",
  props: {
    src: "https://via.placeholder.com/400x200/1e3a8a/e5e7eb?text=Image",
    alt: "Placeholder",
  },
};

export const StatsCard: React.FC<{
  title?: string;
  value?: string;
  description?: string;
}> = ({ title = "Metric", value = "123", description = "Short description" }) => {
  const { connectors } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      className="glass-card"
      style={{
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7 }}>
        {title}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{description}</div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(StatsCard as any).craft = {
  displayName: "StatsCard",
  props: { title: "Metric", value: "123", description: "Short description" },
};

export const PricingTable: React.FC = () => {
  const { connectors } = useNode();

  const rows = [
    { name: "TRU", category: "Hardware", type: "Repl", spec: "Standard", unitPrice: "$18,000", quantity: "1", discount: "0%", amount: "$18,000" },
    { name: "Insulation", category: "Hardware", type: "Repl", spec: "75mm", unitPrice: "$7,800", quantity: "1", discount: "0%", amount: "$7,800" },
    { name: "IoT Sensors", category: "Hardware", type: "New", spec: "Advanced", unitPrice: "$2,800", quantity: "1", discount: "0%", amount: "$2,800" },
  ];

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "100%",
        padding: 24,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#334155" }}>
            Select Components:
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 220,
              padding: "0.8rem 1rem",
              borderRadius: 12,
              border: "1px solid rgba(148, 163, 184, 0.4)",
              background: "#ffffff",
              color: "#0f172a",
              fontSize: 13,
            }}
          >
            Select Components...
          </div>
        </div>
        <button
          type="button"
          style={{
            borderRadius: 999,
            padding: "0.85rem 1.2rem",
            border: "none",
            background: "#55883B",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(85, 136, 59, 0.16)",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          Add to Table
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 920, borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {[
                "Component Name",
                "Category",
                "Upg Type",
                "Spec",
                "Unit Price ($)",
                "Quantity",
                "Discount",
                "Amount",
              ].map((text) => (
                <th
                  key={text}
                  style={{
                    textAlign: "left",
                    padding: "0.9rem 0.75rem",
                    color: "#475569",
                    fontWeight: 700,
                    borderBottom: "1px solid rgba(148, 163, 184, 0.45)",
                    background: "rgba(248, 250, 252, 0.85)",
                  }}
                >
                  {text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                {[row.name, row.category, row.type, row.spec, row.unitPrice, row.quantity, row.discount, row.amount].map((value, index) => (
                  <td
                    key={`${row.name}-${index}`}
                    style={{
                      padding: "0.9rem 0.75rem",
                      borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
                      color: index === 7 ? "#0f172a" : "#475569",
                      fontWeight: index === 7 ? 700 : 500,
                    }}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} style={{ padding: "0.95rem 0.75rem", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>
                Total:
              </td>
              <td style={{ padding: "0.95rem 0.75rem", fontWeight: 700, color: "#0f172a" }}>$28,600</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(PricingTable as any).craft = {
  displayName: "PricingTable",
  props: {},
};

export const GridBlock: React.FC<BaseProps & { columns?: number }> = ({
  children,
  columns = 2,
}) => {
  const { connectors } = useNode();
  
  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 12,
        padding: 12,
        borderRadius: 12,
        border: "1px dashed rgba(148,163,184,0.5)",
        minHeight: 100,
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(GridBlock as any).craft = {
  displayName: "Grid",
  props: { columns: 2 },
};

export const FlexBlock: React.FC<
  BaseProps & { direction?: "row" | "column"; gap?: number; width?: number; height?: number }
> = ({ children, direction = "row", gap = 12, width, height }) => {
  const { connectors } = useNode();
  
  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        display: "flex",
        flexDirection: direction,
        gap,
        padding: 12,
        borderRadius: 12,
        border: "1px dashed rgba(148,163,184,0.5)",
        minHeight: 100,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(FlexBlock as any).craft = {
  displayName: "Flex",
  props: { direction: "row", gap: 12 },
};

export const HeroSection: React.FC<{
  headline?: string;
  subheadline?: string;
  buttonLabel?: string;
  imageUrl?: string;
}> = ({
  headline = "Modern Sustainable Packaging",
  subheadline = "Design a story-driven hero section that highlights your value proposition.",
  buttonLabel = "Learn More",
  imageUrl = heroImage
}) => {
  const { connectors } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
        gap: 24,
        alignItems: "stretch",
        padding: 24,
        borderRadius: 24,
        border: "1px solid rgba(148,163,184,0.4)",
        background:
          "radial-gradient(circle at 0 0, rgba(34,197,94,0.12), transparent 60%), radial-gradient(circle at 100% 0, rgba(56,189,248,0.16), transparent 60%), rgba(255,255,255,0.96)",
        minHeight: 580,
        maxHeight: 640,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 16,
          minHeight: "100%",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            marginBottom: 8,
            color: "#16a34a",
          }}
        >
          Carrier Global
        </div>
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.1,
            fontWeight: 700,
            marginBottom: 10,
            color: "#0f172a",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "#334155",
            marginBottom: 16,
          }}
        >
          {subheadline}
        </div>
        <button
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            border: "none",
            background: "#55883B",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            alignSelf: "start",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {buttonLabel}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
        }}
      >
        <img
          src={imageUrl}
          alt="Hero visual"
          style={{
            width: "100%",
            maxWidth: 560,
            maxHeight: 520,
            objectFit: "cover",
            borderRadius: 20,
            border: "1px solid rgba(148,163,184,0.45)",
            boxShadow: "0 18px 50px rgba(15,23,42,0.4)",
          }}
        />
      </div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HeroSection as any).craft = {
  displayName: "HeroSection",
  props: {
    headline: "Leading the future of intelligent climate and energy solutions.",
    subheadline: "Delivering sustainable HVAC, refrigeration, and building solutions that power smarter, more efficient environments across the world.",
    buttonLabel: "EXPLORE SOLUTIONS",
  },
};

export const VADBlock: React.FC<{ title?: string; vadId?: string; backgroundColor?: string; color?: string }> = ({
  title = "Enter VAD name",
  vadId = "",
  backgroundColor,
  color,
}) => {
  // we need access to the node id so we can ask the editor to delete it
  const { connectors, id } = useNode((node) => ({ id: node.id }));
  const { actions } = useEditor();
  const description = title ? VAD_METADATA[title]?.description : undefined;

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    actions.delete(id);
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      className="glass-card"
      style={{
        position: "relative",
        marginBottom: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 12px",
        background: backgroundColor || "rgba(85, 136, 59, 0.2)",
        border: `1px solid ${color || "#55883B"}`,
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      {/* remove button */}
      <button
        onClick={handleRemove}
        style={{
          position: "absolute",
          top: 2,
          right: 4,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          lineHeight: 1,
          opacity: 0.6,
        }}
        title="Remove VAD"
      >
        ×
      </button>

      <div style={{ fontSize: 12, fontWeight: 600, color: color || "#55883B", wordBreak: "break-word" }}>{title}</div>
      {description && (
        <div style={{ fontSize: 10, color: "#4b5563", opacity: 0.85 }}>
          {description}
        </div>
      )}
      {vadId ? (
        <div style={{ fontSize: 10, color: color || "#55883B", opacity: 0.7 }}>
          {`VAD ID: ${vadId}`}
        </div>
      ) : null}
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(VADBlock as any).craft = {
  displayName: "VADBlock",
  props: { title: "Enter VAD name", vadId: "", backgroundColor: "rgba(85, 136, 59, 0.2)", color: "#55883B" },
};

export const ResultCard: React.FC<{ label?: string; value?: string; resultKey?: string }> = ({
  label = "Enter metric label",
  value = "Enter value",
  resultKey,
}) => {
  const { connectors } = useNode();
  const results = React.useContext(ResultsContext);
  const rawKey = (resultKey || label || "").trim();
  const RESULT_KEY_ALIASES: Record<string, string> = {
    "Annual Value": "Total Annual Value",
    "Annual Investments": "Total Investments",
    "Net Benefit": "Net Benefit (Year 1)",
    "Annual ROI": "ROI",
  };
  const DISPLAY_LABELS: Record<string, string> = {
    "Total Annual Value": "Annual Value",
    "Total Investments": "Annual Investments",
    "Net Benefit (Year 1)": "Net Benefit",
    "ROI": "Annual ROI",
  };
  const key = RESULT_KEY_ALIASES[rawKey] ?? rawKey;
  const displayLabel = DISPLAY_LABELS[rawKey] ?? DISPLAY_LABELS[key] ?? label;

  let displayValue: string = value;

  if (results && key) {
    const numericResults = results;
    if (Object.prototype.hasOwnProperty.call(numericResults, key)) {
      const numeric = numericResults[key];
      const dollarKeys = new Set([
        "Total Annual Value",
        "Total Investments",
        "Net Benefit (Year 1)",
      ]);

      if (key === "ROI") {
        // ROI is stored as a ratio (net gain / total cost).
        // Display directly as percentage.
        displayValue = `${Math.round(numeric * 100).toLocaleString("en-US")}%`;
      } else if (dollarKeys.has(key)) {
        displayValue = "$" + Math.round(numeric).toLocaleString("en-US");
      } else {
        displayValue = numeric.toLocaleString(undefined, { maximumFractionDigits: 2 });
      }
    }
  }
  
  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 10,
        minHeight: 96,
        padding: "14px 12px",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.2 }}>{displayLabel}</div>
      <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.05 }}>{displayValue}</div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ResultCard as any).craft = {
  displayName: "ResultCard",
  props: { label: "Enter metric label", value: "Enter value" },
};

export const SliderCard: React.FC<{
  label?: string;
  min?: number;
  max?: number;
  value?: number;
  unit?: string;
}> = ({
  label = "Enter slider label",
  min = 0,
  max = 100,
  value = 50,
  unit = "",
}) => {
  const [sliderValue, setSliderValue] = React.useState(value);
  const { connectors } = useNode();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);
  };

  const percentage = ((sliderValue - (min ?? 0)) / ((max ?? 100) - (min ?? 0))) * 100;

  return (
    <div
      ref={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: "14px 12px",
        background: "rgba(34, 197, 94, 0.1)",
        border: "1px solid rgba(34, 197, 94, 0.3)",
        borderRadius: "8px",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>{label}</div>
      <div
        style={{
          position: "relative",
          width: "100%",
        }}
      >
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          onChange={handleSliderChange}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            height: 6,
            borderRadius: 3,
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, rgba(148, 163, 184, 0.3) ${percentage}%, rgba(148, 163, 184, 0.3) 100%)`,
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#22c55e",
          textAlign: "center",
          textShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
        }}
      >
        {sliderValue}
        {unit && ` ${unit}`}
      </div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SliderCard as any).craft = {
  displayName: "SliderCard",
  props: { label: "Adjust Value", min: 0, max: 100, value: 50, unit: "" },
};

export const VADResultsList: React.FC<{
  columns?: number;
  gap?: number;
}> = ({ columns = 2, gap = 12 }) => {
  const { connectors } = useNode();
  return (
    <VADResultsCards
      columns={columns}
      gap={gap}
      connectRef={(ref) => {
        if (ref) {
          const dragged = connectors.drag ? connectors.drag(ref) : ref;
          connectors.connect(dragged);
        }
      }}
    />
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(VADResultsList as any).craft = {
  displayName: "VADResultsList",
  props: { columns: 2, gap: 12 },
};

export const VADResultsCards: React.FC<{
  columns?: number;
  gap?: number;
  connectRef?: (el: HTMLDivElement | null) => void;
}> = ({ columns = 2, gap = 12, connectRef }) => {
  const results = React.useContext(ResultsContext);
  const { selectedVADs, inputs } = React.useContext(EvalContext);

  const vadsToRender = selectedVADs && selectedVADs.length > 0 ? selectedVADs : Object.keys(VAD_INPUT_CONFIGS);

  return (
    <div
      ref={connectRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
        gap,
        marginTop: 12,
      }}
    >
      {vadsToRender.length === 0 ? (
        <div className="glass-card" style={{ gridColumn: "1 / -1", opacity: 0.85 }}>
          No VADs selected yet. Go to the Inputs screen and drag VADs in, then Save.
        </div>
      ) : (
        vadsToRender.map((vadName) => {
          const variables = VAD_VARIABLES[vadName];
          const fieldInputs = inputs?.[vadName] ?? {};

          // Show computed value whenever it is present in results (null = not yet calculated)
          const computed =
            results && Object.prototype.hasOwnProperty.call(results, vadName)
              ? results[vadName]
              : null;

          const formattedComputed =
            computed !== null && Number.isFinite(computed)
              ? "$" + Math.round(computed).toLocaleString("en-US")
              : "—";

          return (
            <div
              key={vadName}
              className="glass-card"
              style={{
                padding: "14px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                border: "1px solid rgba(85,136,59,0.25)",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 650, color: "#55883B" }}>{vadName}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(variables ?? []).map((variable, idx) => {
                  // Start with the default (always available as fallback)
                  let valueToShow: number | string = variable.defaultValue;
                  let uomToShow: string = variable.defaultUOM;

                  if (variable.isUserInput && variable.inputFieldIndex != null) {
                    // Prefer user-entered value if it exists
                    const entry = fieldInputs[variable.inputFieldIndex];
                    if (entry != null && entry.value !== "" && entry.value !== null && entry.value !== undefined) {
                      valueToShow = entry.value;
                      uomToShow = entry.uom || variable.defaultUOM;
                    }
                    // else: keep defaultValue shown as the baseline
                  }
                  // For client/derived fields: always show defaultValue (already set above)

                  const value =
                    valueToShow === undefined || valueToShow === null || valueToShow === ""
                      ? "—"
                      : String(valueToShow);
                  const uom = uomToShow || "";
                  const showUnit = uom && uom.toLowerCase() !== "number" ? ` ${uom}` : "";

                  return (
                    <div
                      key={`${vadName}-${variable.label}-${idx}`}
                      style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
                    >
                      <div style={{ fontSize: 12, opacity: 0.85 }}>{variable.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.95, whiteSpace: "nowrap" }}>
                        {value}
                        {showUnit}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 4, paddingTop: 10, borderTop: "1px solid rgba(148,163,184,0.25)" }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Calculated Value</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#55883B" }}>
                  {formattedComputed}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
