// src/builder/craft/CraftEditorShell.tsx
import React from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import {
  Container,
  TitleBlock,
  SubtitleBlock,
  ButtonBlock,
  LogoBlock,
  ImageBlock,
  GridBlock,
  FlexBlock,
  HeroSection,
  StatsCard,
  PricingTable,
  IconBadge,
  VADBlock,
  ResultCard,
  SliderCard,
  VADResultsList,
} from "./craftNodes";
import { craftResolver } from "./craftResolver";
import { EvalContext, type VADInputValue } from "../../evalContext";
import { ResultsContext } from "../../resultsContext";
import { VAD_INPUT_CONFIGS } from "../../vadInputs";
import { VAD_METADATA } from "../../vadMetadata";

type CraftEditorShellProps = {
  initialData?: string | null;
  onChange?: (data: string) => void;
  mode: "home" | "pricing" | "vads" | "results" | "roi";
  zoom?: number;
  viewportWidth?: string;
  // Optional preview context (lets Results screen reflect selected VADs dynamically in Build)
  selectedVADs?: string[];
  previewInputs?: VADInputValue | null;
};

const VADS_LIST: { full: string; short: string }[] = [
  { full: "Reduced Energy and Fuel Costs",   short: "Energy & Fuel Costs"       },
  { full: "Product Loss Prevention",         short: "Product Loss"               },
  { full: "Revenue Protected from Downtime", short: "Downtime Revenue"           },
  { full: "Workforce Productivity",          short: "Workforce Productivity"     },
  { full: "Operator Error Reduction",        short: "Operator Errors"            },
  { full: "Compliance and Penalty Avoidance",short: "Compliance & Penalties"    },
  { full: "Insurance Premium Reduction",     short: "Insurance Reduction"        },
  { full: "Competitive Win Rate",            short: "Competitive Win Rate"       },
  { full: "Customer SLA Compliance",         short: "SLA Compliance"             },
  { full: "Equipment Life Extension",        short: "Equipment Life"             },
  { full: "Fleet / Building Utilization",    short: "Fleet Utilization"          },
  { full: "Carbon Emissions Reduction",      short: "Carbon Reduction"           },
  { full: "Refrigerant Leak Prevention",     short: "Refrigerant Leaks"          },
  { full: "Energy Intensity Reduction",      short: "Energy Intensity"           },
];

// Draggable component inside editor context
type DraggableProps = Record<string, unknown>;

type DraggableItemProps = {
  component: React.ComponentType<DraggableProps>;
  label: string;
  icon: string;
  props?: DraggableProps;
  tooltip?: string;
};

const DraggableItem: React.FC<DraggableItemProps> = ({ component, label, icon, props, tooltip }) => {
  const { connectors } = useEditor();

  return (
    <div
      ref={(ref) => {
        if (ref) {
          // Create a new node in the editor when dragged into the canvas
          // We pass initial props directly into the component so it appears immediately
          connectors?.create(ref, React.createElement(component, props));
        }
      }}
      className="palette-item"
      title={tooltip ?? label}
    >
      <span>{label}</span>
      <span>{icon}</span>
    </div>
  );
};

