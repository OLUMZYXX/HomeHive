import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Fonts, FontSizes } from '../../constants/Typography';
import { useAPI } from '../../contexts/APIContext';
import Button from '../../components/Button';

const STATUS_COLORS = {
  pending: { bg: Colors.amber[50], text: Colors.amber[700] },
  confirmed: { bg: Colors.green[50], text: Colors.green[700] },
  cancelled: { bg: Colors.red[50], text: Colors.red[600] },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
              tintColor={Colors.primary[800]}
            />
          }
          renderItem={({ item: booking }) => {
            const statusStyle =
              STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push(`/listing/${booking.property?._id}`)
                }
                activeOpacity={0.9}
              >
                {/* Property image */}
                {booking.property?.images?.[0] && (
                  <Image
                    source={{ uri: booking.property.images[0] }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.cardBody}>
                  {/* Status badge */}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: statusStyle.text }]}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Text>
                  </View>

                  <Text style={styles.propertyName} numberOfLines={1}>
                    {booking.property?.title || 'Property'}
                  </Text>
                  <Text style={styles.location} numberOfLines={1}>
                    📍 {booking.property?.location}
                  </Text>

                  <View style={styles.datesRow}>
                    <View style={styles.dateBlock}>
                      <Text style={styles.dateLabel}>Check-in</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(booking.checkIn)}
                      </Text>
                    </View>
                    <Text style={styles.dateSep}>→</Text>
                    <View style={styles.dateBlock}>
                      <Text style={styles.dateLabel}>Check-out</Text>
                      <Text style={styles.dateValue}>
                        {formatDate(booking.checkOut)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.guests}>
                      👥 {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.totalPrice}>
                      ${booking.totalPrice?.toLocaleString()}
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
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes.xl,
    color: Colors.text,
  },
  count: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // Guest (logged out)
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  guestIcon: { fontSize: 64, marginBottom: 20 },
  guestTitle: {
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes['2xl'],
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
    fontFamily: Fonts.outfitBold,
    fontSize: FontSizes.xl,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // List
  list: { padding: 16, gap: 16 },

  // Booking card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardBody: { padding: 14, gap: 6 },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  statusText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
  },

  propertyName: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  location: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  dateBlock: { flex: 1 },
  dateLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  dateValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  dateSep: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.lg,
    color: Colors.textMuted,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  guests: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
});
