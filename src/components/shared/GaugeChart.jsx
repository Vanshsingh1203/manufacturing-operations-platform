import { useTheme } from '../../context/ThemeContext';

export default function GaugeChart({ 
  value, 
  label, 
  size = 140,
  thickness = 12,
  showValue = true,
  animated = true 
}) {
  const { theme, isDark } = useTheme();
  
  const getColor = (val) => {
    if (val >= 85) return theme.success;
    if (val >= 70) return theme.warning;
    return theme.danger;
  };

  const color = getColor(value);
  const radius = (size - thickness) / 2;
  const circumference = radius * Math.PI;
  const progress = (value / 100) * circumference;
  const center = size / 2;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '8px'
    }}>
      <svg 
        width={size} 
        height={size / 2 + 20} 
        style={{ overflow: 'visible' }}
      >
        {/* Background arc */}
        <path
          d={`M ${thickness / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${center}`}
          fill="none"
          stroke={isDark ? '#2a2a30' : '#e5e5e8'}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <path
          d={`M ${thickness / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${center}`}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={circumference - progress}
          style={{
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none',
            filter: `drop-shadow(0 0 6px ${color}40)`
          }}
        />

        {/* Min label */}
        <text
          x={thickness / 2}
          y={center + 20}
          textAnchor="middle"
          style={{ fontSize: '10px', fill: theme.textMuted }}
        >
          0
        </text>

        {/* Max label */}
        <text
          x={size - thickness / 2}
          y={center + 20}
          textAnchor="middle"
          style={{ fontSize: '10px', fill: theme.textMuted }}
        >
          100
        </text>

        {/* Value */}
        {showValue && (
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              fill: color
            }}
          >
            {value}%
          </text>
        )}
      </svg>

      {/* Label */}
      {label && (
        <span style={{ 
          fontSize: '12px', 
          color: theme.textSecondary,
          fontWeight: '500',
          marginTop: '-8px'
        }}>
          {label}
        </span>
      )}
    </div>
  );
}