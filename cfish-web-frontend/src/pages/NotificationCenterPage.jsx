import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../contexts/NotificationContext';
import { Bell, CheckCircle, XCircle, Mail, Tag, Heart, UserPlus, Info } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const NotificationCenterPage = () => {
  const { t } = useTranslation();
  const { notifications, markAsRead, markAllAsRead, clearAllNotifications, removeNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint for fetching notifications
        const response = await fetch("https://api.example.com/notifications");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array of notification objects
        // You might need to transform the data to match the expected format of your context
        // For now, we'll just pass it directly to the context's setNotifications if available
        // If your context doesn't expose a setter, you'll need to manage state here
        // For this example, we'll assume the context handles adding/setting notifications
        // For now, we'll just simulate setting them to the context (if it has a setter)
        // If not, you'd manage `notifications` state directly in this component.
        // For simplicity, we'll assume the context's `notifications` state is updated externally or through other means.
        // If the context is only for adding transient notifications, then this page needs its own state.
        // Let's assume for now that the context is the source of truth and we just trigger a refresh.
        // For a real app, the context would likely have a `fetchAndSetNotifications` method.
        // For this task, we'll just set loading to false and rely on the context's existing state.
        // In a real scenario, you'd call a method like `notificationContext.loadNotifications(data)`

        // For now, let's just use the existing `notifications` from context and assume they are populated
        // by other means or that the context itself makes the API call.

      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        // addNotification({
        //   type: "error",
        //   title: t("error"),
        //   message: t("Failed to load notifications"),
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Info className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'sale': return <Tag className="w-5 h-5 text-primary" />;
      case 'bid': return <Bell className="w-5 h-5 text-purple-500" />;
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-blue-500" />;
      default: return <Mail className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">{t('notifications')}</h1>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  activeTab === 'all' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t('viewAll')} ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  activeTab === 'unread' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t('unread')} ({notifications.filter(n => !n.read).length})
              </button>
              <button
                onClick={() => setActiveTab('read')}
                className={`py-2 px-4 rounded-lg text-sm font-medium ${
                  activeTab === 'read' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t('read')} ({notifications.filter(n => n.read).length})
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
              >
                {t('markAllAsRead')}
              </button>
              <button
                onClick={clearAllNotifications}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
              >
                {t('clearAll')}
              </button>
            </div>
          </div>

          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border border-border ${
                    notification.read ? 'bg-gray-800' : 'bg-gray-900'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 rounded-full text-gray-400 hover:text-primary"
                        title={t('markAsRead')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 rounded-full text-red-400 hover:text-red-500"
                      title={t('delete')}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>{t('noNotifications')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenterPage;