const RenderPalette: React.FC<{ mode: "home" | "pricing" | "vads" | "results" | "roi"; selectedVADs?: string[] }> = ({ mode, selectedVADs }) => {
  if (mode === "home") {
    return (
      <>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: "0.5rem", opacity: 0.8 }}>Components</div>
        <DraggableItem component={LogoBlock} label="Logo" icon="●" />
        <DraggableItem component={IconBadge} label="Icon badge" icon="★" />
        <DraggableItem component={TitleBlock} label="Title" icon="H1" />
        <DraggableItem component={SubtitleBlock} label="Subtitle" icon="⋯" />
        <DraggableItem component={ButtonBlock} label="Button" icon="↳" />
        <DraggableItem component={ImageBlock} label="Image" icon="🖼" />
        <DraggableItem component={GridBlock} label="Grid" icon="⊞" />
        <DraggableItem component={FlexBlock} label="Flex" icon="↔" />
        <DraggableItem component={Container} label="Container" icon="◻" />
        <div style={{ fontSize: 12, fontWeight: 600, margin: "0.75rem 0 0.35rem", opacity: 0.8 }}>Sections</div>
        <DraggableItem component={HeroSection} label="Hero section" icon="⬛" />
        <DraggableItem component={StatsCard} label="Stats card" icon="📊" />
      </>
    );
  } else if (mode === "vads") {
    const availableVads = VADS_LIST.filter(
      (vad) => !selectedVADs?.includes(vad.full)
    );

    return (
      <>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: "0.5rem", opacity: 0.8 }}>VADs</div>
        {availableVads.length > 0 ? (
          availableVads.map((vad) => (
            <DraggableItem
              key={vad.full}
              component={VADBlock}
              label={vad.short}
              icon="+"
              props={{ title: vad.full }}
              tooltip={vad.full}
            />
          ))
        ) : (
          <div style={{ fontSize: 12, color: "#64748b", opacity: 0.85, padding: "0.5rem 0" }}>
            All VADs have been added.
          </div>
        )}
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: "1rem", marginBottom: "0.5rem", opacity: 0.8 }}>Layout</div>
        <DraggableItem component={TitleBlock} label="Title" icon="H1" />
        <DraggableItem component={SubtitleBlock} label="Subtitle" icon="⋯" />
        <DraggableItem component={GridBlock} label="Grid" icon="⊞" />
        <DraggableItem component={FlexBlock} label="Flex" icon="↔" />
        <DraggableItem component={Container} label="Container" icon="◻" />
      </>
    );
  } else if (mode === "pricing") {
    return (
      <>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: "0.5rem", opacity: 0.8 }}>Pricing Page</div>
        <DraggableItem component={PricingTable} label="Pricing Table" icon="💲" />
        <DraggableItem component={TitleBlock} label="Title" icon="H1" />
        <DraggableItem component={SubtitleBlock} label="Subtitle" icon="⋯" />
        <DraggableItem component={ButtonBlock} label="Button" icon="↳" />
        <DraggableItem component={ImageBlock} label="Image" icon="🖼" />
        <DraggableItem component={GridBlock} label="Grid" icon="⊞" />
        <DraggableItem component={FlexBlock} label="Flex" icon="↔" />
        <DraggableItem component={Container} label="Container" icon="◻" />
      </>
    );
  } else if (mode === "roi") {
    return (
      <>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: "0.5rem", opacity: 0.8 }}>ROI Results</div>
        <DraggableItem component={ResultCard} label="Result Card" icon="∑" />
        <DraggableItem component={SliderCard} label="Slider" icon="🎚" />
        <DraggableItem component={VADResultsList} label="Selected VAD Cards" icon="⧉" />
        <DraggableItem component={TitleBlock} label="Title" icon="H1" />
        <DraggableItem component={SubtitleBlock} label="Summary" icon="📊" />
        <DraggableItem component={GridBlock} label="Grid" icon="⊞" />
        <DraggableItem component={FlexBlock} label="Flex" icon="↔" />
        <DraggableItem component={Container} label="Container" icon="◻" />
      </>
    );
  }

  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: "0.5rem", opacity: 0.8 }}>Components</div>
      <DraggableItem component={ResultCard} label="Result Card" icon="∑" />
      <DraggableItem component={SliderCard} label="Slider" icon="🎚" />
      <DraggableItem component={VADResultsList} label="Selected VAD Cards" icon="⧉" />
      <DraggableItem component={TitleBlock} label="Title" icon="H1" />
      <DraggableItem component={SubtitleBlock} label="Summary" icon="📊" />
      <DraggableItem component={GridBlock} label="Grid" icon="⊞" />
      <DraggableItem component={FlexBlock} label="Flex" icon="↔" />
      <DraggableItem component={Container} label="Container" icon="◻" />
    </>
  );
};

