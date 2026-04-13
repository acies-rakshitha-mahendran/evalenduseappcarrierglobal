import React from "react";
import type { EvalResults } from "./types";

export const ResultsContext = React.createContext<EvalResults | null>(null);

