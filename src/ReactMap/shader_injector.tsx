import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Box, Text } from "@chakra-ui/react";


const GOOGLE_MAPS_API_KEY = "AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M";

const DEFAULT_CENTER = { lat: 33.7905, lng: -122.3989, altitude: 400 };
const DEFAULT_TILT = 45;
const DEFAULT_HEADING = 25;
const DEFAULT_RANGE = 2500;
const DEFAULT_POLYLINE_COORDINATES = [
    { lat: 45.99391331065768, lng: 7.762488122787081, altitude: 1050 },
    { lat: 45.99391331065768, lng: 7.761488122787081, altitude: 1050 },
    { lat: 45.99391331065768, lng: 7.763488122787081, altitude: 1050 },
];

const createShaderInject = (longitude, latitude, edgeIntensityFactor, hatchDensity, smoothnessFactor, range) => `\
  vec2 sf = vec2(${longitude}, ${latitude});
  vec2 polar = 3.141592653589793 * sf / 180.0;
  float R = 1.0;
  vec3 xyz = vec3(
    R * cos(polar.y) * cos(polar.x),
    R * cos(polar.y) * sin(polar.x),
    R * sin(polar.y)
  );
  vec3 posGround = normalize(posAtmo);

  // Store original color
  vec3 originalColor = FragColor.rgb;

  // Convert to black and white
  float luminance = dot(originalColor, vec3(0.299, 0.587, 0.114));
  vec3 bw = vec3(luminance);

  // Edge detection using derivatives
  vec3 dx = dFdx(originalColor);
  vec3 dy = dFdy(originalColor);
  float edgeIntensity = (length(dx) + length(dy)) * ${edgeIntensityFactor};

  // Base black-and-white effect
  FragColor.rgb = bw;

  // Add edge darkening
  FragColor.rgb *= (1.0 - edgeIntensity);

  // Procedural hatching effect
  float hatchPattern = sin(posGround.x * 50.0) * cos(posGround.y * 50.0);
  FragColor.rgb *= 1.0 - (smoothstep(0.3, 0.7, hatchPattern) * 0.2);

  // Fade to white outside
  float range = ${range};
  float d = distance(xyz, posGround) / range;
  float f = smoothstep(0.8 * ${smoothnessFactor}, 1.2 * ${smoothnessFactor}, d);
  FragColor.rgb = mix(FragColor.rgb, vec3(1.0), f);

  // Add ink accumulation at edges
  float inkEdge = smoothstep(0.3, 0.0, edgeIntensity) * (1.0 - f);
  FragColor.rgb *= (1.0 + inkEdge * 0.5);
`;

const Map3DWithShaders = ({
                              center = DEFAULT_CENTER,
                              tilt = DEFAULT_TILT,
                              heading = DEFAULT_HEADING,
                              range = DEFAULT_RANGE,
                              polylineCoordinates = DEFAULT_POLYLINE_COORDINATES,
                              width = "100%",
                              height = "100%",
                          }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); // Con

    useEffect(() => {
        const injectShaders = () => {
            const inject = createShaderInject(
                center.lng,
                center.lat,
                0.1,
                0.0,
                1.2,
                0.0010
            );

            const patchCanvas = (canvas) => {
                if (!canvas || canvas._patched) return;

                const originalGetContext = canvas.getContext;
                canvas.getContext = function (type, options) {
                    const ctx = originalGetContext.call(this, type, options);

                    if (ctx) {
                        const originalShaderSource = ctx.shaderSource;
                        ctx.shaderSource = function (shader, source) {
                            if (source.includes("gl_Position")) {
                                return originalShaderSource.call(this, shader, source);
                            }
                            let modifiedSource = source;
                            if (source.includes("computeInscatter") && source.includes("FragColor")) {
                                modifiedSource = source.slice(0, -1) + inject + "}";
                            }
                            return originalShaderSource.call(this, shader, modifiedSource);
                        };
                        ctx._isPatched = true;
                    }
                    return ctx;
                };
                canvas._patched = true;
            };

            const findAndPatchCanvas = (element) => {
                const canvas = Object.keys(element)
                    .map((key) => element[key])
                    .find((value) => value && value.getContext);
                if (canvas) patchCanvas(canvas);


                // Simulate map load completion
                setTimeout(() => {
                    setFadeOut(true); // Start fade-out animation
                    setTimeout(() => setIsLoading(false), 1000); // Remove the overlay after 1 second
                }, 2000); // Simulated map load time

            };

            const originalAttachShadow = HTMLElement.prototype.attachShadow;
            HTMLElement.prototype.attachShadow = function (options) {
                const shadowRoot = originalAttachShadow.call(this, options);
                findAndPatchCanvas(this);
                return shadowRoot;
            };

            return () => {
                HTMLElement.prototype.attachShadow = originalAttachShadow;
            };
        };

        const initializeMap = async () => {
            const loader = new Loader({
                apiKey: GOOGLE_MAPS_API_KEY,
                version: "alpha",
            });

            try {

               await loader.importLibrary("maps3d");

                //console.log(test.SteadyChangeEvent)
                if (mapContainerRef.current) {
                    mapContainerRef.current.innerHTML = "";

                    const map = document.createElement("gmp-map-3d");
                    map.setAttribute("heading", heading.toString());
                    map.setAttribute("tilt", tilt.toString());
                    map.setAttribute("min-tilt", "60");
                    map.setAttribute("max-tilt", "60");
                    map.setAttribute("range", range.toString());
                    map.setAttribute("default-labels-disabled", "true");
                    map.setAttribute("center", `${center.lat},${center.lng},${center.altitude || 400}`);

                    const polyline = document.createElement("gmp-polyline-3d");
                    polyline.setAttribute("altitude-mode", "relative-to-ground");
                    polyline.setAttribute("stroke-color", "rgba(255,33,0,0.94)");
                    polyline.setAttribute("stroke-width", "25");

                    customElements.whenDefined(polyline.localName).then(() => {
                        (polyline as any).coordinates = polylineCoordinates;
                    });

                    map.appendChild(polyline);


                    // Add event listener to log camera state
                    // Log camera state on change
                    map.addEventListener("camera-changed", (event) => {
                        console.log("Camera state changed:", event.detail.camera);
                    });

                    mapContainerRef.current.appendChild(map);
                    window.gmpMap = map;

                    injectShaders();
                }
            } catch (error) {
                console.error("Failed to initialize the 3D map:", error);
                setIsLoading(false);
            }
        };

        initializeMap();
    }, [center, tilt, heading, range, polylineCoordinates]);

    return (
        <div
            style={{
                width,
                height,
                border: "none",
                position: "relative",
            }}
        >
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

            {isLoading && (
                <Box
                    position="absolute"
                    inset="0"
                    bg="whiteAlpha.800"
                    backdropFilter="blur(20px)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex="10"
                    opacity={fadeOut ? 0 : 1} // Control opacity for fade-out
                    transition="opacity 1s ease-out" // Smooth fade-out animation
                >

                </Box>
            )}
        </div>
    );
};

export default Map3DWithShaders;
