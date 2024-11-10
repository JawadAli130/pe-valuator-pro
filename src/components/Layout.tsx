import React from 'react';
import { BarChart3, Database, FileSpreadsheet, Settings, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: string) => void;
  currentView: string;
}

export function Layout({ children, onNavigate, currentView }: LayoutProps) {
  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { view: 'providers', label: 'Data Providers', icon: Users },
    { view: 'dataPoints', label: 'Data Points', icon: Database },
    { view: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { view: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-gray-900">PE Valuator Pro</span>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(({ view, label, icon: Icon }) => (
              <li key={view}>
                <button
                  onClick={() => onNavigate(view)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    currentView === view
                      ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}