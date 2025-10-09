import { useRegion } from '../../contexts/RegionContext';
import { useClinic } from '../../contexts/ClinicContext';
import { useTranslation } from '../../hooks/useTranslation';
import layoutTranslations from '../layout-translation.json';
import { Select } from './Select';

export function HeaderControls() {
  const { currentRegion, setRegion } = useRegion();
  const {
    units,
    costCenters,
    selectedUnitIds,
    setSelectedUnitIds,
    selectedCostCenterIds,
    setSelectedCostCenterIds
  } = useClinic();
  const { t } = useTranslation(layoutTranslations);

  // Show super filters only when there are multiple units or cost centers
  const hasMultipleUnits = units.length > 1;
  const hasMultipleCostCenters = costCenters.length > 1;

  return (
    <div className="flex items-center gap-2">
      {/* Units Filter - only show if multiple units */}
      {hasMultipleUnits && (
        <Select
          options={units.map(unit => ({
            value: unit.id.toString(),
            label: unit.titulo
          }))}
          value={selectedUnitIds.map(id => id.toString())}
          onChange={(e) => {
            const values = Array.isArray(e.target.value) ? e.target.value : [];
            setSelectedUnitIds(values.map(v => parseInt(v)));
          }}
          placeholder={t.actions?.allUnits || 'Todas as Unidades'}
          multiple
          showAllOption
          allOptionText={t.actions?.allUnits || 'Todas as Unidades'}
          minWidth="min-w-48"
          className="text-sm max-w-[190px]"
        />
      )}

      {/* Cost Centers Filter - only show if multiple cost centers */}
      {hasMultipleCostCenters && (
        <Select
          options={costCenters.map(center => ({
            value: center.id.toString(),
            label: center.name
          }))}
          value={selectedCostCenterIds.map(id => id.toString())}
          onChange={(e) => {
            const values = Array.isArray(e.target.value) ? e.target.value : [];
            setSelectedCostCenterIds(values.map(v => parseInt(v)));
          }}
          placeholder={t.actions?.allCenters || 'Todos os Centros'}
          multiple
          showAllOption
          allOptionText={t.actions?.allCenters || 'Todos os Centros'}
          minWidth="min-w-48"
          className="text-sm max-w-[190px]"
        />
      )}

      {/* Region Filter */}
      <select
        value={currentRegion}
        onChange={(e) => setRegion(e.target.value as 'BR' | 'US')}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-krooa-green focus:border-transparent"
      >
        <option value="BR">🇧🇷 Brasil</option>
        <option value="US">🇺🇸 United States</option>
      </select>
    </div>
  );
}
