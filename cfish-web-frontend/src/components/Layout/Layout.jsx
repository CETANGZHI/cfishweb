import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import NotificationPanel from '../Notifications/NotificationPanel';
import { useApp } from '../../contexts/AppContext';

const Layout = ({ children }) => {
  const { isMobileMenuOpen, isNotificationPanelOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <MobileMenu />
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 lg:px-6 py-8">
        {children}
      </main>
      
      {/* Notification Panel (not an overlay, part of main content flow if needed) */}
      {/* If NotificationPanel is intended to be a persistent part of the layout, 
          it should be rendered here directly, not as an overlay. 
          For now, keeping it as an overlay based on previous code, 
          but will adjust if user clarifies it should be always visible. */}
      {isNotificationPanelOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <NotificationPanel />
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;

