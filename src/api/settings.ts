import { prisma } from '../lib/db.js';
import { defaultAssetClassSettings } from '../constants/defaultSettings.js';

export async function fetchSettings() {
  const settingsData = await prisma.settings.findMany();
  
  const settingsMap = settingsData.length > 0 
    ? settingsData.reduce((acc, setting) => ({
        ...acc,
        [setting.assetClass]: {
          sMax: setting.sMax,
          aNegative: setting.aNegative,
          aPositive: setting.aPositive,
          m: setting.m,
          adjustmentPerUnit: setting.adjustmentPerUnit,
          weights: setting.weights as Record<string, number>
        }
      }), {})
    : { buyout: defaultAssetClassSettings };

  return { assetClasses: settingsMap };
}

export async function updateSettings(assetClass: string, settings: any) {
  
  const existingSettings = await prisma.settings.findUnique({
    where: { assetClass },
  });

  if (existingSettings) {
    
    return prisma.settings.update({
      where: { assetClass },
      data: settings,
    });
  } else {
    
    return prisma.settings.create({
      data: {
        assetClass,
        ...settings,  
      },
    });
  }
}


