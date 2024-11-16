import React, { useCallback, useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Map3D, Map3DCameraProps } from "./map-3d";
import "./style.css";
import ShaderInjector from "./shader_injector.tsx";

const API_KEY = "AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M";

const INITIAL_VIEW_PROPS = {
    center: { lat: 37.795192, lng: -122.402786, altitude: 0 },
    range: 5000,
    heading: 60,
    tilt: 60,
    roll: 0,
};

const Map3DExample = () => {
    const [viewProps, setViewProps] = useState(INITIAL_VIEW_PROPS);

    const handleCameraChange = useCallback((props: Map3DCameraProps) => {
        setViewProps((oldProps) => ({ ...oldProps, ...props }));
    }, []);

    const repositionMap = () => {
        const { lat, lng } = viewProps.center;

        // Move 1 km north
        const newLat = lat + 0.009;
        const newLng = lng;

        setViewProps((oldProps) => ({
            ...oldProps,
            center: { lat: newLat, lng: newLng },
        }));

        updateShaderUniforms(newLat, newLng, 0.02); // Update shader mask
    };

    const updateShaderUniforms = (lat, lng, radius) => {
        const canvases = document.querySelectorAll("gmp-map-3d canvas");
        canvases.forEach((canvas) => {
            const ctx = canvas.getContext("webgl2");
            if (!ctx) return;

            const program = ctx.getParameter(ctx.CURRENT_PROGRAM);
            if (!program) return;

            const locationUniform = ctx.getUniformLocation(program, "uLocation");
            const radiusUniform = ctx.getUniformLocation(program, "uRadius");

            if (locationUniform) {
                const polar = [(Math.PI * lng) / 180, (Math.PI * lat) / 180];
                ctx.uniform2fv(locationUniform, new Float32Array(polar));
            }

            if (radiusUniform) {
                ctx.uniform1f(radiusUniform, radius);
            }
        });
    };

    return (
        <div className="rightmap" style={{ pointerEvents: "all" }}>
            <ShaderInjector >
                <Map3D
                    maxTilt={80}
                    minTilt={60}
                    {...viewProps}
                    onCameraChange={handleCameraChange}
                    defaultLabelsDisabled
                />
            </ShaderInjector>
            <button
                onClick={repositionMap}
                style={{ position: "absolute", top: 10, left: 10 }}
            >
                Move Map 1km Away
            </button>
        </div>
    );
};

const App = () => (
    <APIProvider apiKey={API_KEY} version={"alpha"}>
        <Map3DExample />
    </APIProvider>
);

export default App;
