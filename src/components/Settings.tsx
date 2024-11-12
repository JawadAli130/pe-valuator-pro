import React, { useState, useEffect } from 'react';
import { Save, Plus } from 'lucide-react';
import { SettingsForm } from './settings/SettingsForm';
import { WeightsForm } from './settings/WeightsForm';
import { AssetClassSettings, validateSettings } from '../types/settings';
import { AddAssetClassModal } from './settings/AddAssetClassModal';

const defaultAssetClassSettings: AssetClassSettings = {
  sMax: 5.0,
  aNegative: 2.0,
  aPositive: 1.0,
  m: 0.5,
  adjustmentPerUnit: 5.0,
  weights: {
    gpQuartile: 2.0,
    strategyDesirability: 1.0,
    gpNavValuation: 1.0,
    vintageDesirability: 1.0,
    geographicDesirability: 1.0,
    ticketSizeLiquidity: 1.0,
    default: 1.0
  }
};

interface Settings {
  assetClasses: Record<string, AssetClassSettings>;
}

export function Settings() {
  const [settings, setSettings] = useState<Settings>({
    assetClasses: {
      buyout: defaultAssetClassSettings
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAssetClass, setCurrentAssetClass] = useState<string>('buyout');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

   const loadSettings = async () => {
    try {
      const response = await fetch('/pricing_tool/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      
      // If no settings exist, use default settings
      if (!data.assetClasses || Object.keys(data.assetClasses).length === 0) {
        setSettings({
          assetClasses: {
            buyout: defaultAssetClassSettings
          }
        });
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to load settings');
      // Set default settings on error
      setSettings({
        assetClasses: {
          buyout: defaultAssetClassSettings
        }
      });
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const errors = validateSettings(settings.assetClasses[currentAssetClass]);
  
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }

  try {
    const response = await fetch(`/pricing_tool/api/settings/${currentAssetClass}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings.assetClasses[currentAssetClass])
    });

    if (!response.ok) {
      throw new Error('Failed to save settings');
    }

    alert('Settings saved successfully');
  } catch (error) {
    console.error('Failed to save settings:', error);
    alert('Failed to save settings');
  }
};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Settings</h1>
          <p className="mt-2 text-gray-600">Configure pricing algorithm parameters</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Asset Class
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="assetClass" className="block text-sm font-medium text-gray-700">
            Select Asset Class
          </label>
          <select
            id="assetClass"
            value={currentAssetClass}
            onChange={(e) => setCurrentAssetClass(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(settings.assetClasses).map((assetClass) => (
              <option key={assetClass} value={assetClass}>
                {assetClass.charAt(0).toUpperCase() + assetClass.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <SettingsForm
              settings={settings.assetClasses[currentAssetClass]}
              onSettingChange={(field, value) => {
                setSettings(prev => ({
                  ...prev,
                  assetClasses: {
                    ...prev.assetClasses,
                    [currentAssetClass]: {
                      ...prev.assetClasses[currentAssetClass],
                      [field]: value
                    }
                  }
                }));
              }}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <WeightsForm
              weights={settings.assetClasses[currentAssetClass].weights}
              onWeightChange={(factor, value) => {
                setSettings(prev => ({
                  ...prev,
                  assetClasses: {
                    ...prev.assetClasses,
                    [currentAssetClass]: {
                      ...prev.assetClasses[currentAssetClass],
                      weights: {
                        ...prev.assetClasses[currentAssetClass].weights,
                        [factor]: value
                      }
                    }
                  }
                }));
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>

      <AddAssetClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(name) => {
          setSettings(prev => ({
            ...prev,
            assetClasses: {
              ...prev.assetClasses,
              [name.toLowerCase()]: { ...defaultAssetClassSettings }
            }
          }));
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
