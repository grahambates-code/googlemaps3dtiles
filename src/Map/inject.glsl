export default `\
  vec2 sf = vec2(-122.402786, 37.795192); // transamerica pyramid
  vec2 polar = 3.141592653589793 * sf / 180.0;
  float R = 1.0;
  vec3 xyz = vec3(
    R * cos(polar.y) * cos(polar.x),
    R * cos(polar.y) * sin(polar.x),
    R * sin(polar.y)
  );
  vec3 posGround = normalize(posAtmo); // Flatten position down to sphere radius

  vec3 bw = vec3(dot(vec3(0.35, 0.71, 0.12), FragColor.rgb));
  vec3 fullColor = FragColor.rgb;
  float range = 0.00002;
  float d = distance(xyz, posGround) / range; // Normalized distance to edge
  float f = smoothstep(0.99, 1.01, d); // 0: location, 1: edge

  // BW to color fade
  FragColor.rgb = mix(fullColor, 0.1 * bw, f);

  // Blue egde
  FragColor.rgb += vec3(0.0, 0.47, 0.96) * smoothstep(0.01, 0.005, abs(d - 1.0));
`;
