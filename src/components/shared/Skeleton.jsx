import { useTheme } from '../../context/ThemeContext';

export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', style = {} }) {
  const { isDark } = useTheme();

  return (
    <>
      <div
        style={{
          width,
          height,
          borderRadius,
          background: isDark 
            ? 'linear-gradient(90deg, #1a1a1f 0%, #252530 50%, #1a1a1f 100%)'
            : 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          ...style
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

export function StatCardSkeleton() {
  const { theme } = useTheme();
  
  return (
    <div style={{
      background: theme.bgSurface,
      border: `0.5px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <Skeleton width="48px" height="48px" borderRadius="12px" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60px" height="28px" />
        <div style={{ marginTop: '8px' }}>
          <Skeleton width="80px" height="12px" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  const { theme } = useTheme();
  
  return (
    <div style={{
      background: theme.bgSurface,
      border: `0.5px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Skeleton width="60%" height="20px" />
        <Skeleton width="60px" height="24px" borderRadius="6px" />
      </div>
      <Skeleton width="40%" height="14px" />
      <div style={{ marginTop: '20px' }}>
        <Skeleton width="100%" height="8px" borderRadius="4px" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
        <div>
          <Skeleton width="50%" height="28px" />
          <div style={{ marginTop: '8px' }}>
            <Skeleton width="70%" height="12px" />
          </div>
        </div>
        <div>
          <Skeleton width="50%" height="28px" />
          <div style={{ marginTop: '8px' }}>
            <Skeleton width="70%" height="12px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;