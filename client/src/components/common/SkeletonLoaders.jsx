import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Property Card Skeleton for Listings Page
export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white border border-primary-100 rounded-2xl overflow-hidden shadow-soft">
      <div className="flex flex-col">
        {/* Image Skeleton */}
        <div className="relative group h-48 overflow-hidden">
          <Skeleton height={192} className="w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="p-4">
          {/* Location and Rating */}
          <div className="flex items-center justify-between mb-2">
            <Skeleton width={120} height={16} />
            <Skeleton width={60} height={16} />
          </div>

          {/* Title */}
          <Skeleton width={180} height={20} className="mb-2" />

          {/* Description */}
          <Skeleton width={200} height={16} className="mb-3" />

          {/* Price */}
          <div className="flex items-center justify-between">
            <Skeleton width={80} height={18} />
            <Skeleton width={40} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Property Detail Page Skeleton
export const PropertyDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header Skeleton */}
      <div className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Skeleton width={200} height={24} />
            <div className="flex gap-2">
              <Skeleton width={80} height={36} />
              <Skeleton width={80} height={36} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Skeleton */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
              <Skeleton height={400} className="w-full" />
            </div>

            {/* Property Info Skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <Skeleton width={200} height={28} />
                <Skeleton width={100} height={24} />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Skeleton width={80} height={20} />
                <Skeleton width={80} height={20} />
                <Skeleton width={80} height={20} />
              </div>

              <Skeleton width="100%" height={16} count={3} className="mb-2" />
            </div>

            {/* Amenities Skeleton */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <Skeleton width={150} height={24} className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton width={24} height={24} />
                      <Skeleton width={60} height={16} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Booking Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-6">
              <Skeleton width={120} height={24} className="mb-4" />

              {/* Date Pickers */}
              <div className="space-y-4 mb-6">
                <div>
                  <Skeleton width={80} height={16} className="mb-2" />
                  <Skeleton height={48} className="w-full" />
                </div>
                <div>
                  <Skeleton width={80} height={16} className="mb-2" />
                  <Skeleton height={48} className="w-full" />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <Skeleton width={60} height={16} className="mb-2" />
                <Skeleton height={48} className="w-full" />
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={60} height={16} />
                </div>
                <div className="flex justify-between">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={50} height={16} />
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                  <Skeleton width={70} height={18} />
                  <Skeleton width={80} height={18} />
                </div>
              </div>

              {/* Book Button */}
              <Skeleton height={48} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Properties Skeleton
export const FeaturedPropertiesSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl overflow-hidden shadow-soft"
          >
            <Skeleton height={200} className="w-full" />
            <div className="p-4">
              <Skeleton width={150} height={20} className="mb-2" />
              <Skeleton width={100} height={16} className="mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton width={80} height={18} />
                <Skeleton width={60} height={16} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
