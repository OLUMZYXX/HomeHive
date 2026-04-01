import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAPI } from "../../contexts/APIContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { FaSearch, FaHeart } from "react-icons/fa";
import Footer from "../Footer/Footer";
import useScrollToTop from "../../hooks/useScrollToTop";
import { PropertyCardSkeleton } from "../common/SkeletonLoaders";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "luxury", label: "Luxury" },
  { id: "apartment", label: "Apartments" },
  { id: "studio", label: "Studios" },
  { id: "house", label: "Houses" },
  { id: "beach", label: "Beach" },
];

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
];

const StarRating = ({ rating }) => {
  const value = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3 h-3 ${s <= Math.round(value) ? "text-amber-400" : "text-neutral-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Listings = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, searchProperties } = useAPI();
  const { selectedCurrency, selectedCurrencyData, convertFromCurrency } = useCurrency();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState(new Set());
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const fetchingRef = useRef(false);

  const convertPrice = (price, fromCurrency = "NGN") => {
    const validPrice = typeof price === "number" && !isNaN(price) ? price : 0;
    return convertFromCurrency(validPrice, fromCurrency || "NGN", selectedCurrency);
  };

  const performQuickSearch = async (quickSearchType) => {
    let searchCriteria = {};
    if (quickSearchType === "lagos-apartments") {
      searchCriteria = { location: "Lagos, Nigeria", propertyType: "apartment", minPrice: 150000, maxPrice: 300000, available: true };
    } else if (quickSearchType === "luxury-villas") {
      searchCriteria = { propertyType: "house|villa", minPrice: 500000, search: "luxury premium modern", searchFields: ["title", "description", "amenities", "category"], available: true };
    } else if (quickSearchType === "budget-options") {
      searchCriteria = { minPrice: 50000, maxPrice: 150000, search: "budget affordable", searchFields: ["title", "description"], available: true };
    } else return;

    setLoadingProperties(true);
    try {
      const results = await searchProperties(searchCriteria);
      setProperties(Array.isArray(results) ? results : []);
      setHasMore(false);
    } catch {}
    setLoadingProperties(false);
  };

  useEffect(() => {
    const handleInitialLoad = async () => {
      if (location.state && Array.isArray(location.state.searchResults)) {
        setProperties(location.state.searchResults);
        setHasMore(false);
        setLoadingProperties(false);
        return;
      }

      const urlParams = new URLSearchParams(location.search);
      const quickSearchType = urlParams.get("quick");
      if (quickSearchType) {
        await performQuickSearch(quickSearchType);
        return;
      }

      if (fetchingRef.current) return;
      fetchingRef.current = true;
      setLoadingProperties(true);
      try {
        const res = await fetch(`/api/properties?page=${page}&limit=12`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.properties)) {
          setProperties((prev) => (page === 1 ? data.properties : [...prev, ...data.properties]));
          setHasMore(data.hasMore || false);
        }
      } catch {}
      fetchingRef.current = false;
      setLoadingProperties(false);
    };

    const id = setTimeout(handleInitialLoad, 300);
    return () => clearTimeout(id);
  }, [location.state, location.search, page]);

  const handleClick = (id) => {
    if (!id || id === "undefined" || id === "null") return;
    navigate(`/listing/${id}`);
  };

  const toggleFavorite = (id) => {
    if (!isAuthenticated) { navigate("/signin"); return; }
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getImage = (property, idx) => {
    const img = property.images?.[0];
    if (!img) return DEMO_IMAGES[idx % DEMO_IMAGES.length];
    if (typeof img === "object" && img.data) return img.data;
    return img;
  };

  const filteredListings =
    activeFilter === "all"
      ? properties
      : properties.filter(
          (p) =>
            p.category?.toLowerCase() === activeFilter ||
            p.type?.toLowerCase() === activeFilter,
        );

  const searchFiltered = searchQuery
    ? filteredListings.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredListings;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* ── Page Header ─────────────────────────────────── */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          {/* Amber accent line + label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-500" />
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase">
              Explore
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="font-Cormorant text-4xl sm:text-5xl font-semibold text-neutral-900 leading-tight">
                Available{" "}
                <em className="not-italic text-amber-500">Properties</em>
              </h1>
              <p className="mt-2 text-neutral-500 text-sm">
                {loadingProperties && properties.length === 0
                  ? "Loading..."
                  : `${searchFiltered.length} ${searchFiltered.length === 1 ? "property" : "properties"} found`}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm pointer-events-none" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 text-sm placeholder-neutral-400
                           focus:outline-none focus:border-neutral-900 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-1.5 text-xs font-semibold tracking-wide border transition-colors duration-200
                  ${activeFilter === f.id
                    ? "bg-neutral-900 border-neutral-900 text-white"
                    : "bg-white border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Properties Grid ──────────────────────────────── */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loadingProperties && properties.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : searchFiltered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-Cormorant text-3xl text-neutral-400 mb-2">No properties found</p>
              <p className="text-sm text-neutral-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchFiltered.map((property, idx) => (
                <article
                  key={property._id}
                  className="group bg-white border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => handleClick(property._id)}
                  >
                    <img
                      src={getImage(property, idx)}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Category badge */}
                    {property.category && (
                      <span className="absolute top-3 left-3 bg-neutral-900/80 text-white text-xs font-semibold px-2.5 py-1 uppercase tracking-wide">
                        {property.category}
                      </span>
                    )}

                    {/* Favorite button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(property._id); }}
                      className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-colors duration-200
                        ${favorites.has(property._id)
                          ? "bg-red-500 text-white"
                          : "bg-white/80 text-neutral-500 hover:text-red-500"
                        }`}
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-xs text-neutral-400 mb-1 truncate">
                      {property.address?.city || property.location}
                    </p>
                    <h2
                      className="font-semibold text-neutral-900 leading-snug mb-2 cursor-pointer hover:text-amber-600 transition-colors duration-200 line-clamp-2"
                      onClick={() => handleClick(property._id)}
                    >
                      {property.title}
                    </h2>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={property.averageRating} />
                        <span className="text-xs text-neutral-500">
                          {property.averageRating
                            ? `${Number(property.averageRating).toFixed(1)} (${property.totalReviews || 0})`
                            : "New"}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-Cormorant text-xl font-semibold text-neutral-900">
                          {selectedCurrencyData?.symbol}
                          {convertPrice(
                            typeof property.price === "number" ? property.price : 0,
                            property.currency || "NGN",
                          )}
                        </span>
                        <span className="text-xs text-neutral-400 ml-0.5">/night</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && !loadingProperties && (
            <div className="text-center mt-12">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-10 py-3 border border-neutral-900 text-neutral-900 text-sm font-semibold tracking-wide hover:bg-neutral-900 hover:text-white transition-colors duration-200"
              >
                Load More Properties
              </button>
            </div>
          )}

          {loadingProperties && properties.length > 0 && (
            <div className="text-center mt-12">
              <div className="inline-block w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Listings;
