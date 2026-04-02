import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, FontSizes } from '../constants/Typography';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error:   (message: string, duration?: number) => void;
  info:    (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CONFIG: Record<ToastType, { bg: string; icon: string; iconColor: string }> = {
  success: { bg: '#1a1a2e', icon: 'checkmark-circle',   iconColor: '#4ade80' },
  error:   { bg: '#1a1a2e', icon: 'close-circle',       iconColor: '#f87171' },
  info:    { bg: '#1a1a2e', icon: 'information-circle',  iconColor: '#60a5fa' },
  warning: { bg: '#1a1a2e', icon: 'warning',             iconColor: '#fbbf24' },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

function ToastCard({
  item,
  onDismiss,
  topOffset,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
  topOffset: number;
}) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const cfg = CONFIG[item.type];

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 200,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss
    const timer = setTimeout(() => dismiss(), item.duration ?? 3500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(item.id));
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: cfg.bg, top: topOffset, opacity, transform: [{ translateY }] },
      ]}
    >
      <Ionicons name={cfg.icon as any} size={22} color={cfg.iconColor} style={styles.icon} />
      <Text style={styles.message} numberOfLines={3}>
        {item.message}
      </Text>
      <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={16} color="rgba(255,255,255,0.45)" />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, type: ToastType = 'info', duration = 3500) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, type, duration }]);
    },
    [],
  );

  const ctx: ToastContextValue = {
    show,
    success: (msg, d) => show(msg, 'success', d),
    error:   (msg, d) => show(msg, 'error',   d),
    info:    (msg, d) => show(msg, 'info',     d),
    warning: (msg, d) => show(msg, 'warning',  d),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {toasts.map((item, i) => (
        <ToastCard
          key={item.id}
          item={item}
          onDismiss={dismiss}
          topOffset={insets.top + 12 + i * 72}
        />
      ))}
    </ToastContext.Provider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    gap: 10,
  },
  icon: { flexShrink: 0 },
  message: {
    flex: 1,
    fontFamily: Fonts.notoSansMedium,
    fontSize: FontSizes.sm,
    color: '#fff',
    lineHeight: 20,
  },
});
