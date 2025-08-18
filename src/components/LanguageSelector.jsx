import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from './LanguageProvider';

// 语言选择器组件
export const LanguageSelector = ({ 
  variant = 'default', 
  size = 'default',
  showLabel = false,
  className = '' 
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages[currentLanguage];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // 紧凑版本（只显示图标）
  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={`p-2 ${className}`}
            aria-label={t('common.language')}
          >
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.values(languages).map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 标准版本（显示当前语言）
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={`flex items-center gap-2 ${className}`}
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg">{currentLang.flag}</span>
          {showLabel && <span>{currentLang.nativeName}</span>}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          {t('common.language')}
        </div>
        {Object.values(languages).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-xs text-muted-foreground">{lang.name}</span>
              </div>
            </div>
            {currentLanguage === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 移动端语言选择器
export const MobileLanguageSelector = () => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages[currentLanguage];

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-gray-400" />
          <span className="text-white">{t('common.language')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm text-gray-400">{currentLang.nativeName}</span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="bg-gray-900 border-t border-gray-700">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-8 py-3 text-left hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-gray-400">{lang.name}</span>
                </div>
              </div>
              {currentLanguage === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 语言切换按钮（简单版本）
export const LanguageToggle = ({ languages: supportedLangs = ['en', 'zh'] }) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  
  const toggleLanguage = () => {
    const currentIndex = supportedLangs.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % supportedLangs.length;
    setLanguage(supportedLangs[nextIndex]);
  };

  const currentLang = languages[currentLanguage];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      aria-label="Toggle language"
    >
      <span className="text-lg">{currentLang.flag}</span>
      <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
    </Button>
  );
};

// 内联语言选择器（用于设置页面）
export const InlineLanguageSelector = () => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        {t('common.language')}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {Object.values(languages).map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              currentLanguage === lang.code
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:bg-muted'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="text-left">
              <div className="font-medium">{lang.nativeName}</div>
              <div className="text-xs opacity-70">{lang.name}</div>
            </div>
            {currentLanguage === lang.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;

