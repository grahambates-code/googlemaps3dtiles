import React, { useState } from "react";
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from "@chakra-ui/react";

const FadeOutWrapper = ({ children, height = "100vh" }) => {
    const [fadeWidth, setFadeWidth] = useState(60); // Default fade width in %

    const handleSliderChange = (value) => {
        setFadeWidth(value);
    };

    return (
        <Box position="relative" width="100%" height={height} overflow="hidden">
            {/* Children Content */}
            <Box position="relative" width="100%" height="100%">
                {children}
            </Box>

            {/* Right-Hand Side Fade-Out Effect */}
            <Box
                position="absolute"
                top="0"
                right="0"
                bottom="0"
                width={`${fadeWidth}%`}
                pointerEvents="none"
                style={{
                    background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
                }}
            ></Box>


        </Box>
    );
};

export default FadeOutWrapper;
