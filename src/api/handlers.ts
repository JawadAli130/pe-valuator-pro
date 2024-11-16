import { createReport, fetchReportData } from './reports.js';

export async function handleFetchReports(): Promise<Response> {
  try {
    const data = await fetchReportData();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reports' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

export async function handleCreateReport(req: Request): Promise<Response> {
  try {
    const reportData = await req.json();
    const newReport = await createReport({
      name: reportData.name,
      assetClass: reportData.assetClass,
      quarter: reportData.quarter,
      date: new Date().toISOString(),
      marketAverage: reportData.marketAverage,
      finalPrice: reportData.finalPrice,
      priceRangeMin: reportData.priceRange.min,
      priceRangeMax: reportData.priceRange.max,
      deferralPrice: reportData.deferralPrice,
      deferralRangeMin: reportData.deferralRangeMin,
      deferralRangeMax: reportData.deferralRangeMax,
      volatilityScore: reportData.volatilityScore,
      qualitativeFactors: reportData.qualitativeFactors
    });
    
    return new Response(JSON.stringify(newReport), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return new Response(JSON.stringify({ error: 'Failed to create report' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
