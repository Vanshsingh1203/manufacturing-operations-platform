import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { bomData } from '../../data/mockData';
import { useToast } from '../../components/shared/Toast';
import { exportMultiSheetExcel, formatBOMExport } from '../../utils/exportUtils';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  ArrowRight,
  Check,
  X,
  Download,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Different model configurations
const modelConfigs = {
  standard: {
    name: 'Standard Model',
    totalCost: 38450,
    shouldCost: 36200,
    variance: 2250,
    variancePercent: 6.2,
    partCount: 2847,
    multiplier: 1
  },
  premium: {
    name: 'Premium Model',
    totalCost: 52800,
    shouldCost: 49500,
    variance: 3300,
    variancePercent: 6.7,
    partCount: 3245,
    multiplier: 1.37
  },
  base: {
    name: 'Base Model',
    totalCost: 28900,
    shouldCost: 27200,
    variance: 1700,
    variancePercent: 6.3,
    partCount: 2156,
    multiplier: 0.75
  }
};

function SupplierRow({ supplier, theme, isDark }) {
  const varianceColor = supplier.variance < 0 ? theme.success : supplier.variance > 5 ? theme.danger : theme.warning;
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'preferred': return { bg: theme.successBg, color: theme.success, label: 'Preferred' };
      case 'backup': return { bg: theme.warningBg, color: theme.warning, label: 'Backup' };
      case 'new': return { bg: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)', color: '#6366f1', label: 'New' };
      default: return { bg: theme.bgSurface, color: theme.textMuted, label: status };
    }
  };

  const statusBadge = getStatusBadge(supplier.status);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '140px 1fr 100px 100px 80px 80px 90px', 
      alignItems: 'center', 
      padding: '14px 16px',
      background: supplier.status === 'preferred' ? theme.successBg : 'transparent',
      borderRadius: '8px',
      marginBottom: '8px',
      border: `0.5px solid ${supplier.status === 'preferred' ? theme.success : theme.border}`
    }}>
      <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text }}>{supplier.name}</span>
      <span style={{ fontSize: '12px', color: theme.textSecondary }}>{supplier.part}</span>
      <span style={{ fontSize: '13px', fontWeight: '600', color: theme.text }}>${supplier.quote.toLocaleString()}</span>
      <span style={{ fontSize: '13px', color: varianceColor, fontWeight: '500' }}>
        {supplier.variance > 0 ? '+' : ''}{supplier.variance}%
      </span>
      <span style={{ fontSize: '12px', color: theme.textSecondary }}>{supplier.leadTime} wks</span>
      <span style={{ fontSize: '12px', color: theme.text }}>{supplier.quality}%</span>
      <span style={{ 
        fontSize: '10px', 
        padding: '4px 8px', 
        borderRadius: '4px',
        background: statusBadge.bg,
        color: statusBadge.color,
        fontWeight: '500',
        textAlign: 'center'
      }}>
        {statusBadge.label}
      </span>
    </div>
  );
}

