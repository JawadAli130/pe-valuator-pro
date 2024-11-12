import { useState, useEffect } from 'react';
import { Report } from '../types/report.js';
import { DataPoint } from '../types/dataPoint.js';
import { PricingSettings } from '../types/settings.js';
import { fetchApi } from '../utils/api.js';

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
      const data = await fetchApi('/reports');
      
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
      const newReport = await fetchApi('/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
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
      await fetchApi(`/reports/${id}`, { method: 'DELETE' });
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