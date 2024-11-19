import React, { useEffect, useState } from 'react';
import { Box, Spacer } from '@chakra-ui/react';

import Map3DWithShaders from "./Map";
import FadeOutWrapper from "./Frames/main.tsx";
import RoughBox from "./Frames/rough.tsx";
import Altitude from "./Frames/altitude.tsx";

const SkiRoute = ({
                      center,
                      tilt,
                      heading_default,
                      text,
                      subtext,
                      color,
                      fade,
                      route_polygon,
                      steepness,
                      image,
                  }) => {
    const [heading, setHeading] = useState(heading_default);
    const [direction, setDirection] = useState(1); // Tracks direction (+1 or -1)

    useEffect(() => {
        let animationFrameId;
        let lastTime = null;

        const animateHeading = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;

            setHeading((prevHeading) => {
                const newHeading = prevHeading + direction * deltaTime * 0.001; // Adjust speed with 0.001
                if (newHeading > heading_default + 1) {
                    setDirection(-1);
                    return heading_default + 0.0001;
                } else if (newHeading < heading_default - 1) {
                    setDirection(1);
                    return heading_default - 0.0001;
                }
                return newHeading;
            });

            lastTime = timestamp;
            //animationFrameId = requestAnimationFrame(animateHeading);
        };

        animationFrameId = requestAnimationFrame(animateHeading);

        return () => cancelAnimationFrame(animationFrameId);
    }, [heading_default, direction]);

    return (
        <FadeOutWrapper fade={fade}>
            <Map3DWithShaders
                color={color}
                center={center}
                tilt={tilt}
                heading={heading}
                route_polygon={route_polygon}
            />

            <Box
                pos="absolute"
                top="0%"
                right="0%"
                zIndex={9999999999}
                width="40%"
                height="100vh"
            >
                <RoughBox
                    color={color}
                    setHeading={setHeading}
                    heading={heading}
                    text={text}
                    steepness={steepness}
                    subtext={subtext}
                />
            </Box>

            <Box
                p={8}
                pos="absolute"
                top="40%"
                left="0%"
                zIndex={9999999999}
                width="100%"
            >
                <Altitude image={image} text={text} color={color} steepness={steepness} />
            </Box>
        </FadeOutWrapper>
    );
};

export default () => (
    <Box width="100vw" height="200vh" pointerEvents="all">
        <SkiRoute
            center={{ lat: 45.9665162753398, lng: 7.717537790, altitude: 2989.0686 }}
            tilt={68.74738583894411}
            heading_default={-150.16076475154642}
            range={2644}
            color="rgba(82,165,50,0.68)"
            steepness={1}
            image="photos/green/1.png"
            route_polygon={[
                { lat: 45.950532707007504, lng: 7.705213504488646, altitude: 3368.2891241242564 },
                { lat: 45.95079915070071, lng: 7.70525515453258, altitude: 3364.854855614912 },
                { lat: 45.9609799051727, lng: 7.717851258498307, altitude: 3036.710637960185 },
                { lat: 45.961900202943866, lng: 7.716502935930871, altitude: 3042.632923103162 },
                { lat: 45.95071872244763, lng: 7.705094888670658, altitude: 3366.963535542433 },
            ]}
            fade={{
                background: "linear-gradient(to right, rgba(72,255,0,0.2) 5%, rgba(255,255,255,0) 40%)",
            }}
            text="Green Run"
            subtext="A gentle descent, perfect for kids and those not seeking adrenaline"
        />

        <Spacer h="10vh" />

        <SkiRoute
            center={{
                lat: 45.969306391940634,
                lng: 7.731646426429233,
                altitude: 2910.151940436536,
            }}
            tilt={70.03295722264041}
            heading_default={-123}
            color="rgba(255,0,0,0.4)"
            steepness={2}
            image="photos/red/1.png"
            route_polygon={[
                { lat: 45.951330969797475, lng: 7.704483486345611, altitude: 3352.151011245517 },
                { lat: 45.96074523562468, lng: 7.713461185580515, altitude: 3065.371190358364 },
                { lat: 45.962588938733795, lng: 7.717693457855674, altitude: 3021.197016051679 },
                { lat: 45.964047770248925, lng: 7.716143353538689, altitude: 3025.1576733372654 },
                { lat: 45.96032846103219, lng: 7.711072440055691, altitude: 3082.7984379112763 },
                { lat: 45.95302249502971, lng: 7.70571878204696, altitude: 3316.6401912275974 },
                { lat: 45.953115624320354, lng: 7.706281275315183, altitude: 3305.5811587391736 },
            ]}
            fade={{
                background: "linear-gradient(to right, rgba(255,0,0,0.2) 5%, rgba(255,255,255,0) 40%)",
            }}
            text="Red Run"
            subtext="Steeper and narrower slopes that require more control and skill."
        />

        <Spacer h="10vh" />

        <SkiRoute
            center={{ lat: 45.94303046105, lng: 7.7167154683, altitude: 3244.70997289666 }}
            tilt={68.28576336}
            range={1522.92097135}
            heading_default={-134.799592807085562}
            color="rgba(0,0,255,0.4)"
            steepness={3}
            image="photos/blue/1.png"
            route_polygon={[
                { lat: 45.93549850872635, lng: 7.709043975047507, altitude: 3442.8620996908007 },
                { lat: 45.937050139486935, lng: 7.709675523411872, altitude: 3420.6469202500716 },
                { lat: 45.938546251326635, lng: 7.7101381311573824, altitude: 3392.991695235272 },
                { lat: 45.94024102948074, lng: 7.710415316344925, altitude: 3355.7207806859865 },
                { lat: 45.94134544957359, lng: 7.710885518550457, altitude: 3317.4468142138803 },
                { lat: 45.9426660450694, lng: 7.7112665359369785, altitude: 3280.6849211221715 },
                { lat: 45.94378958054276, lng: 7.711511974164759, altitude: 3247.629477900609 },
            ]}
            fade={{
                background: "linear-gradient(to right, rgba(0,0,255,0.2) 5%, rgba(255,255,255,0) 40%)",
            }}
            text="Blue Run"
            subtext="An Extreme slope. Only for seasoned pros."
        />
    </Box>
);
