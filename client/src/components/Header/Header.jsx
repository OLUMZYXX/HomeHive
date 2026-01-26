import React, { useState, useEffect, useCallback } from "react";
import header1 from "../../assets/header1.jpg";
import header from "../../assets/header.jpg";
import { useNavigate } from "react-router-dom";
import {
  HiArrowRight,
  HiCheckCircle,
  HiPlay,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { useAPI } from "../../contexts/APIContext";
import { toast } from "../../utils/toast";

// Story Modal Component
const StoryModal = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample accommodation stories
  const stories = [
    {
      id: 1,
      title: "Luxury Downtown Apartment",
      description:
        "Experience the pinnacle of urban living in this meticulously designed apartment featuring floor-to-ceiling windows, premium finishes, and breathtaking city views.",
      image: header,
      location: "Victoria Island, Lagos",
      price: "₦500,000/night",
      features: [
        "Ocean View",
        "Private Balcony",
        "24/7 Concierge",
        "Fitness Center",
      ],
    },
    {
      id: 2,
      title: "Executive Penthouse Suite",
      description:
        "Indulge in unparalleled luxury with this exclusive penthouse offering panoramic cityscapes, a private rooftop terrace, and world-class amenities.",
      image: header1,
      location: "Ikoyi, Lagos",
      price: "₦750,000/night",
      features: [
        "Rooftop Terrace",
        "Private Elevator",
        "Chef's Kitchen",
        "Spa Bathroom",
      ],
    },
    {
      id: 3,
      title: "Boutique Waterfront Villa",
      description:
        "Escape to paradise in this stunning waterfront villa combining traditional architecture with modern luxury, perfect for special occasions.",
      image: header,
      location: "Banana Island, Lagos",
      price: "₦1,200,000/night",
      features: [
        "Private Beach Access",
        "Infinity Pool",
        "Home Theater",
        "Wine Cellar",
      ],
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[currentSlide];

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-primary-900">Our Story</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <HiX className="text-2xl text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Image */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={currentStory.image}
            alt={currentStory.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <HiChevronLeft className="text-2xl text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <HiChevronRight className="text-2xl text-white" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Story Content */}
        <div className="p-8">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-bold text-primary-900 mb-4">
              {currentStory.title}
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {currentStory.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold text-primary-900 mb-2">
                  Location
                </h4>
                <p className="text-gray-600">{currentStory.location}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-900 mb-2">
                  Starting from
                </h4>
                <p className="text-2xl font-bold text-primary-800">
                  {currentStory.price}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-primary-900 mb-3">
                Key Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentStory.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const { getWeeklyHeaderImages } = useAPI();

  // State for dynamic images
  const [headerImages, setHeaderImages] = useState({
    primary: header,
    secondary: header1,
    loading: true,
    useBackend: false,
    lastUpdated: null,
  });

  // Fallback images with luxury metadata (minimum 200K)
  const fallbackImages = {
    primary: {
      url: header,
      title: "Executive Luxury Suite",
      type: "Luxury Apartment",
      category: "Executive",
      location: "Victoria Island, Lagos",
      price: 500000,
      originalPrice: 500000,
      currency: "NGN",
      rating: 4.9,
      quality: 9,
      isLuxury: true,
      isPremium: true,
      bedrooms: 3,
      bathrooms: 3,
      amenities: ["Pool", "Gym", "Concierge", "Parking"],
    },
    secondary: {
      url: header1,
      title: "Premium Penthouse",
      type: "Penthouse",
      category: "Luxury",
      location: "Ikoyi, Lagos",
      price: 350000,
      originalPrice: 350000,
      currency: "NGN",
      rating: 4.8,
      quality: 8,
      isLuxury: true,
      isPremium: true,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["Balcony", "Kitchen", "WiFi", "Security"],
    },
  };

  // Format price display
  const formatPrice = (price, currency = "NGN") => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  // Get display title with luxury indicators
  const getDisplayTitle = (propertyData) => {
    const title =
      propertyData.title ||
      `${propertyData.category || "Luxury"} ${propertyData.type || "Property"}`;

    // Add luxury indicators
    if (propertyData.isLuxury && propertyData.price >= 1000000) {
      return `${title} ✨`;
    } else if (propertyData.isPremium || propertyData.price >= 500000) {
      return `${title} 👑`;
    }

    return title;
  };

  // Fetch weekly featured images
  const fetchWeeklyImages = useCallback(async () => {
    try {
      setHeaderImages((prev) => ({ ...prev, loading: true }));

      const response = await getWeeklyHeaderImages();

      if (response.success && response.images && response.images.length >= 2) {
        // Use backend luxury images
        const [primaryImg, secondaryImg] = response.images;

        setHeaderImages({
          primary: primaryImg.url || header,
          secondary: secondaryImg.url || header1,
          primaryData: {
            ...primaryImg,
            title: getDisplayTitle(primaryImg),
            formattedPrice: formatPrice(primaryImg.price, primaryImg.currency),
          },
          secondaryData: {
            ...secondaryImg,
            title: getDisplayTitle(secondaryImg),
            formattedPrice: formatPrice(
              secondaryImg.price,
              secondaryImg.currency,
            ),
          },
          loading: false,
          useBackend: true,
          lastUpdated: response.lastUpdated
            ? new Date(response.lastUpdated)
            : new Date(),
          weeklyRotation: response.weeklyRotation || false,
          luxuryOnly: response.luxuryOnly || false,
          minPrice: response.minPrice || 200000,
        });

        // Show success notification for luxury properties
        if (!response.cached) {
          toast.success("🏆 Premium luxury properties loaded!", {
            description: `Showcasing ${
              response.totalFound
            } exclusive properties from ₦${response.minPrice / 1000}K+`,
          });
        }
      } else {
        // Fallback to local luxury images
        setHeaderImages({
          primary: header,
          secondary: header1,
          primaryData: {
            ...fallbackImages.primary,
            title: getDisplayTitle(fallbackImages.primary),
            formattedPrice: formatPrice(fallbackImages.primary.price),
          },
          secondaryData: {
            ...fallbackImages.secondary,
            title: getDisplayTitle(fallbackImages.secondary),
            formattedPrice: formatPrice(fallbackImages.secondary.price),
          },
          loading: false,
          useBackend: false,
          lastUpdated: new Date(),
          fallbackReason: response.message || "Using curated luxury collection",
        });

        if (response.useLocal) {
          console.log("Using fallback images:", response.message);
        }
      }
    } catch (error) {
      console.error("Error fetching weekly images:", error);

      // Fallback to local luxury images
      setHeaderImages({
        primary: header,
        secondary: header1,
        primaryData: {
          ...fallbackImages.primary,
          title: getDisplayTitle(fallbackImages.primary),
          formattedPrice: formatPrice(fallbackImages.primary.price),
        },
        secondaryData: {
          ...fallbackImages.secondary,
          title: getDisplayTitle(fallbackImages.secondary),
          formattedPrice: formatPrice(fallbackImages.secondary.price),
        },
        loading: false,
        useBackend: false,
        lastUpdated: new Date(),
        fallbackReason: "Server temporarily unavailable",
      });
    }
  }, [getWeeklyHeaderImages]);

  // Load images on component mount
  useEffect(() => {
    fetchWeeklyImages();
  }, [fetchWeeklyImages]);

  // Auto-refresh images weekly (optional)
  useEffect(() => {
    if (!headerImages.useBackend) return;

    const checkForUpdates = () => {
      const now = new Date();
      const lastUpdate = headerImages.lastUpdated;

      if (lastUpdate) {
        const daysSinceUpdate = Math.floor(
          (now - lastUpdate) / (1000 * 60 * 60 * 24),
        );
        if (daysSinceUpdate >= 7) {
          fetchWeeklyImages();
        }
      }
    };

    // Check for updates every hour
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [headerImages.useBackend, headerImages.lastUpdated, fetchWeeklyImages]);

  // State for story modal
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Event handlers
  const handleExploreClick = () => {
    navigate("/signin");
  };

  const handleLearnMore = () => {
    setIsStoryModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
  };

  const handleImageError = (imageType) => {
    console.warn(`Failed to load ${imageType} image, using fallback`);

    if (imageType === "primary") {
      setHeaderImages((prev) => ({
        ...prev,
        primary: header,
        primaryData: fallbackImages.primary,
      }));
    } else {
      setHeaderImages((prev) => ({
        ...prev,
        secondary: header1,
        secondaryData: fallbackImages.secondary,
      }));
    }
  };

  // Get image data with fallback
  const getPrimaryData = () =>
    headerImages.primaryData || fallbackImages.primary;
  const getSecondaryData = () =>
    headerImages.secondaryData || fallbackImages.secondary;

  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-50 transform rotate-45 -translate-x-32 translate-y-32"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-neutral-100 rounded-full opacity-40"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Content Section - Takes more space */}
          <div className="lg:col-span-7 space-y-10">
            {/* Announcement Banner - Consistent Text */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-100 to-primary-50 border border-primary-200 rounded-2xl px-6 py-3 shadow-soft">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-base font-semibold text-primary-800">
                New Properties Added Weekly
              </span>
              <HiArrowRight className="text-primary-600 text-base" />
            </div>

            {/* Main Heading - Consistent Typography */}
            <div className="space-y-6">
              <h1 className="font-NotoSans leading-[1.1]">
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-primary-900">
                  Find
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-primary-600 -mt-2">
                  Your Dream
                </span>
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-gradient-to-r from-primary-700 via-primary-800 to-primary-900 bg-clip-text -mt-2">
                  Accommodation
                </span>
              </h1>

              {/* Decorative Line */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-1 bg-primary-800 rounded-full"></div>
                <div className="w-8 h-1 bg-primary-600 rounded-full"></div>
                <div className="w-4 h-1 bg-primary-400 rounded-full"></div>
              </div>
            </div>

            {/* Description with Consistent Style */}
            <div className="space-y-6">
              <p className="text-base sm:text-lg lg:text-xl text-primary-700 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience luxury redefined with our handpicked collection of
                premium accommodations
                <span className="text-primary-900 font-semibold">
                  {" "}
                  designed for discerning travelers.
                </span>
              </p>

              {/* Key Features - Consistent Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <HiCheckCircle className="text-success-600 text-xl flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-primary-900 text-base">
                      Verified Quality
                    </div>
                    <div className="text-primary-600 text-base">
                      Every property inspected
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <HiCheckCircle className="text-success-600 text-xl flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-primary-900 text-base">
                      Best Price Promise
                    </div>
                    <div className="text-primary-600 text-base">
                      Guaranteed lowest rates
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section - Different Style */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleExploreClick}
                  className="group relative overflow-hidden bg-primary-900 text-white font-bold py-3 sm:py-5 px-6 sm:px-10 rounded-2xl shadow-strong hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
                    Start Exploring
                    <HiArrowRight className="text-lg sm:text-xl group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </button>

                <button
                  onClick={handleLearnMore}
                  className="group flex items-center gap-2 sm:gap-3 text-primary-800 font-semibold py-3 sm:py-5 px-4 sm:px-6 hover:bg-primary-50 rounded-2xl transition-all duration-300 text-sm sm:text-base"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 group-hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors duration-300">
                    <HiPlay className="text-primary-800 text-base sm:text-lg ml-1" />
                  </div>
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Trust Indicators - Consistent Text */}
              <div className="flex flex-wrap items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-primary-900">
                    500+
                  </div>
                  <div className="text-base text-primary-600 font-medium">
                    Premium Properties
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary-900">
                    98%
                  </div>
                  <div className="text-base text-primary-600 font-medium">
                    Satisfaction Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary-900">
                    24/7
                  </div>
                  <div className="text-base text-primary-600 font-medium">
                    Concierge Service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section - Compact but Impactful */}
          <div className="lg:col-span-5 relative">
            {/* Loading State */}
            {headerImages.loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-50 rounded-3xl z-50">
                <div className="text-center space-y-4">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-primary-700 font-medium">
                    Loading premium images...
                  </p>
                </div>
              </div>
            )}

            {/* Backend Status Indicator */}
            {!headerImages.loading && (
              <div className="absolute top-4 right-4 z-30">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    headerImages.useBackend
                      ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white border border-amber-300"
                      : "bg-gradient-to-r from-blue-400 to-blue-600 text-white border border-blue-300"
                  }`}
                >
                  {headerImages.useBackend
                    ? "🏆 LUXURY WEEKLY"
                    : "💎 CURATED LUXURY"}
                </div>
                {headerImages.luxuryOnly && (
                  <div className="mt-1 px-2 py-1 bg-black/80 text-white text-xs rounded-full text-center">
                    ₦{headerImages.minPrice / 1000}K+ Only
                  </div>
                )}
              </div>
            )}

            {/* Image Stack Layout */}
            <div className="relative h-[500px] sm:h-[550px] lg:h-[600px] xl:h-[650px]">
              {/* Main Large Image */}
              <div className="absolute top-0 right-0 w-[85%] sm:w-[80%] lg:w-[78%] h-[70%] sm:h-[72%] lg:h-[75%]">
                <div className="relative w-full h-full group">
                  <div className="absolute inset-0 bg-primary-900 rounded-2xl sm:rounded-3xl transform rotate-2 opacity-10 group-hover:rotate-1 transition-transform duration-700"></div>
                  <img
                    src={headerImages.primary}
                    alt={`${
                      getPrimaryData().title
                    } - Premium accommodation showcase`}
                    className="relative w-full h-full object-cover rounded-2xl sm:rounded-3xl shadow-xl transform group-hover:scale-[1.02] transition-transform duration-700 z-10"
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                    onError={() => handleImageError("primary")}
                  />
                </div>
              </div>

              {/* Secondary Smaller Image */}
              <div className="absolute bottom-0 left-0 w-[65%] sm:w-[60%] lg:w-[55%] h-[42%] sm:h-[40%] lg:h-[45%] z-20">
                <div className="relative w-full h-full group">
                  <div className="absolute inset-0 bg-neutral-800 rounded-xl sm:rounded-2xl transform -rotate-3 opacity-10 group-hover:-rotate-1 transition-transform duration-700"></div>
                  <img
                    src={headerImages.secondary}
                    alt={`${
                      getSecondaryData().title
                    } - Comfortable accommodation space`}
                    className="relative w-full h-full object-cover rounded-xl sm:rounded-2xl shadow-lg transform group-hover:scale-[1.02] transition-transform duration-700 z-10 border-4 border-white"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    onError={() => handleImageError("secondary")}
                  />

                  {/* Enhanced Small Badge */}
                  <div
                    className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 text-white text-xs font-bold px-2 py-1.5 sm:px-3 sm:py-2 rounded-full shadow-medium z-20 ${
                      headerImages.useBackend
                        ? "bg-gradient-to-r from-purple-600 to-purple-800"
                        : "bg-gradient-to-r from-primary-700 to-primary-900"
                    }`}
                  >
                    {headerImages.useBackend ? "LUXURY PICK" : "PREMIUM"}
                  </div>

                  {/* Enhanced Secondary Image Info */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 bg-gradient-to-r from-black/80 to-black/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 z-20">
                    <div className="text-white font-bold text-sm mb-1">
                      {getSecondaryData().title}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white/90 text-xs">
                        {getSecondaryData().type} •{" "}
                        {getSecondaryData().location}
                      </div>
                      <div className="text-amber-400 font-bold text-sm">
                        {getSecondaryData().formattedPrice ||
                          formatPrice(getSecondaryData().price)}
                      </div>
                    </div>
                    {headerImages.useBackend &&
                      getSecondaryData().amenities && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {getSecondaryData()
                            .amenities.slice(0, 3)
                            .map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
                              >
                                {amenity}
                              </span>
                            ))}
                          {getSecondaryData().amenities.length > 3 && (
                            <span className="text-xs text-white/80">
                              +{getSecondaryData().amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Quality Indicator */}
              {headerImages.useBackend && getPrimaryData().quality >= 9 && (
                <div className="absolute top-16 right-16 sm:top-20 sm:right-20 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse z-30">
                  Ultra HD
                </div>
              )}

              {/* Geometric Accents */}
              <div className="absolute top-16 right-2 sm:top-20 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 bg-primary-600 rounded-full opacity-60"></div>
              <div className="absolute bottom-28 right-6 sm:bottom-32 sm:right-8 w-3 h-3 sm:w-4 sm:h-4 bg-primary-800 rounded-full opacity-40"></div>
              <div className="absolute top-1/2 left-2 sm:left-4 w-1.5 h-6 sm:w-2 sm:h-8 bg-primary-400 rounded-full opacity-30"></div>

              {/* Update Timestamp */}
              {headerImages.lastUpdated && !headerImages.loading && (
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-xs text-primary-500/70 bg-white/80 px-2 py-1 rounded z-30">
                  Updated: {headerImages.lastUpdated.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeStoryModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <StoryModal onClose={closeStoryModal} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
