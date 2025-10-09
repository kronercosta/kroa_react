import React from 'react';
import { PageHeader } from './PageHeader';
import { PageHeaderWithAvatar } from './PageHeaderWithAvatar';
import { PageTabs } from './PageTabs';
import type { TabItem } from './PageTabs';

interface PageHeaderAvatarData {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarColor?: string;
  onBack?: () => void;
}

interface PageLayoutProps {
  // Header Type - Define qual tipo de header usar
  headerType?: 'default' | 'avatar';

  // Page Header props (para headerType: 'default')
  title?: string;
  subtitle?: string;
  headerControls?: React.ReactNode;

  // Avatar Header props (para headerType: 'avatar')
  avatarData?: PageHeaderAvatarData;

  // Page Tabs props (optional)
  tabs?: TabItem[];
  activeTab?: string;
  tabsVariant?: 'default' | 'pills' | 'underline';

  // Content
  children: React.ReactNode;
}

export function PageLayout({
  headerType = 'default',
  title,
  subtitle,
  headerControls,
  avatarData,
  tabs,
  activeTab,
  tabsVariant = 'default',
  children
}: PageLayoutProps) {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Page Header */}
      {headerType === 'avatar' && avatarData ? (
        <div className="flex-shrink-0 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <PageHeaderWithAvatar
              title={avatarData.title}
              subtitle={avatarData.subtitle}
              avatarUrl={avatarData.avatarUrl}
              avatarColor={avatarData.avatarColor}
              onBack={avatarData.onBack}
              actions={headerControls}
            />
          </div>
        </div>
      ) : (
        <PageHeader title={title || ''} subtitle={subtitle}>
          {headerControls}
        </PageHeader>
      )}

      {/* Page Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex-shrink-0">
          <PageTabs
            items={tabs}
            activeTab={activeTab || tabs[0]?.id || ''}
            variant={tabsVariant}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
