import React from 'react';
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
  variant?: 'default' | 'compact';
}

export function PageTabs({ items, activeTab, variant = 'default' }: PageTabsProps) {
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  return (
    <SubMenu
      items={items.map(item => ({ id: item.id, label: item.label }))}
      activeItem={activeTab}
      onItemClick={handleTabChange}
      variant={variant}
    />
  );
}

export type { TabItem };
