import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import { Fonts, FontSizes } from "../constants/Typography";
import { useToast } from "../components/Toast";
import Button from "../components/Button";
import api from "../services/api";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=70";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const {
    // existing booking payment mode
    bookingId: existingBookingId,
    // new booking mode
    propertyId,
    propertyTitle,
    propertyImage,
    propertyLocation,
    checkIn,
    checkOut,
    guests,
    pricePerNight,
    nights,
    totalAmount,
  } = useLocalSearchParams<{
    bookingId?: string;
    propertyId?: string;
    propertyTitle?: string;
    propertyImage?: string;
    propertyLocation?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    pricePerNight?: string;
    nights?: string;
    totalAmount?: string;
  }>();

  const [loading, setLoading] = useState(false);

  const isExistingBooking = !!existingBookingId;
  const nightsNum = parseInt(nights || "0", 10);
  const guestsNum = parseInt(guests || "1", 10);
  const priceNum = parseFloat(pricePerNight || "0");
  const totalNum = parseFloat(totalAmount || "0");

  // For existing bookings, totalAmount already includes any fees
  const serviceFee = isExistingBooking ? 0 : Math.round(totalNum * 0.05);
  const grandTotal = isExistingBooking ? totalNum : totalNum + serviceFee;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      let bookingId = existingBookingId;

      // Create booking only if this is a new reservation
      if (!isExistingBooking) {
        const bookingRes = await api.bookings.create({
          propertyId,
          checkIn,
          checkOut,
          guests: guestsNum,
          totalAmount: grandTotal,
        });
        bookingId =
          bookingRes.bookingId || bookingRes._id || bookingRes.booking?._id;
      }

      try {
        const paymentRes = await api.payments.createIntent({
          amount: grandTotal,
          bookingId: bookingId!,
        });
        if (paymentRes.paymentLink) {
          toast.success("Redirecting to payment...");
          await Linking.openURL(paymentRes.paymentLink);
          setTimeout(() => router.replace("/(tabs)/bookings"), 800);
        } else {
          toast.success(
            isExistingBooking
              ? "Payment link unavailable. Try again later."
              : "Booking created! Complete payment in My Bookings."
          );
          router.replace("/(tabs)/bookings");
        }
      } catch {
        toast.success(
          isExistingBooking
            ? "Payment service unavailable. Please try again later."
            : "Booking created! Payment can be completed in My Bookings."
        );
        if (!isExistingBooking) router.replace("/(tabs)/bookings");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Property card */}
        <View style={styles.propertyCard}>
          <Image
            source={{ uri: propertyImage || PLACEHOLDER }}
            style={styles.propertyImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle} numberOfLines={2}>
              {propertyTitle || "Property"}
            </Text>
            {!!propertyLocation && (
              <Text style={styles.propertyLocation} numberOfLines={1}>
                📍 {propertyLocation}
              </Text>
            )}
          </View>
        </View>

        {/* Stay details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your stay</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{formatDate(checkIn || "")}</Text>
            </View>
            <View style={styles.detailSep} />
            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{formatDate(checkOut || "")}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>
              {nightsNum} {nightsNum === 1 ? "night" : "nights"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Guests</Text>
            <Text style={styles.infoValue}>
              {guestsNum} {guestsNum === 1 ? "guest" : "guests"}
            </Text>
          </View>
        </View>

        {/* Price breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price breakdown</Text>

          {!isExistingBooking && priceNum > 0 && (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  ₦{priceNum.toLocaleString()} × {nightsNum}{" "}
                  {nightsNum === 1 ? "night" : "nights"}
                </Text>
                <Text style={styles.infoValue}>₦{totalNum.toLocaleString()}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Service fee (5%)</Text>
                <Text style={styles.infoValue}>₦{serviceFee.toLocaleString()}</Text>
              </View>
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦{grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Policy note */}
        <View style={styles.policyBox}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.green[600]} />
          <Text style={styles.policyText}>
            Free cancellation for 24 hours after booking. Payment is processed
            securely via Flutterwave.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky confirm bar */}
      <View style={[styles.stickyBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.stickyLabel}>Total amount</Text>
          <Text style={styles.stickyTotal}>₦{grandTotal.toLocaleString()}</Text>
        </View>
        <Button
          title={loading ? "Processing..." : isExistingBooking ? "Pay Now" : "Confirm & Pay"}
          onPress={handleConfirm}
          loading={loading}
          style={styles.stickyBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.lg,
    color: Colors.text,
  },

  scroll: { padding: 16, paddingBottom: 32, gap: 16 },

  // Property card
  propertyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  propertyImage: {
    width: 100,
    height: 90,
  },
  propertyInfo: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  propertyTitle: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
    lineHeight: 22,
  },
  propertyLocation: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // Sections
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.base,
    color: Colors.text,
    marginBottom: 2,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailBlock: { flex: 1 },
  detailSep: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  detailLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 3,
  },
  detailValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  totalLabel: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  totalValue: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.lg,
    color: Colors.primary[800],
  },

  // Policy
  policyBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: Colors.green[50],
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.green[100],
  },
  policyText: {
    flex: 1,
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.green[700],
    lineHeight: 20,
  },

  // Sticky bar
  stickyBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
    gap: 16,
  },
  stickyLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  stickyTotal: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
  stickyBtn: { flex: 1 },
});
