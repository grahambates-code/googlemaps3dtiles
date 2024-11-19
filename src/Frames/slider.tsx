import React, { useState, useRef } from "react";

const SketchySlider = ({ value = 0, min = 0, max = 180, onChange }) => {
    const [sliderValue, setSliderValue] = useState(
        ((value - min) / (max - min)) * 100
    );
    const [isHovered, setIsHovered] = useState(false);
    const sliderRef = useRef(null);

    const sliderWidth = 300; // Slider width in pixels
    const sliderHeight = 50; // Slider height in pixels
    const knobRadius = 12;

    const handleMouseMove = (e) => {
        if (!isHovered) return;

        const sliderRect = sliderRef.current.getBoundingClientRect();
        const mouseX = e.clientX - sliderRect.left;

        // Calculate the new slider value as a percentage
        const newSliderValue = Math.max(
            0,
            Math.min(100, (mouseX / sliderWidth) * 100)
        );

        // Update sliderValue and call onChange in steps of 0.01
        const step = 0.01;
        const actualValue = Math.round((min + (newSliderValue / 100) * (max - min)) / step) * step;

        setSliderValue(newSliderValue);
        if (onChange) {
            onChange(actualValue);
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const generateIrregularKnobPath = (x, y, radius) => {
        const points = 12; // Number of irregular points
        const step = (Math.PI * 2) / points;
        let path = "";
        for (let i = 0; i < points; i++) {
            const angle = i * step;
            const randomRadius = radius + Math.random() * 2 - 1; // Slight irregularity
            const pointX = x + Math.cos(angle) * randomRadius;
            const pointY = y + Math.sin(angle) * randomRadius;
            path += i === 0 ? `M${pointX},${pointY}` : `L${pointX},${pointY}`;
        }
        path += "Z"; // Close the path
        return path;
    };

    return (
        <div
            ref={sliderRef}
            style={{
                position: "relative",
                width: `${sliderWidth}px`,
                height: `${sliderHeight}px`,
                margin: "20px auto",
                cursor: "pointer",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <svg
                width={sliderWidth}
                height={sliderHeight}
                style={{ overflow: "visible" }}
            >
                <defs>
                    {/* Define pencil texture filter */}
                    <filter id="pencilEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.02"
                            numOctaves="3"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="4"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>

                {/* Sketchy Track (Horizontal Line) */}
                <line
                    x1="10"
                    y1={sliderHeight / 2}
                    x2={sliderWidth - 10}
                    y2={sliderHeight / 2}
                    stroke="black"
                    strokeWidth="3"
                    filter="url(#pencilEffect)"
                />

                {/* Irregular knob */}
                <path
                    d={generateIrregularKnobPath(
                        10 + (sliderValue / 100) * (sliderWidth - 20),
                        sliderHeight / 2,
                        knobRadius
                    )}
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                    filter="url(#pencilEffect)"
                    opacity={isHovered ? 1 : 0.8}
                />
            </svg>
        </div>
    );
};

export default SketchySlider;
