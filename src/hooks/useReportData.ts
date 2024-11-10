import { useState, useEffect } from 'react';
import { Report } from '../types/report';
import { DataPoint } from '../types/dataPoint';
import { PricingSettings } from '../types/settings';

interface UseReportDataReturn {
  reports: Report[];
  dataPoints: DataPoint[];
  settings: PricingSettings | null;
  loading: boolean;
  error: Error | null;
  addReport: (report: Omit<Report, 'id'>) => Promise<void>;
  updateReport: (report: Report) => void;
  deleteReport: (id: number) => Promise<void>;
  finalizeReport: (id: number) => void;
}

export function useReportData(): UseReportDataReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [settings, setSettings] = useState<PricingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      const response = await fetch('/api/reports');
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const data = await response.json();
      
      // Validate the response data
      if (!data.reports || !data.dataPoints || !data.settings?.assetClasses) {
        throw new Error('Invalid data format received from server');
      }
      
      setReports(data.reports);
      setDataPoints(data.dataPoints);
      setSettings(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addReport = async (report: Omit<Report, 'id'>) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add report' }));
        throw new Error(errorData.error || 'Failed to add report');
      }
      
      const newReport = await response.json();
      setReports(prev => [...prev, newReport]);
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  const updateReport = (report: Report) => {
    setReports(prev => prev.map(r => r.id === report.id ? report : r));
  };

  const deleteReport = async (id: number) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete report' }));
        throw new Error(errorData.error || 'Failed to delete report');
      }
      
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  const finalizeReport = (id: number) => {
    setReports(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'final' } : r
    ));
  };

  return {
    reports,
    dataPoints,
    settings,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    finalizeReport
  };
}