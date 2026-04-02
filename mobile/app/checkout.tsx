import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Linking,
  KeyboardAvoidingView,
  Platform,
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

type Step = "summary" | "card" | "success";
type PayMethod = "card" | "flutterwave";

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCardNumber(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function maskCardNumber(num: string) {
  const digits = num.replace(/\s/g, "");
  if (!digits) return "•••• •••• •••• ••••";
  const padded = digits.padEnd(16, "•");
  return (
    padded.slice(0, 4) +
    " " +
    padded.slice(4, 8) +
    " " +
    padded.slice(8, 12) +
    " " +
    padded.slice(12, 16)
  );
}

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const {
    bookingId: existingBookingId,
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

  const isExistingBooking = !!existingBookingId;
  const nightsNum = parseInt(nights || "0", 10);
  const guestsNum = parseInt(guests || "1", 10);
  const priceNum = parseFloat(pricePerNight || "0");
  const totalNum = parseFloat(totalAmount || "0");
  const serviceFee = isExistingBooking ? 0 : Math.round(totalNum * 0.05);
  const grandTotal = isExistingBooking ? totalNum : totalNum + serviceFee;

  const [step, setStep] = useState<Step>("summary");
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Success animation
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === "success") {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 12,
          stiffness: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step]);

  const validateCard = () => {
    const errs: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, "").length < 16)
      errs.cardNumber = "Enter a valid 16-digit card number";
    if (expiry.length < 5) errs.expiry = "Enter expiry as MM/YY";
    if (cvv.length < 3) errs.cvv = "Enter a valid CVV";
    if (!cardName.trim()) errs.cardName = "Enter the cardholder name";
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const processPayment = async () => {
    setLoading(true);
    try {
      let bookingId = existingBookingId;

      if (!isExistingBooking) {
        const res = await api.bookings.create({
          propertyId,
          checkIn,
          checkOut,
          guests: guestsNum,
          totalAmount: grandTotal,
        });
        bookingId = res.bookingId || res._id || res.booking?._id;
      }

      setBookingRef(bookingId || "");

      // Initiate payment — open Flutterwave in browser in the background
      try {
        const payRes = await api.payments.createIntent({
          amount: grandTotal,
          bookingId: bookingId!,
        });
        if (payRes.paymentLink) {
          Linking.openURL(payRes.paymentLink).catch(() => {});
        }
      } catch {
        // Payment intent failed — booking still created, user can retry
      }

      setStep("success");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (payMethod === "flutterwave") {
      processPayment();
    } else {
      setStep("card");
    }
  };

  const handleCardPay = () => {
    if (!validateCard()) return;
    processPayment();
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <View style={[styles.container, styles.successBg]}>
        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView
          contentContainerStyle={styles.successScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Animated checkmark */}
          <Animated.View
            style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}
          >
            <Ionicons name="checkmark" size={52} color={Colors.white} />
          </Animated.View>

          <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSub}>
              Your reservation has been created. Complete payment in the browser
              to confirm your stay.
            </Text>

            {/* Summary card */}
            <View style={styles.successCard}>
              <Text style={styles.successCardProp} numberOfLines={1}>
                {propertyTitle || "Property"}
              </Text>
              {!!propertyLocation && (
                <Text style={styles.successCardLocation} numberOfLines={1}>
                  📍 {propertyLocation}
                </Text>
              )}

              <View style={styles.successDivider} />

              <View style={styles.successRow}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={Colors.textSecondary}
                />
                <Text style={styles.successRowText}>
                  {formatDate(checkIn || "")} → {formatDate(checkOut || "")}
                </Text>
              </View>
              <View style={styles.successRow}>
                <Ionicons
                  name="people-outline"
                  size={15}
                  color={Colors.textSecondary}
                />
                <Text style={styles.successRowText}>
                  {guestsNum} {guestsNum === 1 ? "guest" : "guests"}
                </Text>
              </View>
              <View style={styles.successRow}>
                <Ionicons
                  name="cash-outline"
                  size={15}
                  color={Colors.textSecondary}
                />
                <Text style={styles.successRowText}>
                  ₦{grandTotal.toLocaleString()} total
                </Text>
              </View>

              {!!bookingRef && (
                <>
                  <View style={styles.successDivider} />
                  <Text style={styles.refLabel}>Booking Reference</Text>
                  <Text style={styles.refValue} numberOfLines={1}>
                    {bookingRef}
                  </Text>
                </>
              )}
            </View>

            <Button
              title="Go to My Bookings"
              onPress={() => router.replace("/(tabs)/bookings")}
              size="lg"
              style={styles.goBookingsBtn}
            />

            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.homeLink}
            >
              <Text style={styles.homeLinkText}>Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Summary / Card steps ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step === "card" ? setStep("summary") : router.back())}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === "card" ? "Card Details" : "Confirm Booking"}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      {/* ── SUMMARY STEP ─────────────────────────────────────── */}
      {step === "summary" && (
        <>
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
            {!isExistingBooking && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your stay</Text>
                <View style={styles.detailRow}>
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailLabel}>Check-in</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(checkIn || "")}
                    </Text>
                  </View>
                  <View style={styles.detailSep} />
                  <View style={styles.detailBlock}>
                    <Text style={styles.detailLabel}>Check-out</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(checkOut || "")}
                    </Text>
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
            )}

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
                    <Text style={styles.infoValue}>
                      ₦{totalNum.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Service fee (5%)</Text>
                    <Text style={styles.infoValue}>
                      ₦{serviceFee.toLocaleString()}
                    </Text>
                  </View>
                </>
              )}
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ₦{grandTotal.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Payment method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment method</Text>
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[
                    styles.methodCard,
                    payMethod === "card" && styles.methodCardActive,
                  ]}
                  onPress={() => setPayMethod("card")}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodIconBox}>
                    <Ionicons
                      name="card"
                      size={22}
                      color={
                        payMethod === "card"
                          ? Colors.primary[800]
                          : Colors.neutral[400]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.methodLabel,
                      payMethod === "card" && styles.methodLabelActive,
                    ]}
                  >
                    Card
                  </Text>
                  <Text style={styles.methodSub}>Debit / Credit</Text>
                  {payMethod === "card" && (
                    <View style={styles.methodCheck}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={Colors.primary[800]}
                      />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.methodCard,
                    payMethod === "flutterwave" && styles.methodCardActive,
                  ]}
                  onPress={() => setPayMethod("flutterwave")}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodIconBox}>
                    <Ionicons
                      name="flash"
                      size={22}
                      color={
                        payMethod === "flutterwave"
                          ? Colors.primary[800]
                          : Colors.neutral[400]
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.methodLabel,
                      payMethod === "flutterwave" && styles.methodLabelActive,
                    ]}
                  >
                    Flutterwave
                  </Text>
                  <Text style={styles.methodSub}>Bank · USSD · More</Text>
                  {payMethod === "flutterwave" && (
                    <View style={styles.methodCheck}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={Colors.primary[800]}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Policy */}
            <View style={styles.policyBox}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={Colors.green[600]}
              />
              <Text style={styles.policyText}>
                Payments are processed securely. Free cancellation within 24
                hours of booking.
              </Text>
            </View>
          </ScrollView>

          {/* Sticky bar */}
          <View
            style={[styles.stickyBar, { paddingBottom: insets.bottom + 12 }]}
          >
            <View>
              <Text style={styles.stickyLabel}>Total</Text>
              <Text style={styles.stickyTotal}>
                ₦{grandTotal.toLocaleString()}
              </Text>
            </View>
            <Button
              title={
                payMethod === "card" ? "Continue to Card" : "Pay with Flutterwave"
              }
              onPress={handleContinue}
              loading={loading}
              style={styles.stickyBtn}
            />
          </View>
        </>
      )}

      {/* ── CARD STEP ────────────────────────────────────────── */}
      {step === "card" && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* Visual card preview */}
            <View style={styles.cardPreview}>
              <View style={styles.cardChip}>
                <View style={styles.cardChipInner} />
              </View>
              <Text style={styles.cardPreviewNumber}>
                {maskCardNumber(cardNumber)}
              </Text>
              <View style={styles.cardPreviewBottom}>
                <View>
                  <Text style={styles.cardPreviewLabel}>Card Holder</Text>
                  <Text style={styles.cardPreviewValue} numberOfLines={1}>
                    {cardName.toUpperCase() || "FULL NAME"}
                  </Text>
                </View>
                <View>
                  <Text style={styles.cardPreviewLabel}>Expires</Text>
                  <Text style={styles.cardPreviewValue}>
                    {expiry || "MM/YY"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Card form */}
            <View style={styles.section}>
              {/* Card number */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Card Number</Text>
                <TextInput
                  style={[
                    styles.fieldInput,
                    cardErrors.cardNumber && styles.fieldInputError,
                  ]}
                  value={cardNumber}
                  onChangeText={(t) => {
                    setCardNumber(formatCardNumber(t));
                    setCardErrors((e) => ({ ...e, cardNumber: "" }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {!!cardErrors.cardNumber && (
                  <Text style={styles.fieldError}>{cardErrors.cardNumber}</Text>
                )}
              </View>

              {/* Expiry + CVV */}
              <View style={styles.fieldRow}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>Expiry Date</Text>
                  <TextInput
                    style={[
                      styles.fieldInput,
                      cardErrors.expiry && styles.fieldInputError,
                    ]}
                    value={expiry}
                    onChangeText={(t) => {
                      setExpiry(formatExpiry(t));
                      setCardErrors((e) => ({ ...e, expiry: "" }));
                    }}
                    placeholder="MM/YY"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  {!!cardErrors.expiry && (
                    <Text style={styles.fieldError}>{cardErrors.expiry}</Text>
                  )}
                </View>

                <View style={[styles.fieldGroup, { flex: 1 }]}>
                  <Text style={styles.fieldLabel}>CVV</Text>
                  <TextInput
                    style={[
                      styles.fieldInput,
                      cardErrors.cvv && styles.fieldInputError,
                    ]}
                    value={cvv}
                    onChangeText={(t) => {
                      setCvv(t.replace(/\D/g, "").slice(0, 4));
                      setCardErrors((e) => ({ ...e, cvv: "" }));
                    }}
                    placeholder="•••"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                  />
                  {!!cardErrors.cvv && (
                    <Text style={styles.fieldError}>{cardErrors.cvv}</Text>
                  )}
                </View>
              </View>

              {/* Cardholder name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Cardholder Name</Text>
                <TextInput
                  style={[
                    styles.fieldInput,
                    cardErrors.cardName && styles.fieldInputError,
                  ]}
                  value={cardName}
                  onChangeText={(t) => {
                    setCardName(t);
                    setCardErrors((e) => ({ ...e, cardName: "" }));
                  }}
                  placeholder="Name on card"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="characters"
                />
                {!!cardErrors.cardName && (
                  <Text style={styles.fieldError}>{cardErrors.cardName}</Text>
                )}
              </View>
            </View>

            {/* Security note */}
            <View style={styles.secureBox}>
              <Ionicons name="lock-closed" size={14} color={Colors.green[600]} />
              <Text style={styles.secureText}>
                Your card details are encrypted and secure. Payment is processed
                via Flutterwave.
              </Text>
            </View>
          </ScrollView>

          {/* Sticky pay button */}
          <View
            style={[styles.stickyBar, { paddingBottom: insets.bottom + 12 }]}
          >
            <View>
              <Text style={styles.stickyLabel}>You pay</Text>
              <Text style={styles.stickyTotal}>
                ₦{grandTotal.toLocaleString()}
              </Text>
            </View>
            <Button
              title="Confirm Payment"
              onPress={handleCardPay}
              loading={loading}
              style={styles.stickyBtn}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
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

  scroll: { padding: 16, paddingBottom: 32, gap: 14 },

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
  propertyImage: { width: 100, height: 90 },
  propertyInfo: { flex: 1, padding: 12, gap: 6 },
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

  detailRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  detailBlock: { flex: 1 },
  detailSep: { width: 1, height: 36, backgroundColor: Colors.border },
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

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
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

  // Payment method
  methodRow: { flexDirection: "row", gap: 12 },
  methodCard: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  methodCardActive: {
    borderColor: Colors.primary[800],
    backgroundColor: Colors.primary[100],
  },
  methodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  methodLabel: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  methodLabelActive: { color: Colors.primary[800] },
  methodSub: {
    fontFamily: Fonts.notoSans,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: "center",
  },
  methodCheck: { position: "absolute", top: 8, right: 8 },

  // Policy
  policyBox: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    backgroundColor: Colors.green[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.green[50],
  },
  policyText: {
    flex: 1,
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.green[700],
    lineHeight: 18,
  },

  // Sticky bar
  stickyBar: {
    flexDirection: "row",
    alignItems: "center",
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

  // Visual card preview
  cardPreview: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 22,
    height: 195,
    justifyContent: "space-between",
    shadowColor: "#1a1a2e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  cardChip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#d4a017",
    justifyContent: "center",
    alignItems: "center",
  },
  cardChipInner: {
    width: 28,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardPreviewNumber: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: 18,
    color: Colors.white,
    letterSpacing: 3,
    textAlign: "center",
  },
  cardPreviewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardPreviewLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  cardPreviewValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.white,
    maxWidth: 160,
  },

  // Card form fields
  fieldGroup: { gap: 6 },
  fieldRow: { flexDirection: "row", gap: 12 },
  fieldLabel: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  fieldInput: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  fieldInputError: { borderColor: Colors.error },
  fieldError: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: 2,
  },

  // Security note
  secureBox: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    backgroundColor: Colors.green[50],
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.green[50],
  },
  secureText: {
    flex: 1,
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.green[700],
    lineHeight: 18,
  },

  // Success screen
  successBg: { backgroundColor: Colors.primary[800] },
  successScroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.green[500],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowColor: Colors.green[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  successContent: { width: "100%", alignItems: "center" },
  successTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes["3xl"],
    color: Colors.white,
    textAlign: "center",
    marginBottom: 10,
  },
  successSub: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },

  // Success card
  successCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    gap: 10,
    marginBottom: 24,
  },
  successCardProp: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  successCardLocation: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  successDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  successRowText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  refLabel: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  refValue: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },

  goBookingsBtn: { width: "100%", marginBottom: 12 },
  homeLink: { paddingVertical: 8 },
  homeLinkText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.6)",
  },
});
