import React from 'react';
import { Box, Container, Grid, Text, VStack, Heading } from '@chakra-ui/react';
import ReactMap from './ReactMap/app'
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
    return (
        <Container  >
            {/* Main Mountain Illustration */}
            <Box>

                <Box pos={'static'} width={'100%'} height={'200px'} >
                    <ReactMap/>
                </Box>
               {/* <MountainSVG viewBox="0 0 400 200" />*/}
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

            {/* Two Mountain Illustrations */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8} mb={10}>
                <Box>
                    <Heading size="sm" mb={4}>LOPPY USS</Heading>
                    <MountainSVG viewBox="0 0 400 200" />
                    <Text fontSize="sm" mt={4} color="gray.600">
                        Mountain description and details would go here.
                    </Text>
                </Box>
                <Box>
                    <Heading size="sm" mb={4}>LOPPY USS</Heading>
                    <MountainSVG viewBox="0 0 400 200" />
                    <Text fontSize="sm" mt={4} color="gray.600">
                        Mountain description and details would go here.
                    </Text>
                </Box>
            </Grid>


        </Container>
    );
};

export default DesignLayout;