// VAD Properties panel: shows details for the VAD block selected on the canvas
const VadPropertiesPanel: React.FC = () => {
  const { selected, nodes } = useEditor((state) => ({
    selected: state.events.selected,
    nodes: state.nodes,
  }));

  const selectedId = selected?.size ? Array.from(selected)[0] : null;
  const node = selectedId && nodes[selectedId] ? nodes[selectedId] : null;
  const nodeData = node?.data as { displayName?: string; props?: { title?: string } } | undefined;
  const isVADBlock = nodeData?.displayName === "VADBlock";
  const vadTitle = nodeData?.props?.title ?? "";
  const meta = vadTitle ? VAD_METADATA[vadTitle] : null;

  if (!selectedId || !isVADBlock) {
    return (
      <div style={{ fontSize: 11, color: "#666", padding: "0.5rem" }}>
        Click a VAD on the canvas to view its details.
      </div>
    );
  }

  if (!meta) {
    return (
      <div style={{ fontSize: 11, color: "#666", padding: "0.5rem" }}>
        No details for this VAD.
      </div>
    );
  }

  const variablesText = meta.variables.join("\n");

  return (
    <div style={{ padding: "0.25rem 0", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <div>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.85 }}>VAD Name</label>
        <input
          type="text"
          readOnly
          value={vadTitle}
          style={{ fontSize: 11, padding: "0.4rem 0.5rem", width: "100%", boxSizing: "border-box" }}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.85 }}>Category</label>
        <input
          type="text"
          readOnly
          value={meta.category}
          style={{ fontSize: 11, padding: "0.4rem 0.5rem", width: "100%", boxSizing: "border-box" }}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.85 }}>Dimension</label>
        <input
          type="text"
          readOnly
          value={meta.dimension}
          style={{ fontSize: 11, padding: "0.4rem 0.5rem", width: "100%", boxSizing: "border-box" }}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.85 }}>Variables</label>
        <textarea
          readOnly
          value={variablesText}
          rows={Math.min(meta.variables.length + 1, 6)}
          style={{
            fontSize: 11,
            padding: "0.4rem 0.5rem",
            width: "100%",
            boxSizing: "border-box",
            resize: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
      {meta.description && (
        <div>
          <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.85 }}>Description</label>
          <textarea
            readOnly
            value={meta.description}
            rows={2}
            style={{
              fontSize: 11,
              padding: "0.4rem 0.5rem",
              width: "100%",
              boxSizing: "border-box",
              resize: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.85 }}>Expression</label>
        <textarea
          readOnly
          value={meta.expression}
          style={{
            minHeight: "100px",
            fontSize: 11,
            padding: "0.5rem",
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "monospace",
            lineHeight: 1.4,
          }}
        />
      </div>
    </div>
  );
};

// Inspector panel for editing selected component properties
const InspectorPanel: React.FC = () => {
  const { selected } = useEditor((state) => ({
    selected: state.events.selected,
  }));

  if (!selected || selected.size === 0) {
    return (
      <div style={{ fontSize: 11, color: "#666", padding: "0.5rem" }}>
        Select a component to edit properties
      </div>
    );
  }

  return <PropertyEditorWrapper nodeId={Array.from(selected)[0]} />;
};

