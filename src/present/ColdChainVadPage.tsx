// src/present/ColdChainVadPage.tsx
import React, { useState } from 'react';
import { useColdChain } from '../ColdChainContext';
import { VALUE_DRIVERS, LOOKUPS, type CustomerInputs } from '../coldChainData';

const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

// Label -> customerInputs key mapping for editing
const INPUT_META: Record<string, { key: keyof CustomerInputs; label: string; unit: string; isPercent?: boolean }> = {
  fleetSize:                    { key: 'fleetSize', label: 'Fleet Size', unit: 'trucks' },
  annualFuelCostPerTruck:       { key: 'annualFuelCostPerTruck', label: 'Annual Fuel Cost / Truck', unit: '$' },
  annualCompressorCostPerTruck: { key: 'annualCompressorCostPerTruck', label: 'Annual Compressor Cost / Truck', unit: '$' },
  annualDepotDieselPerTruck:    { key: 'annualDepotDieselPerTruck', label: 'Annual Depot Diesel Cost / Truck', unit: '$' },
  annualCargoValuePerTruck:     { key: 'annualCargoValuePerTruck', label: 'Annual Cargo Value / Truck', unit: '$' },
  currentSpoilageRate:          { key: 'currentSpoilageRate', label: 'Current Spoilage Rate', unit: '%', isPercent: true },
  downtimeCostPerHour:          { key: 'downtimeCostPerHour', label: 'Downtime Cost / Hour', unit: '$' },
  breakdownProbability:         { key: 'breakdownProbability', label: 'Breakdown Probability / Yr', unit: '%', isPercent: true },
  complianceStaffCostPerHour:   { key: 'complianceStaffCostPerHour', label: 'Compliance Staff Cost / Hr', unit: '$' },
  annualRouteCostPerTruck:      { key: 'annualRouteCostPerTruck', label: 'Annual Route Cost / Truck', unit: '$' },
  truReplacementCost:           { key: 'truReplacementCost', label: 'TRU Replacement Cost', unit: '$' },
  currentTruLife:               { key: 'currentTruLife', label: 'Current TRU Useful Life', unit: 'years' },
  driverErrorIncidentsPerTruck: { key: 'driverErrorIncidentsPerTruck', label: 'Driver Error Incidents / Truck / Yr', unit: 'incidents' },
  costPerDriverErrorIncident:   { key: 'costPerDriverErrorIncident', label: 'Cost per Driver Error Incident', unit: '$' },
  annualInsurancePremiumPerTruck: { key: 'annualInsurancePremiumPerTruck', label: 'Annual Insurance Premium / Truck', unit: '$' },
};

