import  { useState, useRef, useEffect } from "react";
import {
    Box
} from "@chakra-ui/react";
import { RoughNotation } from "react-rough-notation";

const Welcome = ({
                  }) => {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(700); // Default width
    const [height, setHeight] = useState(400); // Default height

    const [lineCount] = useState(2);
    const [offset] = useState(6); // Reduced randomness
    const [strokeWidth] = useState(2);
    const [opacity] = useState(0.3);
    const [roughness] = useState(0.01); // Reduced noise roughness
    const [displacement] = useState(1.5); // Reduced displacement

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
            h="60vh" // Adjusted panel height to 70vh
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
                top="35%"
                left="50%"
                width={"80%"}
               transform="translate(-50%, -50%)"
               textAlign="center"
              //  fontSize={`${48}px`}
                color="whiteAlpha.100"
            >
                <RoughNotation
                    type="highlight"
                    color="lightgrey"
                    iterations={2}
                    show={true}
                    //multiline={true}
                >
                    <Box
                        fontSize="72px" // Very large font size
                        className={'vintage-map'}
                     //   fontWeight="bold"
                        color="white" // White text color
                       // fontFamily="Amatic SC" // Ensure the Amatic SC font is applied
                    >
                        Welcome to Snowy Falls Slopes
                    </Box>
                </RoughNotation>

                <Box
                    fontSize="48px" // Very large font size
                    className={'vintage-map'}
                    //   fontWeight="bold"
                    color="blackAlpha.600" // White text color
                    // fontFamily="Amatic SC" // Ensure the Amatic SC font is applied
                >
                   Explore our ski runs and pick your next trip.
                </Box>


            </Box>

        </Box>
    );
};

export default Welcome;
