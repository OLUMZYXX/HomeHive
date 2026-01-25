import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxMap = ({
  center = [3.3792, 6.5244], // Default to Lagos, Nigeria
  zoom = 12,
  markers = [],
  className = "w-full h-64 rounded-xl overflow-hidden border border-primary-200",
  style = { width: "100%", height: "100%" },
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center,
      zoom: zoom,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers
    markers.forEach((marker) => {
      const markerElement = new mapboxgl.Marker()
        .setLngLat(marker.coordinates)
        .addTo(map.current);

      if (marker.popup) {
        markerElement.setPopup(new mapboxgl.Popup().setHTML(marker.popup));
      }
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div className={className}>
      <div ref={mapContainer} style={style} />
    </div>
  );
};

MapboxMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
      popup: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MapboxMap;
