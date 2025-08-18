import { createContext, useContext, useState, useEffect } from 'react';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
    nativeName: '中文'
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    nativeName: '日本語'
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    nativeName: '한국어'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español'
  },
  fr: {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    nativeName: 'Français'
  },
  de: {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
    nativeName: 'Deutsch'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    flag: '🇷🇺',
    nativeName: 'Русский'
  }
};

// 检测浏览器语言
export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  const langCode = browserLang.split('-')[0]; // 获取主语言代码
  
  // 如果支持该语言，返回语言代码，否则返回默认英文
  return SUPPORTED_LANGUAGES[langCode] ? langCode : 'en';
};

// 语言上下文
export const LanguageContext = createContext({
  currentLanguage: 'en',
  setLanguage: () => {},
  t: (key) => key,
  languages: SUPPORTED_LANGUAGES
});

// 翻译函数
export const createTranslator = (translations, language) => {
  return (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    // 深度查找翻译值
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
    
    // 如果找不到翻译，尝试使用英文
    if (!value && language !== 'en') {
      let fallbackValue = translations['en'];
      for (const k of keys) {
        if (fallbackValue && typeof fallbackValue === 'object') {
          fallbackValue = fallbackValue[k];
        } else {
          break;
        }
      }
      value = fallbackValue;
    }
    
    // 如果还是找不到，返回key
    if (!value) {
      return key;
    }
    
    // 参数替换
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }
    
    return value;
  };
};

// 语言存储
export const LanguageStorage = {
  get: () => {
    try {
      return localStorage.getItem('cfish-language') || detectBrowserLanguage();
    } catch {
      return detectBrowserLanguage();
    }
  },
  
  set: (language) => {
    try {
      localStorage.setItem('cfish-language', language);
    } catch {
      // 忽略存储错误
    }
  }
};

// 格式化数字
export const formatNumber = (number, language = 'en') => {
  try {
    return new Intl.NumberFormat(language).format(number);
  } catch {
    return number.toString();
  }
};

// 格式化货币
export const formatCurrency = (amount, currency = 'USD', language = 'en') => {
  try {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

// 格式化日期
export const formatDate = (date, language = 'en', options = {}) => {
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    return new Intl.DateTimeFormat(language, defaultOptions).format(new Date(date));
  } catch {
    return new Date(date).toLocaleDateString();
  }
};

// 格式化相对时间
export const formatRelativeTime = (date, language = 'en') => {
  try {
    const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
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

// 复数处理
export const pluralize = (count, singular, plural, language = 'en') => {
  if (language === 'zh' || language === 'ja' || language === 'ko') {
    // 中文、日文、韩文没有复数形式
    return singular;
  }
  
  return count === 1 ? singular : (plural || `${singular}s`);
};

// RTL语言检测
export const isRTL = (language) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(language);
};

// 语言方向
export const getTextDirection = (language) => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

export default {
  SUPPORTED_LANGUAGES,
  detectBrowserLanguage,
  LanguageContext,
  createTranslator,
  LanguageStorage,
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  pluralize,
  isRTL,
  getTextDirection
};

