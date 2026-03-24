import { useTheme } from '../../context/ThemeContext';
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

const alertConfig = {
  danger: {
    icon: AlertCircle,
    getColors: (theme, isDark) => ({
      bg: theme.dangerBg,
      border: isDark ? '#ef4444' : '#dc2626',
      title: isDark ? '#fca5a5' : '#dc2626',
    })
  },
  warning: {
    icon: AlertTriangle,
    getColors: (theme, isDark) => ({
      bg: theme.warningBg,
      border: isDark ? '#f59e0b' : '#d97706',
      title: isDark ? '#fcd34d' : '#d97706',
    })
  },
  success: {
    icon: CheckCircle,
    getColors: (theme, isDark) => ({
      bg: theme.successBg,
      border: isDark ? '#10b981' : '#059669',
      title: isDark ? '#6ee7b7' : '#059669',
    })
  },
  info: {
    icon: Info,
    getColors: (theme, isDark) => ({
      bg: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.06)',
      border: '#6366f1',
      title: isDark ? '#a5b4fc' : '#4f46e5',
    })
  }
};

export default function AlertCard({ 
  type = 'info', 
  title, 
  description, 
  time,
  onClick 
}) {
  const { theme, isDark } = useTheme();
  
  const config = alertConfig[type] || alertConfig.info;
  const colors = config.getColors(theme, isDark);
  const Icon = config.icon;

  const cardStyle = {
    padding: '12px',
    background: colors.bg,
    borderLeft: `3px solid ${colors.border}`,
    borderRadius: '0 8px 8px 0',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.15s ease',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: description ? '4px' : 0,
  };

  const titleStyle = {
    fontSize: '12px',
    fontWeight: '500',
    color: colors.title,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const timeStyle = {
    fontSize: '10px',
    color: theme.textMuted,
  };

  const descriptionStyle = {
    fontSize: '11px',
    color: theme.textSecondary,
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <Icon size={12} />
          {title}
        </div>
        {time && <span style={timeStyle}>{time}</span>}
      </div>
      {description && (
        <div style={descriptionStyle}>{description}</div>
      )}
    </div>
  );
}