function SubstitutionCard({ sub, theme, isDark, isApplied, onApply }) {
  return (
    <div style={{ 
      background: theme.bgSurface, 
      border: `0.5px solid ${isApplied ? theme.success : theme.border}`,
      borderRadius: '12px',
      padding: '20px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text }}>{sub.part}</div>
          <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>Material Substitution Analysis</div>
        </div>
        {isApplied && (
          <div style={{ padding: '4px 8px', background: theme.successBg, borderRadius: '4px', fontSize: '10px', fontWeight: '500', color: theme.success }}>
            Applied
          </div>
        )}
      </div>

      {/* Current vs Proposed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ padding: '16px', background: isDark ? '#1a1a1f' : '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Current</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>{sub.current.material}</div>
          <div style={{ fontSize: '12px', color: theme.textSecondary }}>{sub.current.weight} kg</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, marginTop: '8px' }}>${sub.current.cost}</div>
        </div>

        <ArrowRight size={20} color={theme.textMuted} />

        <div style={{ padding: '16px', background: theme.primaryBg, borderRadius: '8px', border: `1px solid ${theme.primary}30` }}>
          <div style={{ fontSize: '10px', color: theme.primary, textTransform: 'uppercase', marginBottom: '8px' }}>Proposed</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>{sub.proposed.material}</div>
          <div style={{ fontSize: '12px', color: theme.textSecondary }}>{sub.proposed.weight} kg</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: theme.text, marginTop: '8px' }}>${sub.proposed.cost}</div>
        </div>
      </div>

      {/* Impact Analysis */}
      <div style={{ padding: '16px', background: isDark ? '#0c0c0f' : '#f0f0f2', borderRadius: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: theme.text, marginBottom: '12px' }}>Impact Analysis</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: theme.success }}>-{sub.impact.weightReduction} kg</div>
            <div style={{ fontSize: '10px', color: theme.textMuted }}>Weight ({sub.impact.weightReductionPercent}% ↓)</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: theme.danger }}>+${sub.impact.costIncrease}</div>
            <div style={{ fontSize: '10px', color: theme.textMuted }}>Cost ({sub.impact.costIncreasePercent}% ↑)</div>
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: theme.success }}>+{sub.impact.rangeGain} mi</div>
            <div style={{ fontSize: '10px', color: theme.textMuted }}>Range Gain</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => onApply(sub.id)}
        style={{ 
          width: '100%',
          padding: '10px 16px', 
          background: isApplied ? theme.bgSurface : theme.primary, 
          border: isApplied ? `1px solid ${theme.border}` : 'none',
          borderRadius: '8px', 
          fontSize: '12px', 
          fontWeight: '500', 
          color: isApplied ? theme.textSecondary : '#fff', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.15s ease'
        }}
      >
        {isApplied ? <X size={14} /> : <Check size={14} />}
        {isApplied ? 'Remove Substitution' : 'Apply Substitution'}
      </button>
    </div>
  );
}

