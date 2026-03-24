import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const toastConfig = {
  success: { icon: CheckCircle, color: '#10b981' },
  error: { icon: AlertCircle, color: '#ef4444' },
  info: { icon: Info, color: '#6366f1' },
};

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const { theme, isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      padding: '14px 20px',
      background: isDark ? '#1a1a1f' : '#fff',
      border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
      borderLeft: `4px solid ${config.color}`,
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
      transition: 'all 0.3s ease',
    }}>
      <Icon size={18} color={config.color} />
      <span style={{ fontSize: '13px', color: theme.text, fontWeight: '500' }}>{message}</span>
      <button 
        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={14} color={theme.textMuted} />
      </button>
    </div>
  );
}

// Toast container to manage multiple toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ position: 'fixed', bottom: `${24 + index * 70}px`, right: '24px', zIndex: 1000 }}>
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        </div>
      ))}
    </>
  );

  return { showToast, ToastContainer };
}