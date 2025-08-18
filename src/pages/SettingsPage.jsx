import React, { useState } from 'react';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Lock,
  Key,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Camera,
  Edit,
  Plus,
  Minus,
  ToggleLeft,
  ToggleRight,
  Languages,
  Zap,
  DollarSign,
  Percent,
  Clock,
  Target,
  Award,
  Star,
  Heart,
  MessageSquare,
  Share,
  Link,
  QrCode,
  Fingerprint,
  Scan
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import '../App.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: 'CryptoArtist',
    email: 'artist@example.com',
    bio: 'Digital artist and NFT collector passionate about blockchain technology.',
    website: 'https://myartportfolio.com',
    twitter: '@cryptoartist',
    discord: 'CryptoArtist#1234'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    tradingAlerts: true,
    priceAlerts: true,
    newFollowers: true,
    comments: true,
    mentions: true,
    systemUpdates: true,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showWallet: false,
    showActivity: true,
    showCollection: true,
    allowMessages: true,
    allowFollows: true,
    twoFactorAuth: true,
    loginAlerts: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    soundEffects: true,
    animations: true,
    compactMode: false
  });

  const [tradingSettings, setTradingSettings] = useState({
    defaultCurrency: 'SOL',
    showUSDValues: true,
    confirmTransactions: true,
    gasOptimization: 'medium',
    slippageTolerance: 1.0,
    autoApprove: false,
    tradingFees: 'CFISH',
    maxGasPrice: 50
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const themes = [
    { id: 'dark', name: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { id: 'light', name: 'Light', icon: <Sun className="h-4 w-4" /> },
    { id: 'auto', name: 'Auto', icon: <Monitor className="h-4 w-4" /> }
  ];

  const currencies = [
    { code: 'USD', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', flag: '🇪🇺' },
    { code: 'JPY', symbol: '¥', flag: '🇯🇵' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧' },
    { code: 'CNY', symbol: '¥', flag: '🇨🇳' },
    { code: 'KRW', symbol: '₩', flag: '🇰🇷' }
  ];

  const handleSaveProfile = () => {
    // Save profile logic
    console.log('Saving profile:', profileData);
  };

  const handleExportData = () => {
    // Export data logic
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // Delete account logic
    console.log('Deleting account...');
  };

  const SettingItem = ({ icon, title, description, children, action }) => (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
      <div className="flex items-start gap-3 flex-1">
        <div className="h-10 w-10 bg-secondary/20 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          {children}
        </div>
      </div>
      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );

  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-responsive-xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account preferences and platform settings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="relative mx-auto w-32 h-32">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center text-4xl">
                      👨‍🎨
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </Button>
                    <Button variant="ghost" className="w-full text-red-400">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Username
                      </label>
                      <Input
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Bio
                    </label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Website
                      </label>
                      <Input
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Twitter
                      </label>
                      <Input
                        value={profileData.twitter}
                        onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Discord
                    </label>
                    <Input
                      value={profileData.discord}
                      onChange={(e) => setProfileData({...profileData, discord: e.target.value})}
                      placeholder="Username#1234"
                    />
                  </div>

                  <Button onClick={handleSaveProfile} className="btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <Check className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-semibold text-foreground">Email Verified</p>
                      <p className="text-sm text-muted-foreground">Your email is confirmed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <div>
                      <p className="font-semibold text-foreground">Phone Pending</p>
                      <p className="text-sm text-muted-foreground">Add phone number</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <X className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-semibold text-foreground">KYC Required</p>
                      <p className="text-sm text-muted-foreground">Complete verification</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<Mail className="h-5 w-5" />}
                    title="Email Notifications"
                    description="Receive notifications via email"
                    action={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailNotifications: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Smartphone className="h-5 w-5" />}
                    title="Push Notifications"
                    description="Receive push notifications on your device"
                    action={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, pushNotifications: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<MessageSquare className="h-5 w-5" />}
                    title="SMS Notifications"
                    description="Receive important alerts via SMS"
                    action={
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, smsNotifications: checked})
                        }
                      />
                    }
                  />
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Notification Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<DollarSign className="h-5 w-5" />}
                    title="Trading Alerts"
                    description="NFT sales, purchases, and barter offers"
                    action={
                      <Switch
                        checked={notificationSettings.tradingAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, tradingAlerts: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Target className="h-5 w-5" />}
                    title="Price Alerts"
                    description="Price changes for watched NFTs"
                    action={
                      <Switch
                        checked={notificationSettings.priceAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, priceAlerts: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Heart className="h-5 w-5" />}
                    title="Social Interactions"
                    description="New followers, comments, and mentions"
                    action={
                      <Switch
                        checked={notificationSettings.newFollowers}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, newFollowers: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Info className="h-5 w-5" />}
                    title="System Updates"
                    description="Platform updates and maintenance notices"
                    action={
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, systemUpdates: checked})
                        }
                      />
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Notification Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Notification Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Quiet Hours
                    </label>
                    <div className="flex gap-2">
                      <Select defaultValue="22:00">
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="22:00">10:00 PM</SelectItem>
                          <SelectItem value="23:00">11:00 PM</SelectItem>
                          <SelectItem value="00:00">12:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground self-center">to</span>
                      <Select defaultValue="08:00">
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="07:00">7:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Frequency
                    </label>
                    <Select defaultValue="instant">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Profile Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Profile Visibility
                    </label>
                    <Select 
                      value={privacySettings.profileVisibility}
                      onValueChange={(value) => 
                        setPrivacySettings({...privacySettings, profileVisibility: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <SettingItem
                    icon={<Mail className="h-5 w-5" />}
                    title="Show Email"
                    description="Display email address on profile"
                    action={
                      <Switch
                        checked={privacySettings.showEmail}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, showEmail: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<QrCode className="h-5 w-5" />}
                    title="Show Wallet Address"
                    description="Display wallet address on profile"
                    action={
                      <Switch
                        checked={privacySettings.showWallet}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, showWallet: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Clock className="h-5 w-5" />}
                    title="Show Activity"
                    description="Display recent activity and transactions"
                    action={
                      <Switch
                        checked={privacySettings.showActivity}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, showActivity: checked})
                        }
                      />
                    }
                  />
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingItem
                    icon={<Fingerprint className="h-5 w-5" />}
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security"
                    action={
                      <Switch
                        checked={privacySettings.twoFactorAuth}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, twoFactorAuth: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Bell className="h-5 w-5" />}
                    title="Login Alerts"
                    description="Get notified of new login attempts"
                    action={
                      <Switch
                        checked={privacySettings.loginAlerts}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, loginAlerts: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<MessageSquare className="h-5 w-5" />}
                    title="Allow Messages"
                    description="Let other users send you messages"
                    action={
                      <Switch
                        checked={privacySettings.allowMessages}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, allowMessages: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Heart className="h-5 w-5" />}
                    title="Allow Follows"
                    description="Let other users follow your profile"
                    action={
                      <Switch
                        checked={privacySettings.allowFollows}
                        onCheckedChange={(checked) => 
                          setPrivacySettings({...privacySettings, allowFollows: checked})
                        }
                      />
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Data & Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Data & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Download className="h-6 w-6" />
                    <span>Export Data</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Trash2 className="h-6 w-6" />
                    <span>Delete Data</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <ExternalLink className="h-6 w-6" />
                    <span>Privacy Policy</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Theme Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Color Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setAppearanceSettings({...appearanceSettings, theme: theme.id})}
                          className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                            appearanceSettings.theme === theme.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {theme.icon}
                          <span className="text-sm font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <SettingItem
                    icon={<Volume2 className="h-5 w-5" />}
                    title="Sound Effects"
                    description="Play sounds for interactions"
                    action={
                      <Switch
                        checked={appearanceSettings.soundEffects}
                        onCheckedChange={(checked) => 
                          setAppearanceSettings({...appearanceSettings, soundEffects: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Zap className="h-5 w-5" />}
                    title="Animations"
                    description="Enable smooth animations"
                    action={
                      <Switch
                        checked={appearanceSettings.animations}
                        onCheckedChange={(checked) => 
                          setAppearanceSettings({...appearanceSettings, animations: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Monitor className="h-5 w-5" />}
                    title="Compact Mode"
                    description="Use compact layout for more content"
                    action={
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onCheckedChange={(checked) => 
                          setAppearanceSettings({...appearanceSettings, compactMode: checked})
                        }
                      />
                    }
                  />
                </CardContent>
              </Card>

              {/* Localization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Localization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Language
                    </label>
                    <Select 
                      value={appearanceSettings.language}
                      onValueChange={(value) => 
                        setAppearanceSettings({...appearanceSettings, language: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Currency
                    </label>
                    <Select 
                      value={appearanceSettings.currency}
                      onValueChange={(value) => 
                        setAppearanceSettings({...appearanceSettings, currency: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span>{currency.flag}</span>
                              <span>{currency.code} ({currency.symbol})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Timezone
                    </label>
                    <Select 
                      value={appearanceSettings.timezone}
                      onValueChange={(value) => 
                        setAppearanceSettings({...appearanceSettings, timezone: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="EST">EST (GMT-5)</SelectItem>
                        <SelectItem value="PST">PST (GMT-8)</SelectItem>
                        <SelectItem value="JST">JST (GMT+9)</SelectItem>
                        <SelectItem value="CET">CET (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Date Format
                    </label>
                    <Select 
                      value={appearanceSettings.dateFormat}
                      onValueChange={(value) => 
                        setAppearanceSettings({...appearanceSettings, dateFormat: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trading Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Trading Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Default Currency
                    </label>
                    <Select 
                      value={tradingSettings.defaultCurrency}
                      onValueChange={(value) => 
                        setTradingSettings({...tradingSettings, defaultCurrency: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SOL">SOL</SelectItem>
                        <SelectItem value="CFISH">CFISH</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <SettingItem
                    icon={<DollarSign className="h-5 w-5" />}
                    title="Show USD Values"
                    description="Display USD equivalent for all prices"
                    action={
                      <Switch
                        checked={tradingSettings.showUSDValues}
                        onCheckedChange={(checked) => 
                          setTradingSettings({...tradingSettings, showUSDValues: checked})
                        }
                      />
                    }
                  />

                  <SettingItem
                    icon={<Shield className="h-5 w-5" />}
                    title="Confirm Transactions"
                    description="Require confirmation for all transactions"
                    action={
                      <Switch
                        checked={tradingSettings.confirmTransactions}
                        onCheckedChange={(checked) => 
                          setTradingSettings({...tradingSettings, confirmTransactions: checked})
                        }
                      />
                    }
                  />

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Gas Optimization
                    </label>
                    <Select 
                      value={tradingSettings.gasOptimization}
                      onValueChange={(value) => 
                        setTradingSettings({...tradingSettings, gasOptimization: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow (Lower fees)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="fast">Fast (Higher fees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Trading */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Advanced Trading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Slippage Tolerance: {tradingSettings.slippageTolerance}%
                    </label>
                    <Slider
                      value={[tradingSettings.slippageTolerance]}
                      onValueChange={(value) => 
                        setTradingSettings({...tradingSettings, slippageTolerance: value[0]})
                      }
                      max={5}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Max Gas Price: {tradingSettings.maxGasPrice} Gwei
                    </label>
                    <Slider
                      value={[tradingSettings.maxGasPrice]}
                      onValueChange={(value) => 
                        setTradingSettings({...tradingSettings, maxGasPrice: value[0]})
                      }
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <SettingItem
                    icon={<Zap className="h-5 w-5" />}
                    title="Auto-Approve Tokens"
                    description="Automatically approve token spending"
                    action={
                      <Switch
                        checked={tradingSettings.autoApprove}
                        onCheckedChange={(checked) => 
                          setTradingSettings({...tradingSettings, autoApprove: checked})
                        }
                      />
                    }
                  />

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Preferred Fee Payment
                    </label>
                    <Select 
                      value={tradingSettings.tradingFees}
                      onValueChange={(value) => 
                        setTradingSettings({...tradingSettings, tradingFees: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CFISH">CFISH (0% fees)</SelectItem>
                        <SelectItem value="SOL">SOL (2% fees)</SelectItem>
                        <SelectItem value="AUTO">Auto (Best rate)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Account Type</p>
                      <p className="text-sm text-muted-foreground">Premium Member</p>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Member Since</p>
                      <p className="text-sm text-muted-foreground">January 15, 2024</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Total Trades</p>
                      <p className="text-sm text-muted-foreground">47 successful trades</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Reputation Score</p>
                      <p className="text-sm text-muted-foreground">4.9/5.0 (Excellent)</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">
                      <Award className="h-3 w-3 mr-1" />
                      Trusted
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Account Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Preferences
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h3 className="font-semibold text-red-400 mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;

