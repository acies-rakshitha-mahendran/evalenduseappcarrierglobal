import React from "react";
import { CraftEditorShell } from "./craft/CraftEditorShell";
import type { CraftLayout } from "../types";

type Props = {
  data: CraftLayout;
  onChange: (data: CraftLayout) => void;
  onThemeChange: (mode: "light" | "dark") => void;
  zoom?: number;
  viewportWidth?: string;
};

export const HomeBuilderPage: React.FC<Props> = ({
  data,
  onChange,
  onThemeChange,
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
          gap: 8,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.8 }}>Home page builder</div>
      </div>
      <CraftEditorShell
        mode="home"
        initialData={data ?? undefined}
        onChange={onChange}
        zoom={zoom}
        viewportWidth={viewportWidth}
      />
    </div>
  );
};