// Resolve derived variables for display
function getDerivedVars(
  vadId: string,
  config: ReturnType<typeof useColdChain>['componentConfig']
): { label: string; value: string }[] {
  switch (vadId) {
    case 'vd_energy':
      return [
        { label: 'TRU Fuel Reduction', value: (LOOKUPS.truFuelReduction(config.tru) * 100).toFixed(0) + '% (' + config.tru + ')' },
        { label: 'Insulation Reduction', value: (LOOKUPS.insulationReduction(config.insulation) * 100).toFixed(0) + '% (' + config.insulation + ')' },
      ];
    case 'vd_depot':
      return [{ label: 'Standby Saving', value: (LOOKUPS.standbyPct(config.electricStandby) * 100).toFixed(0) + '% (' + config.electricStandby + ')' }];
    case 'vd_spoilage':
      return [{ label: 'Post-Upgrade Spoilage Rate', value: (LOOKUPS.postUpgradeSpoilage(config.sensors) * 100).toFixed(1) + '% (' + config.sensors + ')' }];
    case 'vd_downtime':
      return [{ label: 'Downtime Hours Avoided / Truck', value: LOOKUPS.hoursAvoided(config.predictiveMaintenance) + ' hrs (' + config.predictiveMaintenance + ')' }];
    case 'vd_compliance':
      return [{ label: 'Hours / Week Replaced', value: LOOKUPS.hoursReplacedPerWeek(config.maintenanceContract) + ' hrs (' + config.maintenanceContract + ')' }];
    case 'vd_audit':
      return [{ label: 'Avoided Audit Cost / Truck', value: fmt(LOOKUPS.avoidedAuditCost(config.complianceDocs)) + ' (' + config.complianceDocs + ')' }];
    case 'vd_fleet':
      return [
        { label: 'Telematics Efficiency', value: (LOOKUPS.telematicsEff(config.telematics) * 100).toFixed(0) + '% (' + config.telematics + ')' },
        { label: 'Route Opt Efficiency', value: (LOOKUPS.routeOptEff(config.routeOptimization) * 100).toFixed(0) + '% (' + config.routeOptimization + ')' },
      ];
    case 'vd_lifespan':
      return [{ label: 'Life Extension', value: (LOOKUPS.lifeExtensionPct(config.predictiveMaintenance) * 100).toFixed(0) + '% (' + config.predictiveMaintenance + ')' }];
    case 'vd_driver':
      return [{ label: 'Error Reduction', value: (LOOKUPS.errorReductionPct(config.driverHMI) * 100).toFixed(0) + '% (' + config.driverHMI + ')' }];
    case 'vd_insurance':
      return [{ label: 'Premium Reduction', value: (LOOKUPS.premiumReductionPct(config.sensors, config.telematics) * 100).toFixed(0) + '% (' + config.sensors + ' + ' + config.telematics + ')' }];
    default:
      return [];
  }
}

// Number input with blue styling
const NumInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  isPercent?: boolean;
}> = ({ value, onChange, isPercent }) => {
  const display = isPercent ? (value * 100).toFixed(1) : value.toLocaleString('en-US');
  const [raw, setRaw] = useState('');
  const [editing, setEditing] = useState(false);

  return (
    <input
      type="text"
      value={editing ? raw : display}
      onFocus={() => { setEditing(true); setRaw(isPercent ? (value * 100).toFixed(1) : String(value)); }}
      onChange={e => setRaw(e.target.value)}
      onBlur={() => {
        setEditing(false);
        const n = parseFloat(raw.replace(/,/g, ''));
        if (!isNaN(n)) onChange(isPercent ? n / 100 : n);
      }}
      style={{
        width: 100,
        padding: '4px 8px',
        fontSize: 13,
        color: '#0000FF',
        fontWeight: 600,
        border: '1px solid #b3c6e7',
        borderRadius: 4,
        background: '#EBF5FB',
        textAlign: 'right',
      }}
    />
  );
};

const CATEGORY_COLORS: Record<string, string> = {
  'Decreased Resource Consumption': '#1565C0',
  'Operational Efficiency': '#2E7D32',
  'Risk Management': '#6A1B9A',
  'Employee Productivity': '#E65100',
  'Compliance': '#37474F',
  'Capital Preservation': '#BF360C',
  'Safety and Risk Management': '#AD1457',
};

