import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { capacityData } from '../../data/mockData';
import { X, ArrowLeftRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PlantComparison({ isOpen, onClose }) {
  const { theme, isDark } = useTheme();
  const [plantA, setPlantA] = useState('plant-a');
  const [plantB, setPlantB] = useState('plant-c');

  if (!isOpen) return null;

  const plants = capacityData.plants;
  const dataA = plants.find(p => p.id === plantA);
  const dataB = plants.find(p => p.id === plantB);

  const metrics = [
    { label: 'Utilization', key: 'utilization', suffix: '%', higherBetter: false },
    { label: 'Effective Capacity', key: 'effectiveCapacity', format: (v) => `${(v/1000).toFixed(0)}K`, higherBetter: true },
    { label: 'Current Demand', key: 'demand', format: (v) => `${(v/1000).toFixed(0)}K`, higherBetter: true },
    { label: 'Employees', key: 'employees', format: (v) => v.toLocaleString(), higherBetter: false },
    { label: 'Shifts', key: 'shifts', higherBetter: false },
  ];

  const CompareIcon = ({ valA, valB, higherBetter }) => {
    if (valA === valB) return <Minus size={14} color={theme.textMuted} />;
    const aWins = higherBetter ? valA > valB : valA < valB;
    return aWins 
      ? <TrendingUp size={14} color={theme.success} />
      : <TrendingDown size={14} color={theme.danger} />;
  };

  const selectStyle = {
    padding: '10px 14px',
    background: isDark ? '#1a1a1f' : '#f5f5f5',
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: theme.text,
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    fontWeight: '500'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '700px',
        background: theme.bgSurface,
        borderRadius: '16px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        zIndex: 1001,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowLeftRight size={20} color={theme.primary} />
            <span style={{ fontSize: '16px', fontWeight: '600', color: theme.text }}>
              Plant Comparison
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} color={theme.textMuted} />
          </button>
        </div>

        {/* Plant Selectors */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '20px',
          padding: '24px',
          alignItems: 'center'
        }}>
          <select 
            value={plantA} 
            onChange={(e) => setPlantA(e.target.value)}
            style={selectStyle}
          >
            {plants.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === plantB}>
                {p.name} — {p.city}
              </option>
            ))}
          </select>

          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: theme.primaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.primary }}>VS</span>
          </div>

          <select 
            value={plantB} 
            onChange={(e) => setPlantB(e.target.value)}
            style={selectStyle}
          >
            {plants.map(p => (
              <option key={p.id} value={p.id} disabled={p.id === plantA}>
                {p.name} — {p.city}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Table */}
        <div style={{ padding: '0 24px 24px' }}>
          {/* Header Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr 40px 1.2fr',
            gap: '12px',
            padding: '12px 0',
            borderBottom: `1px solid ${theme.border}`
          }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase' }}>Metric</div>
            <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', textAlign: 'center' }}>{dataA.name}</div>
            <div></div>
            <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', textAlign: 'center' }}>{dataB.name}</div>
          </div>

          {/* Data Rows */}
          {metrics.map((metric, index) => {
            const valA = dataA[metric.key];
            const valB = dataB[metric.key];
            const formatVal = metric.format || ((v) => metric.suffix ? `${v}${metric.suffix}` : v);

            return (
              <div 
                key={metric.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.2fr 40px 1.2fr',
                  gap: '12px',
                  padding: '14px 0',
                  borderBottom: index < metrics.length - 1 ? `1px solid ${theme.border}` : 'none',
                  alignItems: 'center'
                }}
              >
                <div style={{ fontSize: '13px', color: theme.textSecondary }}>{metric.label}</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: theme.text,
                  textAlign: 'center',
                  padding: '8px 12px',
                  background: isDark ? '#1a1a1f' : '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  {formatVal(valA)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <CompareIcon valA={valA} valB={valB} higherBetter={metric.higherBetter} />
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: theme.text,
                  textAlign: 'center',
                  padding: '8px 12px',
                  background: isDark ? '#1a1a1f' : '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  {formatVal(valB)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Products Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          padding: '0 24px 24px'
        }}>
          <div style={{
            padding: '16px',
            background: isDark ? '#0c0c0f' : '#f8f9fa',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '8px' }}>Products</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {dataA.products.map(p => (
                <span key={p} style={{
                  padding: '4px 10px',
                  background: theme.primaryBg,
                  color: theme.primary,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            padding: '16px',
            background: isDark ? '#0c0c0f' : '#f8f9fa',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '8px' }}>Products</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {dataB.products.map(p => (
                <span key={p} style={{
                  padding: '4px 10px',
                  background: theme.primaryBg,
                  color: theme.primary,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}