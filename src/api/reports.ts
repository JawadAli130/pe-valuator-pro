import { prisma } from '../lib/db';
import { Report } from '../types/report';

export async function fetchReportData() {
  const [reportsData, dataPointsData, settingsData] = await Promise.all([
    prisma.report.findMany({
      include: {
        qualitativeFactors: true
      }
    }),
    prisma.dataPoint.findMany({
      include: {
        provider: true
      }
    }),
    prisma.settings.findMany()
  ]);

  const settingsMap = settingsData.reduce((acc, setting) => ({
    ...acc,
    [setting.assetClass]: {
      sMax: setting.sMax,
      aNegative: setting.aNegative,
      aPositive: setting.aPositive,
      m: setting.m,
      adjustmentPerUnit: setting.adjustmentPerUnit,
      weights: setting.weights as Record<string, number>
    }
  }), {});

  return {
    reports: reportsData,
    dataPoints: dataPointsData,
    settings: { assetClasses: settingsMap }
  };
}

export async function createReport(report: Omit<Report, 'id'>) {
  return prisma.report.create({
    data: {
      ...report,
      qualitativeFactors: {
        create: report.qualitativeFactors
      }
    },
    include: {
      qualitativeFactors: true
    }
  });
}
