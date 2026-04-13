import React from "react";
import { CraftEditorShell } from "./craft/CraftEditorShell";
import type { CraftLayout } from "../types";

type Props = {
  data: CraftLayout;
  onChange: (data: CraftLayout) => void;
  selectedVADs?: string[];
  zoom?: number;
  viewportWidth?: string;
};

export const ResultsBuilderPage: React.FC<Props> = ({
  data,
  onChange,
  selectedVADs = [],
  zoom = 100,
  viewportWidth = "100%",
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div
        style={{
          padding: "0.5rem 0.75rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Value estimation layout builder
        </div>
      </div>
      <CraftEditorShell
        mode="results"
        initialData={data ?? undefined}
        onChange={onChange}
        selectedVADs={selectedVADs}
        zoom={zoom}
        viewportWidth={viewportWidth}
      />
    </div>
  );
};
