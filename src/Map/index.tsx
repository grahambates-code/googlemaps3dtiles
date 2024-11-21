import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Box, Text } from "@chakra-ui/react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
                              color,
                              center,
                              tilt,
                              range = 3000,
                              heading,
                              width = "100%",
                              height = "100%",
                              route_polygon,
                              interactive
                          }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [localHeading, setLocalHeading] = useState(heading);
    const intervalRef = useRef(null);

    // Add oscillating effect for heading
    useEffect(() => {
        let isPositive = true;

        intervalRef.current = setInterval(() => {
            !interactive && setLocalHeading(heading + (isPositive ? 2 : -2));
            isPositive = !isPositive;
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [heading, interactive]);

    useEffect(() => {
        const injectShaders = () => {
            const inject = createShaderInject(
                center.lng,
                center.lat,
                0.1,
                0.0,
                1.2,
                0.001
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

            const findCanvas = (element) => {
                if (!element) return null;
                const visited = new Set();
                const candidates = [];

                const scanObject = (obj) => {
                    if (!obj || typeof obj !== "object" || visited.has(obj)) return;
                    visited.add(obj);

                    Object.keys(obj).forEach((key) => {
                        const value = obj[key];
                        if (value && typeof value.getContext === "function") {
                            candidates.push(value);
                        } else if (typeof value === "object" && value !== null) {
                            scanObject(value);
                        }
                    });
                };

                scanObject(element);
                return candidates[0] || null;
            };

            const originalAttachShadow = HTMLElement.prototype.attachShadow;
            HTMLElement.prototype.attachShadow = function (options) {
                const shadowRoot = originalAttachShadow.call(this, options);
                const canvas = findCanvas(this);
                if (canvas) patchCanvas(canvas);
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

                const polygonPoints = [];
                if (mapContainerRef.current) {
                    mapContainerRef.current.innerHTML = "";

                    const map = document.createElement("gmp-map-3d");
                    map.setAttribute("heading", localHeading.toString());
                    map.setAttribute("tilt", tilt.toString());
                    map.setAttribute("range", range.toString());
                    map.setAttribute("default-labels-disabled", "true");
                    map.setAttribute("center", `${center.lat},${center.lng},${center.altitude || 400}`);

                    const polygon = document.createElement("gmp-polygon-3d");
                    polygon.setAttribute("altitude-mode", "absolute");
                    polygon.setAttribute("draws-occluded-segments", "true");
                    polygon.setAttribute("z-index", "99999999");
                    polygon.setAttribute("fill-color", color);

                    customElements.whenDefined(polygon.localName).then(() => {
                        polygon.outerCoordinates = route_polygon;
                    });

                    map.appendChild(polygon);

                    map.addEventListener("gmp-click", (event) => {
                        const { lat, lng, altitude } = event.position;
                        polygonPoints.push({ lat, lng, altitude: altitude + 0 });
                        polygon.outerCoordinates = polygonPoints;
                        console.log("Points :", polygonPoints);
                    });

                    mapContainerRef.current.appendChild(map);
                    mapRef.current = map;
                    window.gmpMap = map;

                    injectShaders();
                }
            } catch (error) {
                console.error("Failed to initialize the 3D map:", error);
                setIsLoading(false);
            }
        };

        initializeMap();
    }, []);

    useEffect(() => {
        if (mapRef?.current) {
            mapRef?.current.flyCameraTo({
                endCamera: {
                    center: center,
                    tilt: tilt,
                    range: range,
                    heading: localHeading
                },
                durationMillis: 5000, // Make sure the animation duration matches the interval
            });
        }
    }, [tilt, range, center, localHeading]);

    return (
        <div
            style={{
                width,
                height,
                border: "none",
                position: "relative",
                pointerEvents: interactive ? "all" : "none"
            }}
        >
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

            {false && (
                <Box
                    position="absolute"
                    inset="0"
                    bg="whiteAlpha.800"
                    display="flex"
                    zIndex="99000099"
                    width={'100%'}
                    height={'100%'}
                    top={0}
                    left={0}
                    color={"black"}
                >
                </Box>
            )}
        </div>
    );
};

export default Map3DWithShaders;
