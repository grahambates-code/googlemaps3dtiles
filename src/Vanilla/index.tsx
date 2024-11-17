import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M";

const Simple3DMap = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        let map;

        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLE_MAPS_API_KEY,
                version: "alpha",
            });

            try {
                const { Map3DElement } = await loader.importLibrary("maps3d");

                // Initialize the map
                map = new Map3DElement({
                    center: { lat: 37.795192, lng: -122.402786, altitude: 0 },
                    defaultLabelsDisabled: true,
                    tilt: 65,
                    heading: 190,
                    range: 800,
                });

                // Append the map's DOM element directly
                if (mapRef.current) {
                    mapRef.current.innerHTML = ""; // Clear any previous content
                    mapRef.current.appendChild(map); // Append the Map3DElement instance
                }

                // Add a marker
                const marker = new google.maps.Marker({
                    position: { lat: 37.795192, lng: -122.402786 },
                    map, // Attach the marker to the map
                    title: "Hello World!", // Optional: Add a title for the marker
                });

                // Example of listening to a camera event
                map.addEventListener("gmp-centerchange", () => {
                    const { lat, lng, altitude } = map.center;
                    const { heading, roll, tilt } = map;
                    console.log("Camera moved:", { lat, lng, altitude, heading, roll, tilt });
                });

                // Optional: Fly camera to a different position
                // map.flyCameraTo({
                //   endCamera: {
                //     center: { lat: 37.6191, lng: -122.3816, altitude: 0 },
                //     roll: 60,
                //     tilt: 67.5,
                //     range: 1000,
                //   },
                //   durationMillis: 5000,
                // });
            } catch (error) {
                console.error("Failed to initialize the 3D map:", error);
            }
        };

        initializeMap();

        return () => {
            if (map) {
                map.destroy(); // Clean up the map instance
                map = null;
            }
        };
    }, []);

    return <div ref={mapRef} style={{ width: "1000px", height: "1000px" }} />;
};

export default Simple3DMap;
