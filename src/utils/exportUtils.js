import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Export data to Excel
export function exportToExcel(data, filename, sheetName = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Auto-size columns
  const maxWidth = 50;
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.min(maxWidth, Math.max(key.length, ...data.map(row => String(row[key] || '').length)))
  }));
  worksheet['!cols'] = colWidths;

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

// Export multiple sheets to Excel
export function exportMultiSheetExcel(sheets, filename) {
  const workbook = XLSX.utils.book_new();
  
  sheets.forEach(({ data, name }) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  });

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
}

// Format data for dashboard export
export function formatDashboardExport(kpis, programs, plants, alerts) {
  return [
    {
      name: 'KPIs',
      data: [
        { Metric: 'Active Programs', Value: kpis.activePrograms },
        { Metric: 'Programs At Risk', Value: kpis.programsAtRisk },
        { Metric: 'OEE', Value: `${kpis.oee}%` },
        { Metric: 'OEE Change', Value: `${kpis.oeeChange}%` },
        { Metric: 'Cost Savings', Value: `$${(kpis.costSavings / 1000000).toFixed(1)}M` },
        { Metric: 'Capacity Utilization', Value: `${kpis.capacity}%` },
      ]
    },
    {
      name: 'NPI Programs',
      data: programs.map(p => ({
        'Program Name': p.name,
        'Code': p.code,
        'Phase': p.phase,
        'Status': p.status,
        'Days to SOP': p.daysToSOP,
        'Readiness': `${p.overallReadiness}%`,
        'Risks': p.risks.length
      }))
    },
    {
      name: 'Plant Utilization',
      data: plants.map(p => ({
        'Plant': p.name,
        'Region': p.region,
        'Utilization': `${p.utilization}%`,
        'Status': p.status
      }))
    },
    {
      name: 'Alerts',
      data: alerts.map(a => ({
        'Type': a.type,
        'Title': a.title,
        'Description': a.description,
        'Time': a.time
      }))
    }
  ];
}

// Format data for production export
export function formatProductionExport(summary, oee, stations, downtime) {
  return [
    {
      name: 'Summary',
      data: [
        { Metric: 'Takt Time', Value: `${summary.taktTime}s` },
        { Metric: 'Daily Target', Value: summary.target },
        { Metric: 'Actual Output', Value: summary.actual },
        { Metric: 'Gap', Value: summary.gap },
        { Metric: 'Gap %', Value: `${summary.gapPercent}%` },
      ]
    },
    {
      name: 'OEE',
      data: [
        { Metric: 'Overall OEE', Value: `${oee.overall}%` },
        { Metric: 'Availability', Value: `${oee.availability}%` },
        { Metric: 'Performance', Value: `${oee.performance}%` },
        { Metric: 'Quality', Value: `${oee.quality}%` },
      ]
    },
    {
      name: 'Stations',
      data: stations.map(s => ({
        'Station': s.name,
        'Cycle Time': `${s.cycleTime}s`,
        'Utilization': `${s.utilization}%`,
        'Status': s.status
      }))
    },
    {
      name: 'Downtime',
      data: downtime.map(d => ({
        'Reason': d.reason,
        'Minutes': d.minutes,
        'Percentage': `${d.percentage}%`
      }))
    }
  ];
}

// Format data for BOM export
export function formatBOMExport(summary, commodities, suppliers, substitutions) {
  return [
    {
      name: 'Summary',
      data: [
        { Metric: 'Vehicle', Value: summary.vehicle },
        { Metric: 'Total BOM Cost', Value: `$${summary.totalCost.toLocaleString()}` },
        { Metric: 'Should-Cost', Value: `$${summary.shouldCost.toLocaleString()}` },
        { Metric: 'Variance', Value: `$${summary.variance.toLocaleString()}` },
        { Metric: 'Variance %', Value: `${summary.variancePercent}%` },
        { Metric: 'Part Count', Value: summary.partCount },
      ]
    },
    {
      name: 'Commodities',
      data: commodities.map(c => ({
        'Commodity': c.name,
        'Cost': `$${c.cost.toLocaleString()}`,
        'Target': `$${c.target.toLocaleString()}`,
        'Variance': `${c.variance}%`
      }))
    },
    {
      name: 'Suppliers',
      data: suppliers.map(s => ({
        'Supplier': s.name,
        'Part': s.part,
        'Quote': `$${s.quote.toLocaleString()}`,
        'Should-Cost': `$${s.shouldCost.toLocaleString()}`,
        'Variance': `${s.variance}%`,
        'Lead Time': `${s.leadTime} weeks`,
        'Quality': `${s.quality}%`,
        'Status': s.status
      }))
    },
    {
      name: 'Substitutions',
      data: substitutions.map(s => ({
        'Part': s.part,
        'Current Material': s.current.material,
        'Current Weight': `${s.current.weight} kg`,
        'Current Cost': `$${s.current.cost}`,
        'Proposed Material': s.proposed.material,
        'Proposed Weight': `${s.proposed.weight} kg`,
        'Proposed Cost': `$${s.proposed.cost}`,
        'Weight Reduction': `${s.impact.weightReduction} kg`,
        'Cost Increase': `$${s.impact.costIncrease}`,
        'Range Gain': `${s.impact.rangeGain} mi`
      }))
    }
  ];
}

// Format data for capacity export
export function formatCapacityExport(summary, plants, scenarios) {
  return [
    {
      name: 'Summary',
      data: [
        { Metric: 'Total Capacity', Value: summary.totalCapacity.toLocaleString() },
        { Metric: 'Total Demand', Value: summary.totalDemand.toLocaleString() },
        { Metric: 'Gap', Value: summary.gap.toLocaleString() },
        { Metric: 'Utilization', Value: `${summary.utilization}%` },
      ]
    },
    {
      name: 'Plants',
      data: plants.map(p => ({
        'Plant': p.name,
        'Region': p.region,
        'Nameplate Capacity': p.nameplateCapacity.toLocaleString(),
        'Effective Capacity': p.effectiveCapacity.toLocaleString(),
        'Demand': p.demand.toLocaleString(),
        'Utilization': `${p.utilization}%`,
        'Status': p.status,
        'Products': p.products.join(', ')
      }))
    }
  ];
}