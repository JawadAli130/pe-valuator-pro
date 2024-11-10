import React from 'react';
import { qualitativeFactorOptions } from '../../types/report';

interface WeightsFormProps {
  weights: {
    [key: string]: number;
    default: number;
  };
  onWeightChange: (factor: string, value: number) => void;
}

export function WeightsForm({ weights, onWeightChange }: WeightsFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Factor Weights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {qualitativeFactorOptions.map((factor) => (
          <div key={factor.name}>
            <label htmlFor={factor.name} className="block text-sm font-medium text-gray-700">
              {factor.label} Weight
            </label>
            <input
              type="number"
              id={factor.name}
              value={weights[factor.name]}
              onChange={(e) => onWeightChange(factor.name, parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="0"
              step="0.1"
            />
          </div>
        ))}

        <div>
          <label htmlFor="defaultWeight" className="block text-sm font-medium text-gray-700">
            Default Weight
          </label>
          <input
            type="number"
            id="defaultWeight"
            value={weights.default}
            onChange={(e) => onWeightChange('default', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
}