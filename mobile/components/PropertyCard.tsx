import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Fonts, FontSizes } from '../constants/Typography';
import { useAPI } from '../contexts/APIContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2-column grid with 16px padding each side + 16px gap

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
    rating?: number;
    reviewCount?: number;
    category?: string;
  };
  horizontal?: boolean; // wider card for horizontal scroll
}

export default function PropertyCard({
  property,
  horizontal = false,
}: PropertyCardProps) {
  const router = useRouter();
  const { favorites, toggleFavorite, isAuthenticated } = useAPI();
  const isFav = favorites.includes(property._id);

  const cardWidth = horizontal ? CARD_WIDTH * 1.6 : CARD_WIDTH;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => router.push(`/listing/${property._id}`)}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={[styles.imageWrapper, { width: cardWidth }]}>
        <Image
          source={{ uri: property.images?.[0] }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: 'LGFFaXYk^6#M@-5c,1J5@[or[Q6.' }}
        />

        {/* Category badge */}
        {property.category && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {property.category.charAt(0).toUpperCase() +
                property.category.slice(1)}
            </Text>
          </View>
        )}

        {/* Favorite button */}
        {isAuthenticated && (
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(property._id)}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Text style={[styles.heart, isFav && styles.heartActive]}>
              {isFav ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {property.location}
        </Text>
        <View style={styles.row}>
          {property.rating != null && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>
                {Number(property.rating).toFixed(1)}
              </Text>
              {property.reviewCount != null && (
                <Text style={styles.reviewCount}>
                  ({property.reviewCount})
                </Text>
              )}
            </View>
          )}
          <Text style={styles.price}>
            <Text style={styles.priceAmount}>${property.price}</Text>
            <Text style={styles.perNight}>/night</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    // iOS shadow
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    // Android shadow
    elevation: 3,
  },

  imageWrapper: {
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary[800],
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.notoSansSemiBold,
  },

  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: 18,
    color: Colors.neutral[400],
  },
  heartActive: {
    color: Colors.red[500],
  },

  info: {
    padding: 10,
    gap: 3,
  },
  title: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  location: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    color: Colors.star,
    fontSize: FontSizes.sm,
  },
  ratingText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.xs,
    color: Colors.text,
  },
  reviewCount: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontFamily: Fonts.notoSansBold,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  perNight: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
});
