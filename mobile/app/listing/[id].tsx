import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import Button from '../../components/Button';
import DatePickerModal from '../../components/DatePickerModal';
import api from '../../services/api';

const { width } = Dimensions.get('window');

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  category?: string;
  bedrooms?: number;
  bathrooms?: number;
  guests?: number;
  amenities?: string[];
  description?: string;
  host?: { name: string; avatar?: string };
}

const AMENITY_ICONS: Record<string, string> = {
  wifi: '📶', pool: '🏊', gym: '💪', parking: '🚗',
  kitchen: '🍳', ac: '❄️', tv: '📺', balcony: '🌅',
  beach: '🏖', pet: '🐾', breakfast: '🍳', laundry: '👕',
};

function getAmenityIcon(amenity: string) {
  const key = amenity.toLowerCase();
  for (const [k, icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return '✓';
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, favorites, toggleFavorite } = useAPI();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [booking, setBooking] = useState(false);
  const [showCheckIn, setShowCheckIn]   = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const galleryRef   = useRef<ScrollView>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageIndexRef = useRef(0); // tracks current index without closure issues

  const isFav = id ? favorites.includes(id) : false;

  useEffect(() => {
    if (!id) return;
    api.properties
      .getById(id)
      .then((data) => {
        setProperty(data.property || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Auto-scroll images — uses a ref so scrollTo is never called inside a state updater
  const startAutoScroll = useCallback((imageCount: number) => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (imageCount <= 1) return;
    autoScrollRef.current = setInterval(() => {
      const next = (imageIndexRef.current + 1) % imageCount;
      imageIndexRef.current = next;
      setImageIndex(next);
      galleryRef.current?.scrollTo({ x: next * width, animated: true });
    }, 3500);
  }, []);

  useEffect(() => {
    if (!property || property.images.length <= 1) return;
    startAutoScroll(property.images.length);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [property, startAutoScroll]);

  const handleBook = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }
    if (!checkIn || !checkOut) {
      Alert.alert('Booking', 'Please enter check-in and check-out dates.');
      return;
    }
    setBooking(true);
    try {
      await api.bookings.create({
        propertyId: id,
        checkIn,
        checkOut,
        guests,
      });
      Alert.alert('Success 🎉', 'Your booking request has been submitted!', [
        { text: 'View Bookings', onPress: () => router.push('/(tabs)/bookings') },
        { text: 'OK' },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Booking Failed',
        err?.response?.data?.message || 'Something went wrong. Try again.',
      );
    } finally {
      setBooking(false);
    }
  }, [id, isAuthenticated, checkIn, checkOut, guests, router]);

  if (loading || !property) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </>
    );
  }

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  const totalPrice = nights * property.price;

  return (
    <View style={styles.container}>
      {/* Hide the Expo Router default header */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ── Image Gallery ──────────────────────────────── */}
        <View style={styles.gallery}>
          <ScrollView
            ref={galleryRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={() => {
              if (autoScrollRef.current) clearInterval(autoScrollRef.current);
            }}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              imageIndexRef.current = idx;
              setImageIndex(idx);
              startAutoScroll(property.images.length);
            }}
          >
            {property.images.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img }}
                style={{ width, height: 300 }}
                contentFit="cover"
              />
            ))}
          </ScrollView>

          {/* Floating back button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 8 }]}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>

          {/* Dots */}
          {property.images.length > 1 && (
            <View style={styles.dots}>
              {property.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === imageIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}

          {/* Favorite */}
          {isAuthenticated && (
            <TouchableOpacity
              style={[styles.favBtn, { top: insets.top + 8 }]}
              onPress={() => toggleFavorite(property._id)}
            >
              <Text style={[styles.heart, isFav && styles.heartActive]}>
                {isFav ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Image counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {imageIndex + 1}/{property.images.length}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Category */}
          {property.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {property.category.charAt(0).toUpperCase() +
                  property.category.slice(1)}
              </Text>
            </View>
          )}

          {/* Title + Rating */}
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingValue}>
              {property.rating?.toFixed(1) || '4.8'}
            </Text>
            <Text style={styles.reviewCount}>
              ({property.reviewCount || 0} reviews)
            </Text>
            <Text style={styles.dot2}>·</Text>
            <Text style={styles.location}>📍 {property.location}</Text>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            {property.bedrooms != null && (
              <SpecItem icon="🛏" value={`${property.bedrooms} bed`} />
            )}
            {property.bathrooms != null && (
              <SpecItem icon="🚿" value={`${property.bathrooms} bath`} />
            )}
            {property.guests != null && (
              <SpecItem icon="👥" value={`${property.guests} guests`} />
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Host */}
          {property.host && (
            <View style={styles.hostRow}>
              <View style={styles.hostAvatar}>
                <Text style={styles.hostAvatarText}>
                  {property.host.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <View>
                <Text style={styles.hostedBy}>Hosted by</Text>
                <Text style={styles.hostName}>{property.host.name}</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Description */}
          {property.description && (
            <>
              <Text style={styles.sectionTitle}>About this place</Text>
              <Text style={styles.description}>{property.description}</Text>
              <View style={styles.divider} />
            </>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity) => (
                  <View key={amenity} style={styles.amenityItem}>
                    <Text style={styles.amenityIcon}>
                      {getAmenityIcon(amenity)}
                    </Text>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Booking Widget */}
          <Text style={styles.sectionTitle}>Reserve your stay</Text>

          <View style={styles.bookingWidget}>
            <View style={styles.priceRow}>
              <Text style={styles.priceAmount}>
                ₦{property.price.toLocaleString()}
              </Text>
              <Text style={styles.perNight}> / night</Text>
            </View>

            {/* Date pickers */}
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.dateInput, { flex: 1 }]}
                onPress={() => setShowCheckIn(true)}
                activeOpacity={0.75}
              >
                <Text style={styles.dateLabel}>Check-in</Text>
                <Text style={[styles.dateValue, !checkIn && styles.datePlaceholder]}>
                  {checkIn || 'Select date'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.dateSep}>→</Text>
              <TouchableOpacity
                style={[styles.dateInput, { flex: 1 }]}
                onPress={() => setShowCheckOut(true)}
                activeOpacity={0.75}
              >
                <Text style={styles.dateLabel}>Check-out</Text>
                <Text style={[styles.dateValue, !checkOut && styles.datePlaceholder]}>
                  {checkOut || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Guests */}
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Guests</Text>
              <View style={styles.guestCounter}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setGuests((g) => Math.max(1, g - 1))}
                >
                  <Text style={styles.counterBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.guestCount}>{guests}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() =>
                    setGuests((g) => Math.min(property.guests || 10, g + 1))
                  }
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Price breakdown */}
            {nights > 0 && (
              <View style={styles.priceBreakdown}>
                <View style={styles.priceBreakdownRow}>
                  <Text style={styles.breakdownLabel}>
                    ₦{property.price.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </Text>
                  <Text style={styles.breakdownValue}>
                    ₦{totalPrice.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.priceBreakdownRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    ₦{totalPrice.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            <Button
              title={isAuthenticated ? 'Reserve Now' : 'Sign in to Book'}
              onPress={handleBook}
              loading={booking}
              size="lg"
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Date picker modals */}
          <DatePickerModal
            visible={showCheckIn}
            value={checkIn}
            title="Check-in Date"
            onConfirm={(d) => { setCheckIn(d); if (checkOut && checkOut <= d) setCheckOut(''); }}
            onClose={() => setShowCheckIn(false)}
          />
          <DatePickerModal
            visible={showCheckOut}
            value={checkOut}
            minDate={checkIn || undefined}
            title="Check-out Date"
            onConfirm={setCheckOut}
            onClose={() => setShowCheckOut(false)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SpecItem({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={styles.specItem}>
      <Text style={styles.specIcon}>{icon}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  loadingText: {
    fontFamily: Fonts.notoSans,
    color: Colors.textSecondary,
  },

  // Gallery
  gallery: { position: 'relative' },
  dots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.white,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtn: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { fontSize: 22, color: Colors.neutral[400] },
  heartActive: { color: Colors.red[500] },
  counter: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  counterText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.white,
  },

  // Body
  body: { padding: 20, paddingBottom: 40 },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  categoryText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.primary[700],
  },

  propertyTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes['2xl'],
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 34,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  star: { color: Colors.star, fontSize: FontSizes.base },
  ratingValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  reviewCount: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  dot2: { color: Colors.textMuted, fontSize: FontSizes.lg },
  location: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  specs: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  specIcon: { fontSize: 16 },
  specValue: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },

  // Host
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary[800],
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.lg,
    color: Colors.white,
  },
  hostedBy: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  hostName: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },

  // Content
  sectionTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.lg,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.neutral[100],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amenityIcon: { fontSize: 16 },
  amenityText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },

  // Booking widget
  bookingWidget: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes['2xl'],
    color: Colors.text,
  },
  perNight: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
  },
  dateLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  dateValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
    marginTop: 2,
  },
  datePlaceholder: {
    color: Colors.textMuted,
    fontFamily: Fonts.notoSans,
  },
  dateSep: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.lg,
    color: Colors.textMuted,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  guestLabel: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  guestCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnText: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
  guestCount: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },

  // Price breakdown
  priceBreakdown: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  priceBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  breakdownValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes.lg,
    color: Colors.primary[800],
  },
});
