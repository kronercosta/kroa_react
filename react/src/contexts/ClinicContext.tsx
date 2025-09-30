import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ClinicContextData {
  multiplasUnidadesEnabled: boolean;
  setMultiplasUnidadesEnabled: (value: boolean) => void;
  centroCustoEnabled: boolean;
  setCentroCustoEnabled: (value: boolean) => void;
}

const ClinicContext = createContext<ClinicContextData>({} as ClinicContextData);

interface ClinicProviderProps {
  children: ReactNode;
}

export function ClinicProvider({ children }: ClinicProviderProps) {
  const [multiplasUnidadesEnabled, setMultiplasUnidadesEnabled] = useState(false);
  const [centroCustoEnabled, setCentroCustoEnabled] = useState(false);

  return (
    <ClinicContext.Provider
      value={{
        multiplasUnidadesEnabled,
        setMultiplasUnidadesEnabled,
        centroCustoEnabled,
        setCentroCustoEnabled,
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