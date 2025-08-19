import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Settings,
  Shield,
  Key,
  UserX,
  CreditCard,
  Bell,
  Globe,
  Palette,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
  Plus,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useApp();
  const { isConnected, publicKey } = useWallet();
  const { addNotification, settings: notificationContextSettings, updateSettings: updateNotificationContextSettings, requestPushPermission, subscribePush, unsubscribePush } = useNotification();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Profile settings
  const [profileData, setProfileData] = useState({
    username: 'CryptoFish',
    email: 'user@example.com',
    bio: 'NFT collector and digital art enthusiast',
    website: 'https://example.com',
    twitter: '@cryptofish',
    discord: 'CryptoFish#1234',
    avatar: null
  });

  // Notification preferences (local state, synced with context)
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false, // This will be synced with context
    saleNotifications: true,
    bidNotifications: true,
    offerNotifications: true,
    followNotifications: false,
    marketingEmails: false
  });

  useEffect(() => {
    // Sync local notificationPrefs with context settings
    setNotificationPrefs(prev => ({
      ...prev,
      pushNotifications: notificationContextSettings.pushEnabled,
      saleNotifications: notificationContextSettings[NotificationTypes.TRADE],
      bidNotifications: notificationContextSettings[NotificationTypes.ACTIVITY],
      offerNotifications: notificationContextSettings[NotificationTypes.ACTIVITY],
      followNotifications: notificationContextSettings[NotificationTypes.SOCIAL],
      // emailNotifications and marketingEmails are not directly in context, keep as is or add to context
    }));
  }, [notificationContextSettings]);

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showWallet: false,
    showActivity: true,
    showCollection: true
  });

  // Trading settings
  const [tradingSettings, setTradingSettings] = useState({
    defaultCurrency: 'SOL',
    autoApproveOffers: false,
    requireConfirmation: true,
    maxOfferAmount: 100,
    defaultCommission: 2.5
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'My App API', key: 'sk_test_...', created: '2024-01-15', lastUsed: '2024-01-20' },
    { id: 2, name: 'Bot Trading', key: 'sk_live_...', created: '2024-01-10', lastUsed: '2024-01-19' }
  ]);

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'preferences', label: t('notificationPreferences'), icon: Bell },
    { id: 'privacy', label: t('privacySettings'), icon: Eye },
    { id: 'security', label: t('securitySettings'), icon: Shield },
    { id: 'trading', label: t('交易设置'), icon: CreditCard },
    { id: 'api', label: t('apiKeys'), icon: Key },
    { id: 'advanced', label: t('高级设置'), icon: Settings }
  ];

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      addNotification({
        type: 'success',
        title: t('success'),
        message: `${section} ${t('设置已保存')}`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('保存失败，请重试')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_${Math.random().toString(36).substr(2, 20)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys(prev => [...prev, newKey]);
    setShowApiKeyModal(false);
    addNotification({
      type: 'success',
      title: t('success'),
      message: t('API密钥已生成')
    });
  };

  const deleteApiKey = (id) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    addNotification({
      type: 'success',
      title: t('success'),
      message: t('API密钥已删除')
    });
  };

  const handleNotificationToggle = async (key) => {
    if (key === 'pushNotifications') {
      if (notificationPrefs.pushNotifications) {
        // If currently enabled, unsubscribe
        await unsubscribePush();
      } else {
        // If currently disabled, request permission and subscribe
        await requestPushPermission();
      }
    } else {
      // For other notification types, update context settings
      const typeMap = {
        saleNotifications: NotificationTypes.TRADE,
        bidNotifications: NotificationTypes.ACTIVITY,
        offerNotifications: NotificationTypes.ACTIVITY,
        followNotifications: NotificationTypes.SOCIAL,
      };
      const contextKey = typeMap[key];
      if (contextKey) {
        updateNotificationContextSettings({ [contextKey]: !notificationPrefs[key] });
      }
      setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80">
            <Upload className="w-3 h-3 text-black" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{profileData.username}</h3>
          <p className="text-gray-400">{profileData.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('用户名')}
          </label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('邮箱')}
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('个人简介')}
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('网站')}
          </label>
          <input
            type="url"
            value={profileData.website}
            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Twitter
          </label>
          <input
            type="text"
            value={profileData.twitter}
            onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <button
        onClick={() => handleSave('个人资料')}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
      >
        {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
        <span>{t('保存更改')}</span>
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(notificationPrefs).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t(key)}</h4>
              <p className="text-sm text-gray-400">{t(`${key}Description`)}</p>
            </div>
            <button
              onClick={() => handleNotificationToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => handleSave('通知偏好')}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 disabled:opacity-50"
      >
        {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
        <span>{t('保存更改')}</span>
      </button>
    </div>
  );

  const renderApiKeySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">API {t('密钥管理')}</h3>
          <p className="text-gray-400">管理您的API密钥以访问CFISH API</p>
        </div>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80"
        >
          <Plus className="w-4 h-4" />
          <span>生成新密钥</span>
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-white font-medium">{apiKey.name}</h4>
                <p className="text-sm text-gray-400 font-mono">{apiKey.key}...</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>创建于: {apiKey.created}</span>
                  <span>最后使用: {apiKey.lastUsed}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-white">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteApiKey(apiKey.id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('请先连接钱包')}</h2>
          <p className="text-gray-400">{t('您需要连接钱包才能访问设置页面')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-gray-900 rounded-lg p-4 sticky top-8">
              <h2 className="text-xl font-bold mb-6">{t('settings')}</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-black'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-900 rounded-lg p-6">
              {activeTab === 'profile' && renderProfileSettings()}
              {activeTab === 'preferences' && renderNotificationSettings()}
              {activeTab === 'api' && renderApiKeySettings()}
              {/* Add other tab content here */}
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        title="生成新的API密钥"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              密钥名称
            </label>
            <input
              type="text"
              placeholder="输入API密钥名称"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              {t('cancel')}
            </button>
            <button
              onClick={generateApiKey}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80"
            >
              生成密钥
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;


