import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Wallet, 
  Globe, 
  Palette, 
  Bell,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { NotificationBell } from './NotificationSystem';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from './LanguageProvider';
import '../App.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.home'), key: 'home' },
    { path: '/marketplace', label: t('nav.marketplace'), key: 'marketplace' },
    { path: '/create', label: t('nav.create'), key: 'create' },
    { path: '/barter', label: t('nav.barter'), key: 'barter' },
    { path: '/staking', label: t('nav.staking'), key: 'staking' },
    { path: '/community', label: t('nav.community'), key: 'community' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  const themes = [
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'blue', name: 'Blue', icon: '🔵' },
    { id: 'green', name: 'Green', icon: '🟢' },
    { id: 'purple', name: 'Purple', icon: '🟣' },
  ];

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="text-responsive-lg font-bold text-foreground">CFISH</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`text-responsive-base transition-colors duration-200 hover:text-primary ${
                  location.pathname === item.path 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Selector */}
            <LanguageSelector variant="compact" />

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {themes.map((theme) => (
                  <DropdownMenuItem key={theme.id} className="cursor-pointer">
                    <span className="mr-2">{theme.icon}</span>
                    {theme.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <NotificationBell />

            {/* Wallet Connect */}
            <Button className="btn-primary">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-secondary"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile actions */}
              <div className="pt-4 pb-2 border-t border-border mt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">Quick Actions</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Globe className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Palette className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full mt-2 btn-primary">
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

