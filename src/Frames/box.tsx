const ImperfectBox = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            width="500"
            height="500"
        >
            {/* Define SVG Filters for Imperfect Lines */}
            <defs>
                <filter id="imperfectLines">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01"
                        numOctaves="2"
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

            {/* Outer Box */}
            <rect
                x="50"
                y="50"
                width="400"
                height="400"
                stroke="brown"
                strokeWidth="3"
                fill="none"
                filter="url(#imperfectLines)"
            />

            {/* Inner Horizontal Line */}
            <line
                x1="50"
                y1="150"
                x2="450"
                y2="150"
                stroke="brown"
                strokeWidth="2"
                filter="url(#imperfectLines)"
            />

            {/* Inner Vertical Line */}
            <line
                x1="250"
                y1="50"
                x2="250"
                y2="450"
                stroke="brown"
                strokeWidth="2"
                filter="url(#imperfectLines)"
            />
        </svg>
    );
};

export default ImperfectBox;
