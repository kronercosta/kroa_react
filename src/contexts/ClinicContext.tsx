import { createContext, useContext, useState, type ReactNode } from 'react';

interface Unit {
  id: number;
  titulo: string;
  isMaster?: boolean;
}

interface CostCenter {
  id: number;
  name: string;
  isMaster?: boolean;
}

interface ClinicContextData {
  multiplasUnidadesEnabled: boolean;
  setMultiplasUnidadesEnabled: (value: boolean) => void;
  centroCustoEnabled: boolean;
  setCentroCustoEnabled: (value: boolean) => void;
  units: Unit[];
  setUnits: (units: Unit[]) => void;
  costCenters: CostCenter[];
  setCostCenters: (costCenters: CostCenter[]) => void;
  selectedUnitIds: number[];
  setSelectedUnitIds: (ids: number[]) => void;
  selectedCostCenterIds: number[];
  setSelectedCostCenterIds: (ids: number[]) => void;
}

const ClinicContext = createContext<ClinicContextData>({} as ClinicContextData);

interface ClinicProviderProps {
  children: ReactNode;
}

export function ClinicProvider({ children }: ClinicProviderProps) {
  const [multiplasUnidadesEnabled, setMultiplasUnidadesEnabled] = useState(false);
  const [centroCustoEnabled, setCentroCustoEnabled] = useState(false);

  // Units and Cost Centers data
  const [units, setUnits] = useState<Unit[]>([
    {
      id: 1,
      titulo: 'Unidade Principal',
      isMaster: true
    }
  ]);

  const [costCenters, setCostCenters] = useState<CostCenter[]>([
    {
      id: 1,
      name: 'Centro de Custo Principal',
      isMaster: true
    }
  ]);

  // Selected filters - arrays for multiple selection
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);
  const [selectedCostCenterIds, setSelectedCostCenterIds] = useState<number[]>([]);

  return (
    <ClinicContext.Provider
      value={{
        multiplasUnidadesEnabled,
        setMultiplasUnidadesEnabled,
        centroCustoEnabled,
        setCentroCustoEnabled,
        units,
        setUnits,
        costCenters,
        setCostCenters,
        selectedUnitIds,
        setSelectedUnitIds,
        selectedCostCenterIds,
        setSelectedCostCenterIds,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}