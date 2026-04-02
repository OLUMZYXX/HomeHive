import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMoneyBillAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { AiFillPropertySafety } from "react-icons/ai";
import { HiChevronDown } from "react-icons/hi";
import { toast } from "sonner";
import { ButtonLoader } from "../common/Loader";
import { useAPI } from "../../contexts/APIContext";

const Location = () => {
  const navigate = useNavigate();
  const { searchProperties, getProperties, loading } = useAPI();

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);

  const defaultLocations = useMemo(
    () => [
      "Abuja, Nigeria",
      "Lagos, Nigeria",
      "Port Harcourt, Nigeria",
      "Ibadan, Nigeria",
      "Abeokuta, Nigeria",
    ],
    [],
  );

  const propertyTypes = ["Apartment", "Villa", "Condo", "Studio", "House"];

  const priceRanges = [
    { label: "₦50,000 - ₦150,000", min: 50000, max: 150000 },
    { label: "₦150,000 - ₦300,000", min: 150000, max: 300000 },
    { label: "₦300,000 - ₦500,000", min: 300000, max: 500000 },
    { label: "₦500,000 - ₦750,000", min: 500000, max: 750000 },
    { label: "₦750,000+", min: 750000, max: null },
  ];

  useEffect(() => {
    const fetchAvailableLocations = async () => {
      try {
        const properties = await getProperties({ limit: 1000 });
        const locations = [
          ...new Set(
            properties
              .map((property) => {
                const loc = property.location || property.city || property.address;
                if (typeof loc === "object" && loc !== null) {
                  return [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
                }
                return loc;
              })
              .filter((loc) => typeof loc === "string" && loc.trim() !== ""),
          ),
        ];
        setAvailableLocations(locations.length > 0 ? locations : defaultLocations);
      } catch {
        setAvailableLocations(defaultLocations);
      }
    };
    fetchAvailableLocations();
  }, [getProperties, defaultLocations]);

  const handleSearch = async () => {
    if (!location && !propertyType && !priceRange && !searchKeyword) {
      toast.error("Please fill at least one field to search");
      return;
    }
    setIsSearching(true);
    try {
      let selectedPriceRange = null;
      if (priceRange) {
        selectedPriceRange = priceRanges.find((r) => r.label === priceRange);
        if (!selectedPriceRange) throw new Error("Invalid price range selected");
      }
      const searchCriteria = {
        ...(location && { location }),
        ...(propertyType && { propertyType: propertyType.toLowerCase() }),
        ...(selectedPriceRange && {
          minPrice: selectedPriceRange.min,
          ...(selectedPriceRange.max && { maxPrice: selectedPriceRange.max }),
        }),
        ...(searchKeyword && {
          search: searchKeyword.trim(),
          searchFields: ["title", "description", "amenities", "address"],
        }),
        available: true,
        status: "active",
      };
      const searchResults = await searchProperties(searchCriteria);
      const results = Array.isArray(searchResults) ? searchResults : [];
      if (results.length > 0) {
        toast.success(`Found ${results.length} properties`);
      } else {
        toast.info("No properties match your search criteria.");
      }
      const queryParams = new URLSearchParams({
        ...(location && { location }),
        ...(propertyType && { propertyType }),
        ...(priceRange && { priceRange }),
        ...(searchKeyword && { keyword: searchKeyword }),
        resultsCount: results.length.toString(),
      }).toString();
      navigate(`/listings?${queryParams}`, { state: { searchResults: results, searchCriteria } });
    } catch (error) {
      toast.error(error.message || "Unable to search properties. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = async (quickSearchType) => {
    try {
      let searchCriteria = {};
      switch (quickSearchType) {
        case "lagos-apartments":
          setLocation("Lagos, Nigeria");
          setPropertyType("Apartment");
          setPriceRange("₦150,000 - ₦300,000");
          setSearchKeyword("");
          searchCriteria = { location: "Lagos, Nigeria", propertyType: "apartment", minPrice: 150000, maxPrice: 300000, available: true };
          break;
        case "luxury-villas":
          setPropertyType("Villa");
          setPriceRange("₦500,000+");
          setSearchKeyword("luxury premium");
          searchCriteria = { propertyType: "house|villa", minPrice: 500000, search: "luxury premium modern", available: true };
          break;
        case "budget-options":
          setPriceRange("₦50,000 - ₦150,000");
          setSearchKeyword("budget");
          searchCriteria = { minPrice: 50000, maxPrice: 150000, search: "budget affordable", available: true };
          break;
        default:
          return;
      }
      if (searchCriteria.location || searchCriteria.propertyType || searchCriteria.minPrice) {
        setIsSearching(true);
        const searchResults = await searchProperties(searchCriteria);
        const results = Array.isArray(searchResults) ? searchResults : [];
        if (results.length > 0) {
          toast.success(`Found ${results.length} properties`);
        } else {
          toast.info("No properties match this quick search.");
        }
        navigate(`/listings?quick=${quickSearchType}`, { state: { searchResults: results, searchCriteria } });
        setIsSearching(false);
      }
    } catch {
      toast.error("Quick search failed. Please try manual search.");
      setIsSearching(false);
    }
  };

  const selectClass = "flex-1 bg-transparent text-neutral-800 focus:outline-none cursor-pointer text-sm appearance-none";
  const fieldWrap = "flex items-center bg-white border border-neutral-200 hover:border-neutral-400 focus-within:border-neutral-800 px-4 py-3 transition-colors duration-200 gap-3";

  return (
    <section className="bg-neutral-50 border-b border-neutral-100 py-12 lg:py-16" id="accomodation">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">

        {/* Section label */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-500" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-600">
              Search Properties
            </span>
            <div className="w-8 h-px bg-amber-500" />
          </div>
          <h2 className="font-Cormorant text-4xl sm:text-5xl font-light text-neutral-900">
            Find Your Perfect <span className="italic">Accommodation</span>
          </h2>
        </div>

        {/* Search form — clean white bar */}
        <div className="bg-white border border-neutral-200 shadow-soft">
          {/* Keyword row */}
          <div className={`${fieldWrap} border-b border-neutral-100`}>
            <FaSearch className="text-neutral-400 text-sm flex-shrink-0" />
            <input
              type="text"
              placeholder='Search by keyword — "pool", "beachfront", "studio"…'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="flex-1 bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none text-sm"
            />
          </div>

          {/* Filters row */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {/* Location */}
            <div className={`${fieldWrap} sm:border-r border-neutral-100`}>
              <FaLocationDot className="text-neutral-400 text-sm flex-shrink-0" />
              <select className={selectClass} value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">Location</option>
                {availableLocations.map((loc, i) => (
                  <option key={loc + i} value={loc}>{loc}</option>
                ))}
              </select>
              <HiChevronDown className="text-neutral-400 text-sm flex-shrink-0" />
            </div>

            {/* Property type */}
            <div className={`${fieldWrap} sm:border-r border-neutral-100`}>
              <AiFillPropertySafety className="text-neutral-400 text-sm flex-shrink-0" />
              <select className={selectClass} value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="">Property Type</option>
                {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <HiChevronDown className="text-neutral-400 text-sm flex-shrink-0" />
            </div>

            {/* Price range */}
            <div className={fieldWrap}>
              <FaMoneyBillAlt className="text-neutral-400 text-sm flex-shrink-0" />
              <select className={selectClass} value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="">Budget</option>
                {priceRanges.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
              </select>
              <HiChevronDown className="text-neutral-400 text-sm flex-shrink-0" />
            </div>
          </div>

          {/* Search button + quick filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 border-t border-neutral-100">
            <button
              onClick={handleSearch}
              disabled={isSearching || loading}
              className="sm:w-56 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-medium tracking-widest uppercase px-8 py-4 flex items-center justify-center gap-2 transition-colors duration-200"
            >
              {isSearching || loading ? (
                <>
                  <ButtonLoader />
                  Searching…
                </>
              ) : (
                <>
                  <FaSearch className="text-xs" />
                  Search
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center gap-2 px-5 py-3">
              <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider mr-1">Quick:</span>
              {[
                { key: "lagos-apartments", label: "Lagos Apartments" },
                { key: "luxury-villas", label: "Luxury Villas" },
                { key: "budget-options", label: "Budget Stays" },
              ].map((q) => (
                <button
                  key={q.key}
                  onClick={() => handleQuickSearch(q.key)}
                  disabled={isSearching || loading}
                  className="px-3 py-1.5 border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 text-xs font-medium transition-colors duration-200 disabled:opacity-40"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
