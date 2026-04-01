import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: {
  name: string;
  label: string;
  icon: IoniconsName;
  iconOutline: IoniconsName;
}[] = [
  { name: 'index',    label: 'Home',     icon: 'home',            iconOutline: 'home-outline'     },
  { name: 'listings', label: 'Search',   icon: 'search',          iconOutline: 'search-outline'   },
  { name: 'bookings', label: 'Bookings', icon: 'calendar',        iconOutline: 'calendar-outline' },
  { name: 'profile',  label: 'Profile',  icon: 'person-circle',   iconOutline: 'person-circle-outline' },
];

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        { bottom: insets.bottom + 16 },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab = TABS[index];
          if (!tab) return null;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.75}
              style={styles.tabBtn}
            >
              {focused ? (
                <View style={styles.activePill}>
                  <Ionicons name={tab.icon} size={17} color="#0d0d1a" />
                  <Text style={styles.activeLabel}>{tab.label}</Text>
                </View>
              ) : (
                <Ionicons name={tab.iconOutline} size={20} color="rgba(255,255,255,0.45)" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home'     }} />
      <Tabs.Screen name="listings" options={{ title: 'Search'   }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile'  }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    // lift above any bottom content
    zIndex: 100,
    elevation: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13131f',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 4,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  activeLabel: {
    color: '#0d0d1a',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
