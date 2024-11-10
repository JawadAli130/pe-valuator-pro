import { prisma } from '../lib/db';

export async function fetchDashboardStats() {
  const [reports, providers] = await Promise.all([
    prisma.report.findMany({
      orderBy: { date: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        finalPrice: true,
        date: true
      }
    }),
    prisma.provider.count()
  ]);

  const reportsCount = await prisma.report.count();
  const avgPrice = await prisma.report.aggregate({
    _avg: {
      finalPrice: true
    }
  });

  return {
    totalReports: reportsCount,
    averagePrice: avgPrice._avg.finalPrice || 0,
    activeProviders: providers,
    recentReports: reports.map(r => ({
      ...r,
      date: r.date.toLocaleDateString()
    }))
  };
}
