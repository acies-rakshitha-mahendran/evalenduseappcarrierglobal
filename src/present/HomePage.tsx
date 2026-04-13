import React from "react";
import { Editor, Frame } from "@craftjs/core";
import { craftResolver } from "../builder/craft/craftResolver";
import type { CraftLayout } from "../types";

type Props = {
  layout: CraftLayout;
};

export const HomePage: React.FC<Props> = ({ layout }) => {
  if (!layout) {
    return (
      <div style={{ padding: 24, opacity: 0.8, fontSize: 13 }}>
        No home layout published yet.
      </div>
    );
  }

  return (
    <div className="present-body" style={{ padding: 0, overflowY: "auto", minHeight: "100%", height: "100%", maxHeight: "calc(100vh - 72px)" }}>
      <div className="canvas-frame present-canvas-frame" style={{ width: "100%", minHeight: "100%", height: "100%" }}>
        <Editor enabled={false} resolver={craftResolver}>
          <Frame data={layout} />
        </Editor>
      </div>
    </div>
  );
};
