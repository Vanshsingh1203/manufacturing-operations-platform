import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { productionData } from '../../data/mockData';
import { useToast } from '../../components/shared/Toast';
import { exportMultiSheetExcel, formatProductionExport } from '../../utils/exportUtils';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import GaugeChart from '../../components/shared/GaugeChart';
import { 
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

// Period-specific data
const periodData = {
  today: {
    summary: { taktTime: 52, target: 1200, actual: 1087, gap: -113, gapPercent: -9.4 },
    oee: { overall: 84.2, availability: 91.5, performance: 94.8, quality: 97.1 },
    oeeChange: 2.1,
    outputTrend: [
      { day: '6AM', target: 150, actual: 142 },
      { day: '8AM', target: 150, actual: 138 },
      { day: '10AM', target: 150, actual: 155 },
      { day: '12PM', target: 150, actual: 148 },
      { day: '2PM', target: 150, actual: 132 },
      { day: '4PM', target: 150, actual: 145 },
      { day: '6PM', target: 150, actual: 140 }
    ]
  },
  week: {
    summary: { taktTime: 52, target: 8400, actual: 7667, gap: -733, gapPercent: -8.7 },
    oee: { overall: 82.8, availability: 90.2, performance: 93.5, quality: 98.2 },
    oeeChange: 1.5,
    outputTrend: [
      { day: 'Mon', target: 1200, actual: 1050 },
      { day: 'Tue', target: 1200, actual: 1120 },
      { day: 'Wed', target: 1200, actual: 980 },
      { day: 'Thu', target: 1200, actual: 1150 },
      { day: 'Fri', target: 1200, actual: 1100 },
      { day: 'Sat', target: 1200, actual: 1180 },
      { day: 'Sun', target: 1200, actual: 1087 }
    ]
  },
  month: {
    summary: { taktTime: 52, target: 36000, actual: 32850, gap: -3150, gapPercent: -8.8 },
    oee: { overall: 83.5, availability: 90.8, performance: 94.1, quality: 97.8 },
    oeeChange: 3.2,
    outputTrend: [
      { day: 'Week 1', target: 8400, actual: 7800 },
      { day: 'Week 2', target: 8400, actual: 8100 },
      { day: 'Week 3', target: 8400, actual: 7200 },
      { day: 'Week 4', target: 8400, actual: 9750 }
    ]
  }
};

// Plant-specific multipliers
const plantMultipliers = {
  all: 1.0,
  'plant-a': 1.05,
  'plant-b': 0.92,
  'plant-c': 1.12,
  'plant-d': 0.88,
  'plant-e': 1.08,
  'plant-f': 0.95
};

function StationRow({ station, taktTime, theme, isDark }) {
  const isBottleneck = station.status === 'bottleneck';
  const utilizationColor = station.utilization > 100 ? theme.danger : station.utilization > 95 ? theme.warning : theme.success;
  const cycleTimePercent = (station.cycleTime / taktTime) * 100;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '160px 80px 1fr 70px 70px 80px', 
      alignItems: 'center', 
      padding: '12px 16px',
      background: isBottleneck ? theme.dangerBg : 'transparent',
      borderRadius: '8px',
      marginBottom: '8px',
      border: isBottleneck ? `1px solid ${theme.danger}` : `0.5px solid ${theme.border}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isBottleneck && <AlertTriangle size={14} color={theme.danger} />}
        <span style={{ fontSize: '12px', fontWeight: '500', color: theme.text }}>{station.name}</span>
      </div>
      
      <div style={{ fontSize: '12px', color: isBottleneck ? theme.danger : theme.text, fontWeight: isBottleneck ? '600' : '400' }}>
        {station.cycleTime}s
      </div>
      
      <div style={{ padding: '0 16px' }}>
        <div style={{ position: 'relative', height: '8px', background: isDark ? '#222' : '#f0f0f0', borderRadius: '4px', overflow: 'visible' }}>
          <div style={{ 
            position: 'absolute',
            left: `${(taktTime / Math.max(taktTime, station.cycleTime)) * 100}%`,
            top: '-4px',
            bottom: '-4px',
            width: '2px',
            background: theme.textMuted,
            zIndex: 2
          }} />
          <div style={{ 
            width: `${Math.min(cycleTimePercent, 100)}%`, 
            height: '100%', 
            background: isBottleneck ? theme.danger : theme.success,
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{ fontSize: '12px', color: utilizationColor, fontWeight: '500', textAlign: 'right' }}>
        {station.utilization}%
      </div>

      <div style={{ fontSize: '12px', color: theme.textSecondary, textAlign: 'right' }}>
        {station.defectRate}%
      </div>

      <div style={{ textAlign: 'right' }}>
        <span style={{ 
          fontSize: '10px', 
          padding: '4px 8px', 
          borderRadius: '4px',
          background: isBottleneck ? theme.dangerBg : theme.successBg,
          color: isBottleneck ? theme.danger : theme.success,
          fontWeight: '500',
          textTransform: 'uppercase'
        }}>
          {isBottleneck ? 'Bottleneck' : 'OK'}
        </span>
      </div>
    </div>
  );
}

export default function Production() {
  const { theme, isDark } = useTheme();
  const { showToast, ToastContainer } = useToast();
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isExporting, setIsExporting] = useState(false);
  
  const { stations, downtime, oee: baseOEE } = productionData;
  
  // Get period-specific data
  const currentPeriodData = periodData[selectedPeriod];
  const multiplier = plantMultipliers[selectedPlant];

  // Calculate adjusted values
  const adjustedOEE = {
    overall: Math.min(99, (currentPeriodData.oee.overall * multiplier)).toFixed(1),
    availability: Math.min(99, (currentPeriodData.oee.availability * multiplier)).toFixed(1),
    performance: Math.min(99, (currentPeriodData.oee.performance * multiplier)).toFixed(1),
    quality: Math.min(99, (currentPeriodData.oee.quality * multiplier)).toFixed(1),
  };

  const adjustedSummary = {
    ...currentPeriodData.summary,
    actual: Math.round(currentPeriodData.summary.actual * multiplier),
    gap: Math.round(currentPeriodData.summary.target - (currentPeriodData.summary.actual * multiplier)),
    gapPercent: (((currentPeriodData.summary.target - (currentPeriodData.summary.actual * multiplier)) / currentPeriodData.summary.target) * -100).toFixed(1)
  };

  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
    const plantName = plant === 'all' ? 'All Plants' : plant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    showToast(`Showing data for ${plantName}`, 'info');
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const periodName = period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month';
    showToast(`Showing ${periodName} data`, 'info');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = formatProductionExport(adjustedSummary, currentPeriodData.oee, stations, downtime);
      const plantName = selectedPlant === 'all' ? 'All_Plants' : selectedPlant.replace('-', '_').toUpperCase();
      const periodName = selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1);
      exportMultiSheetExcel(exportData, `Production_Report_${plantName}_${periodName}_${new Date().toISOString().split('T')[0]}`);
      showToast('Production report exported successfully!', 'success');
    } catch (error) {
      showToast('Export failed. Please try again.', 'error');
    }
    setIsExporting(false);
  };

  const selectStyle = {
    padding: '8px 12px',
    background: theme.bgSurface,
    border: `0.5px solid ${theme.border}`,
    borderRadius: '8px',
    fontSize: '12px',
    color: theme.text,
    outline: 'none',
    cursor: 'pointer',
  };

  const buttonStyle = {
    padding: '8px 16px',
    background: theme.primary,
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    opacity: isExporting ? 0.7 : 1,
  };

  const iconButtonStyle = {
    padding: '8px',
    background: theme.bgSurface,
    border: `0.5px solid ${theme.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardStyle = {
    background: theme.bgSurface,
    border: `0.5px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '20px',
  };

  const cardTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.text,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const tooltipStyle = {
    background: isDark ? '#1a1a1f' : '#fff',
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '10px 14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={tooltipStyle}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ fontSize: '11px', color: entry.color, margin: '2px 0' }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Daily';
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      default: return 'Daily';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <ToastContainer />
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>Production Analytics</h1>
          <p style={{ fontSize: '12px', color: theme.textMuted }}>Monitor OEE, identify bottlenecks, track output — {getPeriodLabel()} View</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={selectStyle} value={selectedPlant} onChange={(e) => handlePlantChange(e.target.value)}>
            <option value="all">All Plants</option>
            <option value="plant-a">Plant A — Detroit</option>
            <option value="plant-b">Plant B — Austin</option>
            <option value="plant-c">Plant C — Fremont</option>
            <option value="plant-d">Plant D — Charlotte</option>
            <option value="plant-e">Plant E — Monterrey</option>
            <option value="plant-f">Plant F — Munich</option>
          </select>
          <select style={selectStyle} value={selectedPeriod} onChange={(e) => handlePeriodChange(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button style={iconButtonStyle} onClick={() => showToast('Production data refreshed', 'info')} title="Refresh data">
            <RefreshCw size={16} color={theme.textSecondary} />
          </button>
          <button style={buttonStyle} onClick={handleExport} disabled={isExporting}>
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* OEE Gauge Charts */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={cardTitleStyle}>
          <span>OEE Performance</span>
          <span style={{ fontSize: '11px', color: currentPeriodData.oeeChange >= 0 ? theme.success : theme.danger, fontWeight: '500' }}>
            {currentPeriodData.oeeChange >= 0 ? '↑' : '↓'} {Math.abs(currentPeriodData.oeeChange)}% vs last period
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', justifyItems: 'center' }}>
          <GaugeChart value={parseFloat(adjustedOEE.overall)} label="Overall OEE" size={160} />
          <GaugeChart value={parseFloat(adjustedOEE.availability)} label="Availability" size={160} />
          <GaugeChart value={parseFloat(adjustedOEE.performance)} label="Performance" size={160} />
          <GaugeChart value={parseFloat(adjustedOEE.quality)} label="Quality" size={160} />
        </div>
      </div>

      {/* Production Output Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={adjustedSummary.target} duration={1000} />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>{getPeriodLabel()} Target</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color={theme.success} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={adjustedSummary.actual} duration={1000} />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Actual Output</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: adjustedSummary.gap < 0 ? theme.dangerBg : theme.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {adjustedSummary.gap < 0 ? <TrendingDown size={24} color={theme.danger} /> : <TrendingUp size={24} color={theme.success} />}
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: adjustedSummary.gap < 0 ? theme.danger : theme.success }}>
              <AnimatedCounter value={adjustedSummary.gap} duration={1000} />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Gap ({adjustedSummary.gapPercent}%)</div>
          </div>
        </div>
      </div>

      {/* Main Content Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Line Balance / Bottleneck View */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>
            <span>Line Balance — Bottleneck Detection</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: theme.textMuted }}>
              <Clock size={12} />
              Takt Time: {adjustedSummary.taktTime}s
            </div>
          </div>
          
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '160px 80px 1fr 70px 70px 80px', padding: '8px 16px', marginBottom: '8px' }}>
            <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Station</span>
            <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Cycle</span>
            <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', paddingLeft: '16px' }}>vs Takt</span>
            <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Util.</span>
            <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Defect</span>
            <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Status</span>
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {stations.map(station => (
              <StationRow key={station.id} station={station} taktTime={adjustedSummary.taktTime} theme={theme} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* Downtime Pareto */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Downtime Pareto</div>
          <div style={{ height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={downtime} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 10, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="reason" tick={{ fontSize: 11, fill: theme.textSecondary }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {downtime.map((entry, index) => (
                    <Cell key={index} fill={index === 0 ? theme.danger : index === 1 ? theme.warning : theme.textMuted} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* OEE Trend */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>OEE Trend (7 Days)</div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={baseOEE.trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={85} stroke={theme.success} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="oee" name="OEE" stroke={theme.primary} strokeWidth={2} dot={{ fill: theme.primary, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Output Trend */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>{getPeriodLabel()} Output vs Target</div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentPeriodData.outputTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="actual" name="Actual" fill={theme.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}