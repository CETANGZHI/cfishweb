import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageContext, 
  createTranslator, 
  LanguageStorage, 
  detectBrowserLanguage,
  SUPPORTED_LANGUAGES,
  getTextDirection
} from '../i18n';
import translations from '../i18n/translations';

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return LanguageStorage.get();
  });

  // 创建翻译函数
  const t = createTranslator(translations, currentLanguage);

  // 设置语言
  const setLanguage = (language) => {
    if (SUPPORTED_LANGUAGES[language]) {
      setCurrentLanguage(language);
      LanguageStorage.set(language);
      
      // 更新HTML lang属性
      document.documentElement.lang = language;
      
      // 更新文档方向
      document.documentElement.dir = getTextDirection(language);
      
      // 触发自定义事件
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language } 
      }));
    }
  };

  // 初始化时设置HTML属性
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = getTextDirection(currentLanguage);
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
    isRTL: getTextDirection(currentLanguage) === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言的Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 翻译Hook
export const useTranslation = () => {
  const { t, currentLanguage } = useLanguage();
  return { t, language: currentLanguage };
};

// 格式化Hook
export const useFormatting = () => {
  const { currentLanguage } = useLanguage();
  
  const formatNumber = (number) => {
    try {
      return new Intl.NumberFormat(currentLanguage).format(number);
    } catch {
      return number.toString();
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  const formatDate = (date, options = {}) => {
    try {
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
      };
      return new Intl.DateTimeFormat(currentLanguage, defaultOptions).format(new Date(date));
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  const formatRelativeTime = (date) => {
    try {
      const rtf = new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' });
      const now = new Date();
      const targetDate = new Date(date);
      const diffInSeconds = (targetDate - now) / 1000;
      
      const intervals = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 }
      ];
      
      for (const interval of intervals) {
        const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
        if (count >= 1) {
          return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit);
        }
      }
      
      return rtf.format(0, 'second');
    } catch {
      return new Date(date).toLocaleDateString();
    }
  };

  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime
  };
};

export default LanguageProvider;

