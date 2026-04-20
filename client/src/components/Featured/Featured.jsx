import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AptWebP from "../../assets/Apt1.webp";
import { HiStar, HiLocationMarker, HiHeart, HiArrowRight } from "react-icons/hi";
import { propertiesAPI, favoritesAPI } from "../../services/api";
import { FeaturedPropertiesSkeleton } from "../common/SkeletonLoaders";

const Featured = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedProperties, setDisplayedProperties] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    propertiesAPI
      .getTopRatedProperties(3)
      .then((res) => {
        if (cancelled) return;
        const fetched = res.properties || res.data || [];
        setProperties(fetched);
        setDisplayedProperties(fetched);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load featured properties.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Favorites load in parallel and never block the property render
    favoritesAPI
      .getFavorites()
      .then((res) => {
        if (cancelled) return;
        setFavorites(res.favorites ? res.favorites.map((f) => f.propertyId) : []);
      })
      .catch(() => { /* silent — auth may be missing */ });

    return () => {
      cancelled = true;
    };
  }, []);

  // Resolve image source: API returns `images` array (string URL or {data} object),
  // not `url`/`image`. Fall back to the bundled placeholder if none.
  const getPropertyImage = (property) => {
    const first =
      Array.isArray(property?.images) && property.images.length > 0
        ? property.images[0]
        : null;
    if (first && typeof first === "object" && first.data) return first.data;
    if (typeof first === "string" && first.length > 0) return first;
    return property?.url || property?.image || AptWebP;
  };

  const handleLike = async (propertyId) => {
    try {
      if (favorites.includes(propertyId)) {
        await favoritesAPI.removeFromFavorites(propertyId);
        setFavorites(favorites.filter((id) => id !== propertyId));
      } else {
        await favoritesAPI.addToFavorites(propertyId);
        setFavorites([...favorites, propertyId]);
      }
    } catch { /* silent */ }
  };

  const handlePropertyClick = (property) => {
    const propertyId = property.id || property.propertyId || property._id;
    if (!propertyId || propertyId === "undefined" || propertyId === "null") return;
    navigate(`/listing/${propertyId}`);
  };

  return (
    <section className="py-16 lg:py-24 bg-white [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-amber-500" />
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
                Top Rated
              </span>
            </div>
            <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
              Featured <span className="italic">Accommodations</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/listings")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition-all duration-200 flex-shrink-0"
          >
            View All Properties
            <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <FeaturedPropertiesSkeleton />
          ) : error || displayedProperties.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
              <div className="w-0.5 h-12 bg-amber-400/60 mb-8 mx-auto" />
              <h3 className="font-Cormorant text-2xl font-light text-neutral-800 mb-3">
                No Featured Properties Yet
              </h3>
              <p className="text-neutral-500 text-sm mb-8 max-w-sm">
                {error
                  ? "We couldn't load featured properties right now. Please try again later."
                  : "Be the first to list a top-rated property on HomeHive."}
              </p>
              <button
                onClick={() => navigate("/listings")}
                className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium tracking-widest uppercase px-8 py-3 transition-colors duration-300"
              >
                Browse All Listings
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            displayedProperties.map((property, idx) => (
              <article
                key={property.id || property.propertyId}
                className="group cursor-pointer"
                onClick={() => handlePropertyClick(property)}
              >
                {/* Image */}
                <div className="relative overflow-hidden mb-4 aspect-[4/3] bg-neutral-100">
                  <img
                    src={getPropertyImage(property)}
                    alt={property.title}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    width={512}
                    height={384}
                    onError={(e) => {
                      if (e.currentTarget.src !== AptWebP) {
                        e.currentTarget.src = AptWebP;
                      }
                    }}
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-semibold tracking-wider uppercase px-3 py-1">
                    {property.category || "Featured"}
                  </div>
                  {/* Favourite */}
                  <button
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors duration-200"
                    onClick={(e) => { e.stopPropagation(); handleLike(property.propertyId || property.id); }}
                    aria-label={favorites.includes(property.propertyId || property.id) ? "Unlike" : "Like"}
                  >
                    <HiHeart
                      className={`text-base ${
                        favorites.includes(property.propertyId || property.id)
                          ? "text-red-500"
                          : "text-neutral-500 hover:text-red-400"
                      }`}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < Math.round(property.rating) ? "text-amber-400" : "text-neutral-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-neutral-500 ml-1">
                        {property.rating} ({property.totalReviews || property.views || 0})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-Cormorant text-xl font-semibold text-neutral-900">
                        ₦{property.price?.toLocaleString() || "N/A"}
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">/night</span>
                    </div>
                  </div>

                  <h3 className="font-Cormorant text-xl font-semibold text-neutral-800 group-hover:text-neutral-600 transition-colors duration-200 line-clamp-1 leading-snug">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <HiLocationMarker className="text-xs flex-shrink-0" />
                    <span className="text-xs">
                      {property.address?.city || "Unknown"}, {property.address?.state || "Nigeria"}
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Featured;
