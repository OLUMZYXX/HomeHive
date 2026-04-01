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
        <h2 className="font-Cormorant text-3xl font-semibold text-neutral-900">Our Story</h2>
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
            <h3 className="font-Cormorant text-4xl font-semibold text-neutral-900 mb-4 leading-tight">
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
      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-8 max-w-full md:max-w-screen-md xl:max-w-screen-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-2">
            {/* Label */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-amber-500"></div>
              <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
                Welcome to HomeHive
              </span>
            </div>

            {/* Heading — Cormorant serif */}
            <h2 className="font-Cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-[1.1]">
              Luxury living in the{" "}
              <span className="italic">heart of the city.</span>
            </h2>

            {/* Description */}
            <p className="font-NotoSans text-neutral-500 text-base leading-relaxed max-w-md">
              HomeHive offers over 500 handpicked premium accommodations across
              Nigeria's finest cities. Enjoy top-tier amenities, seamless
              booking, and a personalized experience — from arrival to checkout.
            </p>

            {/* Feature list */}
            <div className="space-y-3">
              {[
                "Every property verified and quality-inspected",
                "Instant booking with best price guarantee",
                "24/7 concierge support for every stay",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <HiCheckCircle className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-600 text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                onClick={handleExploreClick}
                className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3.5 text-sm font-medium tracking-widest uppercase transition-colors duration-300"
              >
                Read More
                <HiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={handleLearnMore}
                className="group flex items-center gap-3 text-neutral-700 hover:text-neutral-900 text-sm font-medium transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-full border border-neutral-300 group-hover:border-neutral-600 flex items-center justify-center transition-colors duration-200">
                  <HiPlay className="text-neutral-600 text-sm ml-0.5" />
                </div>
                Watch Our Story
              </button>
            </div>
          </div>

          {/* Images Section — Larita-style stacked layout, left side */}
          <div className="lg:col-span-6 relative order-1 lg:order-1">
            {/* Loading State */}
            {headerImages.loading && (
              <div className="h-[480px] flex items-center justify-center bg-neutral-50">
                <div className="animate-spin w-8 h-8 border-4 border-neutral-300 border-t-neutral-700 rounded-full" />
              </div>
            )}

            {!headerImages.loading && (
              <div className="relative flex gap-4 items-end h-[480px] sm:h-[520px]">
                {/* Tall left image */}
                <div className="w-[52%] h-full flex-shrink-0">
                  <img
                    src={headerImages.primary}
                    alt={`${getPrimaryData().title} - Premium accommodation`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                    onError={() => handleImageError("primary")}
                  />
                </div>

                {/* Shorter right image — sits at bottom */}
                <div className="w-[44%] h-[72%] flex-shrink-0">
                  <div className="relative w-full h-full">
                    <img
                      src={headerImages.secondary}
                      alt={`${getSecondaryData().title} - Comfortable accommodation`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                      onError={() => handleImageError("secondary")}
                    />
                    {/* Price badge on secondary image */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3">
                      <div className="text-white text-xs font-medium truncate">
                        {getSecondaryData().location}
                      </div>
                      <div className="text-amber-400 font-semibold text-sm font-Cormorant">
                        {getSecondaryData().formattedPrice || formatPrice(getSecondaryData().price)}
                        <span className="text-white/60 text-xs font-normal ml-1">/night</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amber accent line — left edge */}
                <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-amber-400/50" />
              </div>
            )}
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
