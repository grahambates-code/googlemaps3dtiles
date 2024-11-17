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
    ButtonGroup,
    Button,
} from "@chakra-ui/react";
import "@fontsource/caveat"; // Hand-drawn font

const PRESETS = {
    default: {
        name: "Default",
        lineCount: 2,
        offset: 12,
        opacity: 0.2,
        roughness: 0.02,
        displacement: 2,
        strokeWidth: 2,
    },
    softPencil: {
        name: "Soft Pencil",
        lineCount: 5,
        offset: 10,
        opacity: 0.5,
        roughness: 0.01,
        displacement: 1.5,
        strokeWidth: 1.5,
    },
    sharpPen: {
        name: "Sharp Pen",
        lineCount: 3,
        offset: 5,
        opacity: 0.8,
        roughness: 0.03,
        displacement: 3,
        strokeWidth: 1,
    },
    roughSketch: {
        name: "Rough Sketch",
        lineCount: 6,
        offset: 15,
        opacity: 0.4,
        roughness: 0.05,
        displacement: 4,
        strokeWidth: 2.5,
    },
};

const RoughBox = ({
                      width = 400,
                      height = 400,
                      text = "Red Run",
                      subtext = "Intermediate Ski Route",
                      difficulty = 3,
                  }) => {
    // State for customization
    const [lineCount, setLineCount] = useState(PRESETS.default.lineCount);
    const [offset, setOffset] = useState(PRESETS.default.offset);
    const [strokeWidth, setStrokeWidth] = useState(PRESETS.default.strokeWidth);
    const [opacity, setOpacity] = useState(PRESETS.default.opacity);
    const [roughness, setRoughness] = useState(PRESETS.default.roughness);
    const [displacement, setDisplacement] = useState(PRESETS.default.displacement);
    const [fontSize, setFontSize] = useState(24); // Font size state
    const [shapeSize, setShapeSize] = useState(15); // Difficulty shape size
    const [showSliders, setShowSliders] = useState(false); // Toggle slider visibility

    // Apply a preset
    const applyPreset = (presetName) => {
        const preset = PRESETS[presetName];
        setLineCount(preset.lineCount);
        setOffset(preset.offset);
        setStrokeWidth(preset.strokeWidth);
        setOpacity(preset.opacity);
        setRoughness(preset.roughness);
        setDisplacement(preset.displacement);
    };

    // Generate imperfect lines for each box edge
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
                    opacity={opacity}
                    filter="url(#pencilEffect)"
                />
            );
        }
        return lines;
    };

    // Generate sketchy difficulty shapes
    const generateDifficultyShapes = () => {
        const shapes = [];
        const spacing = shapeSize * 2;
        const startX = width / 2 - ((difficulty - 1) * spacing) / 2;

        for (let i = 0; i < difficulty; i++) {
            for (let j = 0; j < lineCount; j++) {
                const randomOffsetX = Math.random() * offset - offset / 2;
                const randomOffsetY = Math.random() * offset - offset / 2;

                shapes.push(
                    <circle
                        key={`${i}-${j}`}
                        cx={startX + i * spacing + randomOffsetX}
                        cy={height - 40 + randomOffsetY}
                        r={shapeSize}
                        fill="none"
                        stroke="black"
                        strokeWidth={strokeWidth}
                        filter="url(#pencilEffect)"
                    />
                );
            }
        }
        return shapes;
    };

    return (
        <Box position="relative" w="100%" h="100%" p="4">
            <svg width={width} height={height}>
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

                {/* Draw edges of the box */}
                {generateLines(10, 10, width - 10, 10)} {/* Top edge */}
                {generateLines(width - 10, 10, width - 10, height - 10)} {/* Right edge */}
                {generateLines(width - 10, height - 10, 10, height - 10)} {/* Bottom edge */}
                {generateLines(10, height - 10, 10, 10)} {/* Left edge */}

                {/* Add text in the middle */}
                <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Caveat', cursive"
                    fontSize={fontSize}
                    fill="black"
                    filter="url(#pencilEffect)"
                >
                    {text}
                </text>

                {/* Add smaller subtext below the title */}
                <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'Caveat', cursive"
                    fontSize={fontSize * 0.6}
                    fill="black"
                    filter="url(#pencilEffect)"
                >
                    {subtext}
                </text>

                {/* Add sketchy difficulty shapes */}
                {generateDifficultyShapes()}
            </svg>

            {/* Buttons for Presets */}
            <ButtonGroup position="absolute" top="10px" left="10px" size="sm">
                {Object.keys(PRESETS).map((presetName) => (
                    <Button
                        key={presetName}
                        onClick={() => applyPreset(presetName)}
                        variant="outline"
                    >
                        {PRESETS[presetName].name}
                    </Button>
                ))}
                <Button onClick={() => setShowSliders((prev) => !prev)}>
                    {showSliders ? "Hide Sliders" : "Show Sliders"}
                </Button>
            </ButtonGroup>

            {/* Sliders for customization */}
            {showSliders && (
                <VStack
                    position="absolute"
                    top="50px"
                    left="10px"
                    bg="white"
                    p="4"
                    spacing="4"
                    rounded="md"
                    shadow="md"
                    borderWidth="1px"
                >
                    {/* Font Size Control */}
                    <Box>
                        <FormLabel fontSize="sm" mb={1}>
                            Font Size
                        </FormLabel>
                        <Slider
                            min={10}
                            max={50}
                            step={1}
                            value={fontSize}
                            onChange={(val) => setFontSize(val)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text fontSize="xs" textAlign="right">
                            {fontSize}px
                        </Text>
                    </Box>

                    {/* Shape Size Control */}
                    <Box>
                        <FormLabel fontSize="sm" mb={1}>
                            Difficulty Shape Size
                        </FormLabel>
                        <Slider
                            min={5}
                            max={30}
                            step={1}
                            value={shapeSize}
                            onChange={(val) => setShapeSize(val)}
                        >
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb />
                        </Slider>
                        <Text fontSize="xs" textAlign="right">
                            {shapeSize}px
                        </Text>
                    </Box>

                    {/* Line Count Control */}
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
                </VStack>
            )}
        </Box>
    );
};

export default RoughBox;
