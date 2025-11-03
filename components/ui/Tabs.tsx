'use client';

import { useEffect, useState } from 'react';
import TabButton from './TabButton';

interface Tab {
  id: string;
  label: string;
  iconName: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
}

export default function Tabs({ tabs, defaultActiveTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActiveTab(defaultActiveTab || tabs[0]?.id || '');
    setMounted(true);
  }, [defaultActiveTab, tabs]);

  return (
    <>
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            label={tab.label}
            iconName={tab.iconName}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      
      <div className="mt-6">
        {mounted ? tabs.find(tab => tab.id === activeTab)?.content : null}
      </div>
    </>
  );
}
