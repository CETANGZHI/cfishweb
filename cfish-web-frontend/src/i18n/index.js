import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// 翻译资源
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        explore: 'Explore',
        collections: 'Collections',
        marketplace: 'Marketplace',
        create: 'Create',
        resources: 'Resources',
        publish: 'Publish',
        connect: 'Connect',
        disconnect: 'Disconnect',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout'
      },
      // Hero Section
      hero: {
        title: 'The Web3 C2C Global Trading Platform for NFTs',
        subtitle: 'Discover, trade, and collect unique digital assets on Solana\'s fastest marketplace',
        searchPlaceholder: 'Search NFTs, collections...'
      },
      // Categories
      categories: {
        all: 'All',
        art: 'Art',
        collectibles: 'Collectibles',
        gaming: 'Gaming',
        music: 'Music',
        virtual: 'Virtual'
      },
      // Sections
      sections: {
        trending: 'Trending NFTs',
        featured: 'Featured Collections',
        marketplace: 'Marketplace',
        categories: 'Explore Categories',
        howItWorks: 'How It Works',
        viewAll: 'View All',
        exploreAll: 'Explore All',
        browseAll: 'Browse All'
      },
      // Marketplace
      marketplace: {
        rare: 'Rare',
        epic: 'Epic',
        legendary: 'Legendary',
        items: 'Items',
        owners: 'Owners',
        floor: 'Floor'
      },
      // Features
      features: {
        digitalArt: {
          title: 'Digital Art',
          description: 'Unique artworks from creators worldwide'
        },
        gamingAssets: {
          title: 'Gaming Assets',
          description: 'In-game items and virtual worlds'
        },
        musicAudio: {
          title: 'Music & Audio',
          description: 'Exclusive tracks and audio experiences'
        },
        utilityNFTs: {
          title: 'Utility NFTs',
          description: 'Access passes and functional tokens'
        }
      },
      // How It Works
      howItWorks: {
        connect: {
          title: 'Connect',
          description: 'Link your Solana wallet to start trading'
        },
        discover: {
          title: 'Discover',
          description: 'Browse collections and find unique NFTs'
        },
        trade: {
          title: 'Trade',
          description: 'Buy, sell, or swap with zero fees using CFISH'
        }
      },
      // Stats
      stats: {
        nfts: 'NFTs',
        users: 'Users',
        fees: 'Fees'
      },
      // Notifications
      notifications: {
        title: 'Notifications',
        markAllRead: 'Mark all as read',
        noNotifications: 'No notifications',
        types: {
          trade: 'Trade',
          system: 'System',
          activity: 'Activity',
          social: 'Social'
        }
      },
      // Settings
      settings: {
        language: 'Language',
        theme: 'Theme',
        notifications: 'Notifications',
        privacy: 'Privacy'
      },
      // Themes
      themes: {
        dark: 'Dark',
        light: 'Light',
        auto: 'Auto'
      },
      // Languages
      languages: {
        en: 'English',
        zh: '中文',
        ja: '日本語',
        ko: '한국어',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        ru: 'Русский'
      }
    }
  },
  zh: {
    translation: {
      // Navigation
      nav: {
        explore: '探索',
        collections: '收藏品',
        marketplace: '市场',
        create: '创建',
        resources: '资源',
        publish: '发布',
        connect: '连接钱包',
        disconnect: '断开连接',
        profile: '个人资料',
        settings: '设置',
        logout: '退出登录'
      },
      // Hero Section
      hero: {
        title: 'Web3 C2C 全球NFT交易平台',
        subtitle: '在Solana最快的市场上发现、交易和收集独特的数字资产',
        searchPlaceholder: '搜索NFT、收藏品...'
      },
      // Categories
      categories: {
        all: '全部',
        art: '艺术',
        collectibles: '收藏品',
        gaming: '游戏',
        music: '音乐',
        virtual: '虚拟'
      },
      // Sections
      sections: {
        trending: '热门NFT',
        featured: '精选收藏',
        marketplace: '市场',
        categories: '探索分类',
        howItWorks: '如何使用',
        viewAll: '查看全部',
        exploreAll: '探索全部',
        browseAll: '浏览全部'
      },
      // Marketplace
      marketplace: {
        rare: '稀有',
        epic: '史诗',
        legendary: '传奇',
        items: '物品',
        owners: '持有者',
        floor: '地板价'
      },
      // Features
      features: {
        digitalArt: {
          title: '数字艺术',
          description: '来自全球创作者的独特艺术作品'
        },
        gamingAssets: {
          title: '游戏资产',
          description: '游戏内物品和虚拟世界'
        },
        musicAudio: {
          title: '音乐音频',
          description: '独家音轨和音频体验'
        },
        utilityNFTs: {
          title: '实用NFT',
          description: '访问通行证和功能代币'
        }
      },
      // How It Works
      howItWorks: {
        connect: {
          title: '连接',
          description: '连接您的Solana钱包开始交易'
        },
        discover: {
          title: '发现',
          description: '浏览收藏品并找到独特的NFT'
        },
        trade: {
          title: '交易',
          description: '使用CFISH零手续费买卖或交换'
        }
      },
      // Stats
      stats: {
        nfts: 'NFT数量',
        users: '用户数',
        fees: '手续费'
      },
      // Notifications
      notifications: {
        title: '通知',
        markAllRead: '全部标记为已读',
        noNotifications: '暂无通知',
        types: {
          trade: '交易',
          system: '系统',
          activity: '活动',
          social: '社交'
        }
      },
      // Settings
      settings: {
        language: '语言',
        theme: '主题',
        notifications: '通知',
        privacy: '隐私'
      },
      // Themes
      themes: {
        dark: '深色',
        light: '浅色',
        auto: '自动'
      },
      // Languages
      languages: {
        en: 'English',
        zh: '中文',
        ja: '日本語',
        ko: '한국어',
        es: 'Español',
        fr: 'Français',
        de: 'Deutsch',
        ru: 'Русский'
      }
    }
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;

