import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Report } from '../types/report';
import { ViewReportModal } from './reports/ViewReportModal';
import { AddReportModal } from './reports/AddReportModal';
import { ReportsTable } from './reports/ReportsTable';
import { ReportFilters } from './reports/ReportFilters';
import { exportReportToPDF } from '../utils/pdfExport';
import { useReportData } from '../hooks/useReportData';
import { generateReport } from '../utils/reportGenerator';
import { validateReport } from '../utils/validation';

interface ReportFilters {
  assetClass?: string;
  quarter?: string;
  status?: 'draft' | 'final';
}

export function Reports() {
  const { 
    reports, 
    dataPoints, 
    settings, 
    loading, 
    error, 
    addReport,
    deleteReport 
  } = useReportData();

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [newReport, setNewReport] = useState({
    name: '',
    assetClass: 'Buyout',
    quarter: 'Q1 2024',
    qualitativeFactors: [],
    volatilityScore: 3
  });

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleExportPDF = (report: Report) => {
    exportReportToPDF(report, {
      currentNAV: '0',
      fundManager: '',
      vintage: '',
      buyers: '',
      includeQualitativeFactors: true,
      includeMarketData: true
    });
  };

  const handleAddReport = () => {
    setNewReport({
      name: '',
      assetClass: 'Buyout',
      quarter: 'Q1 2024',
      qualitativeFactors: [],
      volatilityScore: 3
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings?.assetClasses) {
      alert('Settings not properly initialized');
      return;
    }

    const assetClassSettings = settings.assetClasses[newReport.assetClass.toLowerCase()];
    if (!assetClassSettings?.weights) {
      alert('Missing settings for selected asset class');
      return;
    }

    const errors = validateReport(newReport);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    try {
      const report = generateReport(
        newReport.name,
        newReport.assetClass,
        newReport.quarter,
        newReport.qualitativeFactors,
        newReport.volatilityScore,
        dataPoints,
        { assetClasses: { [newReport.assetClass.toLowerCase()]: assetClassSettings } }
      );
      
      await addReport(report);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating report:', error);
      alert(error instanceof Error ? error.message : 'Failed to create report');
    }
  };

  const handleUpdateNewReport = (field: string, value: any) => {
    setNewReport(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQualitativeFactor = () => {
    if (!settings?.assetClasses) {
      console.error('Settings or assetClasses not found');
      return;
    }
    
    
    const assetClass = newReport.assetClass?.toLowerCase();
    

    if (!assetClass) {
      console.error('Asset class is undefined or empty');
      return;
    }
    
    const assetClassSettings = settings.assetClasses[assetClass];
    if (!assetClassSettings) {
      console.error(`Asset class settings not found for ${assetClass}`);
      return;
    }
  
    if (!assetClassSettings?.weights) {
      console.error(`Weights not found in settings for asset class: ${assetClass}`);
      return;
    }
    
    const defaultWeight = assetClassSettings.weights.gpQuartile || 1;
  
    setNewReport(prev => ({
      ...prev,
      qualitativeFactors: [
        ...prev.qualitativeFactors,
        { 
          name: 'gpQuartile', 
          score: 0, 
          weight: defaultWeight 
        }
      ]
    }));
  };
  
  const handleUpdateQualitativeFactor = (
    index: number,
    field: 'name' | 'score',
    value: string | number
  ) => {
    if (!settings?.assetClasses) return;
    
    const assetClass = newReport.assetClass.toLowerCase();
    const assetClassSettings = settings.assetClasses[assetClass];
    
    if (!assetClassSettings?.weights) {
      console.error('Asset class settings or weights not found');
      return;
    }

    setNewReport(prev => ({
      ...prev,
      qualitativeFactors: prev.qualitativeFactors.map((factor, i) =>
        i === index
          ? {
              ...factor,
              [field]: value,
              weight: field === 'name' 
                ? (assetClassSettings.weights[value as string] || assetClassSettings.weights.gpQuartile)
                : factor.weight
            }
          : factor
      )
    }));
  };

  const handleRemoveQualitativeFactor = (index: number) => {
    setNewReport(prev => ({
      ...prev,
      qualitativeFactors: prev.qualitativeFactors.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteReport = async (reportId: number) => {
    try {
      if (!window.confirm('Are you sure you want to delete this report?')) {
        return;
      }
      
      await deleteReport(reportId);
    } catch (error) {
      console.error('Error deleting report:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete report. Please try again.');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filters.assetClass && report.assetClass !== filters.assetClass) return false;
    if (filters.quarter && report.quarter !== filters.quarter) return false;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!settings?.assetClasses || !Array.isArray(dataPoints)) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-lg text-gray-600">Failed to load required data</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-2 text-gray-600">View and manage valuation reports</p>
        </div>
        <button
          onClick={handleAddReport}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          New Report
        </button>
      </div>

      <ReportFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <ReportsTable
        reports={filteredReports}
        onViewReport={handleViewReport}
        onExportPDF={handleExportPDF}
        onDeleteReport={handleDeleteReport}
      />

      {selectedReport && (
        <ViewReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {isAddModalOpen && (
        <AddReportModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          newReport={newReport}
          onSubmit={handleSubmitReport}
          onUpdateReport={handleUpdateNewReport}
          onAddQualitativeFactor={handleAddQualitativeFactor}
          onUpdateQualitativeFactor={handleUpdateQualitativeFactor}
          onRemoveQualitativeFactor={handleRemoveQualitativeFactor}
        />
      )}
    </div>
  );
}