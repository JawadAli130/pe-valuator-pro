import { prisma } from '../lib/db.js';
import { Provider } from '../types/provider.js';

export async function fetchProviders() {
  const providers = await prisma.provider.findMany({
    include: {
      _count: {
        select: { dataPoints: true }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return providers.map(provider => ({
    id: provider.id,
    name: provider.name,
    dataPoints: provider._count.dataPoints,
    updatedAt: provider.updatedAt
  }));
}

export async function createProvider(provider: Pick<Provider, 'name'>) {
  return prisma.provider.create({
    data: provider,
    include: {
      _count: {
        select: { dataPoints: true }
      }
    }
  });
}

export async function updateProvider(id: number, data: Pick<Provider, 'name'>) {
  return prisma.provider.update({
    where: { id },
    data
  });
}




  export async function deleteProvider(id: number) {
    try {
      await prisma.dataPoint.deleteMany({
        where: { providerId: id }
      });
  
      
      return prisma.provider.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting provider:', error);
      throw new Error('Failed to delete provider');
    }
    
}
