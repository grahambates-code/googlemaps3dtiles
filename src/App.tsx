import React from 'react';
import { Box, Container, Grid, Text, VStack, Heading } from '@chakra-ui/react';
import ReactMap from './ReactMap/app'
import {APIProvider} from "@vis.gl/react-google-maps";
import FadeOutWrapper from "./Frames/main.tsx";
import RoughLines from "./Frames/rough.tsx";
import SketchyMountain from "./Frames/mountain.tsx";
import ScrollImagePanel from "./Frames/container.tsx";
import MapRoute from "./Vanilla";
import {Map3D} from "./ReactMap/map-3d";

const MountainSVG = ({ viewBox = "0 0 400 200" }) => (
    <svg viewBox={viewBox} style={{ width: '100%', height: 'auto' }}>
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

const SmallHouseSVG = () => (
    <svg viewBox="0 0 100 50" style={{ width: '100px', height: 'auto' }}>
        <path
            d="M10,40 L10,25 L25,15 L40,25 L40,40 Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
        />
        <path
            d="M50,40 L50,25 L65,15 L80,25 L80,40 Z"
            fill="none"
            stroke="black"
            strokeWidth="1"
        />
    </svg>
);


const DesignLayout = () => {

   // return    <Map3D/>
    //return <ScrollImagePanel/>
    return (
        <Container  >
            {/* Main Mountain Illustration */}
            <Box>

                    {/*<SketchyMountain/>*/}

                {/*<MountainSVG viewBox="0 0 400 150" />*/}
            </Box>



            {/* Three Column Text Section */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} mb={10}>
                {["COLUMN ONE", "COLUMN TWO", "COLUMN THREE"].map((title, i) => (
                    <VStack key={i} align="stretch" spacing={4}>
                        <Heading size="sm">{title}</Heading>
                        <Text fontSize="sm" color="gray.600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </Text>
                    </VStack>
                ))}
            </Grid>

            {/*<APIProvider*/}
            {/*    apiKey={"AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M"} version={"alpha"} >*/}
            {/*    <Box pos={'relative'} width={'1000px'} height={'1000px'} >*/}
            {/*        <Map3D*/}
            {/*            center={{ lat: 37.7749, lng: -122.4194, altitude: 1400 }}*/}
            {/*            heading={25}*/}
            {/*            tilt={45}*/}
            {/*            range={2500}*/}
            {/*        />*/}
            {/*        /!*<FadeOutWrapper>*!/*/}
            {/*        /!*    <Map3D/>*!/*/}
            {/*        /!*</FadeOutWrapper>*!/*/}
            {/*    </Box>*/}


            {/*</APIProvider>*/}

            {/* Two Mountain Illustrations */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} >

                <Box>
                    <RoughLines/>
                </Box>
                <Box>
                    {/*<Heading size="sm" mb={4}>LOPPY USS</Heading>*/}
                    {/*<MountainSVG viewBox="0 0 400 200" />*/}




                    {/*<MapRoute/>*/}
                   {/*<RoughLines/>*/}
                    <APIProvider
                        apiKey={"AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M"} version={"alpha"} >
                        <Box pos={'relative'} width={'100%'} height={'200vh'} >
                            <FadeOutWrapper>
                                <ReactMap view={{"center":{"lat":45.99391331065768,"lng":7.762488122787081,"altitude":2678.0628388326822},"range":7210.967245087959,"heading":151.36676143493665,"tilt":70.38352037662207,"roll":0}}/>
                            </FadeOutWrapper>
                        </Box>


                    </APIProvider>


                </Box>

            </Grid>


        </Container>
    );
};

export default DesignLayout;
