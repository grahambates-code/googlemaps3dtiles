import React, { useState } from 'react';
import { Box, Button, Textarea } from '@chakra-ui/react';

import Map3DWithShaders from "./ReactMap/shader_injector.tsx";
import FadeOutWrapper from "./Frames/main.tsx";
import RoughBox from "./Frames/rough.tsx";
import {RoughNotation} from "react-rough-notation";

const MountainSVG = ({ viewBox = "0 0 400 200" }) => (
    <svg viewBox={viewBox} style={{ width: '100%', height: '100px' }}>
        <path
            d="M20,180 L140,60 L180,90 L280,40 L380,180"
            fill="none"
            stroke="black"
            strokeWidth="2"
        />
        <path
            d="M20,180 L140,60 L180,90 L280,40 L380,180 L20,180"
            fill="white"
            stroke="none"
            fillOpacity="0.8"
        />
        <path
            d="M60,180 L140,120 L220,180"
            fill="black"
            stroke="none"
            opacity="0.1"
        />
    </svg>
);

const DesignLayout = () => {
    const [viewState, setViewState] = useState({
        center: { lat: 37.7749, lng: -122.4194, altitude: 400 },
        tilt: 60,
        heading: 90,
        range: 13000,
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(viewState, null, 2));
    };

    const handlePaste = (event) => {
        try {
            const newState = JSON.parse(event.target.value);
            setViewState(newState);
        } catch (e) {
            console.error("Invalid JSON:", e);
        }
    };

    return (
        <Box>
            <Box zIndex="99999999" pos={'fixed'} right={0} top={0}>
                {/*<MountainSVG />*/}
            </Box>

            {/*<Box pos="fixed" zIndex="99999999" p={4} left={0} top={0} backgroundColor="white" boxShadow="lg">*/}
            {/*    <Textarea*/}
            {/*        value={JSON.stringify(viewState, null, 2)}*/}
            {/*        onChange={handlePaste}*/}
            {/*        rows={10}*/}
            {/*        placeholder="View State JSON"*/}
            {/*    />*/}
            {/*    <Button mt={2} onClick={handleCopy}>*/}
            {/*        Copy View State*/}
            {/*    </Button>*/}
            {/*</Box>*/}

            <Box width={'100vw'} height={'400vh'} pointerEvents={'all'}>


                <FadeOutWrapper>



                    <Map3DWithShaders
                        center={viewState.center}
                        tilt={viewState.tilt}
                        heading={viewState.heading}
                        range={viewState.range}
                        polylineCoordinates={[
                            { lat: 37.7749, lng: -122.4194, altitude: 400 },
                            { lat: 37.7849, lng: -122.4294, altitude: 500 },
                            { lat: 37.7949, lng: -122.4394, altitude: 600 },
                        ]}
                        onViewStateChange={setViewState} // Callback for view state updates
                    />

                    <Box pos={'absolute'} top={'0%'} right={'0%'} zIndex={9999999999} width={'40%'} height={'100vh'}>
                        <RoughBox text={"Yellow Run"} subtext={'New to the slopes? This one is for you.'}/>

                        <Box
                            position="absolute"
                            bottom="5%"
                            left="50%"
                            width={"70%"}
                            transform="translate(-50%, -50%)"
                            textAlign="center"
                        >
                        <RoughNotation
                            type="circle"
                            color="rgba(0, 0, 200, 0.2)"
                            show={true}
                        >
                            <div
                                style={{

                                    fontSize: `${48}px`,
                                    fontFamily: "'Amatic SC', cursive", // Ensure this

                                    color: "blackAlpha.300",
                                }}
                            >&nbsp;&nbsp;Scroll for more&nbsp;&nbsp;</div>
                        </RoughNotation>
                        </Box>


                    </Box>





                </FadeOutWrapper>
            </Box>
        </Box>
    );
};

export default DesignLayout;
