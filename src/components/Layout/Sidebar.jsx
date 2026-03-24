import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  Rocket, 
  Activity, 
  DollarSign, 
  BarChart3,
  Sun,
  Moon,
  Search
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/npi', label: 'NPI Tracker', icon: Rocket },
  { path: '/production', label: 'Production', icon: Activity },
  { path: '/bom', label: 'BOM Cost', icon: DollarSign },
  { path: '/capacity', label: 'Capacity', icon: BarChart3 },
];

export default function Sidebar({ onSearchClick }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <aside style={{
      width: '240px',
      height: '100vh',
      background: theme.bgSurface,
      borderRight: `0.5px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px',
        borderBottom: `0.5px solid ${theme.border}`,
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '700',
          color: theme.text,
          letterSpacing: '-0.3px',
        }}>
          MOP
        </div>
        <div style={{
          fontSize: '10px',
          color: theme.textMuted,
          marginTop: '2px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Manufacturing Ops Platform
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={onSearchClick}
        style={{
          margin: '12px 16px',
          padding: '10px 14px',
          background: isDark ? '#1a1a1f' : '#f5f5f5',
          border: `0.5px solid ${theme.border}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <Search size={16} color={theme.textMuted} />
        <span style={{ fontSize: '13px', color: theme.textMuted, flex: 1, textAlign: 'left' }}>Search...</span>
        <kbd style={{ 
          fontSize: '10px', 
          padding: '2px 6px', 
          background: isDark ? '#252530' : '#e0e0e0', 
          borderRadius: '4px',
          color: theme.textMuted
        }}>/</kbd>
      </button>

      {/* Navigation */}
      <nav style={{ padding: '12px', flex: 1 }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500',
              color: isActive ? theme.primary : theme.textSecondary,
              marginBottom: '4px',
              transition: 'all 0.15s ease',
              background: isActive ? theme.primaryBg : 'transparent',
            })}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div style={{
        padding: '16px',
        borderTop: `0.5px solid ${theme.border}`,
      }}>
        <div 
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: '8px',
            background: isDark ? '#1a1a1f' : '#f5f5f5',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '12px', color: theme.textSecondary }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </span>
          {isDark ? <Moon size={16} color={theme.textSecondary} /> : <Sun size={16} color={theme.textSecondary} />}
        </div>
      </div>
    </aside>
  );
}