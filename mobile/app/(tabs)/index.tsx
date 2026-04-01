import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import PropertyCard from '../../components/PropertyCard';
import { PropertyListSkeleton } from '../../components/SkeletonLoader';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: '✨ Luxury', value: 'luxury' },
  { label: '🏢 Apartment', value: 'apartment' },
  { label: '🛏 Studio', value: 'studio' },
  { label: '🏡 House', value: 'house' },
  { label: '🏖 Beach', value: 'beach' },
];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80',
];

export default function HomeScreen() {
  const router = useRouter();
  const { featuredProperties, fetchFeatured, isAuthenticated, user } = useAPI();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);

  const load = useCallback(async () => {
    await fetchFeatured();
    setLoading(false);
  }, [fetchFeatured]);

  useEffect(() => {
    load();
    // Rotate hero images
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeatured();
    setRefreshing(false);
  }, [fetchFeatured]);

  const filteredFeatured =
    activeCategory
      ? featuredProperties.filter(
          (p) => p.category?.toLowerCase() === activeCategory,
        )
      : featuredProperties;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[800]} />
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
                  {user?.name?.charAt(0).toUpperCase() || '?'}
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
            colors={['rgba(15,23,42,0.15)', 'rgba(15,23,42,0.75)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>Discover your next stay</Text>
            <Text style={styles.heroTitle}>Find Your Perfect Home Away</Text>
            <View style={styles.heroStats}>
              <HeroStat value="500+" label="Properties" />
              <View style={styles.statDivider} />
              <HeroStat value="4.9★" label="Avg Rating" />
              <View style={styles.statDivider} />
              <HeroStat value="10K+" label="Happy Guests" />
            </View>
            <View style={styles.heroBtns}>
              <Button
                title="Explore Stays"
                onPress={() => router.push('/(tabs)/listings')}
                style={styles.heroBtn}
              />
              <Button
                title="Learn More"
                onPress={() => {}}
                variant="outline"
                style={[styles.heroBtn, styles.heroBtnOutline]}
                textStyle={{ color: Colors.white }}
              />
            </View>
          </View>
        </View>

        {/* ── Categories ─────────────────────────────────── */}
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

        {/* ── Featured Properties ────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Stays</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <PropertyListSkeleton count={4} />
        ) : filteredFeatured.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏠</Text>
            <Text style={styles.emptyText}>No featured properties found</Text>
            <Button
              title="Browse All"
              onPress={() => router.push('/(tabs)/listings')}
              size="sm"
              style={{ marginTop: 12 }}
            />
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredFeatured.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </View>
        )}

        {/* ── Why HomeHive ───────────────────────────────── */}
        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Why HomeHive?</Text>
          <View style={styles.whyGrid}>
            {[
              { icon: '🛡️', title: 'Verified Listings', desc: 'Every property is manually verified for quality.' },
              { icon: '💳', title: 'Secure Payments', desc: 'Your payments are always safe and protected.' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Book your stay in seconds, anytime.' },
              { icon: '🌟', title: 'Top-Rated Hosts', desc: 'Only the best hosts make our platform.' },
            ].map((item) => (
              <View key={item.title} style={styles.whyCard}>
                <Text style={styles.whyIcon}>{item.icon}</Text>
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
  content: { paddingBottom: 32 },

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
    color: Colors.primary[800],
  },
  avatarBtn: {},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[800],
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
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary[800],
  },
  signInText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary[800],
  },

  // Hero
  heroContainer: {
    height: 320,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 20,
    paddingBottom: 24,
  },
  heroSubtitle: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes['3xl'],
    color: Colors.white,
    lineHeight: 38,
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
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  heroBtn: { flex: 1 },
  heroBtnOutline: {
    borderColor: 'rgba(255,255,255,0.6)',
  },

  // Categories
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    backgroundColor: Colors.primary[800],
    borderColor: Colors.primary[800],
  },
  chipText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.white },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes.xl,
    color: Colors.text,
  },
  seeAll: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary[700],
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
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },

  // Why section
  whySection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  whyCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  whyIcon: { fontSize: 28, marginBottom: 8 },
  whyTitle: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginBottom: 4,
  },
  whyDesc: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
