import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Check, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ThemeSelector = ({ className = '', showLabel = false }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { 
      value: 'dark', 
      label: t('themes.dark'), 
      icon: Moon, 
      description: 'Dark theme for better night viewing',
      preview: 'bg-gray-900 border-gray-700'
    },
    { 
      value: 'light', 
      label: t('themes.light'), 
      icon: Sun, 
      description: 'Light theme for daytime use',
      preview: 'bg-white border-gray-200'
    },
    { 
      value: 'auto', 
      label: t('themes.auto'), 
      icon: Monitor, 
      description: 'Automatically switch based on system preference',
      preview: 'bg-gradient-to-r from-gray-900 to-white border-gray-400'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  const handleThemeChange = (themeValue) => {
    setTheme(themeValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-foreground transition-all duration-200 border border-border hover:border-primary/50"
        aria-label="Select theme"
      >
        {showLabel ? (
          <>
            <Palette size={16} />
            <span className="text-sm">{t('settings.theme')}</span>
          </>
        ) : (
          <>
            <CurrentIcon size={16} />
            <span className="text-sm font-medium capitalize">{currentTheme.label}</span>
          </>
        )}
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="py-2">
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon;
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <div className={`w-8 h-8 rounded-lg border-2 ${themeOption.preview} flex items-center justify-center`}>
                      <IconComponent size={14} className="text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {themeOption.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {themeOption.description}
                      </div>
                    </div>
                    {theme === themeOption.value && (
                      <Check size={16} className="text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;

