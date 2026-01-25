import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const MapboxAddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Enter your property address",
  className = "w-full p-3 md:p-4 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors duration-300",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  console.log(
    "🔍 MapboxAddressAutocomplete: Access token available:",
    !!accessToken,
  );

  // Debounced search function
  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!accessToken) {
      console.error("Mapbox access token not found");
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔍 Searching for address:", query);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${accessToken}&limit=5&types=address,poi,place,neighborhood,locality,region,country&autocomplete=true`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();
      console.log(
        "🔍 Address suggestions received:",
        data.features?.length || 0,
      );
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) {
        searchAddress(value);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    const address = suggestion.place_name;
    console.log("📍 Address selected:", address);
    console.log("📍 Coordinates:", suggestion.center);
    onChange(address);
    setShowSuggestions(false);
    setSuggestions([]);

    // Call onSelect with the full suggestion data
    if (onSelect) {
      onSelect({
        address,
        coordinates: suggestion.center,
        context: suggestion.context,
        properties: suggestion.properties,
      });
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={className}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          ) : (
            <FaSearch className="text-primary-400" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-primary-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="flex items-center px-4 py-3 hover:bg-primary-50 cursor-pointer border-b border-primary-100 last:border-b-0"
            >
              <FaMapMarkerAlt className="text-primary-400 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-primary-800">
                  {suggestion.text}
                </div>
                <div className="text-xs text-primary-600">
                  {suggestion.place_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MapboxAddressAutocomplete.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default MapboxAddressAutocomplete;