// Wrapper that has access to Editor context
const PropertyEditorWrapper: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { actions } = useEditor();

  const handlePropChange = (propName: string, value: unknown) => {
    try {
      actions.setProp(nodeId, (props: Record<string, unknown>) => {
        props[propName] = value;
      });
    } catch (e) {
      console.error("Error updating prop:", e);
    }
  };

  return (
    <div style={{ fontSize: 11, padding: "0.5rem" }}>
      <div style={{ marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(85, 136, 59, 0.2)" }}>
        <span style={{ opacity: 0.8, fontWeight: 600 }}>
          Component Properties
        </span>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Text</label>
        <input
          type="text"
          placeholder="Enter text"
          onChange={(e) => handlePropChange("text", e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Font Size (px)</label>
        <input
          type="number"
          placeholder="16"
          defaultValue="16"
          onChange={(e) => handlePropChange("fontSize", parseInt(e.target.value) || 16)}
        />
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Text Color</label>
        <input
          type="color"
          defaultValue="#000000"
          onChange={(e) => handlePropChange("color", e.target.value)}
          style={{ height: "32px", cursor: "pointer" }}
        />
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Background Color</label>
        <input
          type="color"
          defaultValue="#ffffff"
          onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
          style={{ height: "32px", cursor: "pointer" }}
        />
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Border Radius (px)</label>
        <input
          type="number"
          placeholder="0"
          defaultValue="0"
          onChange={(e) => handlePropChange("borderRadius", parseInt(e.target.value) || 0)}
        />
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Min Height (px)</label>
        <input
          type="number"
          placeholder="100"
          defaultValue="100"
          onChange={(e) => handlePropChange("minHeight", parseInt(e.target.value) || 100)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6 }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Width (px)</label>
          <input
            type="number"
            placeholder="auto"
            onChange={(e) =>
              handlePropChange("width", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined)
            }
          />
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", fontSize: 11, marginBottom: "0.25rem", opacity: 0.7 }}>Height (px)</label>
          <input
            type="number"
            placeholder="auto"
            onChange={(e) =>
              handlePropChange("height", e.target.value === "" ? undefined : parseInt(e.target.value) || undefined)
            }
          />
        </div>
      </div>
    </div>
  );
};

export const CraftEditorShell: React.FC<CraftEditorShellProps> = ({
  initialData,
  onChange,
  mode,
  zoom = 100,
  viewportWidth = "100%",
  selectedVADs = [],
  previewInputs = null,
}) => {
  return (
    <div className="editor-shell">
      <Editor
        resolver={craftResolver}
        onNodesChange={(query) => {
          const json = query.serialize();
          onChange?.(json);
        }}
      >
        <div className="editor-panel">
          <h4 style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
            {mode === "home" && "Components"}
            {mode === "vads" && "VAD List & Layout"}
            {mode === "results" && "Components"}
          </h4>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Drag from here into the central canvas.
          </div>
          <div className="palette-list" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
            <RenderPalette mode={mode} selectedVADs={selectedVADs} />
          </div>
        </div>

        <div className="editor-canvas">
          <div className="editor-canvas-inner">
            <div
              className="canvas-frame"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: viewportWidth,
              }}
            >
              <ResultsContext.Provider value={null}>
                <EvalContext.Provider value={{ selectedVADs, inputs: previewInputs }}>
                  <Frame data={initialData ?? undefined}>
                    {mode === "results" ? (
                      <Element is={Container} canvas padding={24} align="left">
                        <TitleBlock text="Value Estimation" />
                        <div style={{ marginBottom: 16 }}>
                          <GridBlock columns={4}>
                            <ResultCard label="Total Annual Value" value="Enter value" />
                            <ResultCard label="Total Investments" value="Enter value" />
                            <ResultCard label="Net Benefit (Year 1)" value="Enter value" />
                            <ResultCard label="ROI" value="Enter value" />
                          </GridBlock>
                        </div>

                        {/* Dynamic: cards for the VADs selected on the Inputs screen */}
                        <VADResultsList columns={2} />
                      </Element>
                    ) : mode === "vads" && !initialData?.trim() ? (
                      <Element is={Container} canvas padding={24} align="left">
                        <TitleBlock text="Selected VADs" />
                        <div style={{ marginBottom: 16 }}>
                          <GridBlock columns={2}>
                            {Object.keys(VAD_INPUT_CONFIGS).map((vadName) => (
                              <VADBlock key={vadName} title={vadName} />
                            ))}
                          </GridBlock>
                        </div>
                      </Element>
                    ) : (
                      <Element is={Container} canvas padding={24} align="left" />
                    )}
                  </Frame>
                </EvalContext.Provider>
              </ResultsContext.Provider>
            </div>
          </div>
        </div>

        <div className="editor-panel">
          <h4 style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
            {mode === "vads" ? "VAD Properties" : "Inspector"}
          </h4>
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              maxHeight: "calc(100vh - 300px)",
              overflowY: "auto",
            }}
          >
            {mode === "vads" ? <VadPropertiesPanel /> : <InspectorPanel />}
          </div>
        </div>
      </Editor>
    </div>
  );
};
