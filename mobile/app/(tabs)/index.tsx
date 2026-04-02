import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import PropertyCard from '../../components/PropertyCard';
import { PropertyListSkeleton } from '../../components/SkeletonLoader';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Studio', value: 'studio' },
  { label: 'House', value: 'house' },
  { label: 'Beach', value: 'beach' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80',
];

export default function HomeScreen() {
  const router = useRouter();
  const { properties, fetchProperties, isAuthenticated, user } = useAPI();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);

  const load = useCallback(async () => {
    await fetchProperties();
    setLoading(false);
  }, [fetchProperties]);

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  }, [fetchProperties]);

  const filtered =
    activeCategory
      ? properties.filter(
          (p) => (p.category || '').toLowerCase() === activeCategory,
        )
      : properties;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.amber[500]}
          />
        }
      >
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.logo}>HomeHive</Text>
          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => router.push('/auth/signin')}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Hero ───────────────────────────────────────── */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: HERO_IMAGES[heroIndex] }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={800}
          />
          <LinearGradient
            colors={['rgba(15,23,42,0.1)', 'rgba(15,23,42,0.80)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>DISCOVER YOUR NEXT STAY</Text>
            <Text style={styles.heroTitle}>Find Your Perfect{'\n'}Home Away</Text>
            <View style={styles.heroStats}>
              <HeroStat value="500+" label="Properties" />
              <View style={styles.statDivider} />
              <HeroStat value="4.9★" label="Rating" />
              <View style={styles.statDivider} />
              <HeroStat value="10K+" label="Guests" />
            </View>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push('/(tabs)/listings')}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreBtnText}>Explore Stays</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Category Chips ─────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by Type</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.chip,
                activeCategory === cat.value && styles.chipActive,
              ]}
              onPress={() => setActiveCategory(cat.value)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat.value && styles.chipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Properties ─────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeCategory
              ? `${CATEGORIES.find((c) => c.value === activeCategory)?.label} Stays`
              : 'All Properties'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
            <Text style={styles.seeAll}>Browse All →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <PropertyListSkeleton count={4} />
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="home-outline" size={48} color={Colors.neutral[300]} />
            <Text style={styles.emptyText}>
              {activeCategory
                ? `No ${activeCategory} properties found`
                : 'No properties available'}
            </Text>
            <Button
              title="Browse All"
              onPress={() => router.push('/(tabs)/listings')}
              size="sm"
              style={{ marginTop: 12 }}
            />
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </View>
        )}

        {/* ── Why HomeHive ───────────────────────────────── */}
        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Why HomeHive?</Text>
          <View style={styles.whyGrid}>
            {WHY_ITEMS.map((item) => (
              <View key={item.title} style={styles.whyCard}>
                <Ionicons name={item.icon as any} size={26} color={Colors.amber[500]} />
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const WHY_ITEMS = [
  { icon: 'shield-checkmark-outline', title: 'Verified Listings', desc: 'Every property manually verified for quality.' },
  { icon: 'card-outline', title: 'Secure Payments', desc: 'Your payments are always safe and protected.' },
  { icon: 'flash-outline', title: 'Instant Booking', desc: 'Book your stay in seconds, anytime.' },
  { icon: 'star-outline', title: 'Top-Rated Hosts', desc: 'Only the best hosts on our platform.' },
];

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingBottom: 110 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: FontSizes['2xl'],
    color: Colors.neutral[900],
  },
  avatarBtn: {},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.amber[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.base,
    color: Colors.white,
  },
  signInBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.neutral[800],
  },
  signInText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.neutral[800],
  },

  // Hero
  heroContainer: {
    height: 310,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 20,
    paddingBottom: 24,
  },
  heroLabel: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes['3xl'],
    color: Colors.white,
    lineHeight: 44,
    marginBottom: 16,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.lg,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.65)',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 16,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: Colors.amber[500],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  exploreBtnText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.white,
    letterSpacing: 0.5,
  },

  // Categories
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.neutral[900],
    borderColor: Colors.neutral[900],
  },
  chipText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.white },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.xl,
    color: Colors.text,
  },
  seeAll: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.amber[600],
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginTop: 8,
  },

  // Why section
  whySection: {
    paddingHorizontal: 16,
    paddingTop: 28,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  whyCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  whyTitle: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  whyDesc: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
