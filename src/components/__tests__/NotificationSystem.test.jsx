import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import { NotificationProvider, NotificationBell, useNotifications } from '../NotificationSystem';
import { createMockNotification } from '../../test/utils';

// Test component to access notification context
const TestComponent = () => {
  const { notifications, addNotification, markAsRead, clearAll } = useNotifications();
  
  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <button onClick={() => addNotification(createMockNotification())}>
        Add Notification
      </button>
      <button onClick={() => markAsRead('notification-1')}>
        Mark as Read
      </button>
      <button onClick={clearAll}>
        Clear All
      </button>
      {notifications.map(notification => (
        <div key={notification.id} data-testid={`notification-${notification.id}`}>
          {notification.title}
        </div>
      ))}
    </div>
  );
};

describe('NotificationSystem', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('NotificationProvider', () => {
    it('provides notification context to children', () => {
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
      expect(screen.getByText('Add Notification')).toBeInTheDocument();
    });

    it('adds notifications correctly', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const addButton = screen.getByText('Add Notification');
      await user.click(addButton);

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
      expect(screen.getByTestId('notification-notification-1')).toBeInTheDocument();
    });

    it('marks notifications as read', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      // Add a notification first
      const addButton = screen.getByText('Add Notification');
      await user.click(addButton);

      // Mark as read
      const markReadButton = screen.getByText('Mark as Read');
      await user.click(markReadButton);

      // Notification should still exist but marked as read
      expect(screen.getByTestId('notification-notification-1')).toBeInTheDocument();
    });

    it('clears all notifications', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      // Add a notification first
      const addButton = screen.getByText('Add Notification');
      await user.click(addButton);

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

      // Clear all
      const clearAllButton = screen.getByText('Clear All');
      await user.click(clearAllButton);

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    });

    it('persists notifications in localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      const addButton = screen.getByText('Add Notification');
      await user.click(addButton);

      // Check if notification is saved to localStorage
      const savedNotifications = JSON.parse(localStorage.getItem('cfish_notifications') || '[]');
      expect(savedNotifications).toHaveLength(1);
      expect(savedNotifications[0].id).toBe('notification-1');
    });

    it('loads notifications from localStorage on mount', () => {
      // Pre-populate localStorage
      const mockNotifications = [createMockNotification()];
      localStorage.setItem('cfish_notifications', JSON.stringify(mockNotifications));

      render(
        <NotificationProvider>
          <TestComponent />
        </NotificationProvider>
      );

      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
      expect(screen.getByTestId('notification-notification-1')).toBeInTheDocument();
    });
  });

  describe('NotificationBell', () => {
    it('renders notification bell with count', () => {
      const mockNotifications = [
        createMockNotification({ id: '1', read: false }),
        createMockNotification({ id: '2', read: false }),
        createMockNotification({ id: '3', read: true }),
      ];

      // Mock the useNotifications hook
      vi.doMock('../NotificationSystem', () => ({
        useNotifications: () => ({
          notifications: mockNotifications,
          unreadCount: 2,
          markAsRead: vi.fn(),
          clearAll: vi.fn(),
        }),
        NotificationBell: ({ children, ...props }) => (
          <button {...props}>
            <span>🔔</span>
            <span data-testid="unread-count">2</span>
            {children}
          </button>
        ),
      }));

      render(<NotificationBell />);

      expect(screen.getByText('🔔')).toBeInTheDocument();
      expect(screen.getByTestId('unread-count')).toHaveTextContent('2');
    });

    it('opens notification panel when clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      // Should show notification panel
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('shows empty state when no notifications', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('displays notification list when notifications exist', async () => {
      const user = userEvent.setup();
      
      // Pre-populate with notifications
      const mockNotifications = [
        createMockNotification({ id: '1', title: 'Test Notification 1' }),
        createMockNotification({ id: '2', title: 'Test Notification 2' }),
      ];
      localStorage.setItem('cfish_notifications', JSON.stringify(mockNotifications));

      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
      expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
    });

    it('marks notification as read when clicked', async () => {
      const user = userEvent.setup();
      
      const mockNotifications = [
        createMockNotification({ id: '1', title: 'Test Notification', read: false }),
      ];
      localStorage.setItem('cfish_notifications', JSON.stringify(mockNotifications));

      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      const notificationItem = screen.getByText('Test Notification');
      await user.click(notificationItem);

      // Notification should be marked as read
      await waitFor(() => {
        const updatedNotifications = JSON.parse(localStorage.getItem('cfish_notifications') || '[]');
        expect(updatedNotifications[0].read).toBe(true);
      });
    });

    it('shows mark all as read button when there are unread notifications', async () => {
      const user = userEvent.setup();
      
      const mockNotifications = [
        createMockNotification({ id: '1', read: false }),
        createMockNotification({ id: '2', read: false }),
      ];
      localStorage.setItem('cfish_notifications', JSON.stringify(mockNotifications));

      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      expect(screen.getByText('Mark all as read')).toBeInTheDocument();
    });

    it('marks all notifications as read when button is clicked', async () => {
      const user = userEvent.setup();
      
      const mockNotifications = [
        createMockNotification({ id: '1', read: false }),
        createMockNotification({ id: '2', read: false }),
      ];
      localStorage.setItem('cfish_notifications', JSON.stringify(mockNotifications));

      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      const markAllButton = screen.getByText('Mark all as read');
      await user.click(markAllButton);

      await waitFor(() => {
        const updatedNotifications = JSON.parse(localStorage.getItem('cfish_notifications') || '[]');
        expect(updatedNotifications.every(n => n.read)).toBe(true);
      });
    });
  });

  describe('Notification Settings', () => {
    it('renders notification settings panel', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      const settingsButton = screen.getByText('Settings');
      await user.click(settingsButton);

      expect(screen.getByText('Notification Settings')).toBeInTheDocument();
      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('Sound Notifications')).toBeInTheDocument();
    });

    it('toggles notification settings', async () => {
      const user = userEvent.setup();
      
      render(
        <NotificationProvider>
          <NotificationBell />
        </NotificationProvider>
      );

      const bellButton = screen.getByRole('button');
      await user.click(bellButton);

      const settingsButton = screen.getByText('Settings');
      await user.click(settingsButton);

      const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
      await user.click(emailToggle);

      // Settings should be saved to localStorage
      await waitFor(() => {
        const settings = JSON.parse(localStorage.getItem('cfish_notification_settings') || '{}');
        expect(settings.email).toBeDefined();
      });
    });
  });
});

