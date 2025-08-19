import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LanguageSelector = ({ className = '', showLabel = false }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-foreground transition-all duration-200 border border-border hover:border-primary/50"
        aria-label="Select language"
      >
        {showLabel ? (
          <>
            <Globe size={16} />
            <span className="text-sm">{t('settings.language')}</span>
          </>
        ) : (
          <>
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
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
          <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/50 transition-colors duration-200"
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      {language.nativeName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language.name}
                    </div>
                  </div>
                  {i18n.language === language.code && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;