export const ColdChainVadPage: React.FC = () => {
  const { selectedVADs, toggleVAD, vadResults, customerInputs, componentConfig, setCustomerInput } = useColdChain();

  const totalSelected = selectedVADs.reduce((sum, id) => sum + (vadResults[id] ?? 0), 0);

  return (
    <div className="present-body" style={{ overflowY: 'auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 700, color: '#2C3E50' }}>
          Value Accrual Drivers
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
          Select the value drivers relevant to this deal. Customer inputs update all selected VAD calculations in real time.
        </p>
      </div>

      {/* VAD Selection Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {VALUE_DRIVERS.map(vad => {
          const isSelected = selectedVADs.includes(vad.id);
          const catColor = CATEGORY_COLORS[vad.category] ?? '#37474F';
          const value = vadResults[vad.id] ?? 0;

          return (
            <div
              key={vad.id}
              onClick={() => toggleVAD(vad.id)}
              style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid #27AE60' : '2px solid #e0e4e8',
                borderRadius: 10,
                padding: '12px 14px',
                background: isSelected ? '#f0faf4' : '#fff',
                transition: 'border-color 0.15s, background 0.15s',
                position: 'relative',
              }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 10,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#27AE60',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
              )}
              {/* Category badge */}
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#fff',
                  background: catColor,
                  borderRadius: 4,
                  padding: '2px 6px',
                  marginBottom: 6,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {vad.category}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 2, paddingRight: 24 }}>
                {vad.name}
              </div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 8, lineHeight: 1.4 }}>
                {vad.dimension}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? '#27AE60' : '#aaa' }}>
                {isSelected ? fmt(value) + '/yr' : 'Not selected'}
              </div>
              <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                Weight: {(vad.weight * 100).toFixed(0)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Banner */}
      <div
        style={{
          padding: '12px 18px',
          background: '#2C3E50',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
          {selectedVADs.length} Value Driver{selectedVADs.length !== 1 ? 's' : ''} Selected
        </div>
        <div style={{ color: '#27AE60', fontSize: 20, fontWeight: 700 }}>
          Total Annual Savings: {fmt(totalSelected)}/yr
        </div>
      </div>

      {/* Per-VAD input forms */}
      {VALUE_DRIVERS.filter(vad => selectedVADs.includes(vad.id)).map(vad => {
        const derivedVars = getDerivedVars(vad.id, componentConfig);
        const value = vadResults[vad.id] ?? 0;

        return (
          <div
            key={vad.id}
            className="glass-card"
            style={{ padding: '16px 18px', marginBottom: 16, background: '#fff' }}
          >
            {/* VAD header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#2C3E50', marginBottom: 2 }}>
                  {vad.name}
                </div>
                <div style={{ fontSize: 11, color: '#666', lineHeight: 1.4, maxWidth: 600 }}>
                  {vad.description}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                <div style={{ fontSize: 11, color: '#999' }}>Annual Value</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#27AE60' }}>{fmt(value)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Customer Inputs (given: true) */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2C3E50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Customer Inputs
                </div>
                {vad.variables.map(v => {
                  const meta = INPUT_META[v.key];
                  if (!meta) return null;
                  const currentVal = customerInputs[meta.key] as number;

                  return (
                    <div key={v.key} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>{v.label}</div>
                          <div style={{ fontSize: 10, color: '#888' }}>{v.source}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <NumInput
                            value={currentVal}
                            onChange={val => setCustomerInput(meta.key, val)}
                            isPercent={meta.isPercent}
                          />
                          <span style={{ fontSize: 11, color: '#888', minWidth: 40 }}>{v.unit}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Derived Variables (given: false) */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2C3E50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Derived from Configuration
                </div>
                {derivedVars.map(dv => (
                  <div key={dv.label} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, color: '#555' }}>{dv.label}</div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#555',
                        background: '#f0f0f0',
                        padding: '4px 10px',
                        borderRadius: 4,
                        border: '1px solid #ddd',
                        minWidth: 80,
                        textAlign: 'right',
                      }}
                    >
                      {dv.value}
                    </div>
                  </div>
                ))}

                {/* Formula */}
                <div style={{ marginTop: 12, padding: '8px 10px', background: '#f8f9fa', borderRadius: 6, border: '1px solid #e0e4e8' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#888', marginBottom: 3, textTransform: 'uppercase' }}>Formula</div>
                  <div style={{ fontSize: 11, color: '#333', lineHeight: 1.5, fontFamily: 'monospace' }}>{vad.expression}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {selectedVADs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999', fontSize: 14 }}>
          Click a value driver card above to select it and enter inputs.
        </div>
      )}
    </div>
  );
};
