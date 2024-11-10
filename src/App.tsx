import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DataProviders } from './components/DataProviders';
import { DataPoints } from './components/DataPoints';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';

type View = 'dashboard' | 'providers' | 'dataPoints' | 'reports' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'providers':
        return <DataProviders />;
      case 'dataPoints':
        return <DataPoints />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout onNavigate={setCurrentView} currentView={currentView}>
      {renderView()}
    </Layout>
  );
}

export default App;