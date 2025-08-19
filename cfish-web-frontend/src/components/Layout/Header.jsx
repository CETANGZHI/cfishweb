import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Globe,
  Palette,
  User,
  Settings
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useNotifications } from '../../contexts/NotificationContext';
import LanguageSelector from '../UI/LanguageSelector';
import ThemeSelector from '../UI/ThemeSelector';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { connected, publicKey } = useWallet();
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    connectWallet,
    disconnectWallet
  } = useApp();
  const { notifications, unreadCount } = useNotifications();
  // 监听钱包连接状态变化
  useEffect(() => {
    if (connected && publicKey) {
      connectWallet(publicKey.toString());
    } else {
      disconnectWallet();
    }
  }, [connected, publicKey, connectWallet, disconnectWallet]);

  // 监听路由变化，关闭移动菜单
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  // 监听滚动，添加头部样式
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/marketplace', label: t('nav.explore') },
    { path: '/collections', label: t('nav.collections') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/create', label: t('nav.create') },
    { path: '/settings', label: t('nav.resources') }
  ];

  return (
    <header
      id="header"
      className="header fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-border transition-all duration-300"
    >
      <nav className="nav flex justify-between items-center p-4 lg:px-6 max-w-7xl mx-auto">
        {/* Mobile: Menu Button (最左边) and Logo (居中) */}
        <div className="flex items-center lg:hidden w-full">
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-btn p-2 text-white hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
          {/* Logo (居中在移动端) */}
          <Link to="/" className="logo flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors absolute left-1/2 -translate-x-1/2">
            <div className="logo-icon w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-lg pulse-glow">
              🐟
            </div>
            <span className="hidden sm:block">CFISH</span>
          </Link>
        </div>

        {/* Desktop: Logo (左边) */}
        <Link to="/" className="logo hidden lg:flex items-center gap-2 text-xl font-bold text-white hover:text-primary transition-colors">
          <div className="logo-icon w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-lg pulse-glow">
            🐟
          </div>
          <span>CFISH</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-links hidden lg:flex list-none gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="relative text-muted-foreground hover:text-white font-medium transition-all duration-300 py-2 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Desktop: Language & Theme Selectors */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSelector />
            <ThemeSelector />
          </div>

          {/* Publish Button (突出显示) */}
          <Link
            to="/publish"
            className="hidden sm:flex items-center gap-2 bg-gradient-primary text-black px-4 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
          >
            <Plus size={16} />
            <span className="hidden md:block">{t('nav.publish')}</span>
          </Link>

          {/* Notification Bell (仅在钱包连接时显示) */}
          {connected && (
            <Link
              to="/notifications"
              className="relative p-2 text-muted-foreground hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile (仅在钱包连接时显示) */}
          {connected && (
            <Link
              to="/profile"
              className="hidden lg:flex p-2 text-muted-foreground hover:text-white transition-colors"
              aria-label="Profile"
            >
              <User size={20} />
            </Link>
          )}

          {/* Wallet Connection */}
          <div className="wallet-connection">
            <WalletMultiButton className="!bg-gradient-primary !text-black !border-none !rounded-full !font-semibold !px-4 !py-2 !text-sm hover:!shadow-lg hover:!shadow-primary/25 !transition-all !duration-300 hover:!scale-105" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;


