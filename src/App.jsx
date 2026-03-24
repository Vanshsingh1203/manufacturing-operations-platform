import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Layout/Sidebar';
import GlobalSearch from './components/shared/GlobalSearch';
import Dashboard from './modules/Dashboard/Dashboard';
import NPITracker from './modules/NPITracker/NPITracker';
import Production from './modules/Production/Production';
import BOMCost from './modules/BOMCost/BOMCost';
import Capacity from './modules/Capacity/Capacity';

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+K (to avoid browser conflict)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Use Ctrl+Shift+K or Cmd+Shift+K to avoid browser's Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        e.stopPropagation();
        setIsSearchOpen(prev => !prev);
        return;
      }
      
      // Also support forward slash "/" when not typing in an input
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Close on Escape
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onSearchClick={() => setIsSearchOpen(true)} />
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/npi" element={<NPITracker />} />
          <Route path="/production" element={<Production />} />
          <Route path="/bom" element={<BOMCost />} />
          <Route path="/capacity" element={<Capacity />} />
        </Routes>
      </main>
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/manufacturing-operations-platform">
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}