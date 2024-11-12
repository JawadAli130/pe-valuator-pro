import React, { useEffect, useState } from 'react';
import { FileText, Plus, Settings, TrendingUp, Users } from 'lucide-react';
import { fetchApi } from '../utils/api.js';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

interface DashboardStats {
  totalReports: number;
  averagePrice: number;
  activeProviders: number;
  recentReports: Array<{
    id: number;
    name: string;
    finalPrice: number;
    date: string;
  }>;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    averagePrice: 0,
    activeProviders: 0,
    recentReports: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const data = await fetchApi('/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome to PE Valuator Pro</h1>
        <p className="mt-2 text-gray-600">Manage your private equity fund valuations efficiently</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={<FileText className="w-5 h-5" />}
          title="New Report"
          description="Create a new valuation report"
          onClick={() => onNavigate('reports')}
        />
        <QuickAction
          icon={<TrendingUp className="w-5 h-5" />}
          title="Add Data Point"
          description="Record new pricing data"
          onClick={() => onNavigate('dataPoints')}
        />
        <QuickAction
          icon={<Users className="w-5 h-5" />}
          title="Add Provider"
          description="Register a new data provider"
          onClick={() => onNavigate('providers')}
        />
        <QuickAction
          icon={<Settings className="w-5 h-5" />}
          title="Pricing Settings"
          description="Configure pricing parameters"
          onClick={() => onNavigate('settings')}
        />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentReports.map((report) => (
            <div key={report.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Final Price: {report.finalPrice.toFixed(1)}% | Created: {report.date}
                  </p>
                </div>
                <button 
                  onClick={() => onNavigate('reports')}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Reports"
          value={stats.totalReports.toString()}
          description="Reports created"
        />
        <StatCard
          title="Average Price"
          value={`${stats.averagePrice.toFixed(1)}%`}
          description="Of NAV across all reports"
        />
        <StatCard
          title="Active Providers"
          value={stats.activeProviders.toString()}
          description="Data providers"
        />
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickAction({ icon, title, description, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
