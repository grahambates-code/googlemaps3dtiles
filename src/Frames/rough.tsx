import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Select,
    FormLabel,
    ButtonGroup,
    Button,
} from "@chakra-ui/react";
import { RoughNotation } from "react-rough-notation";
import '@fontsource/amatic-sc';


const RoughBox = ({
                      text = "New Title",
                      subtext = "Write here",
                      difficulty = 1,
                      cost = 2,
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
    const [difficultyRepresentation, setDifficultyRepresentation] = useState("!");
    const [costRepresentation, setCostRepresentation] = useState("$");

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
            h="80vh" // Adjusted panel height to 80vh
            p="0"
            bg="whiteAlpha.50"
            rounded="md"
            overflow="hidden"
            borderWidth="0px"
        >
            <svg width={width} height={height} style={{ position: "absolute" }}>
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
                transform="translate(-50%, -50%)"
                textAlign="center"
            >
                <RoughNotation
                    type="highlight"
                    color="rgba(255, 255, 0, 0.2)"
                    show={showAnnotations}
                >
          <div
              style={{

                  fontSize: `${fontSize}px`,
                  fontFamily: "'Amatic SC', cursive", // Ensure this

                  color: "blackAlpha.300",
              }}
          >
            {text}
          </div>
                </RoughNotation>
            </Box>

            {/* Subtext */}
            <Box
                position="absolute"
                top="25%"
                width={"100%"}
                left="0%"
                padding={8}
              //  transform="translate(-50%, -50%)"

            >

          <span
              style={{
                  fontSize: `${fontSize * 0.6}px`,

                  fontFamily: "'Amatic SC', cursive", // Ensure this
                  color: "gray.200",
              }}
          >
            {subtext}
          </span>

            </Box>

            <Box
                position="absolute"
                top="75%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
            >
                <RoughNotation
                    type="highlight"
                    color="rgba(100, 255, 0, 0.2)"
                    show={showAnnotations}
                >
                    <div
                        style={{

                            fontSize: `${fontSize*0.7}px`,
                            fontFamily: "'Amatic SC', cursive", // Ensure this
                            fontWeight: "bold",
                            color: "blackAlpha.300",
                        }}
                    >
                       $ $ $
                    </div>
                </RoughNotation>
            </Box>








        </Box>
    );
};

export default RoughBox;
