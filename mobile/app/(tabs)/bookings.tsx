import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import Button from '../../components/Button';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:   { bg: Colors.amber[50],  text: Colors.amber[700],  dot: Colors.amber[500] },
  confirmed: { bg: Colors.green[50],  text: Colors.green[700],  dot: Colors.green[500] },
  cancelled: { bg: Colors.red[50],    text: Colors.red[600],    dot: Colors.red[400] },
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=70';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Resolve image URI from raw API value (string URL or base64 object) */
function resolveImage(raw: string | { data: string } | undefined): string {
  if (!raw) return PLACEHOLDER;
  if (typeof raw === 'string') return raw || PLACEHOLDER;
  if (raw.data) return raw.data;
  return PLACEHOLDER;
}

export default function BookingsScreen() {
  const router = useRouter();
  const { isAuthenticated, bookings, fetchBookings, isLoading } = useAPI();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
        </View>
        <View style={styles.guestContainer}>
          <Text style={styles.guestIcon}>📅</Text>
          <Text style={styles.guestTitle}>Sign in to view bookings</Text>
          <Text style={styles.guestSubtitle}>
            Your booking history will appear here once you sign in.
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/signin')}
            style={{ marginTop: 20, width: 200 }}
          />
          <Button
            title="Create Account"
            onPress={() => router.push('/auth/signup')}
            variant="outline"
            style={{ marginTop: 10, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.count}>{bookings.length} total</Text>
      </View>

      {bookings.length === 0 && !isLoading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🏠</Text>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Your upcoming and past stays will appear here.
          </Text>
          <Button
            title="Explore Properties"
            onPress={() => router.push('/(tabs)/listings')}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.neutral[900]}
            />
          }
          renderItem={({ item: booking }) => {
            const statusStyle = STATUS_COLORS[booking.status] ?? STATUS_COLORS.pending;
            const imageUri = resolveImage(booking.propertyImages?.[0]);

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => booking.propertyId && router.push(`/listing/${booking.propertyId}`)}
                activeOpacity={0.9}
              >
                {/* Property image */}
                <Image
                  source={{ uri: imageUri }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={400}
                />

                {/* Status badge overlaid on image */}
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusStyle.dot }]} />
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.propertyName} numberOfLines={1}>
                    {booking.propertyTitle || 'Property'}
                  </Text>
                  {!!booking.propertyLocation && (
                    <Text style={styles.location} numberOfLines={1}>
                      📍 {booking.propertyLocation}
                    </Text>
                  )}

                  <View style={styles.datesRow}>
                    <View style={styles.dateBlock}>
                      <Text style={styles.dateLabel}>Check-in</Text>
                      <Text style={styles.dateValue}>{formatDate(booking.checkIn)}</Text>
                    </View>
                    <View style={styles.dateSepLine} />
                    <View style={styles.dateBlock}>
                      <Text style={styles.dateLabel}>Check-out</Text>
                      <Text style={styles.dateValue}>{formatDate(booking.checkOut)}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.guests}>
                      👥 {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.totalPrice}>
                      ₦{(booking.totalAmount ?? 0).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
  count: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },

  // Guest / logged-out
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  guestIcon: { fontSize: 64, marginBottom: 20 },
  guestTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.xl,
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.lg,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // List
  list: { padding: 16, paddingBottom: 110, gap: 14 },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
  },
  cardBody: { padding: 14, gap: 5 },
  propertyName: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  location: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
  dateBlock: { flex: 1 },
  dateSepLine: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  dateLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  dateValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  guests: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
});
