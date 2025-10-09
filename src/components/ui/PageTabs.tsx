import { useNavigate } from 'react-router-dom';
import { SubMenu } from '../navigation/SubMenu';

export interface TabItem {
  id: string;
  label: string;
  path: string;
}

interface PageTabsProps {
  items: TabItem[];
  activeTab: string;
  variant?: 'default' | 'compact' | 'pills';
}

export function PageTabs({ items, activeTab, variant = 'default' }: PageTabsProps) {
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  // Map 'pills' variant to 'default' for SubMenu compatibility
  const subMenuVariant = variant === 'pills' ? 'default' : variant;

  return (
    <div className="w-full max-w-[100dvw] overflow-hidden">
      <SubMenu
        items={items.map(item => ({ id: item.id, label: item.label }))}
        activeItem={activeTab}
        onItemClick={handleTabChange}
        variant={subMenuVariant}
        className="w-full max-w-[100dvw]"
      />
    </div>
  );
}

