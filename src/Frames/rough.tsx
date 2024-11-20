import React, { useState, useRef, useEffect } from "react";
import {
    Box, Button, Slider, SliderFilledTrack, SliderThumb, SliderTrack,
} from "@chakra-ui/react";
import { RoughNotation } from "react-rough-notation";
import '@fontsource/amatic-sc';

const RoughBox = ({
                      color,
                      heading,
                      setHeading,
                      text = "New Title",
                      subtext = "Write here",
                      steepness
                  }) => {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(700); // Default width
    const [height, setHeight] = useState(400); // Default height

    const [lineCount, setLineCount] = useState(2);
    const [offset, setOffset] = useState(6); // Reduced randomness
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [opacity, setOpacity] = useState(0.3);
    const [roughness, setRoughness] = useState(0.01); // Reduced noise roughness
    const [displacement, setDisplacement] = useState(1.5); // Reduced displacement
    const [fontSize, setFontSize] = useState(72);
    const [showAnnotations, setShowAnnotations] = useState(true);

    useEffect(() => {
        // Dynamically update dimensions
        const updateDimensions = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
                setHeight(containerRef.current.offsetHeight);
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Generate sketchy border lines
    const generateLines = (x1, y1, x2, y2) => {
        const lines = [];
        for (let i = 0; i < lineCount; i++) {
            const randomOffsetX1 = Math.random() * offset - offset / 4; // Less randomness
            const randomOffsetY1 = Math.random() * offset - offset / 4; // Less randomness
            const randomOffsetX2 = Math.random() * offset - offset / 4;
            const randomOffsetY2 = Math.random() * offset - offset / 4;

            lines.push(
                <line
                    rotate={'1 deg'}
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

    return (
        <Box
            ref={containerRef}
            position="relative"
            w="100%"
            h="70vh" // Adjusted panel height to 70vh
            p="0"
            bg="whiteAlpha.50"
            rounded="md"
            overflow="hidden"
            borderWidth="0px"
            className={'vintage-map'}
        >
            <svg width={width} height={height} style={{ position: "absolute" }}>

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

                {/* Sketchy box edges */}
                {generateLines(10, 10, width - 10, 10)} {/* Top edge */}
                {generateLines(width - 10, 10, width - 10, height - 10)} {/* Right edge */}
                {generateLines(width - 10, height - 10, 10, height - 10)} {/* Bottom edge */}
                {generateLines(10, height - 10, 10, 10)} {/* Left edge */}
            </svg>

            {/* Highlighted Title */}
            <Box
                position="absolute"
                top="15%"
                left="50%"
                width={"100%"}
                transform="translate(-50%, -50%)"
                textAlign="center"
                fontSize={`${fontSize}px`}
                color="whiteAlpha.900"
            >
                <RoughNotation
                    type="highlight"
                    color={color}
                    iterations={4}
                    show={showAnnotations}
                >
                    &nbsp;&nbsp;{text}&nbsp;&nbsp;
                </RoughNotation>
            </Box>

            {/* Highlighted Subtext */}
            <Box
                position="absolute"
                top="55%"
                left="50%"
                width={"80%"}
                transform="translate(-50%, -50%)"
                textAlign="center"
            >
                <RoughNotation
                    type="highlight"
                    color="rgba(255, 255, 255, 0.7)"
                    show={showAnnotations}
                >
                    <Box fontSize={`${fontSize / 2}px`} color="blackAlpha.600">
                        {subtext}
                    </Box>
                </RoughNotation>



                {false && <Slider aria-label="custom-slider"
                        min={-180}
                        max={0}
                        isReversed={false}

                        step={0.001}
                        value={heading} onChange={setHeading} >
                {/* Slider track */}
                <SliderTrack>
                    <SliderFilledTrack bg={color} />
                </SliderTrack>

                {/* Custom slider thumb */}
                <SliderThumb boxSize={4}>
                    <Box
                        color={color}
                        as="span"
                        fontSize="sm"

                    >
                        O
                    </Box>
                </SliderThumb>
            </Slider> }



            </Box>
        </Box>
    );
};

export default RoughBox;
