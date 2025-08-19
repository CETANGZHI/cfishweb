import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  X,
  Home,
  Search,
  Grid3X3,
  ShoppingBag,
  Plus,
  Coins,
  Upload,
  Bell,
  User,
  Settings,
  Globe,
  Palette
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useNotifications } from '../../contexts/NotificationContext';
import LanguageSelector from '../UI/LanguageSelector';
import ThemeSelector from '../UI/ThemeSelector';

const MobileMenu = () => {
  const { t } = useTranslation();
  const { isMobileMenuOpen, closeMobileMenu } = useApp();
  const { unreadCount } = useNotifications();

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/marketplace', label: t('nav.explore'), icon: Search },
    { path: '/collections', label: t('nav.collections'), icon: Grid3X3 },
    { path: '/create', label: t('nav.create'), icon: Plus },
    { path: '/publish', label: t('nav.publish'), icon: Upload },
    { path: '/wallet', label: t('nav.wallet'), icon: Coins },
    { path: '/profile', label: t('nav.profile'), icon: User },
    { path: '/settings', label: t('nav.settings'), icon: Settings },
    { path: '/notifications', label: t('nav.notifications'), icon: Bell },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="logo-icon w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-lg">
            🐟
          </div>
          <span className="text-xl font-bold text-foreground">CFISH</span>
        </div>
        <button
          onClick={closeMobileMenu}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Publish Button (突出显示) */}
      <div className="p-4 border-b border-border">
        <Link
          to="/publish"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 w-full bg-gradient-primary text-black px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        >
          <Upload size={20} />
          <span>{t('nav.publish')}</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <ul className="flex flex-col space-y-4 py-2">
        {navLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <li key={link.path}>
              <Link
                to={link.path}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary/50 transition-colors duration-200"
              >
                <IconComponent size={20} className="text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{link.label}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User Menu (仅在登录时显示) */}
      {connected && (
        <div className="py-2 border-t border-border">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('nav.account')}
            </h3>
          </div>
          
          {/* Notification (仅在登录时显示) */}
          <Link
            to="/notifications"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary/50 transition-colors duration-200"
          >
            <div className="relative">
              <Bell size={20} className="text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium">{t('nav.notifications')}</div>
              <div className="text-xs text-muted-foreground">{t('nav.notificationsDesc')}</div>
            </div>
          </Link>

          <ul className="flex flex-col space-y-4">
            {navLinks.filter(link => ['/profile', '/wallet', '/settings'].includes(link.path)).map((link) => {
              const IconComponent = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <IconComponent size={20} className="text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{link.label}</div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Settings Section */}
      <div className="py-2 border-t border-border">
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('nav.preferences')}
          </h3>
        </div>
        
        {/* Language Selector */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={20} className="text-muted-foreground" />
            <span className="font-medium text-foreground">{t('settings.language')}</span>
          </div>
          <LanguageSelector showLabel={false} className="w-full" />
        </div>

        {/* Theme Selector */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <Palette size={20} className="text-muted-foreground" />
            <span className="font-medium text-foreground">{t('settings.theme')}</span>
          </div>
          <ThemeSelector showLabel={false} className="w-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>© 2025 CFISH NFT Marketplace</p>
          <p className="mt-1">{t('footer.version')} 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

