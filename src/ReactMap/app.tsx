import React, { useCallback, useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Map3D, Map3DCameraProps } from "./map-3d";
import "./style.css";
import ShaderInjector from "./shader_injector.tsx";

const Map3DExample = ({view }) => {
    const [viewProps, setViewProps] = useState(view );

    const handleCameraChange = useCallback((props: Map3DCameraProps) => {
        setViewProps((oldProps) => ({ ...oldProps, ...props }));
    }, []);

    return (

            <ShaderInjector
                viewProps={viewProps}
                onCameraChange={handleCameraChange}
                />

    );
};


export default Map3DExample;
