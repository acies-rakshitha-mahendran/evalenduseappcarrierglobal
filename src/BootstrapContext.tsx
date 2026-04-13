import React, { createContext, useContext, useState, ReactNode } from "react";

interface BootstrapContextType {
  isBootstrapReady: boolean;
  notifyBootstrapComplete: () => void;
}

const BootstrapContext = createContext<BootstrapContextType | undefined>(undefined);

export const BootstrapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBootstrapReady, setIsBootstrapReady] = useState(false);

  const notifyBootstrapComplete = () => {
    setIsBootstrapReady(true);
  };

  return (
    <BootstrapContext.Provider value={{ isBootstrapReady, notifyBootstrapComplete }}>
      {children}
    </BootstrapContext.Provider>
  );
};

export const useBootstrap = () => {
  const context = useContext(BootstrapContext);
  if (!context) {
    throw new Error("useBootstrap must be used within BootstrapProvider");
  }
  return context;
};
