import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import inject from './../Map/../Map/inject.glsl';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M';

const ShaderInjector = ({ children }) => {
    useEffect(() => {
        const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY, version: 'alpha' });

        const patchCanvas = (canvas) => {
            if (!canvas || canvas._patched) return; // Avoid double patching
            canvas._patched = true;

            console.log('Patching canvas:', canvas);
            canvas._getContext = canvas.getContext;

            canvas.getContext = (type, options) => {
                const ctx = canvas._getContext(type, options);

                if (!ctx._shaderSource) {
                    ctx._shaderSource = ctx.shaderSource;
                    ctx.shaderSource = (shader, source) => {
                        console.log('Shader create:', shader);
                        let modifiedSource = source;

                        if (source.includes('gl_Position')) {
                            console.log('Skipping vertex shader');
                        } else if (source.includes('computeInscatter')) {
                            // SKYBOX
                            if (
                                source.includes(
                                    'FragColor = computeInscatter(gl_FragCoord.xy, uExposureAndAtmoTweak.x)'
                                )
                            ) {
                                console.log('Skybox shader found');
                                // Customize as needed (e.g., apply inject.glsl logic)
                            }

                            // GROUND
                            if (source.includes('FragColor = vec4(color.rgb * color.a, color.a)')) {
                                console.log('Ground shader found');
                                modifiedSource = source.slice(0, -1) + inject + '}';
                            }
                        }

                        ctx._shaderSource(shader, modifiedSource);
                    };
                }

                return ctx;
            };
        };

        const findCanvas = (element) => {
            const keys = Object.keys(element);
            return keys.map((k) => element[k] && element[k].getContext && element[k]).filter((v) => v)[0];
        };

        const originalAttachShadow = HTMLElement.prototype.attachShadow;
        HTMLElement.prototype.attachShadow = function (options) {
            const shadowRoot = originalAttachShadow.call(this, options);

            const canvas = findCanvas(this);
            if (canvas) patchCanvas(canvas);

            return shadowRoot;
        };

        const init = async () => {
            try {
                const { Map3DElement } = await loader.importLibrary('maps3d');
                console.log('Map3DElement loaded:', Map3DElement);
                // Further initialization or camera handling can go here if needed.
            } catch (error) {
                console.error('Error initializing Map3DElement:', error);
            }
        };

        init();

        return () => {
            // Cleanup: Restore original attachShadow
            HTMLElement.prototype.attachShadow = originalAttachShadow;
        };
    }, []);

    return <>{children}</>;
};

export default ShaderInjector;
