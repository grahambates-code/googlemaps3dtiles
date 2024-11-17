import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Set your Google Maps API key securely
const GOOGLE_MAPS_API_KEY = "AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M";

const DEFAULT_CENTER = { lat: 33.7905, lng: -122.3989, altitude: 400 };
const DEFAULT_TILT = 45;
const DEFAULT_HEADING = 25;
const DEFAULT_RANGE = 2500;
const DEFAULT_POLYLINE_COORDINATES = [
  { lat: 45.99391331065768, lng: 7.762488122787081, altitude : 1050 },
    { lat: 45.99391331065768, lng: 7.761488122787081, altitude : 1050 },
    { lat: 45.99391331065768, lng: 7.763488122787081, altitude : 1050 },


];

interface Map3DProps {
  center?: { lat: number; lng: number; altitude?: number };
  tilt?: number;
  heading?: number;
  range?: number;
  polylineCoordinates?: Array<{ lat: number; lng: number }>;
  width?: string | number;
  height?: string | number;
}

const Map3D: React.FC<Map3DProps> = ({
                                       center = DEFAULT_CENTER,
                                       tilt = DEFAULT_TILT,
                                       heading = DEFAULT_HEADING,
                                       range = DEFAULT_RANGE,
                                       polylineCoordinates = DEFAULT_POLYLINE_COORDINATES,
                                       width = "1000px",
                                       height = "1000px",
                                     }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: "alpha"
      });

      try {
        // Load the Google Maps library
     // await loader.importLibrary('test')
         await loader.importLibrary("maps3d");

        if (mapContainerRef.current) {
          // Clear any existing content
          mapContainerRef.current.innerHTML = "";

          // Create and configure the Map3D element
          const map = document.createElement("gmp-map-3d");
          map.setAttribute("heading", heading.toString());
          map.setAttribute("tilt", tilt.toString());
          map.setAttribute("range", range.toString());
          map.setAttribute("default-labels-disabled", "true");

          //45.99391331065768,"lng":7.762488122787081
          //37.79925208843463, lng: -122.3976697250461
          map.setAttribute(
              "center",
              `${45.99391331065768},${7.762488122787081},${3000}`
          );
          //map.style.width = "100%";
          // /map.style.height = "100%";

          // Create and configure the Polyline3D element
          const polyline = document.createElement("gmp-polyline-3d");
          polyline.setAttribute("altitude-mode", "relative-to-ground");
          polyline.setAttribute(
              "stroke-color",
              "rgba(255,246,0,0.94)"
          );
          polyline.setAttribute("stroke-width", "25");

          // Set the coordinates dynamically
          customElements.whenDefined(polyline.localName).then(() => {
            (polyline as any).coordinates = polylineCoordinates;
          });

          // Append the polyline to the map
          map.appendChild(polyline);

          // Append the map to the container
          mapContainerRef.current.appendChild(map);
        }
      } catch (error) {
        console.error("Failed to initialize the 3D map:", error);
      }
    };

    initializeMap();
  }, [center, tilt, heading, range, polylineCoordinates]); // Re-run when props change

  return (
      <div
          ref={mapContainerRef}
          style={{
            width,
            height,
            border: "1px solid #ccc",
            position: "relative",
          }}
      />
  );
};

export { Map3D };
