import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useApp } from './AppContext';

// 通知类型
export const NotificationTypes = {
  TRADE: 'trade',
  SYSTEM: 'system',
  ACTIVITY: 'activity',
  SOCIAL: 'social'
};

// 通知优先级
export const NotificationPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// 初始状态
const initialState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    [NotificationTypes.TRADE]: true,
    [NotificationTypes.SYSTEM]: true,
    [NotificationTypes.ACTIVITY]: true,
    [NotificationTypes.SOCIAL]: true,
    pushEnabled: false,
    emailEnabled: false,
    pushSubscription: null, // Store push subscription object
  },
  isLoading: false
};

// Action类型
const ActionTypes = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_PUSH_SUBSCRIPTION: 'SET_PUSH_SUBSCRIPTION',
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      const newNotification = {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        isRead: false,
        ...action.payload
      };
      
      const updatedNotifications = [newNotification, ...state.notifications];
      
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(
        n => n.id !== action.payload
      );
      
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.isRead).length
      };
      
    case ActionTypes.MARK_AS_READ:
      const markedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, isRead: true } : n
      );
      
      return {
        ...state,
        notifications: markedNotifications,
        unreadCount: markedNotifications.filter(n => !n.isRead).length
      };
      
    case ActionTypes.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(n => ({
        ...n,
        isRead: true
      }));
      
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      };
      
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_PUSH_SUBSCRIPTION:
      return {
        ...state,
        settings: { ...state.settings, pushSubscription: action.payload }
      };
      
    default:
      return state;
  }
}

// Context
const NotificationContext = createContext();

// Provider
export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isWalletConnected } = useApp();
  
  // 从localStorage加载通知设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('cfish-notification-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
      } catch (error) {
        console.error('Failed to load notification settings:', error);
      }
    }
  }, []);
  
  // 保存通知设置到localStorage
  useEffect(() => {
    localStorage.setItem('cfish-notification-settings', JSON.stringify(state.settings));
  }, [state.settings]);
  
  // 加载通知数据
  const loadNotifications = useCallback(async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    
    try {
      // Replace with your actual API endpoint for fetching notifications
      const response = await fetch("https://api.example.com/notifications");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the API returns an array of notification objects that match the expected format
      dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: data });
    } catch (error) {
      console.error("Failed to load notifications:", error);
      // Optionally add a notification about the error
      // addNotification({
      //   type: "error",
      //   title: "Error",
      //   message: "Failed to load notifications."
      // });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // 注册Service Worker并管理推送订阅
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported by this browser.');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);

        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          dispatch({ type: ActionTypes.SET_PUSH_SUBSCRIPTION, payload: existingSubscription });
          dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: { pushEnabled: true } });
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribePush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Push notifications are not supported by your browser.'
      });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE'; // Replace with your actual VAPID public key
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Send subscription to your backend
      const response = await fetch('https://api.example.com/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to push notifications on backend.');
      }

      dispatch({ type: ActionTypes.SET_PUSH_SUBSCRIPTION, payload: subscription });
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: { pushEnabled: true } });
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Successfully subscribed to push notifications!'
      });
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to subscribe to push notifications. Please try again.'
      });
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: { pushEnabled: false } });
    }
  };

  const unsubscribePush = async () => {
    if (!state.settings.pushSubscription) {
      addNotification({
        type: 'warning',
        title: 'Info',
        message: 'Not subscribed to push notifications.'
      });
      return;
    }

    try {
      await state.settings.pushSubscription.unsubscribe();

      // Notify backend to remove subscription
      const response = await fetch('https://api.example.com/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: state.settings.pushSubscription.endpoint }),
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe from push notifications on backend.');
      }

      dispatch({ type: ActionTypes.SET_PUSH_SUBSCRIPTION, payload: null });
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: { pushEnabled: false } });
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Successfully unsubscribed from push notifications.'
      });
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to unsubscribe from push notifications. Please try again.'
      });
    }
  };

  // Fetch notifications when wallet is connected or refresh is triggered
  useEffect(() => {
    if (isWalletConnected) {
      loadNotifications();
    } else {
      // Clear notifications if wallet is disconnected
      dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: [] });
    }
  }, [isWalletConnected, loadNotifications]);
  
  // Actions
  const actions = {
    addNotification: (notification) => {
      // 检查通知类型是否启用
      if (!state.settings[notification.type]) {
        return;
      }
      
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
      
      // 如果启用了浏览器推送通知
      if (state.settings.pushEnabled && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            tag: notification.id
          });
        }
      }
    },
    
    removeNotification: (id) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
    },
    
    markAsRead: (id) => {
      dispatch({ type: ActionTypes.MARK_AS_READ, payload: id });
    },
    
    markAllAsRead: () => {
      dispatch({ type: ActionTypes.MARK_ALL_AS_READ });
    },
    
    updateSettings: (settings) => {
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
    },
    
    requestPushPermission: async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // If permission granted, attempt to subscribe
          await subscribePush();
        } else {
          actions.updateSettings({ pushEnabled: false });
        }
        return permission;
      }
      return 'denied';
    },
    
    refreshNotifications: () => {
      if (isWalletConnected) {
        loadNotifications();
      }
    },
    subscribePush: subscribePush,
    unsubscribePush: unsubscribePush,
  };
  
  const value = {
    ...state,
    ...actions
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}


