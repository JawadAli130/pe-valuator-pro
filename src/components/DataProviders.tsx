import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ProvidersTable } from './providers/ProvidersTable.js';
import { ProviderModal } from './providers/ProviderModal.js';
import { Provider, ProviderFilters, filterProviders } from '../types/provider.js';
import { fetchApi } from '../utils/api.js';

export function DataProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentProvider, setCurrentProvider] = useState<Partial<Provider>>({
    name: '',
  });
  const [filters, setFilters] = useState<ProviderFilters>({
    searchTerm: ''
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await fetchApi('/providers');
      setProviders(data);
    } catch (error) {
      console.error('Failed to load providers:', error);
      setError(error instanceof Error ? error.message : 'Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProvider.name?.trim()) {
      alert('Provider name is required');
      return;
    }

    try {
      await fetchApi('/providers', {
        method: modalMode === 'add' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProvider)
      });
      
      await loadProviders();
      setIsModalOpen(false);
      setCurrentProvider({ name: '' });
    } catch (error) {
      console.error('Failed to save provider:', error);
      alert('Failed to save provider');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this provider? All associated data points will also be deleted.')) {
      try {
        await fetchApi(`/providers/${id}`, { method: 'DELETE' });
        await loadProviders();
      } catch (error) {
        console.error('Failed to delete provider:', error);
        alert('Failed to delete provider');
      }
    }
  };

  const handleEdit = (provider: Partial<Provider>) => {
    setCurrentProvider(provider);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProvider({
      name: '',
    });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const filteredProviders = filterProviders(providers, filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Providers</h1>
          <p className="mt-2 text-gray-600">Manage your data provider sources</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Provider
        </button>
      </div>

      {/* Search Filter */}
      <div className="max-w-md">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Search Providers
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="search"
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            placeholder="Search by provider name..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <ProvidersTable
        providers={filteredProviders}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProviderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={currentProvider}
        onSubmit={handleSubmit}
        onChange={(name, value) => setCurrentProvider({ ...currentProvider, [name]: value })}
        mode={modalMode}
      />
    </div>
  );
}