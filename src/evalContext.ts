import React from "react";

export type VADFieldInput = {
  value: string | number;
  uom: string;
};

export type VADInputValue = {
  [vadName: string]: {
    [fieldIndex: number]: VADFieldInput;
  };
};

export type EvalContextValue = {
  selectedVADs: string[];
  inputs: VADInputValue | null;
};

export const EvalContext = React.createContext<EvalContextValue>({
  selectedVADs: [],
  inputs: null,
});

