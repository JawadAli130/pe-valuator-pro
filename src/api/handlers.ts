import { Report } from '../types/report.js';
import { createReport, fetchReportData } from './reports.js';

export async function handleFetchReports(): Promise<Response> {
  try {
    const data = await fetchReportData();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch reports' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

export async function handleCreateReport(req: Request): Promise<Response> {
  try {
    const report = await req.json() as Omit<Report, 'id'>;
    const newReport = await createReport(report);
    return new Response(JSON.stringify(newReport), {
      headers: { 'Content-Type': 'application/json' },
      status: 201
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create report' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
