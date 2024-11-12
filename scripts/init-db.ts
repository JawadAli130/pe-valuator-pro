import { prisma } from '../src/lib/db.js';
import { defaultAssetClassSettings } from '../src/constants/defaultSettings.js';

async function main() {
  // Initialize settings for each asset class
  const assetClasses = ['buyout', 'growth', 'venture'];
  
  for (const assetClass of assetClasses) {
    await prisma.settings.upsert({
      where: { assetClass },
      update: {
        ...defaultAssetClassSettings,
        weights: defaultAssetClassSettings.weights
      },
      create: {
        assetClass,
        ...defaultAssetClassSettings,
        weights: defaultAssetClassSettings.weights
      }
    });
  }

  console.log('Database initialized successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 