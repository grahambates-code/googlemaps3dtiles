import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import inject from "./inject.glsl"; // Your GLSL shader code as a string

const ShaderInjector = ({ children }) => {
  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyCwmX_Ejr4hEyGDZfgBWPgLYzIqMhY1P3M",
      version: "alpha",
    });

    const patchCanvas = (canvas) => {
      if (!canvas || canvas._patched) return;
      canvas._patched = true;

      canvas._getContext = canvas.getContext;
      canvas.getContext = (type, options) => {
        const ctx = canvas._getContext(type, options);

        if (!ctx._shaderSource) {
          ctx._shaderSource = ctx.shaderSource;
          ctx.shaderSource = (shader, source) => {
            console.log("Intercepted Shader Source:", shader);

            // Modify shaders
            if (source.includes("gl_Position")) {
              console.log("Skipping vertex shader");
            } else if (source.includes("computeInscatter")) {
              // Patch ground shaders
              if (source.includes("FragColor = vec4(color.rgb * color.a, color.a)")) {
                console.log("Patching ground shader");
                source = source.slice(0, -1) + inject + "}"; // Append your custom GLSL code
              }
            }

            ctx._shaderSource(shader, source);
          };
        }

        return ctx;
      };
    };

    const findCanvas = (element) => {
      const keys = Object.keys(element);
      return keys.map((key) => element[key] && element[key].getContext && element[key]).find(Boolean);
    };

    HTMLElement.prototype._attachShadow = HTMLElement.prototype.attachShadow;
    HTMLElement.prototype.attachShadow = function (options) {
      const shadowRoot = this._attachShadow(options);

      // Patch canvas within the shadow root
      const canvas = findCanvas(this);
      if (canvas) patchCanvas(canvas);

      return shadowRoot;
    };

    const init = async () => {
      try {
        const { Map3DElement } = await loader.importLibrary("maps3d");
        console.log("Google Maps 3D API loaded");

        // Patch all canvases after library loads
        const canvases = document.querySelectorAll("gmp-map-3d canvas");
        canvases.forEach(patchCanvas);

        // Observe DOM for dynamically added canvases
        const observer = new MutationObserver(() => {
          const newCanvases = document.querySelectorAll("gmp-map-3d canvas:not([data-patched])");
          newCanvases.forEach((canvas) => {
            patchCanvas(canvas);
            canvas.dataset.patched = true; // Mark as patched
          });
        });

        observer.observe(document.body, { childList: true, subtree: true });
      } catch (error) {
        console.error("Error loading Google Maps 3D API:", error);
      }
    };

    init();

    return () => {
      // Restore original attachShadow method
      HTMLElement.prototype.attachShadow = HTMLElement.prototype._attachShadow;
    };
  }, []);

  return <>{children}</>;
};

export default ShaderInjector;
