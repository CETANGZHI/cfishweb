import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 初始状态
const initialState = {
  // 用户状态
  isWalletConnected: false,
  walletAddress: null,
  userProfile: null,
  
  // UI状态
  isMobileMenuOpen: false,
  isNotificationPanelOpen: false,
  theme: 'dark',
  
  // 通知状态
  notifications: [],
  unreadNotificationCount: 0,
  
  // 加载状态
  isLoading: false,
  
  // 错误状态
  error: null
};

// Action类型
const ActionTypes = {
  // 钱包相关
  CONNECT_WALLET: 'CONNECT_WALLET',
  DISCONNECT_WALLET: 'DISCONNECT_WALLET',
  SET_WALLET_ADDRESS: 'SET_WALLET_ADDRESS',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  
  // UI相关
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  CLOSE_MOBILE_MENU: 'CLOSE_MOBILE_MENU',
  TOGGLE_NOTIFICATION_PANEL: 'TOGGLE_NOTIFICATION_PANEL',
  CLOSE_NOTIFICATION_PANEL: 'CLOSE_NOTIFICATION_PANEL',
  SET_THEME: 'SET_THEME',
  
  // 通知相关
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  MARK_ALL_NOTIFICATIONS_READ: 'MARK_ALL_NOTIFICATIONS_READ',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  
  // 加载和错误
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer函数
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.CONNECT_WALLET:
      return {
        ...state,
        isWalletConnected: true,
        walletAddress: action.payload.address,
        userProfile: action.payload.profile || null
      };
      
    case ActionTypes.DISCONNECT_WALLET:
      return {
        ...state,
        isWalletConnected: false,
        walletAddress: null,
        userProfile: null,
        notifications: [],
        unreadNotificationCount: 0
      };
      
    case ActionTypes.SET_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: action.payload
      };
      
    case ActionTypes.SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      };
      
    case ActionTypes.TOGGLE_MOBILE_MENU:
      return {
        ...state,
        isMobileMenuOpen: !state.isMobileMenuOpen,
        isNotificationPanelOpen: false // 关闭通知面板
      };
      
    case ActionTypes.CLOSE_MOBILE_MENU:
      return {
        ...state,
        isMobileMenuOpen: false
      };
      
    case ActionTypes.TOGGLE_NOTIFICATION_PANEL:
      return {
        ...state,
        isNotificationPanelOpen: !state.isNotificationPanelOpen,
        isMobileMenuOpen: false // 关闭移动菜单
      };
      
    case ActionTypes.CLOSE_NOTIFICATION_PANEL:
      return {
        ...state,
        isNotificationPanelOpen: false
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      const newNotification = {
        id: Date.now(),
        ...action.payload,
        isRead: false,
        timestamp: new Date()
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadNotificationCount: state.unreadNotificationCount + 1
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      return {
        ...state,
        notifications: filteredNotifications,
        unreadNotificationCount: filteredNotifications.filter(n => !n.isRead).length
      };
      
    case ActionTypes.MARK_NOTIFICATION_READ:
      const updatedNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadNotificationCount: updatedNotifications.filter(n => !n.isRead).length
      };
      
    case ActionTypes.MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadNotificationCount: 0
      };
      
    case ActionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadNotificationCount: action.payload.filter(n => !n.isRead).length
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
}

// 创建Context
const AppContext = createContext();

// Provider组件
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // 从localStorage恢复主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem('cfish-theme');
    if (savedTheme) {
      dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme });
    }
  }, []);
  
  // 保存主题设置到localStorage
  useEffect(() => {
    localStorage.setItem('cfish-theme', state.theme);
    // 应用主题到document
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);
  
  // Action creators
  const actions = {
    // 钱包相关
    connectWallet: (address, profile) => {
      dispatch({
        type: ActionTypes.CONNECT_WALLET,
        payload: { address, profile }
      });
    },
    
    disconnectWallet: () => {
      dispatch({ type: ActionTypes.DISCONNECT_WALLET });
    },
    
    setWalletAddress: (address) => {
      dispatch({ type: ActionTypes.SET_WALLET_ADDRESS, payload: address });
    },
    
    setUserProfile: (profile) => {
      dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: profile });
    },
    
    // UI相关
    toggleMobileMenu: () => {
      dispatch({ type: ActionTypes.TOGGLE_MOBILE_MENU });
    },
    
    closeMobileMenu: () => {
      dispatch({ type: ActionTypes.CLOSE_MOBILE_MENU });
    },
    
    toggleNotificationPanel: () => {
      dispatch({ type: ActionTypes.TOGGLE_NOTIFICATION_PANEL });
    },
    
    closeNotificationPanel: () => {
      dispatch({ type: ActionTypes.CLOSE_NOTIFICATION_PANEL });
    },
    
    setTheme: (theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    },
    
    // 通知相关
    addNotification: (notification) => {
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    },
    
    removeNotification: (id) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
    },
    
    markNotificationRead: (id) => {
      dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: id });
    },
    
    markAllNotificationsRead: () => {
      dispatch({ type: ActionTypes.MARK_ALL_NOTIFICATIONS_READ });
    },
    
    setNotifications: (notifications) => {
      dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications });
    },
    
    // 加载和错误
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },
    
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },
    
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    }
  };
  
  const value = {
    ...state,
    ...actions
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook for using the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { ActionTypes };

