import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import Button from '../../components/Button';

interface MenuItemProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, sublabel, onPress, danger }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIcon}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && { color: Colors.red[500] }]}>
          {label}
        </Text>
        {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout, favorites, bookings } = useAPI();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.guestView}>
          <View style={styles.guestAvatar}>
            <Text style={styles.guestAvatarText}>👤</Text>
          </View>
          <Text style={styles.guestTitle}>Welcome to HomeHive</Text>
          <Text style={styles.guestSubtitle}>
            Sign in to manage your bookings, save favorites, and more.
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/signin')}
            style={styles.authBtn}
          />
          <Button
            title="Create Account"
            onPress={() => router.push('/auth/signup')}
            variant="outline"
            style={styles.authBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* ── Avatar Card ────────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            {user?.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>✨ Premium Member</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Stats ──────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatBox value={bookings.length} label="Bookings" />
          <View style={styles.statDivider} />
          <StatBox value={favorites.length} label="Favorites" />
          <View style={styles.statDivider} />
          <StatBox value={user?.isPremium ? 'Pro' : 'Free'} label="Plan" />
        </View>

        {/* ── Menu ───────────────────────────────────────── */}
        <Text style={styles.menuSection}>Account</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="📅"
            label="My Bookings"
            sublabel={`${bookings.length} total`}
            onPress={() => router.push('/(tabs)/bookings')}
          />
          <MenuItem
            icon="❤️"
            label="Saved Properties"
            sublabel={`${favorites.length} saved`}
            onPress={() => router.push('/(tabs)/listings')}
          />
          <MenuItem
            icon="🔔"
            label="Notifications"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.menuSection}>Settings</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="🌍"
            label="Language & Region"
            sublabel="English · USD"
            onPress={() => {}}
          />
          <MenuItem
            icon="🔒"
            label="Privacy & Security"
            onPress={() => {}}
          />
          <MenuItem
            icon="❓"
            label="Help & Support"
            onPress={() => {}}
          />
          <MenuItem
            icon="📄"
            label="Terms & Privacy Policy"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.menuSection}>Danger Zone</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="🚪"
            label="Sign Out"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text style={styles.version}>HomeHive v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.xl,
    color: Colors.text,
  },

  // Guest state
  guestView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  guestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  guestAvatarText: { fontSize: 40 },
  guestTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes['2xl'],
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  authBtn: { width: '100%', marginBottom: 10 },

  // Profile card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.xl,
    color: Colors.white,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
  profileEmail: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.amber[50],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  premiumText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.amber[700],
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes.xl,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },

  // Menu
  menuSection: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  menuGroup: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconText: { fontSize: 18 },
  menuContent: { flex: 1 },
  menuLabel: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  menuSublabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  menuArrow: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xl,
    color: Colors.textMuted,
  },

  version: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
