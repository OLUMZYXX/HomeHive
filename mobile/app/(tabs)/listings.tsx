import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { Fonts, FontSizes } from "../../constants/Typography";
import { useAPI } from "../../contexts/APIContext";
import PropertyCard from "../../components/PropertyCard";
import SearchBar from "../../components/SearchBar";
import { PropertyListSkeleton } from "../../components/SkeletonLoader";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "✨ Luxury", value: "luxury" },
  { label: "🏢 Apartment", value: "apartment" },
  { label: "🛏 Studio", value: "studio" },
  { label: "🏡 House", value: "house" },
  { label: "🏖 Beach", value: "beach" },
  { label: "🏔 Mountain", value: "mountain" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "" },
  { label: "Price: Low", value: "price_asc" },
  { label: "Price: High", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function ListingsScreen() {
  const { properties, fetchProperties } = useAPI();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (params?: object) => {
      await fetchProperties(params);
      setLoading(false);
    },
    [fetchProperties],
  );

  // Initial load — fetch everything
  useEffect(() => {
    load();
  }, []);

  // Re-fetch when sort changes (server-side sort)
  useEffect(() => {
    if (sort) load({ sort });
  }, [sort]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (search) load({ search });
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(sort ? { sort } : undefined);
    setRefreshing(false);
  }, [sort, load]);

  const filteredProperties = properties.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category?.toLowerCase() === category;
    return matchSearch && matchCat;
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ── Page Header ──────────────────────────────────── */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Explore Properties</Text>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setShowSort((v) => !v)}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.sortLabel}>
            {SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.sortOption,
                sort === opt.value && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSort(opt.value);
                setShowSort(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sort === opt.value && styles.sortOptionTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Search ───────────────────────────────────────── */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch("")}
          placeholder="Search cities, properties..."
        />
      </View>

      {/* ── Category Chips ───────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[styles.chip, category === cat.value && styles.chipActive]}
            onPress={() => setCategory(cat.value)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chipText,
                category === cat.value && styles.chipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Results count ────────────────────────────────── */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {loading ? "..." : `${filteredProperties.length} properties found`}
        </Text>
      </View>

      {/* ── Property Grid ────────────────────────────────── */}
      {loading ? (
        <PropertyListSkeleton count={6} />
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.list,
            filteredProperties.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary[800]}
            />
          }
          renderItem={({ item }) => <PropertyCard property={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Properties Found</Text>
              <Text style={styles.emptyText}>
                No{" "}
                {category
                  ? CATEGORIES.find((c) => c.value === category)?.label.replace(
                      /^\S+\s/,
                      "",
                    )
                  : ""}{" "}
                properties available right now.
                {"\n"}Try a different category or check back later.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.xl,
    color: Colors.text,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  sortIcon: { fontSize: 16, color: Colors.textSecondary },
  sortLabel: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  sortDropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 100,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    overflow: "hidden",
  },
  sortOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  sortOptionActive: { backgroundColor: Colors.primary[50] },
  sortOptionText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  sortOptionTextActive: {
    fontFamily: Fonts.notoSansSemiBold,
    color: Colors.primary[800],
  },

  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },

  chips: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: Colors.neutral[900],
    borderColor: Colors.neutral[900],
  },
  chipText: {
    fontFamily: Fonts.notoSansSemiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  chipTextActive: { color: Colors.white },

  resultsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  columnWrapper: {
    paddingHorizontal: 16,
    gap: 16,
  },
  list: { paddingTop: 8, paddingBottom: 110 },
  listEmpty: { flexGrow: 1 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontFamily: Fonts.pacifico,
    fontSize: FontSizes.xl,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: Fonts.notoSans,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
});
