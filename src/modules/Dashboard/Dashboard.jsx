import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ProgressBar from '../../components/shared/ProgressBar';
import AlertCard from '../../components/shared/AlertCard';
import { useToast } from '../../components/shared/Toast';
import { StatCardSkeleton, CardSkeleton } from '../../components/shared/Skeleton';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import { dashboardData, npiPrograms } from '../../data/mockData';
import { exportMultiSheetExcel, formatDashboardExport } from '../../utils/exportUtils';
import { 
  Rocket, 
  Activity, 
  DollarSign, 
  BarChart3,
  Download,
  RefreshCw,
  Zap,
  Factory,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const { theme, isDark } = useTheme();
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [liveOEE, setLiveOEE] = useState(84.2);
  const [isLive, setIsLive] = useState(true);

  const { kpis, alerts } = dashboardData;

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Real-time OEE simulation
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setLiveOEE(prev => {
        const change = (Math.random() - 0.5) * 0.6;
        const newValue = Math.max(80, Math.min(88, prev + change));
        return parseFloat(newValue.toFixed(1));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Filter plant utilization based on selection
  const plantUtilization = selectedPlant === 'all' 
    ? dashboardData.plantUtilization 
    : dashboardData.plantUtilization.filter(p => p.name.toLowerCase().replace(' ', '-') === selectedPlant);

  // Filter alerts based on selected plant
  const filteredAlerts = selectedPlant === 'all'
    ? alerts
    : alerts.filter(a => a.description.toLowerCase().includes(selectedPlant.replace('-', ' ').replace('plant-', 'plant ')));

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = formatDashboardExport(
        kpis,
        npiPrograms,
        dashboardData.plantUtilization,
        alerts
      );
      exportMultiSheetExcel(exportData, `Dashboard_Report_${new Date().toISOString().split('T')[0]}`);
      showToast('Dashboard report exported successfully!', 'success');
    } catch (error) {
      showToast('Export failed. Please try again.', 'error');
    }
    setIsExporting(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsLoading(false);
      showToast('Dashboard data refreshed', 'info');
    }, 800);
  };

  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
    const plantName = plant === 'all' ? 'All Plants' : plant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    showToast(`Filtering by ${plantName}`, 'info');
  };

  const handleViewAllNPI = () => {
    navigate('/npi');
  };

  const handleNPICardClick = (programId) => {
    navigate('/npi', { state: { selectedProgramId: programId } });
  };

  const handleAlertClick = (alert) => {
    switch (alert.module) {
      case 'production':
        navigate('/production');
        break;
      case 'capacity':
        navigate('/capacity');
        break;
      case 'npi':
        navigate('/npi');
        break;
      case 'bom':
        navigate('/bom');
        break;
      default:
        break;
    }
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
    padding: '18px',
    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
  };

  const statCardStyle = {
    ...cardStyle,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return theme.success;
      case 'at-risk': return theme.warning;
      case 'critical': return theme.danger;
      default: return theme.textSecondary;
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.text }}>Executive Dashboard</h1>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Loading real-time data...</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <ToastContainer />
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>Executive Dashboard</h1>
          <div style={{ fontSize: '12px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Real-time manufacturing overview • Last updated: {lastRefresh.toLocaleTimeString()}</span>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              onClick={() => setIsLive(prev => !prev)}
              title={isLive ? 'Click to pause live updates' : 'Click to enable live updates'}
            >
              <Zap size={12} color={isLive ? theme.success : theme.textMuted} />
              <span style={{ color: isLive ? theme.success : theme.textMuted, fontSize: '11px', fontWeight: '600' }}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            style={selectStyle} 
            value={selectedPlant} 
            onChange={(e) => handlePlantChange(e.target.value)}
          >
            <option value="all">All Plants</option>
            <option value="plant-a">Plant A — Detroit</option>
            <option value="plant-b">Plant B — Austin</option>
            <option value="plant-c">Plant C — Fremont</option>
            <option value="plant-d">Plant D — Charlotte</option>
            <option value="plant-e">Plant E — Monterrey</option>
            <option value="plant-f">Plant F — Munich</option>
          </select>
          <button style={iconButtonStyle} onClick={handleRefresh} title="Refresh data">
            <RefreshCw size={16} color={theme.textSecondary} />
          </button>
          <button style={buttonStyle} onClick={handleExport} disabled={isExporting}>
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* KPI Cards with Animated Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={24} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={kpis.activePrograms} duration={1000} />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Active Programs</div>
            <div style={{ fontSize: '11px', color: theme.warning, marginTop: '2px' }}>{kpis.programsAtRisk} at risk</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} color={theme.success} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={liveOEE} duration={500} decimals={1} suffix="%" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Overall OEE</div>
            <div style={{ fontSize: '11px', color: isLive ? theme.success : theme.textMuted, marginTop: '2px' }}>
              {isLive ? '● Live' : '○ Paused'}
            </div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color={theme.success} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>
              $<AnimatedCounter value={kpis.costSavings / 1000000} duration={1200} decimals={1} suffix="M" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>YTD Cost Savings</div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Factory size={24} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={kpis.capacity} duration={1000} decimals={1} suffix="%" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Global Utilization</div>
            <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '2px' }}>{kpis.totalPlants} plants</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: theme.text }}>
            <AnimatedCounter value={kpis.totalPlants} duration={800} />
          </div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Manufacturing Plants</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: theme.text }}>
            <AnimatedCounter value={kpis.totalEmployees} duration={1200} />
          </div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Total Employees</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: theme.success }}>
            <AnimatedCounter value={npiPrograms.filter(p => p.status === 'on-track').length} duration={800} />
          </div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Programs On Track</div>
        </div>
        <div style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '22px', fontWeight: '700', color: theme.text }}>
            <AnimatedCounter value={Math.round(npiPrograms.reduce((sum, p) => sum + p.overallReadiness, 0) / npiPrograms.length)} duration={1000} suffix="%" />
          </div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Avg NPI Readiness</div>
        </div>
      </div>

      {/* NPI Programs Summary */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>NPI Programs</span>
          <span 
            style={{ fontSize: '11px', color: theme.primary, cursor: 'pointer' }}
            onClick={handleViewAllNPI}
          >
            View all {npiPrograms.length} →
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {npiPrograms.slice(0, 4).map(program => (
            <div 
              key={program.id} 
              style={{
                ...cardStyle,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onClick={() => handleNPICardClick(program.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>{program.name}</div>
                  <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>{program.code}</div>
                </div>
                <div style={{ 
                  padding: '3px 8px', 
                  background: program.status === 'on-track' ? theme.successBg : theme.warningBg,
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: '600',
                  color: getStatusColor(program.status),
                  textTransform: 'uppercase'
                }}>
                  {program.status.replace('-', ' ')}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: theme.text }}>{program.daysToSOP}</div>
                  <div style={{ fontSize: '9px', color: theme.textMuted }}>days to SOP</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: theme.text }}>{program.overallReadiness}%</div>
                  <div style={{ fontSize: '9px', color: theme.textMuted }}>readiness</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
        {/* Plant Utilization */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>Plant Utilization</span>
            <div style={{ fontSize: '11px', color: theme.success, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: theme.success, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Live
            </div>
          </div>
          {plantUtilization.length > 0 ? (
            plantUtilization.map((plant, index) => (
              <ProgressBar
                key={index}
                label={plant.name}
                sublabel={`${plant.city} • ${plant.region}`}
                value={plant.utilization}
                showWarning={true}
                warningThreshold={95}
              />
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: theme.textMuted, fontSize: '13px' }}>
              No data for selected plant
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>Active Alerts</span>
            <span style={{ fontSize: '11px', color: theme.textMuted }}>{filteredAlerts.length} active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.slice(0, 6).map(alert => (
                <AlertCard
                  key={alert.id}
                  type={alert.type}
                  title={alert.title}
                  description={alert.description}
                  time={alert.time}
                  onClick={() => handleAlertClick(alert)}
                />
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: theme.textMuted, fontSize: '13px' }}>
                No alerts for selected plant
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}