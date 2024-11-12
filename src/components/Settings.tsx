import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { SettingsForm } from './settings/SettingsForm.js';
import { WeightsForm } from './settings/WeightsForm.js';
import { AssetClassSettings, validateSettings } from '../types/settings.js';
import { AddAssetClassModal } from './settings/AddAssetClassModal.js';
import { fetchApi } from '../utils/api.js';

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
      const data = await fetchApi('/settings');
      
      // Always ensure at least default settings exist
      setSettings({
        assetClasses: {
          ...{
            buyout: defaultAssetClassSettings
          },
          ...(data.assetClasses || {})
        }
      });
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
    await fetchApi(`/settings/${currentAssetClass}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings.assetClasses[currentAssetClass])
    });
    alert('Settings saved successfully');
  } catch (error) {
    console.error('Failed to save settings:', error);
    alert('Failed to save settings');
  }
};

  const handleAddAssetClass = async (name: string) => {
    try {
      const newAssetClassData = {
        assetClass: name.toLowerCase(),
        ...defaultAssetClassSettings,
        weights: defaultAssetClassSettings.weights
      };

      await fetchApi('/settings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssetClassData)
      });

      // Update local state after successful creation
      setSettings(prev => ({
        ...prev,
        assetClasses: {
          ...prev.assetClasses,
          [name.toLowerCase()]: { ...defaultAssetClassSettings }
        }
      }));
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create asset class:', error);
      alert('Failed to create asset class');
    }
  };

  const handleDeleteAssetClass = async () => {
    // Don't allow deletion of the default buyout class
    if (currentAssetClass === 'buyout') {
      alert('Cannot delete the default asset class');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the ${currentAssetClass} asset class? This action cannot be undone.`)) {
      try {
        await fetchApi(`/settings/${currentAssetClass}`, {
          method: 'DELETE'
        });

        // Update local state after successful deletion
        setSettings(prev => {
          const newAssetClasses = { ...prev.assetClasses };
          delete newAssetClasses[currentAssetClass];
          return {
            ...prev,
            assetClasses: newAssetClasses
          };
        });

        // Switch to buyout after deletion
        setCurrentAssetClass('buyout');
      } catch (error) {
        console.error('Failed to delete asset class:', error);
        alert('Failed to delete asset class');
      }
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

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDeleteAssetClass}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
                currentAssetClass === 'buyout'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={currentAssetClass === 'buyout'}
            >
              <Trash2 className="w-4 h-4" />
              Delete Asset Class
            </button>
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
        onAdd={handleAddAssetClass}
      />
    </div>
  );
}
