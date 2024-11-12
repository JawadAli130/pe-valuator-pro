import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../lib/db.js';
import { fetchProviders, createProvider, updateProvider, deleteProvider } from '../api/providers.js';
import { fetchDashboardStats } from '../api/dashboard.js';
import { fetchSettings, updateSettings } from '../api/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files
app.use('/pricing_tool', express.static(path.join(__dirname, '../../dist')));

// API Routes
app.get('/api/providers', async (req, res) => {
  try {
    const providers = await fetchProviders();
    res.json(providers);
  } catch (error) {
    console.error('Failed to fetch providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

app.post('/api/providers', async (req, res) => {
  try {
    const provider = await createProvider(req.body);
    res.status(201).json(provider);
  } catch (error) {
    console.error('Failed to create provider:', error);
    res.status(500).json({ error: 'Failed to create provider' });
  }
});

app.put('/api/providers/:id', async (req, res) => {
  try {
    const provider = await updateProvider(Number(req.params.id), req.body);
    res.json(provider);
  } catch (error) {
    console.error('Failed to update provider:', error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

app.delete('/api/providers/:id', async (req, res) => {
  try {
    await deleteProvider(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete provider:', error);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

// Dashboard endpoints
app.get('/api/dashboard', async (req, res) => {
  try {
    const stats = await fetchDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Data points endpoints
app.get('/api/dataPoints', async (req, res) => {
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

app.post('/api/dataPoints', async (req, res) => {
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

app.put('/api/dataPoints/:id', async (req, res) => {
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

app.delete('/api/dataPoints/:id', async (req, res) => {
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
app.get('/api/reports', async (req, res) => {
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

app.post('/api/reports', async (req, res) => {
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

app.delete('/api/reports/:id', async (req, res) => {
  try {
    const reportId = parseInt(req.params.id);
    console.log('Attempting to delete report:', reportId);
    
    if (isNaN(reportId)) {
      console.log('Invalid report ID received:', req.params.id);
      return res.status(400).json({ error: 'Invalid report ID' });
    }
    
    // First delete all associated qualitative factors
    await prisma.qualitativeFactor.deleteMany({
      where: {
        reportId: reportId
      }
    });
    
    // Then delete the report
    const report = await prisma.report.delete({
      where: {
        id: reportId
      }
    });
    
    console.log('Successfully deleted report:', report);
    res.status(204).end();
  } catch (error) {
    console.error('Failed to delete report:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await fetchSettings();
    res.json(settings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings/:assetClass', async (req, res) => {
  try {
    const { assetClass } = req.params;
    const settings = req.body;
    const updatedSettings = await updateSettings(assetClass, settings);
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Handle React routing
app.get('/pricing_tool/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
