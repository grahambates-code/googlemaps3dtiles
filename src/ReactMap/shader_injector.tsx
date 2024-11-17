import React, { useEffect } from 'react';
import {Map3D} from "./map-3d";

const createShaderInject = (longitude, latitude, edgeIntensityFactor, hatchDensity, smoothnessFactor, range) => `\
  vec2 sf = vec2(${longitude}, ${latitude});
  vec2 polar = 3.141592653589793 * sf / 180.0;
  float R = 1.0;
  vec3 xyz = vec3(
    R * cos(polar.y) * cos(polar.x),
    R * cos(polar.y) * sin(polar.x),
    R * sin(polar.y)
  );
  vec3 posGround = normalize(posAtmo);

  // Store original color
  vec3 originalColor = FragColor.rgb;

  // Convert to black and white
  float luminance = dot(originalColor, vec3(0.299, 0.587, 0.114));
  vec3 bw = vec3(luminance);

  // Edge detection using derivatives
  vec3 dx = dFdx(originalColor);
  vec3 dy = dFdy(originalColor);
  float edgeIntensity = (length(dx) + length(dy)) * ${edgeIntensityFactor};

  // Base black-and-white effect
  FragColor.rgb = bw;

  // Add edge darkening
  FragColor.rgb *= (1.0 - edgeIntensity);

  // Procedural hatching effect
  float hatchPattern = sin(posGround.x * 50.0) * cos(posGround.y * 50.0);
  FragColor.rgb *= 1.0 - (smoothstep(0.3, 0.7, hatchPattern) * 0.2);

  // Fade to white outside
  float range = ${range};
  float d = distance(xyz, posGround) / range;
  float f = smoothstep(0.8 * ${smoothnessFactor}, 1.2 * ${smoothnessFactor}, d);
  FragColor.rgb = mix(FragColor.rgb, vec3(1.0), f);

  // Soft white edge glow
  //float edgeGlow = smoothstep(0.05 * ${smoothnessFactor}, 0.0, abs(d - 1.0));
  //FragColor.rgb += vec3(1.0) * edgeGlow * 0.5;

  // Add ink accumulation at edges
  float inkEdge = smoothstep(0.3, 0.0, edgeIntensity) * (1.0 - f);
  FragColor.rgb *= (1.0 + inkEdge * 0.5);
`;




const ShaderInjector = ({ viewProps, onCameraChange }) => {
    useEffect(() => {
        const inject = createShaderInject(
            viewProps.center.lng,
            viewProps.center.lat,
            0.1, // edgeIntensityFactor
            0.0, // hatchDensity
            1.2, // smoothnessFactor
            0.0010 // range
        );

        const patchCanvas = (canvas) => {
            if (!canvas || canvas._patched) return;
            console.log('Found new canvas to patch');

            const originalGetContext = canvas.getContext;
            canvas.getContext = function (type, options) {
                const ctx = originalGetContext.call(this, type, options);

                if (ctx) {
                    const originalShaderSource = ctx.shaderSource;
                    ctx.shaderSource = function (shader, source) {
                        try {
                            if (source.includes('gl_Position')) {
                                // Skip vertex shaders
                                return originalShaderSource.call(this, shader, source);
                            }

                            let modifiedSource = source;

                            console.log(source)
                            if (source.includes('computeInscatter') && source.includes('FragColor')) {
                                console.log('Injecting custom shader code');
                                modifiedSource = source.slice(0, -1) + inject + '}';
                            }

                            return originalShaderSource.call(this, shader, modifiedSource);
                        } catch (error) {
                            console.error('Shader injection error:', error);
                            return originalShaderSource.call(this, shader, source); // Fallback to original shader
                        }
                    };

                    ctx._isPatched = true;
                }

                return ctx;
            };
            canvas._patched = true;
        };

        const findAndPatchCanvas = (element) => {
            const canvas = Object.keys(element)
                .map((key) => element[key])
                .find((value) => value && value.getContext);

            if (canvas) {
                patchCanvas(canvas);
            }
        };

        // Override shadow DOM attachment to patch shaders
        const originalAttachShadow = HTMLElement.prototype.attachShadow;
        HTMLElement.prototype.attachShadow = function (options) {
            const shadowRoot = originalAttachShadow.call(this, options);
            findAndPatchCanvas(this);
            return shadowRoot;
        };

        return () => {
            HTMLElement.prototype.attachShadow = originalAttachShadow; // Restore original behavior
        };
    }, [viewProps]);

    return (
        <Map3D

            {...viewProps}
            onCameraChange={onCameraChange}
            defaultLabelsDisabled
            defaultUiDisabled

        />
    );
};

export default ShaderInjector;
