import React from 'react';
import { LayoutDashboardIcon, PlusIcon, ListIcon, HistoryIcon, SettingsIcon } from '@/components/icons/CompostIcons';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { id: 'submit', label: 'Submit Waste', icon: PlusIcon },
  { id: 'queue', label: 'Queue Status', icon: ListIcon },
  { id: 'history', label: 'History', icon: HistoryIcon },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-73px)] p-4">
      <nav className="space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-eco-sm' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Info Box */}
      <div className="mt-8 p-4 rounded-lg bg-secondary">
        <h4 className="font-display font-semibold text-secondary-foreground mb-2">Quick Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Toggle Demo Mode to auto-generate values</li>
          <li>• Monitor temperature & moisture daily</li>
          <li>• Turn compost every 3-4 days</li>
        </ul>
      </div>
    </aside>
  );
}
