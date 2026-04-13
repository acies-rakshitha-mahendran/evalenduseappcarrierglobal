// src/ColdChainContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  type CustomerInputs,
  type ComponentConfig,
  type Discounts,
  type PricingResult,
  type ROIResult,
  DEFAULT_CUSTOMER_INPUTS,
  DEFAULT_COMPONENT_CONFIG,
  DEFAULT_DISCOUNTS,
  DEFAULT_SELECTED_VADS,
  VALUE_DRIVERS,
  calculatePricing,
  calculateVADValue,
  calculateROI,
} from './coldChainData';

export interface ColdChainContextValue {
  // State
  customerInputs: CustomerInputs;
  componentConfig: ComponentConfig;
  discounts: Discounts;
  selectedVADs: string[];

  // Setters
  setCustomerInput: (key: keyof CustomerInputs, value: number) => void;
  setComponentConfig: (key: keyof ComponentConfig, value: string) => void;
  setDiscount: (key: keyof Discounts, value: number) => void;
  toggleVAD: (vadId: string) => void;
  setSelectedVADs: (ids: string[]) => void;

  // Computed
  pricing: PricingResult;
  vadResults: Record<string, number>;
  totalAnnualSavings: number;
  savingsPerTruck: number;
  roiData: ROIResult;
}

const ColdChainContext = createContext<ColdChainContextValue | null>(null);

export const ColdChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerInputs, setCustomerInputs] = useState<CustomerInputs>(DEFAULT_CUSTOMER_INPUTS);
  const [componentConfig, setComponentConfigState] = useState<ComponentConfig>(DEFAULT_COMPONENT_CONFIG);
  const [discounts, setDiscountsState] = useState<Discounts>(DEFAULT_DISCOUNTS);
  const [selectedVADs, setSelectedVADs] = useState<string[]>(DEFAULT_SELECTED_VADS);

  const setCustomerInput = (key: keyof CustomerInputs, value: number) => {
    setCustomerInputs(prev => ({ ...prev, [key]: value }));
  };

  const setComponentConfig = (key: keyof ComponentConfig, value: string) => {
    setComponentConfigState(prev => ({ ...prev, [key]: value }));
  };

  const setDiscount = (key: keyof Discounts, value: number) => {
    setDiscountsState(prev => ({ ...prev, [key]: value }));
  };

  const toggleVAD = (vadId: string) => {
    setSelectedVADs(prev =>
      prev.includes(vadId) ? prev.filter(id => id !== vadId) : [...prev, vadId]
    );
  };

  const pricing = useMemo(
    () => calculatePricing(componentConfig, customerInputs, discounts),
    [componentConfig, customerInputs, discounts]
  );

  const vadResults = useMemo(() => {
    const results: Record<string, number> = {};
    VALUE_DRIVERS.forEach(vad => {
      results[vad.id] = calculateVADValue(vad.id, customerInputs, componentConfig);
    });
    return results;
  }, [customerInputs, componentConfig]);

  const totalAnnualSavings = useMemo(
    () => selectedVADs.reduce((sum, id) => sum + (vadResults[id] ?? 0), 0),
    [selectedVADs, vadResults]
  );

  const savingsPerTruck = useMemo(
    () => (customerInputs.fleetSize > 0 ? totalAnnualSavings / customerInputs.fleetSize : 0),
    [totalAnnualSavings, customerInputs.fleetSize]
  );

  const roiData = useMemo(
    () => calculateROI(pricing, totalAnnualSavings, savingsPerTruck, customerInputs),
    [pricing, totalAnnualSavings, savingsPerTruck, customerInputs]
  );

  const value: ColdChainContextValue = {
    customerInputs,
    componentConfig,
    discounts,
    selectedVADs,
    setCustomerInput,
    setComponentConfig,
    setDiscount,
    toggleVAD,
    setSelectedVADs,
    pricing,
    vadResults,
    totalAnnualSavings,
    savingsPerTruck,
    roiData,
  };

  return <ColdChainContext.Provider value={value}>{children}</ColdChainContext.Provider>;
};

export const useColdChain = (): ColdChainContextValue => {
  const ctx = useContext(ColdChainContext);
  if (!ctx) throw new Error('useColdChain must be used inside ColdChainProvider');
  return ctx;
};
