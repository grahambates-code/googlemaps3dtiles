import React from "react";
import { Box } from "@chakra-ui/react";
import { APIProvider } from "@vis.gl/react-google-maps";
import FadeOutWrapper from "./main.tsx";
import Map3DExample from "../ReactMap/app.tsx";

const FullScreenScrollImage = () => {
    return (
        <Box position="relative" bg="gray.100" >

            <APIProvider
                apiKey="AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M"
                version="alpha"
            >
                <Box position="relative" width="100%" height="300vh" pointerEvents={'all'}>
                    <FadeOutWrapper height={"300vh"}>
                        <Map3DExample
                            view={{
                                center: {
                                    lat: 45.99391331065768,
                                    lng: 7.762488122787081,
                                    altitude: 2678.0628388326822,
                                },
                                range: 7210.967245087959,
                                heading: 151.36676143493665,
                                tilt: 70.38352037662207,
                                roll: 0,
                            }}
                        />
                    </FadeOutWrapper>
                </Box>
            </APIProvider>
        </Box>
    );
};

export default FullScreenScrollImage;
