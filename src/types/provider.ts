export interface Provider {
  id: number;
  name: string;
  dataPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderFilters {
  searchTerm?: string;
}

export function filterProviders(providers: Provider[], filters: ProviderFilters): Provider[] {
  return providers.filter(provider => {
    if (filters.searchTerm && !provider.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
}