import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const MapboxMapWithPin = ({
  center = [3.3792, 6.5244], // Default to Lagos, Nigeria
  zoom = 12,
  onLocationChange,
  initialLocation,
  className = "w-full h-48 md:h-64 rounded-xl overflow-hidden border border-primary-200",
  style = { width: "100%", height: "100%" },
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    console.log("🗺️ MapboxMapWithPin: Initializing map");
    console.log("🗺️ Access token available:", !!accessToken);

    if (!accessToken) {
      console.error(
        "Mapbox access token not found. Please add VITE_MAPBOX_ACCESS_TOKEN to your .env file",
      );
      return;
    }

    mapboxgl.accessToken = accessToken;

    if (map.current) return; // initialize map only once

    console.log("🗺️ Creating map with center:", initialLocation || center);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialLocation || center,
      zoom: zoom,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Wait for map to load
    map.current.on("load", () => {
      console.log("🗺️ Map loaded successfully");
      setIsMapLoaded(true);

      // Create a custom marker element
      const markerElement = document.createElement("div");
      markerElement.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
        </div>
      `;

      // Create marker
      marker.current = new mapboxgl.Marker({
        element: markerElement,
        draggable: true,
      })
        .setLngLat(initialLocation || center)
        .addTo(map.current);

      console.log("🗺️ Marker created and added to map");

      // Handle marker drag end
      marker.current.on("dragend", () => {
        const lngLat = marker.current.getLngLat();
        console.log("🗺️ Marker dragged to:", lngLat);
        if (onLocationChange) {
          onLocationChange([lngLat.lng, lngLat.lat]);
        }
      });

      // Handle map click to move marker
      map.current.on("click", (e) => {
        const coordinates = [e.lngLat.lng, e.lngLat.lat];
        console.log("🗺️ Map clicked at:", coordinates);
        if (marker.current) {
          marker.current.setLngLat(coordinates);
        }
        if (onLocationChange) {
          onLocationChange(coordinates);
        }
      });
    });

    // Handle map errors
    map.current.on("error", (e) => {
      console.error("🗺️ Map error:", e);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker position when initialLocation changes
  useEffect(() => {
    if (marker.current && initialLocation && isMapLoaded) {
      marker.current.setLngLat(initialLocation);
      map.current.setCenter(initialLocation);
    }
  }, [initialLocation, isMapLoaded]);

  return (
    <div
      className={`relative ${className}`}
      style={{ ...style, minHeight: "300px" }}
    >
      <div
        ref={mapContainer}
        className="w-full h-full rounded-xl"
        style={{ minHeight: "300px", height: "100%" }}
      />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-primary-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
            <p className="text-primary-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      {isMapLoaded && (
        <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm text-primary-700 font-medium z-10">
          <FaMapMarkerAlt className="inline mr-2" />
          Drag the pin to your exact location
        </div>
      )}
    </div>
  );
};

MapboxMapWithPin.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  onLocationChange: PropTypes.func,
  initialLocation: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MapboxMapWithPin;
