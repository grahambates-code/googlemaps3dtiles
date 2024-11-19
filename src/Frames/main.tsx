import React, { useState } from "react";
import { Box  } from "@chakra-ui/react";

const FadeOutWrapper = ({ fade, children, height = "100%" }) => {
    const [fadeWidth, setFadeWidth] = useState(100); // Default fade width in %

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
                style={fade}
            ></Box>


        </Box>
    );
};

export default FadeOutWrapper;
