import { prisma } from '../lib/db.js';

export async function fetchSettings() {
  const settingsData = await prisma.settings.findMany();
  
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

  return { assetClasses: settingsMap };
}

export async function updateSettings(assetClass: string, settings: any) {
  return prisma.settings.update({
    where: { assetClass },
    data: settings
  });
}
