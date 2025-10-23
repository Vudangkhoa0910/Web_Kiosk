import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import OrderFlowSection from './components/sections/OrderFlowSection';
import TrackingSection from './components/sections/TrackingSection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthLandingPage from './pages/AuthLandingPage';
import TestOrderPage from './pages/TestOrderPage';
import TokenUpdatePage from './pages/TokenUpdatePage';
import PaymentResult from './pages/PaymentResult';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
// MQTT service has been disabled
// import { socketMqttService } from './services';
import { useAppStore } from './hooks/useAppStore';

// Main App Content with URL Routing
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSection, setActiveSection } = useAppStore();

  // Sync URL with activeSection state
  useEffect(() => {
    const pathToSection = {
      '/': 'home',
      '/tracking': 'tracking',
      '/history': 'history'
    } as const;

    const section = pathToSection[location.pathname as keyof typeof pathToSection] ?? 'home';
    if (section !== activeSection) {
      setActiveSection(section);
    }
  }, [location.pathname, activeSection, setActiveSection]);

  // Check for active order and redirect to tracking
  useEffect(() => {
    const checkActiveOrder = async () => {
      try {
        // Import the kiosk store dynamically
        const { useKioskStore } = await import('./stores/kioskStore');
        const currentOrder = useKioskStore.getState().currentOrder;
        
        // If there's an active order and we're on home page, redirect to tracking
        if (currentOrder && 
            currentOrder.status !== 'delivered' && 
            currentOrder.status !== 'cancelled' &&
            location.pathname === '/') {
          setActiveSection('tracking');
          navigate('/tracking');
        }
      } catch (error) {
        console.error('Error checking active order:', error);
      }
    };

    checkActiveOrder();
  }, [location.pathname, navigate, setActiveSection]);

  // MQTT connection has been disabled
  // useEffect(() => {
  //   let isInitialized = false;
  //   
  //   const initializeSocketMQTT = async () => {
  //     if (isInitialized) return;
  //     isInitialized = true;
  //     
  //     try {
  //       console.log('Initializing Socket.IO MQTT connection...');
  //       socketMqttService.connect();
  //     } catch (error) {
  //       console.error('Failed to initialize Socket.IO MQTT:', error);
  //     }
  //   };
  //
  //   initializeSocketMQTT();
  //
  //   return () => {
  //     socketMqttService.disconnect();
  //   };
  // }, []);

  return (
    <>
      <Routes>
        {/* Auth Routes - without Layout */}
        <Route path="/auth" element={<AuthLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Test Route - without Layout */}
        <Route path="/test-order" element={<TestOrderPage />} />
        
        {/* Token Management - without Layout */}
        <Route path="/token-update" element={<TokenUpdatePage />} />
        
        {/* Payment Callback - without Layout */}
        <Route path="/payment/result" element={<PaymentResult />} />
        
        {/* Main App Routes - with Layout */}
        <Route path="/*" element={
          <Layout currentSection={activeSection}>
            <Routes>
              <Route path="/" element={<OrderFlowSection />} />
              <Route path="/tracking" element={<TrackingSection onBackToHome={() => navigate('/')} />} />
              <Route path="*" element={<OrderFlowSection />} />
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