export default function BOMCost() {
  const { theme, isDark } = useTheme();
  const { showToast, ToastContainer } = useToast();
  const [selectedModel, setSelectedModel] = useState('standard');
  const [appliedSubs, setAppliedSubs] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const { commodities, suppliers, substitutions } = bomData;
  const modelConfig = modelConfigs[selectedModel];

  // Adjust commodities based on model
  const adjustedCommodities = commodities.map(c => ({
    ...c,
    cost: Math.round(c.cost * modelConfig.multiplier),
    target: Math.round(c.target * modelConfig.multiplier)
  }));

  const handleApply = (subId) => {
    if (appliedSubs.includes(subId)) {
      setAppliedSubs(appliedSubs.filter(id => id !== subId));
      showToast('Substitution removed', 'info');
    } else {
      setAppliedSubs([...appliedSubs, subId]);
      showToast('Substitution applied!', 'success');
    }
  };

  const totalWeightSaved = substitutions
    .filter(s => appliedSubs.includes(s.id))
    .reduce((sum, s) => sum + s.impact.weightReduction, 0);

  const totalCostIncrease = substitutions
    .filter(s => appliedSubs.includes(s.id))
    .reduce((sum, s) => sum + s.impact.costIncrease, 0);

  const totalRangeGain = substitutions
    .filter(s => appliedSubs.includes(s.id))
    .reduce((sum, s) => sum + s.impact.rangeGain, 0);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = formatBOMExport(
        { ...bomData.summary, ...modelConfig },
        adjustedCommodities,
        suppliers,
        substitutions
      );
      exportMultiSheetExcel(exportData, `BOM_Cost_${modelConfig.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}`);
      showToast('BOM report exported successfully!', 'success');
    } catch (error) {
      showToast('Export failed. Please try again.', 'error');
    }
    setIsExporting(false);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    showToast(`Switched to ${modelConfigs[model].name}`, 'info');
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
  };

  const tooltipStyle = {
    background: isDark ? '#1a1a1f' : '#fff',
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '10px 14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={tooltipStyle}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>{data.name}</p>
          <p style={{ fontSize: '11px', color: theme.textSecondary }}>Cost: ${data.cost.toLocaleString()}</p>
          <p style={{ fontSize: '11px', color: theme.textSecondary }}>Target: ${data.target.toLocaleString()}</p>
          <p style={{ fontSize: '11px', color: data.variance > 0 ? theme.danger : theme.success }}>
            Variance: {data.variance > 0 ? '+' : ''}{data.variance}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate adjusted totals with substitutions
  const adjustedTotalCost = modelConfig.totalCost + totalCostIncrease;
  const adjustedVariance = adjustedTotalCost - modelConfig.shouldCost;

  return (
    <div style={{ padding: '24px' }}>
      <ToastContainer />
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>BOM Cost Analyzer</h1>
          <p style={{ fontSize: '12px', color: theme.textMuted }}>Analyze costs, compare suppliers, simulate material substitutions</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={selectStyle} value={selectedModel} onChange={(e) => handleModelChange(e.target.value)}>
            <option value="standard">Standard Model</option>
            <option value="premium">Premium Model</option>
            <option value="base">Base Model</option>
          </select>
          <button style={iconButtonStyle} onClick={() => showToast('Data refreshed', 'info')} title="Refresh data">
            <RefreshCw size={16} color={theme.textSecondary} />
          </button>
          <button style={buttonStyle} onClick={handleExport} disabled={isExporting}>
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} color={theme.primary} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>${adjustedTotalCost.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Total BOM Cost</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingDown size={24} color={theme.success} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>${modelConfig.shouldCost.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Should-Cost Target</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: theme.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color={theme.danger} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.danger }}>+${adjustedVariance.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Variance (+{((adjustedVariance / modelConfig.shouldCost) * 100).toFixed(1)}%)</div>
          </div>
        </div>
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={24} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>{modelConfig.partCount.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>Total Parts</div>
          </div>
        </div>
      </div>

      {/* Cost by Commodity Chart */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={cardTitleStyle}>Cost by Commodity — {modelConfig.name}</div>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adjustedCommodities} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                {adjustedCommodities.map((entry, index) => (
                  <Cell key={index} fill={entry.variance > 0 ? theme.danger : theme.success} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Comparison */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={cardTitleStyle}>Supplier Quote Comparison</div>
          <div style={{ fontSize: '12px', color: theme.textMuted }}>Should-Cost: ${suppliers[0]?.shouldCost.toLocaleString()}</div>
        </div>
        
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 100px 80px 80px 90px', padding: '8px 16px', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Supplier</span>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Part</span>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Quote</span>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Variance</span>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Lead Time</span>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Quality</span>
          <span style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase' }}>Status</span>
        </div>

        {suppliers.map(supplier => (
          <SupplierRow key={supplier.id} supplier={supplier} theme={theme} isDark={isDark} />
        ))}
      </div>

      {/* Material Substitution Simulator */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>Material Substitution Simulator</h2>
            <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>Analyze weight vs cost trade-offs</p>
          </div>
          {appliedSubs.length > 0 && (
            <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', background: theme.bgSurface, border: `0.5px solid ${theme.success}`, borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: theme.success }}>-{totalWeightSaved.toFixed(1)} kg</div>
                <div style={{ fontSize: '10px', color: theme.textMuted }}>Weight Saved</div>
              </div>
              <div style={{ width: '1px', background: theme.border }} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: theme.danger }}>+${totalCostIncrease}</div>
                <div style={{ fontSize: '10px', color: theme.textMuted }}>Cost Added</div>
              </div>
              <div style={{ width: '1px', background: theme.border }} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: theme.success }}>+{totalRangeGain} mi</div>
                <div style={{ fontSize: '10px', color: theme.textMuted }}>Range Gain</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {substitutions.map(sub => (
            <SubstitutionCard 
              key={sub.id} 
              sub={sub} 
              theme={theme} 
              isDark={isDark}
              isApplied={appliedSubs.includes(sub.id)}
              onApply={handleApply}
            />
          ))}
        </div>
      </div>
    </div>
  );
}