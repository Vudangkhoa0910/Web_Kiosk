import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomeSection from './components/sections/HomeSection';
import OrderFlowSection from './components/sections/OrderFlowSection';
import { KioskHistorySection } from './components/sections/KioskHistorySection';
import TrackingSection from './components/sections/TrackingSection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthLandingPage from './pages/AuthLandingPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { socketMqttService } from './services/socketMqttService';
import { useAppStore } from './hooks/useAppStore';
import type { NavigationSection } from './types';

// Main App Content with URL Routing
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSection, setActiveSection } = useAppStore();

  // Sync URL with activeSection state
  useEffect(() => {
    const pathToSection: Record<string, NavigationSection> = {
      '/': 'home',
      '/order': 'order',
      '/tracking': 'tracking',
      '/history': 'history'
    };

    const section = pathToSection[location.pathname as keyof typeof pathToSection] ?? 'home';
    if (section !== activeSection) {
      setActiveSection(section);
    }
  }, [location.pathname, activeSection, setActiveSection]);

  // Initialize Socket.IO MQTT connection
  useEffect(() => {
    let isInitialized = false;
    
    const initializeSocketMQTT = async () => {
      if (isInitialized) return;
      isInitialized = true;
      
      try {
        console.log('Initializing Socket.IO MQTT connection...');
        socketMqttService.connect();
      } catch (error) {
        console.error('Failed to initialize Socket.IO MQTT:', error);
      }
    };

    initializeSocketMQTT();

    return () => {
      socketMqttService.disconnect();
    };
  }, []);

  const handleSectionChange = (section: NavigationSection) => {
    setActiveSection(section);

    const sectionToPath: Record<NavigationSection, string> = {
      home: '/',
      order: '/order',
      tracking: '/tracking',
      history: '/history'
    };

    navigate(sectionToPath[section]);
  };

  return (
    <>
      <Routes>
        {/* Auth Routes - without Layout */}
        <Route path="/auth" element={<AuthLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Main App Routes - with Layout */}
        <Route path="/*" element={
          <Layout currentSection={activeSection} onSectionChange={handleSectionChange}>
            <Routes>
              <Route path="/" element={<HomeSection />} />
              <Route path="/order" element={<OrderFlowSection />} />
              <Route path="/tracking" element={<TrackingSection onBackToHome={() => navigate('/')} />} />
              <Route path="/history" element={<KioskHistorySection />} />
              <Route path="*" element={<HomeSection />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
