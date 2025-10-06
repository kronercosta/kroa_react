import { useRegion } from '../../contexts/RegionContext';

export function HeaderControls() {
  const { currentRegion, setRegion } = useRegion();

  return (
    <div className="flex items-center gap-2">
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
