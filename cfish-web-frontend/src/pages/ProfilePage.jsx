import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Wallet,
  Image,
  Heart,
  Tag,
  Edit,
  Share2,
  Link as LinkIcon,
  Twitter,
  Discord,
  Globe,
  Shield,
  PlusCircle,
  Grid,
  List,
  Award
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';
import UserAvatar from '../components/UI/UserAvatar';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NFTCard from '../components/NFT/NFTCard';
import CollectionCard from '../components/NFT/CollectionCard';
import Modal from '../components/UI/Modal';

const ProfilePage = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isConnected, publicKey } = useWallet();
  const { addNotification } = useNotification();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created'); // 'created', 'collected', 'onSale', 'favorites', 'activity', 'achievements'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    username: '',
    bio: '',
    website: '',
    twitter: '',
    discord: '',
    avatar: null
  });
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileAddress = address || publicKey?.toBase58();
        if (!profileAddress) {
          setLoading(false);
          return;
        }
        const response = await fetch(`https://api.example.com/profile/${profileAddress}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data);
        setEditProfileData({
          username: data.username,
          bio: data.bio,
          website: data.website,
          twitter: data.twitter,
          discord: data.discord,
          avatar: data.avatar
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load profile details')
        });
      }
    };

    const fetchAchievements = async () => {
      try {
        const profileAddress = address || publicKey?.toBase58();
        if (!profileAddress) {
          return;
        }
        const response = await fetch(`https://api.example.com/profile/${profileAddress}/achievements`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
        addNotification({
          type: 'error',
          title: t('error'),
          message: t('Failed to load achievements')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchAchievements();
  }, [address, publicKey, addNotification, t]);

  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.example.com/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: profile.address,
          ...editProfileData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      addNotification({
        type: 'success',
        title: t('success'),
        message: t('Profile updated successfully!')
      });
      setShowEditProfileModal(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to update profile. Please try again.')
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
        setEditProfileData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderNFTs = (nfts) => {
    if (!nfts || nfts.length === 0) {
      return <p className="text-gray-400 text-center py-8">{t('noNFTsFound')}</p>;
    }
    return (
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {nfts.map(nft => (
          <NFTCard key={nft.id} nft={nft} viewMode={viewMode} />
        ))}
      </div>
    );
  };

  const renderActivity = (activity) => {
    if (!activity || activity.length === 0) {
      return <p className="text-gray-400 text-center py-8">{t('noActivityFound')}</p>;
    }
    return (
      <div className="space-y-4">
        {activity.map((event, index) => (
          <div key={index} className="p-4 bg-gray-900 rounded-lg flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              {event.type === 'sale' && <Tag className="w-6 h-6 text-green-400" />}
              {event.type === 'mint' && <PlusCircle className="w-6 h-6 text-blue-400" />}
              {event.type === 'list' && <List className="w-6 h-6 text-yellow-400" />}
            </div>
            <div>
              <p className="font-medium text-white">
                {event.type === 'sale' && `${t('sold')} ${event.nftName} ${t('for')} ${event.price} ${event.currency.toUpperCase()}`}
                {event.type === 'mint' && `${t('minted')} ${event.nftName}`}
                {event.type === 'list' && `${t('listed')} ${event.nftName} ${t('for')} ${event.price} ${event.currency.toUpperCase()}`}
              </p>
              <p className="text-sm text-gray-400">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAchievements = (achievementsList) => {
    if (!achievementsList || achievementsList.length === 0) {
      return <p className="text-gray-400 text-center py-8">{t('noAchievementsFound')}</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievementsList.map(achievement => (
          <div key={achievement.id} className="bg-gray-900 rounded-lg p-4 text-center flex flex-col items-center justify-center">
            <Award className="w-12 h-12 text-yellow-400 mb-2" />
            <h4 className="font-semibold text-white text-lg mb-1">{achievement.name}</h4>
            <p className="text-sm text-gray-400">{achievement.description}</p>
            {achievement.dateAchieved && (
              <p className="text-xs text-gray-500 mt-2">{t('achievedOn')}: {new Date(achievement.dateAchieved).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('profileNotFound')}</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80"
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    );
  }

  const isCurrentUser = isConnected && publicKey?.toBase58() === profile.address;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="relative bg-gray-900 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="flex-shrink-0 relative">
            <UserAvatar 
              address={profile.address}
              username={profile.username}
              avatar={profile.avatar}
              size="xl"
            />
            {profile.verified && (
              <Shield className="absolute bottom-0 right-0 w-6 h-6 text-blue-400 bg-gray-900 rounded-full p-1" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
              <h1 className="text-3xl font-bold">{profile.username}</h1>
              {profile.verified && (
                <Shield className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <p className="text-gray-400 mb-4">{profile.bio}</p>
            
            <div className="flex items-center justify-center md:justify-start space-x-6 text-sm mb-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span>{profile.followers} {t('followers')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4 text-blue-400" />
                <span>{profile.following} {t('following')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {profile.twitter && (
                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {profile.discord && (
                <a href={`https://discord.com/users/${profile.discord}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                  <Discord className="w-5 h-5" />
                </a>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-4">
              {isCurrentUser ? (
                <button
                  onClick={handleEditProfile}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('editProfile')}</span>
                </button>
              ) : (
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('follow')}</span>
                </button>
              )}
              <Share2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-primary" />
            </div>
          </div>

          {/* Level and Reputation */}
          <div className="flex-shrink-0 text-center md:text-right space-y-2">
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">{t('level')}</p>
              <p className="text-xl font-bold text-primary">{profile.level}</p>
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-400">{t('reputation')}</p>
              <p className="text-xl font-bold text-green-400">{profile.reputation}%</p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-800">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('created')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'created'
                    ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('created')}
              </button>
              <button
                onClick={() => setActiveTab('collected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'collected'
                    ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('collected')}
              </button>
              <button
                onClick={() => setActiveTab('onSale')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'onSale'
                    ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('onSale')}
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'favorites'
                    ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('favorites')}
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('activity')}
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'achievements'
                    ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('achievements')}
              </button>
            </nav>
          </div>

          <div className="py-8">
            <div className="flex justify-end mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-700' : 'bg-gray-800'} text-gray-300 hover:bg-gray-700`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-700' : 'bg-gray-800'} text-gray-300 hover:bg-gray-700`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {activeTab === 'created' && renderNFTs(profile.nftsCreated)}
            {activeTab === 'collected' && renderNFTs(profile.nftsCollected)}
            {activeTab === 'onSale' && renderNFTs(profile.nftsOnSale)}
            {activeTab === 'favorites' && renderNFTs(profile.nftsFavorites)}
            {activeTab === 'activity' && renderActivity(profile.activity)}
            {activeTab === 'achievements' && renderAchievements(achievements)}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        title={t('editProfile')}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                {editProfileData.avatar ? (
                  <img src={editProfileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
              <h3 className="text-lg font-semibold text-white">{editProfileData.username}</h3>
              <p className="text-gray-400">{profile.address.slice(0, 6)}...{profile.address.slice(-4)}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('username')}
            </label>
            <input
              type="text"
              value={editProfileData.username}
              onChange={(e) => setEditProfileData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('bio')}
            </label>
            <textarea
              value={editProfileData.bio}
              onChange={(e) => setEditProfileData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('website')}
            </label>
            <input
              type="text"
              value={editProfileData.website}
              onChange={(e) => setEditProfileData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Twitter
            </label>
            <input
              type="text"
              value={editProfileData.twitter}
              onChange={(e) => setEditProfileData(prev => ({ ...prev, twitter: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Discord
            </label>
            <input
              type="text"
              value={editProfileData.discord}
              onChange={(e) => setEditProfileData(prev => ({ ...prev, discord: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/80"
            >
              {t('saveChanges')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;


