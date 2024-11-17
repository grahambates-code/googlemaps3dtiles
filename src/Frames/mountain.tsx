import React, { useState } from "react";
import {
    Box,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Text,
    VStack,
    FormLabel,
} from "@chakra-ui/react";

const SketchyMountain = () => {
    const [lineCount, setLineCount] = useState(3); // Number of sketchy lines per edge
    const [offset, setOffset] = useState(8); // Randomness in line positions
    const [strokeWidth, setStrokeWidth] = useState(2); // Thickness of the lines
    const [roughness, setRoughness] = useState(0.03); // Texture roughness
    const [displacement, setDisplacement] = useState(3); // Line displacement intensity

    const width = "100%"; // Full width of the component
    const height = 300; // Fixed height

    // Generate sketchy lines for a single edge
    const generateLines = (x1, y1, x2, y2) => {
        const lines = [];
        for (let i = 0; i < lineCount; i++) {
            const randomOffsetX1 = Math.random() * offset - offset / 2;
            const randomOffsetY1 = Math.random() * offset - offset / 2;
            const randomOffsetX2 = Math.random() * offset - offset / 2;
            const randomOffsetY2 = Math.random() * offset - offset / 2;

            lines.push(
                <line
                    key={`${x1}-${y1}-${x2}-${y2}-${i}`}
                    x1={x1 + randomOffsetX1}
                    y1={y1 + randomOffsetY1}
                    x2={x2 + randomOffsetX2}
                    y2={y2 + randomOffsetY2}
                    stroke="black"
                    strokeWidth={strokeWidth}
                    opacity={0.8}
                    filter="url(#pencilEffect)"
                />
            );
        }
        return lines;
    };

    return (
        <Box position="relative" w={width} h={`${height}px`} p="4">
            <svg width="100%" height={height} viewBox="0 0 1000 300" preserveAspectRatio="none">
                {/* Define pencil texture filters */}
                <defs>
                    <filter id="pencilEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={roughness}
                            numOctaves="2"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={displacement}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>

                {/* Sketchy mountain shape */}
                {/* Main mountain triangle */}
                {generateLines(100, 250, 500, 50)} {/* Left side of the mountain */}
                {generateLines(500, 50, 900, 250)} {/* Right side of the mountain */}
                {generateLines(100, 250, 900, 250)} {/* Base of the mountain */}

                {/* Optional inner details for sketchy effect */}
                {generateLines(300, 200, 500, 120)} {/* Inner slope */}
                {generateLines(500, 120, 700, 200)} {/* Inner slope */}
            </svg>

            {/* Sliders for customization */}
            <VStack
                position="absolute"
                top="10px"
                left="10px"
                bg="white"
                p="4"
                spacing="4"
                rounded="md"
                shadow="md"
                borderWidth="1px"
            >
                <Box>
                    <FormLabel fontSize="sm" mb={1}>
                        Line Count
                    </FormLabel>
                    <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={lineCount}
                        onChange={(val) => setLineCount(val)}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" textAlign="right">
                        {lineCount}
                    </Text>
                </Box>

                <Box>
                    <FormLabel fontSize="sm" mb={1}>
                        Overreach/Underreach
                    </FormLabel>
                    <Slider
                        min={0}
                        max={20}
                        step={1}
                        value={offset}
                        onChange={(val) => setOffset(val)}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" textAlign="right">
                        {offset}px
                    </Text>
                </Box>

                <Box>
                    <FormLabel fontSize="sm" mb={1}>
                        Stroke Width
                    </FormLabel>
                    <Slider
                        min={0.5}
                        max={5}
                        step={0.5}
                        value={strokeWidth}
                        onChange={(val) => setStrokeWidth(val)}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" textAlign="right">
                        {strokeWidth}px
                    </Text>
                </Box>

                <Box>
                    <FormLabel fontSize="sm" mb={1}>
                        Roughness
                    </FormLabel>
                    <Slider
                        min={0.01}
                        max={0.1}
                        step={0.01}
                        value={roughness}
                        onChange={(val) => setRoughness(val)}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" textAlign="right">
                        {roughness.toFixed(2)}
                    </Text>
                </Box>

                <Box>
                    <FormLabel fontSize="sm" mb={1}>
                        Displacement
                    </FormLabel>
                    <Slider
                        min={1}
                        max={10}
                        step={0.5}
                        value={displacement}
                        onChange={(val) => setDisplacement(val)}
                    >
                        <SliderTrack>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Text fontSize="xs" textAlign="right">
                        {displacement.toFixed(1)}
                    </Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default SketchyMountain;
