import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { npiPrograms } from '../../data/mockData';
import { useToast } from '../../components/shared/Toast';
import { exportToExcel } from '../../utils/exportUtils';
import { 
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  Settings,
  Shield,
  Download,
  RefreshCw
} from 'lucide-react';

const gateIcons = {
  engineering: Settings,
  manufacturing: Settings,
  supplyChain: Truck,
  quality: Shield
};

const gateLabels = {
  engineering: 'Engineering',
  manufacturing: 'Manufacturing',
  supplyChain: 'Supply Chain',
  quality: 'Quality'
};

const phases = [
  { id: 'concept', label: 'Concept', color: '#6366f1' },
  { id: 'design', label: 'Design', color: '#8b5cf6' },
  { id: 'validation', label: 'Validation', color: '#f59e0b' },
  { id: 'pre-production', label: 'Pre-Prod', color: '#10b981' },
  { id: 'sop', label: 'SOP', color: '#059669' }
];

function ReadinessGate({ label, value, icon: Icon, theme, isDark }) {
  const getColor = () => {
    if (value >= 90) return theme.success;
    if (value >= 70) return theme.warning;
    return theme.danger;
  };

  const color = getColor();

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={14} color={theme.textSecondary} />
          <span style={{ fontSize: '12px', color: theme.textSecondary }}>{label}</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '600', color }}>{value}%</span>
      </div>
      <div style={{ height: '6px', background: isDark ? '#222' : '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}

function MilestoneTimeline({ milestones, theme, isDark }) {
  return (
    <div style={{ position: 'relative', paddingLeft: '20px' }}>
      <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: isDark ? '#333' : '#e0e0e0', borderRadius: '1px' }} />
      
      {milestones.map((milestone, index) => {
        const getStatusColor = () => {
          switch (milestone.status) {
            case 'complete': return theme.success;
            case 'in-progress': return theme.warning;
            default: return theme.textMuted;
          }
        };
        const statusColor = getStatusColor();

        return (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-16px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: milestone.status === 'complete' ? statusColor : theme.bgSurface, border: `2px solid ${statusColor}` }} />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '500', color: theme.text }}>{milestone.name}</span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: milestone.status === 'complete' ? theme.successBg : milestone.status === 'in-progress' ? theme.warningBg : (isDark ? '#222' : '#f0f0f0'), color: statusColor, fontWeight: '500', textTransform: 'capitalize' }}>
                  {milestone.status.replace('-', ' ')}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
                {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgramCard({ program, theme, isDark, onClick, isSelected }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'on-track': return { bg: theme.successBg, color: theme.success, label: 'On Track' };
      case 'at-risk': return { bg: theme.warningBg, color: theme.warning, label: 'At Risk' };
      case 'critical': return { bg: theme.dangerBg, color: theme.danger, label: 'Critical' };
      default: return { bg: theme.bgSurface, color: theme.textSecondary, label: status };
    }
  };

  const statusStyle = getStatusStyle(program.status);
  const currentPhaseIndex = phases.findIndex(p => p.id === program.phase);

  return (
    <div 
      style={{ 
        background: theme.bgSurface, 
        border: `0.5px solid ${isSelected ? theme.primary : theme.border}`,
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: isSelected ? 'scale(1.01)' : 'scale(1)',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>{program.name}</div>
          <div style={{ fontSize: '11px', color: theme.textMuted, marginTop: '4px' }}>
            {program.code} • SOP: {new Date(program.sopDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <div style={{ padding: '4px 10px', background: statusStyle.bg, borderRadius: '6px', fontSize: '11px', fontWeight: '500', color: statusStyle.color }}>
          {statusStyle.label}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {phases.map((phase, index) => (
            <div key={phase.id} style={{ flex: 1, height: '4px', borderRadius: '2px', background: index <= currentPhaseIndex ? phase.color : (isDark ? '#333' : '#e0e0e0') }} />
          ))}
        </div>
        <div style={{ fontSize: '11px', color: theme.textMuted }}>
          Phase: <span style={{ color: phases[currentPhaseIndex]?.color, fontWeight: '500' }}>{phases[currentPhaseIndex]?.label}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px 0', borderTop: `0.5px solid ${theme.border}`, borderBottom: `0.5px solid ${theme.border}`, marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>{program.daysToSOP}</div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Days to SOP</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: theme.text }}>{program.overallReadiness}%</div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Overall Readiness</div>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '500', color: theme.text, marginBottom: '12px' }}>Readiness Gates</div>
        {Object.entries(program.readiness).map(([key, value]) => (
          <ReadinessGate key={key} label={gateLabels[key]} value={value} icon={gateIcons[key]} theme={theme} isDark={isDark} />
        ))}
      </div>

      {program.risks.length > 0 && (
        <div style={{ padding: '12px', background: theme.warningBg, borderRadius: '8px', borderLeft: `3px solid ${theme.warning}` }}>
          <div style={{ fontSize: '11px', fontWeight: '500', color: theme.warning, marginBottom: '6px' }}>
            ⚠️ {program.risks.length} Active Risk{program.risks.length > 1 ? 's' : ''}
          </div>
          <div style={{ fontSize: '11px', color: theme.textSecondary }}>
            {program.risks[0].description}
            {program.risks.length > 1 && ` (+${program.risks.length - 1} more)`}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NPITracker() {
  const { theme, isDark } = useTheme();
  const { showToast, ToastContainer } = useToast();
  const location = useLocation();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filterPhase, setFilterPhase] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Handle navigation state from Dashboard
  useEffect(() => {
    if (location.state?.selectedProgramId) {
      const program = npiPrograms.find(p => p.id === location.state.selectedProgramId);
      if (program) {
        setSelectedProgram(program);
        showToast(`Viewing ${program.name}`, 'info');
      }
    }
  }, [location.state]);

  const filteredPrograms = npiPrograms.filter(p => {
    if (filterPhase !== 'all' && p.phase !== filterPhase) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  // Calculate stats from actual data
  const totalPrograms = npiPrograms.length;
  const onTrackCount = npiPrograms.filter(p => p.status === 'on-track').length;
  const atRiskCount = npiPrograms.filter(p => p.status === 'at-risk' || p.status === 'critical').length;
  const avgReadiness = Math.round(npiPrograms.reduce((sum, p) => sum + p.overallReadiness, 0) / npiPrograms.length);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = npiPrograms.map(p => ({
        'Program Name': p.name,
        'Code': p.code,
        'Phase': p.phase,
        'Status': p.status,
        'Days to SOP': p.daysToSOP,
        'SOP Date': p.sopDate,
        'Overall Readiness': `${p.overallReadiness}%`,
        'Engineering': `${p.readiness.engineering}%`,
        'Manufacturing': `${p.readiness.manufacturing}%`,
        'Supply Chain': `${p.readiness.supplyChain}%`,
        'Quality': `${p.readiness.quality}%`,
        'Active Risks': p.risks.length
      }));
      exportToExcel(exportData, `NPI_Programs_${new Date().toISOString().split('T')[0]}`, 'Programs');
      showToast('NPI report exported successfully!', 'success');
    } catch (error) {
      showToast('Export failed. Please try again.', 'error');
    }
    setIsExporting(false);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'phase') {
      setFilterPhase(value);
    } else {
      setFilterStatus(value);
    }
  };

  const selectStyle = {
    padding: '8px 12px',
    background: theme.primary,
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const statCardStyle = {
    background: theme.bgSurface,
    border: `0.5px solid ${theme.border}`,
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center'
  };

  const detailPanelStyle = {
    background: theme.bgSurface,
    border: `0.5px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '20px',
    height: 'fit-content',
    position: 'sticky',
    top: '24px',
  };

  return (
    <div style={{ padding: '24px' }}>
      <ToastContainer />
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>NPI Tracker</h1>
          <p style={{ fontSize: '12px', color: theme.textMuted }}>Track new product introduction from concept to production</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={selectStyle} value={filterPhase} onChange={(e) => handleFilterChange('phase', e.target.value)}>
            <option value="all">All Phases</option>
            {phases.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <select style={selectStyle} value={filterStatus} onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="all">All Status</option>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="critical">Critical</option>
          </select>
          <button 
            style={{ 
              padding: '8px', 
              background: theme.bgSurface, 
              border: `0.5px solid ${theme.border}`, 
              borderRadius: '8px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center' 
            }} 
            onClick={() => showToast('Data refreshed', 'info')}
          >
            <RefreshCw size={16} color={theme.textSecondary} />
          </button>
          <button 
            style={{ 
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
              opacity: isExporting ? 0.7 : 1 
            }} 
            onClick={handleExport} 
            disabled={isExporting}
          >
            <Download size={14} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>{totalPrograms}</div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Total Programs</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.success }}>{onTrackCount}</div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>On Track</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.warning }}>{atRiskCount}</div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>At Risk</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: theme.text }}>{avgReadiness}%</div>
          <div style={{ fontSize: '11px', color: theme.textMuted }}>Avg Readiness</div>
        </div>
      </div>

      {/* Programs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedProgram ? '1fr 400px' : 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: selectedProgram ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px', alignContent: 'start' }}>
          {filteredPrograms.map(program => (
            <ProgramCard
              key={program.id}
              program={program}
              theme={theme}
              isDark={isDark}
              isSelected={selectedProgram?.id === program.id}
              onClick={() => setSelectedProgram(selectedProgram?.id === program.id ? null : program)}
            />
          ))}
        </div>

        {/* Detail Panel */}
        {selectedProgram && (
          <div style={detailPanelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: theme.text }}>{selectedProgram.name}</h2>
                <p style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>{selectedProgram.code}</p>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: theme.textMuted, 
                  cursor: 'pointer', 
                  fontSize: '20px', 
                  padding: '4px 8px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '16px' }}>Milestones</h3>
              <MilestoneTimeline milestones={selectedProgram.milestones} theme={theme} isDark={isDark} />
            </div>

            {selectedProgram.risks.length > 0 && (
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: theme.text, marginBottom: '12px' }}>Active Risks ({selectedProgram.risks.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedProgram.risks.map(risk => (
                    <div key={risk.id} style={{ padding: '12px', background: risk.severity === 'high' ? theme.dangerBg : theme.warningBg, borderLeft: `3px solid ${risk.severity === 'high' ? theme.danger : theme.warning}`, borderRadius: '0 8px 8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '600', color: risk.severity === 'high' ? theme.danger : theme.warning, textTransform: 'uppercase' }}>
                          {risk.severity} • {risk.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: theme.text, marginBottom: '6px' }}>{risk.description}</div>
                      <div style={{ fontSize: '10px', color: theme.textMuted }}>Owner: {risk.owner} • Due: {new Date(risk.dueDate).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}