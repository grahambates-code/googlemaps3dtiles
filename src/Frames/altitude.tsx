import React, { useRef } from "react";
import { Box } from "@chakra-ui/react";
import * as d3 from "d3";
import { RoughNotation } from "react-rough-notation";

const SkiRunMap = ({
                       strokeWidth = 1.5,
                       text = "Ski Run Altitude Map",
                       color,
                       steepness = 1,
                       image,
                       photoEffect = "tornEdge", // Options: 'polaroid', 'maskingTape', 'tornEdge'
                   }) => {
    const containerRef = useRef(null);

    const generateAltitudeData = (steepness) => {
        const baseAltitude = 2000;
        const totalTime = 90;
        const steps = totalTime / 10;

        const patterns = {
            1: [10, 5, 10, 5, 10, 5, 10, 5, 10],
            2: [15, 0, 20, 0, 10, 15, 20, 0, 5],
            3: [30, 5, 35, 0, 40, 0, 30, 10, 5],
        };

        const dropPattern = patterns[steepness];
        let altitude = baseAltitude;

        return Array.from({ length: steps + 1 }, (_, i) => {
            const time = i * 10;
            const drop = dropPattern[i % dropPattern.length];
            altitude -= drop;
            return { time, altitude: Math.max(altitude, 1500) };
        });
    };

    const altitudeData = generateAltitudeData(steepness);

    const width = 1000;
    const height = 500;

    const maxAltitude = Math.max(...altitudeData.map((d) => d.altitude));
    const minAltitude = Math.min(...altitudeData.map((d) => d.altitude));
    const maxTime = Math.max(...altitudeData.map((d) => d.time));

    const xScale = d3.scaleLinear().domain([0, maxTime]).range([70, width - 70]);
    const yScale = d3.scaleLinear()
        .domain([minAltitude, maxAltitude])
        .range([height - 50, 50]);

    const generateAltitudePath = () => {
        const lineGenerator = d3.line()
            .x((d) => xScale(d.time))
            .y((d) => yScale(d.altitude))
            .curve(d3.curveNatural);

        return lineGenerator(altitudeData);
    };

    const yAxisTicks = yScale.ticks(6).map((tick) => ({
        value: tick,
        y: yScale(tick),
    }));

    return (
        <Box
            ref={containerRef}
            position="relative"
            w="100%"
            h="95vh"
            p="0"
            bg="rgba(255, 255, 255, 0.9)"
            rounded="md"
            overflow="hidden"
            borderWidth="0px"
            boxShadow="lg"
            className={'vintage-map'}
        >
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                style={{position: "absolute"}}
            >


                <image
                    href={image}
                    x="650"
                    y="-50"
                    width={'400'}
                    height={'400'}
                    //preserveAspectRatio="xMidYMid meet"  // Maintain

                    transform="rotate(5)"
                    style={{
                        opacity: 0.65,
                        filter: "grayscale(0%)", // Desaturates the photo
                    }}
                />

                {/* Altitude Path */}
                <path
                    d={generateAltitudePath()}
                    stroke="black"
                    strokeWidth={strokeWidth}
                    fill="none"
                    filter="url(#pencilTexture)"
                    style={{opacity: 0.4}}
                />

                {/* Y-Axis Ticks */}
                <g>
                    {yAxisTicks.map((tick, i) => (
                        <g key={`tick-${i}`} transform={`translate(0, ${tick.y})`}>
                            <line
                                x1="55"
                                x2="60"
                                stroke="black"
                                strokeWidth={2}
                                style={{opacity: 0.4}}
                            />
                            <text
                                x="50"
                                y="5"
                                fontSize="12"
                                textAnchor="end"
                                fill="black"
                                style={{opacity: 0.4}}
                            >
                                {tick.value} m
                            </text>
                        </g>
                    ))}
                </g>

                {/* Photos */}


                {/*<image*/}
                {/*    href="photos/red/2.png"*/}
                {/*    x="650"*/}
                {/*    y="-200"*/}
                {/*    width="500"*/}
                {/*    height="300"*/}
                {/*    transform="rotate(10)"*/}
                {/*    style={{*/}
                {/*        opacity : 0.55,*/}
                {/*        filter: "grayscale(70%)", // Desaturates the photo*/}
                {/*    }}*/}

                {/*/>*/}
            </svg>

            <Box
                position="absolute"
                top="5%"
                left="50%"
                transform="translateX(-50%)"
                textAlign="center"
                fontSize="2.0rem"
            >
                <RoughNotation
                    show={true}
                    type="highlight"
                    iterations={4}
                    color={color}
                >
                    <div style={{color: 'white'}}>
                    &nbsp;{text} elevation&nbsp;
                    </div>
                </RoughNotation>
            </Box>
        </Box>
    );
};


export default SkiRunMap;
