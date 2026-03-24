import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { capacityData } from '../../data/mockData';
import { useToast } from '../../components/shared/Toast';
import { exportMultiSheetExcel, formatCapacityExport } from '../../utils/exportUtils';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import PlantComparison from '../../components/shared/PlantComparison';
import { 
  Factory,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Sliders,
  BarChart3,
  Target,
  Download,
  RefreshCw,
  Save,
  RotateCcw,
  ArrowLeftRight
} from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, ReferenceLine } from 'recharts';

const savedScenarios = [
  { id: 'baseline', name: 'Baseline', demandChange: 0, plantAExpansion: 0, plantBExpansion: 0, newPlant: 0 },
  { id: 'high-demand', name: 'High Demand (+15%)', demandChange: 15, plantAExpansion: 0, plantBExpansion: 0, newPlant: 0 },
  { id: 'expansion', name: 'Plant Expansion', demandChange: 0, plantAExpansion: 0, plantBExpansion: 15, newPlant: 0 },
  { id: 'new-plant', name: 'New Plant', demandChange: 10, plantAExpansion: 0, plantBExpansion: 0, newPlant: 30 },
];

function PlantCard({ plant, theme, isDark, isSelected, onClick }) {
  const getStatusConfig = (utilization) => {
    if (utilization >= 95) return { color: theme.danger, bg: theme.dangerBg, icon: AlertTriangle, label: 'Critical' };
    if (utilization >= 85) return { color: theme.warning, bg: theme.warningBg, icon: AlertTriangle, label: 'High' };
    return { color: theme.success, bg: theme.successBg, icon: CheckCircle, label: 'OK' };
  };

  const status = getStatusConfig(plant.utilization);
  const StatusIcon = status.icon;

  return (
    <div 
      onClick={onClick}
      style={{ 
        background: theme.bgSurface, 
        border: `0.5px solid ${isSelected ? theme.primary : plant.utilization >= 95 ? theme.danger : theme.border}`,
        borderRadius: '12px',
        padding: '16px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '8px', 
            background: isSelected ? theme.primaryBg : status.bg, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Factory size={18} color={isSelected ? theme.primary : status.color} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>{plant.name}</div>
            <div style={{ fontSize: '10px', color: theme.textMuted }}>{plant.city}, {plant.country}</div>
          </div>
        </div>
        <div style={{ 
          padding: '3px 8px', 
          background: status.bg, 
          borderRadius: '4px', 
          fontSize: '10px', 
          fontWeight: '500', 
          color: status.color,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <StatusIcon size={10} />
          {status.label}
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', color: theme.textMuted }}>Utilization</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: status.color }}>{plant.utilization}%</span>
        </div>
        <div style={{ height: '6px', background: isDark ? '#222' : '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${plant.utilization}%`, 
            height: '100%', 
            background: plant.utilization >= 95 
              ? `linear-gradient(90deg, ${theme.warning}, ${theme.danger})` 
              : `linear-gradient(90deg, ${theme.primary}, #e8304a)`,
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: `0.5px solid ${theme.border}` }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: theme.text }}>{(plant.effectiveCapacity / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: '9px', color: theme.textMuted }}>Capacity</div>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: theme.text }}>{plant.employees.toLocaleString()}</div>
          <div style={{ fontSize: '9px', color: theme.textMuted }}>Employees</div>
        </div>
      </div>

      <div style={{ marginTop: '10px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {plant.products.map((product, index) => (
          <span key={index} style={{ 
            fontSize: '9px', 
            padding: '3px 6px', 
            background: isDark ? '#1a1a1f' : '#f0f0f2', 
            borderRadius: '3px',
            color: theme.textSecondary
          }}>
            {product}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScenarioSlider({ label, value, min, max, unit, onChange, theme, isDark }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', color: theme.textSecondary }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: '600', color: value !== 0 ? theme.primary : theme.text }}>
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ 
          width: '100%', 
          height: '6px',
          borderRadius: '3px',
          appearance: 'none',
          background: isDark ? '#333' : '#e0e0e0',
          outline: 'none',
          cursor: 'pointer'
        }}
      />
    </div>
  );
}

export default function Capacity() {
  const { theme, isDark } = useTheme();
  const { showToast, ToastContainer } = useToast();
  const { summary, plants, quarterlyTrend } = capacityData;
  
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState('Q1 26');
  const [isExporting, setIsExporting] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const [demandChange, setDemandChange] = useState(0);
  const [plantAExpansion, setPlantAExpansion] = useState(0);
  const [plantBExpansion, setPlantBExpansion] = useState(0);
  const [newPlant, setNewPlant] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState('baseline');

  const baseCapacity = summary.totalCapacity;
  const baseDemand = summary.totalDemand;
  
  const scenarioCapacity = baseCapacity + (plantAExpansion * 10000) + (plantBExpansion * 10000) + (newPlant * 10000);
  const scenarioDemand = baseDemand * (1 + demandChange / 100);
  const scenarioGap = scenarioCapacity - scenarioDemand;
  const scenarioUtilization = ((scenarioDemand / scenarioCapacity) * 100).toFixed(1);

  const investmentCost = (plantAExpansion * 2) + (plantBExpansion * 2) + (newPlant * 5);

  const loadScenario = (scenarioId) => {
    const scenario = savedScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setDemandChange(scenario.demandChange);
      setPlantAExpansion(scenario.plantAExpansion);
      setPlantBExpansion(scenario.plantBExpansion);
      setNewPlant(scenario.newPlant);
      setSelectedScenario(scenarioId);
      showToast(`Loaded scenario: ${scenario.name}`, 'info');
    }
  };

  const resetScenario = () => {
    setDemandChange(0);
    setPlantAExpansion(0);
    setPlantBExpansion(0);
    setNewPlant(0);
    setSelectedScenario('baseline');
    showToast('Scenario reset to baseline', 'info');
  };

  const saveScenario = () => {
    showToast('Scenario saved successfully!', 'success');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = formatCapacityExport(summary, plants, []);
      exportMultiSheetExcel(exportData, `Capacity_Plan_${selectedQuarter.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}`);
      showToast('Capacity report exported successfully!', 'success');
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
  };

  const outlineButtonStyle = {
    padding: '8px 16px',
    background: 'transparent',
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    color: theme.textSecondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
  };

  const statCardStyle = {
    ...cardStyle,
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
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
              {entry.name}: {entry.value.toLocaleString()}K units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getScenarioStatus = () => {
    const util = parseFloat(scenarioUtilization);
    if (scenarioGap < 0) return { color: theme.danger, label: 'Capacity Shortage', icon: AlertTriangle };
    if (util > 95) return { color: theme.danger, label: 'Critical', icon: AlertTriangle };
    if (util > 85) return { color: theme.warning, label: 'Tight', icon: AlertTriangle };
    return { color: theme.success, label: 'Healthy', icon: CheckCircle };
  };

  const scenarioStatus = getScenarioStatus();
  const ScenarioIcon = scenarioStatus.icon;

  return (
    <div style={{ padding: '24px' }}>
      <ToastContainer />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>Capacity Planning</h1>
          <p style={{ fontSize: '12px', color: theme.textMuted }}>Plan production capacity across {plants.length} plants, simulate demand scenarios</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={selectStyle} value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
            {quarterlyTrend.map(q => (
              <option key={q.quarter} value={q.quarter}>{q.quarter}</option>
            ))}
          </select>
          <button style={iconButtonStyle} onClick={() => showToast('Data refreshed', 'info')} title="Refresh data">
            <RefreshCw size={16} color={theme.textSecondary} />
          </button>
          <button style={outlineButtonStyle} onClick={() => setIsCompareOpen(true)}>
            <ArrowLeftRight size={14} />
            Compare
          </button>
          <button style={buttonStyle} onClick={handleExport} disabled={isExporting}>
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Factory size={24} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={summary.totalCapacity / 1000000} duration={1000} decimals={2} suffix="M" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Total Capacity</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.warningBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} color={theme.warning} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={summary.totalDemand / 1000000} duration={1000} decimals={2} suffix="M" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Forecasted Demand</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color={theme.success} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.success }}>
              +<AnimatedCounter value={summary.gap / 1000} duration={1000} decimals={0} suffix="K" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Buffer Capacity</div>
          </div>
        </div>
        <div style={statCardStyle}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>
              <AnimatedCounter value={summary.utilization} duration={1000} decimals={1} suffix="%" />
            </div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Avg Utilization</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={cardTitleStyle}>Plant Utilization</div>
          {selectedPlant && (
            <button 
              onClick={() => setSelectedPlant(null)}
              style={{ fontSize: '11px', color: theme.primary, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear selection
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          {plants.map(plant => (
            <PlantCard 
              key={plant.id} 
              plant={plant} 
              theme={theme} 
              isDark={isDark}
              isSelected={selectedPlant === plant.id}
              onClick={() => setSelectedPlant(selectedPlant === plant.id ? null : plant.id)}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Capacity vs Demand Trend</div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={quarterlyTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.warning} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={theme.warning} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} domain={[2000, 3600]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => <span style={{ color: theme.textSecondary }}>{value}</span>}
                />
                <ReferenceLine x={selectedQuarter} stroke={theme.primary} strokeDasharray="5 5" />
                <Area type="monotone" dataKey="capacity" name="Capacity" stroke={theme.primary} fill="url(#capacityGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="demand" name="Demand" stroke={theme.warning} fill="url(#demandGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={16} color={theme.primary} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>What-If Simulator</span>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '8px' }}>PRESETS</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {savedScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => loadScenario(scenario.id)}
                  style={{
                    padding: '5px 10px',
                    background: selectedScenario === scenario.id ? theme.primaryBg : 'transparent',
                    border: `1px solid ${selectedScenario === scenario.id ? theme.primary : theme.border}`,
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: selectedScenario === scenario.id ? theme.primary : theme.textSecondary,
                    cursor: 'pointer',
                  }}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>

          <ScenarioSlider label="Demand Change" value={demandChange} min={-20} max={30} unit="%" onChange={setDemandChange} theme={theme} isDark={isDark} />
          <ScenarioSlider label="Plant A Expansion" value={plantAExpansion} min={0} max={20} unit="0K" onChange={setPlantAExpansion} theme={theme} isDark={isDark} />
          <ScenarioSlider label="Plant B Expansion" value={plantBExpansion} min={0} max={20} unit="0K" onChange={setPlantBExpansion} theme={theme} isDark={isDark} />
          <ScenarioSlider label="New Plant" value={newPlant} min={0} max={50} unit="0K" onChange={setNewPlant} theme={theme} isDark={isDark} />

          <div style={{ padding: '14px', background: isDark ? '#0c0c0f' : '#f0f0f2', borderRadius: '8px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: theme.text }}>Results</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: `${scenarioStatus.color}15`, borderRadius: '4px' }}>
                <ScenarioIcon size={10} color={scenarioStatus.color} />
                <span style={{ fontSize: '9px', fontWeight: '600', color: scenarioStatus.color }}>{scenarioStatus.label}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text }}>{(scenarioCapacity / 1000000).toFixed(2)}M</div>
                <div style={{ fontSize: '9px', color: theme.textMuted }}>New Capacity</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: theme.text }}>{(scenarioDemand / 1000000).toFixed(2)}M</div>
                <div style={{ fontSize: '9px', color: theme.textMuted }}>Projected Demand</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: scenarioGap >= 0 ? theme.success : theme.danger }}>
                  {scenarioGap >= 0 ? '+' : ''}{(scenarioGap / 1000).toFixed(0)}K
                </div>
                <div style={{ fontSize: '9px', color: theme.textMuted }}>Gap</div>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: Number(scenarioUtilization) > 95 ? theme.danger : theme.text }}>
                  {scenarioUtilization}%
                </div>
                <div style={{ fontSize: '9px', color: theme.textMuted }}>Utilization</div>
              </div>
            </div>
            
            {investmentCost > 0 && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `0.5px solid ${theme.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: theme.textMuted }}>Investment Required</span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: theme.primary }}>${investmentCost}M</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button onClick={saveScenario} style={{ flex: 1, padding: '10px', background: theme.primary, border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: '500', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Save size={12} />
              Save
            </button>
            <button onClick={resetScenario} style={{ padding: '10px 14px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: '8px', fontSize: '11px', color: theme.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <PlantComparison isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </div>
  );
}