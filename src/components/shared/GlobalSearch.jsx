import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { searchIndex } from '../../data/mockData';
import { Search, X, Rocket, Truck, Factory, Activity } from 'lucide-react';

const typeIcons = {
  npi: Rocket,
  supplier: Truck,
  plant: Factory,
  station: Activity
};

const typeColors = {
  npi: '#6366f1',
  supplier: '#10b981',
  plant: '#f59e0b',
  station: '#ec4899'
};

export default function GlobalSearch({ isOpen, onClose }) {
  const { theme, isDark } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = searchIndex.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path, { state: { searchResult: item } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      {/* Backdrop */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        maxWidth: '90vw',
        background: theme.bgSurface,
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        overflow: 'hidden'
      }}>
        {/* Input Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <Search size={20} color={theme.textMuted} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, results.length - 1));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
              }
              if (e.key === 'Enter' && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
              }
            }}
            placeholder="Search programs, suppliers, plants..."
            style={{
              flex: 1,
              fontSize: '16px',
              border: 'none',
              outline: 'none',
              background: 'none',
              color: theme.text,
            }}
          />
          {query && (
            <X 
              size={18} 
              color={theme.textMuted} 
              style={{ cursor: 'pointer' }}
              onClick={() => setQuery('')}
            />
          )}
        </div>

        {/* Suggestions when empty */}
        {!query && (
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, marginBottom: '10px' }}>
              SUGGESTIONS
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Vehicle Refresh', 'Apex', 'Plant A', 'Battery'].map(s => (
                <span
                  key={s}
                  onClick={() => setQuery(s)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: isDark ? '#222' : '#f0f0f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: theme.textSecondary
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {results.map((item, idx) => {
              const Icon = typeIcons[item.type];
              const color = typeColors[item.type];
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: idx === selectedIndex ? (isDark ? '#1a1a1f' : '#f5f5f5') : 'transparent',
                    borderLeft: idx === selectedIndex ? `3px solid ${theme.primary}` : '3px solid transparent'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: theme.text }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>{item.subtitle}</div>
                  </div>
                  <span style={{
                    fontSize: '9px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    background: `${color}20`,
                    color: color,
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    {item.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: theme.textMuted }}>
            No results for "{query}"
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '11px',
          color: theme.textMuted
        }}>
          <span><kbd style={{ padding: '2px 5px', background: isDark ? '#333' : '#ddd', borderRadius: '3px' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ padding: '2px 5px', background: isDark ? '#333' : '#ddd', borderRadius: '3px' }}>↵</kbd> select</span>
          <span><kbd style={{ padding: '2px 5px', background: isDark ? '#333' : '#ddd', borderRadius: '3px' }}>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}