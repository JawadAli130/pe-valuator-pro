import { prisma } from '../lib/db';
import { Provider } from '../types/provider';

export async function fetchProviders() {
  return prisma.provider.findMany({
    include: {
      _count: {
        select: { dataPoints: true }
      }
    }
  });
}

export async function createProvider(provider: Pick<Provider, 'name'>) {
  return prisma.provider.create({
    data: provider
  });
}

export async function updateProvider(id: number, data: Pick<Provider, 'name'>) {
  return prisma.provider.update({
    where: { id },
    data
  });
}

export async function deleteProvider(id: number) {
  return prisma.provider.delete({
    where: { id }
  });
}
