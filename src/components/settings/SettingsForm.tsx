import React from 'react';
import { AssetClassSettings } from '../../types/settings';

interface SettingsFormProps {
  settings: AssetClassSettings;
  onSettingChange: (field: keyof AssetClassSettings, value: string | number) => void;
}

export function SettingsForm({ settings, onSettingChange }: SettingsFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Basic Parameters</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sMax" className="block text-sm font-medium text-gray-700">
            Maximum Absolute Score (S_max)
          </label>
          <input
            type="number"
            id="sMax"
            value={settings.sMax}
            onChange={(e) => onSettingChange('sMax', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label htmlFor="aNegative" className="block text-sm font-medium text-gray-700">
            Negative Score Scaling (a_negative)
          </label>
          <input
            type="number"
            id="aNegative"
            value={settings.aNegative}
            onChange={(e) => onSettingChange('aNegative', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label htmlFor="aPositive" className="block text-sm font-medium text-gray-700">
            Positive Score Scaling (a_positive)
          </label>
          <input
            type="number"
            id="aPositive"
            value={settings.aPositive}
            onChange={(e) => onSettingChange('aPositive', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label htmlFor="m" className="block text-sm font-medium text-gray-700">
            Volatility Impact (m)
          </label>
          <input
            type="number"
            id="m"
            value={settings.m}
            onChange={(e) => onSettingChange('m', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            max="1"
            step="0.1"
          />
        </div>

        <div>
          <label htmlFor="adjustmentPerUnit" className="block text-sm font-medium text-gray-700">
            Adjustment per Unit
          </label>
          <input
            type="number"
            id="adjustmentPerUnit"
            value={settings.adjustmentPerUnit}
            onChange={(e) => onSettingChange('adjustmentPerUnit', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}