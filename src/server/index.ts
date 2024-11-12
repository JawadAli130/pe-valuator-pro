import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/db.js';
import { createProvider, updateProvider, deleteProvider } from '../api/providers.js';
import { fetchDashboardStats } from '../api/dashboard.js';
import { fetchSettings, updateSettings } from '../api/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use('/pricing_tool', express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/pricing_tool/api/providers', async (_req: Request, res: Response) => {
  try {
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

    const formattedProviders = providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      dataPoints: provider._count.dataPoints,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString()
    }));

    res.json(formattedProviders);
  } catch (error) {
    console.error('Failed to fetch providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

app.post('/pricing_tool/api/providers', async (req: Request, res: Response) => {
  try {
    const provider = await createProvider(req.body);
    const formattedProvider = {
      id: provider.id,
      name: provider.name,
      dataPoints: provider._count.dataPoints,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString()
    };
    res.status(201).json(formattedProvider);
  } catch (error) {
    console.error('Failed to create provider:', error);
    res.status(500).json({ error: 'Failed to create provider' });
  }
});

app.put('/pricing_tool/api/providers/:id', async (req: Request, res: Response) => {
  try {
    const provider = await updateProvider(Number(req.params.id), req.body);
    res.json(provider);
  } catch (error) {
    console.error('Failed to update provider:', error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

app.delete('/pricing_tool/api/providers/:id', async (req: Request, res: Response) => {
  try {
    await deleteProvider(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete provider:', error);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

// Dashboard endpoints
app.get('/pricing_tool/api/dashboard', async (_req: Request, res: Response) => {
  try {
    const stats = await fetchDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Data points endpoints
app.get('/pricing_tool/api/dataPoints', async (_req: Request, res: Response) => {
  try {
    const dataPoints = await prisma.dataPoint.findMany({
      include: {
        provider: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    res.json(dataPoints);
  } catch (error) {
    console.error('Failed to fetch data points:', error);
    res.status(500).json({ error: 'Failed to fetch data points' });
  }
});

app.post('/pricing_tool/api/dataPoints', async (req: Request, res: Response) => {
  try {
    const { provider, assetClass, quarter, minPrice, maxPrice } = req.body;
    
    const dataPoint = await prisma.dataPoint.create({
      data: {
        providerId: parseInt(provider),
        assetClass,
        quarter,
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        date: new Date()
      },
      include: {
        provider: true
      }
    });
    
    res.status(201).json(dataPoint);
  } catch (error) {
    console.error('Failed to create data point:', error);
    res.status(500).json({ error: 'Failed to create data point' });
  }
});

app.put('/pricing_tool/api/dataPoints/:id', async (req: Request, res: Response) => {
  try {
    const dataPoint = await prisma.dataPoint.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
        provider: {
          connect: { id: parseInt(req.body.provider) }
        }
      },
      include: {
        provider: true
      }
    });
    res.json(dataPoint);
  } catch (error) {
    console.error('Failed to update data point:', error);
    res.status(500).json({ error: 'Failed to update data point' });
  }
});

app.delete('/pricing_tool/api/dataPoints/:id', async (req: Request, res: Response) => {
  try {
    const dataPointId = parseInt(req.params.id);
    if (isNaN(dataPointId)) {
      return res.status(400).json({ error: 'Invalid data point ID' });
    }
    await prisma.dataPoint.delete({
      where: {
        id: dataPointId
      }
    });
    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete data point:', error);
    res.status(500).json({ error: 'Failed to delete data point' });
  }
});

// Reports endpoints
app.get('/pricing_tool/api/reports', async (_req: Request, res: Response) => {
  try {
    const [reports, dataPoints, settings] = await Promise.all([
      prisma.report.findMany({
        include: { qualitativeFactors: true }
      }),
      prisma.dataPoint.findMany({
        include: { provider: true }
      }),
      prisma.settings.findMany()
    ]);

    const settingsMap = settings.reduce((acc, setting) => ({
      ...acc,
      [setting.assetClass]: {
        sMax: setting.sMax,
        aNegative: setting.aNegative,
        aPositive: setting.aPositive,
        m: setting.m,
        adjustmentPerUnit: setting.adjustmentPerUnit,
        weights: setting.weights
      }
    }), {});

    res.json({
      reports,
      dataPoints,
      settings: { assetClasses: settingsMap }
    });
  } catch (error) {
    console.error('Failed to fetch report data:', error);
    res.status(500).json({ error: 'Failed to fetch report data' });
  }
});

app.post('/pricing_tool/api/reports', async (req: Request, res: Response) => {
  try {
    const report = await prisma.report.create({
      data: {
        name: req.body.name,
        assetClass: req.body.assetClass,
        quarter: req.body.quarter,
        date: new Date(),
        status: 'DRAFT',
        marketAverage: req.body.marketAverage,
        finalPrice: req.body.finalPrice,
        priceRangeMin: req.body.priceRange.min,
        priceRangeMax: req.body.priceRange.max,
        deferralPrice: req.body.deferralPrice,
        deferralRangeMin: req.body.deferralPriceRange.min,
        deferralRangeMax: req.body.deferralPriceRange.max,
        volatilityScore: req.body.volatilityScore,
        qualitativeFactors: {
          create: req.body.qualitativeFactors
        }
      },
      include: {
        qualitativeFactors: true
      }
    });
    res.status(201).json(report);
  } catch (error) {
    console.error('Failed to create report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.delete('/pricing_tool/api/reports/:id', async (req: Request, res: Response) => {
  try {
    const reportId = parseInt(req.params.id);
    console.log('Attempting to delete report:', reportId);
    if (isNaN(reportId)) {
      console.log('Invalid report ID received:', req.params.id);
      return res.status(400).json({ error: 'Invalid report ID' });
    }
    await prisma.qualitativeFactor.deleteMany({
      where: {
        reportId: reportId
      }
    });
    const report = await prisma.report.delete({
      where: {
        id: reportId
      }
    });
    console.log('Successfully deleted report:', report);
    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete report:', error as any);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Settings endpoints
app.get('/pricing_tool/api/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await fetchSettings();
    res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/pricing_tool/api/settings/:assetClass', async (req: Request, res: Response) => {
  try {
    const { assetClass } = req.params;
    const settings = req.body;
    const updatedSettings = await updateSettings(assetClass, settings);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.post('/pricing_tool/api/settings/create', async (req: Request, res: Response) => {
  try {
    const { assetClass, sMax, aNegative, aPositive, m, adjustmentPerUnit, weights } = req.body;
    
    if (!assetClass) {
      return res.status(400).json({ error: 'Asset class name is required' });
    }

    const newSettings = await prisma.settings.create({
      data: {
        assetClass,
        sMax,
        aNegative,
        aPositive,
        m,
        adjustmentPerUnit,
        weights
      }
    });

    res.status(201).json(newSettings);
  } catch (error) {
    console.error('Failed to create settings:', error);
    res.status(500).json({ error: 'Failed to create settings' });
  }
});

app.delete('/pricing_tool/api/settings/:assetClass', async (req: Request, res: Response) => {
  try {
    const { assetClass } = req.params;
    
    if (assetClass === 'buyout') {
      return res.status(400).json({ error: 'Cannot delete default asset class' });
    }

    await prisma.settings.delete({
      where: { assetClass }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete settings:', error);
    res.status(500).json({ error: 'Failed to delete settings' });
  }
});

// Handle React routing
app.get('/pricing_tool/*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
