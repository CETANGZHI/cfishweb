import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Bell, CheckCircle, Trash2, Settings, AlertCircle } from 'lucide-react';
import { useNotifications, NotificationTypes } from '../../contexts/NotificationContext';
import { useApp } from '../../contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

const NotificationPanel = () => {
  const { t, i18n } = useTranslation();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    isLoading 
  } = useNotifications();
  const { closeNotificationPanel } = useApp();

  const getLocale = () => {
    switch (i18n.language) {
      case 'zh': return zhCN;
      case 'en': return enUS;
      default: return enUS;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case NotificationTypes.TRADE: return <Bell size={18} className="text-primary" />;
      case NotificationTypes.SYSTEM: return <Settings size={18} className="text-blue-500" />;
      case NotificationTypes.ACTIVITY: return <CheckCircle size={18} className="text-green-500" />;
      case NotificationTypes.SOCIAL: return <User size={18} className="text-purple-500" />;
      default: return <Bell size={18} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 max-w-[90vw] bg-card border-l border-border z-50 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">{t('notifications.title')} ({unreadCount})</h2>
        <button
          onClick={closeNotificationPanel}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close notifications"
        >
          <X size={24} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-between p-4 border-b border-border">
        <button
          onClick={markAllAsRead}
          className="text-sm text-primary hover:underline disabled:opacity-50"
          disabled={unreadCount === 0}
        >
          {t('notifications.markAllRead')}
        </button>
        <Link to="/settings?tab=notifications" onClick={closeNotificationPanel} className="text-sm text-muted-foreground hover:underline">
          {t('notifications.settings')}
        </Link>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <LoadingSpinner size="small" text={t('notifications.loading')} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell size={48} className="mx-auto mb-4" />
            <p>{t('notifications.noNotifications')}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-4 border-b border-border ${!notification.isRead ? 'bg-secondary/20' : ''} hover:bg-secondary/30 transition-colors`}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-foreground">{notification.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: getLocale() })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                <div className="flex gap-2 text-xs">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-primary hover:underline"
                    >
                      {t('notifications.markRead')}
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-muted-foreground hover:underline"
                  >
                    {t('notifications.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border text-center text-xs text-muted-foreground">
        <p>{t('notifications.footer')}</p>
      </div>
    </div>
  );
};

export default NotificationPanel;

