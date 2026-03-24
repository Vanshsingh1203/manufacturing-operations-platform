import { useTheme } from '../../context/ThemeContext';

export default function ProgressBar({ 
  label, 
  value, 
  maxValue = 100,
  sublabel,
  color,
  showWarning = false,
  warningThreshold = 95
}) {
  const { theme, isDark } = useTheme();
  
  const percentage = Math.min((value / maxValue) * 100, 100);
  const isWarning = showWarning && percentage >= warningThreshold;

  const containerStyle = {
    marginBottom: '14px',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
  };

  const labelStyle = {
    fontSize: '12px',
    color: isDark ? '#ccc' : '#555',
  };

  const valueStyle = {
    fontSize: '12px',
    fontWeight: '500',
    color: isWarning ? theme.warning : theme.text,
  };

  const trackStyle = {
    height: '6px',
    background: isDark ? '#222' : '#f0f0f0',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const getBarColor = () => {
    if (isWarning) return theme.warning;
    if (color) return color;
    return isDark 
      ? `linear-gradient(90deg, ${theme.primary}, #e8304a)`
      : `linear-gradient(90deg, ${theme.primary}, #e8304a)`;
  };

  const barStyle = {
    width: `${percentage}%`,
    height: '100%',
    background: getBarColor(),
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          {label}
          {sublabel && <span style={{ color: theme.textMuted }}> — {sublabel}</span>}
        </span>
        <span style={valueStyle}>{value}%</span>
      </div>
      <div style={trackStyle}>
        <div style={barStyle} />
      </div>
    </div>
  );
}