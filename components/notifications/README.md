# Notification System

A complete, modular notification system for React applications with TypeScript support.

## 📁 Structure

```
lib/notifications/
├── index.ts          # Main export file
├── types.ts          # TypeScript interfaces and types
└── utils.ts          # Utility functions and configuration

components/notifications/
├── index.ts               # Component exports
├── Notification.tsx       # Individual notification component
├── NotificationProvider.tsx  # Context provider and hook
└── WelcomeNotification.tsx   # Legacy component (deprecated)
```

## 🚀 Quick Start

### 1. Wrap your app with NotificationProvider

```tsx
import { NotificationProvider } from '@/components/notifications';

function App() {
  return (
    <NotificationProvider 
      position={{ vertical: 'top', horizontal: 'right' }}
      maxNotifications={5}
    >
      {/* Your app content */}
    </NotificationProvider>
  );
}
```

### 2. Use notifications in your components

```tsx
import { useNotifications } from '@/components/notifications';

function MyComponent() {
  const { success, error, warning, info } = useNotifications();

  const handleSuccess = () => {
    success('Success!', 'Operation completed successfully');
  };

  const handleError = () => {
    error('Error', 'Something went wrong');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

## 🎨 Features

- **4 notification types**: Success, Error, Warning, Info
- **Fully responsive**: Optimized for mobile and desktop
- **Customizable positioning**: Top/bottom, left/center/right
- **Auto-dismiss**: Configurable duration or persistent
- **Progress indicators**: Visual progress bars for auto-dismiss
- **Action buttons**: Add custom action buttons
- **Custom icons**: Use your own icons
- **Animations**: Smooth entrance/exit animations
- **TypeScript**: Full type safety
- **Modular design**: Easy to extend and customize

## 📱 Responsive Design

Notifications automatically adapt to different screen sizes:

- **Mobile**: Smaller size, closer to screen edges
- **Desktop**: Larger size, more spacing
- **Typography**: Responsive text sizes
- **Icons**: Appropriate sizes for each breakpoint

## 🎯 API Reference

### NotificationProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `NotificationPositionConfig` | `{ vertical: 'top', horizontal: 'right' }` | Where to position notifications |
| `maxNotifications` | `number` | `5` | Maximum number of notifications to show |

### useNotifications Hook

Returns an object with these methods:

- `success(title, message?, options?)` - Show success notification
- `error(title, message?, options?)` - Show error notification  
- `warning(title, message?, options?)` - Show warning notification
- `info(title, message?, options?)` - Show info notification
- `addNotification(config)` - Add custom notification
- `removeNotification(id)` - Remove specific notification
- `clearAllNotifications()` - Clear all notifications

### Notification Options

```typescript
interface NotificationConfig {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // 0 for no auto-dismiss
  icon?: React.ComponentType;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  persistent?: boolean;
}
```

## 🎨 Theming

The notification system uses a predefined color scheme:

- **Success**: Emerald green gradients
- **Error**: Red gradients  
- **Warning**: Amber/orange gradients
- **Info**: Blue gradients

Each notification includes:
- Gradient backgrounds
- Matching borders and text colors
- Icon containers with gradients
- Progress bars with matching colors
- Subtle animations and effects

## 🔧 Customization

You can customize notifications by:

1. **Custom icons**: Pass your own icon components
2. **Custom durations**: Set auto-dismiss timing
3. **Action buttons**: Add interactive buttons
4. **Positioning**: Choose where notifications appear
5. **Persistent notifications**: Disable auto-dismiss

## 📄 Migration from Old System

If you're migrating from the old notification system:

1. Replace imports:
   ```tsx
   // Old
   import { useNotifications } from '@/contexts/NotificationContext';
   
   // New
   import { useNotifications } from '@/components/notifications';
   ```

2. The API remains the same, so your existing code should work without changes.

## 🧪 Development

The notification system is fully self-contained with:

- TypeScript interfaces in `lib/notifications/types.ts`
- Utility functions in `lib/notifications/utils.ts`
- React components in `components/notifications/`
- Proper exports and re-exports for clean imports

This structure makes it easy to understand, maintain, and extend the notification system.