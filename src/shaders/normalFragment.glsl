precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom;
varying float vElevation;
varying vec2 vUv;

void main() {
    // float lvElevation = vElevation * 5.0;
    // gl_FragColor = vec4(vRandom + uColor.r * lvElevation, uColor.g * lvElevation, uColor.b * lvElevation - vRandom, 1.0);
    vec4 textureColor = texture2D(uTexture, vUv);

    // Negative
    // textureColor.r = 1.0 - textureColor.r;
    // textureColor.g = 1.0 - textureColor.g;
    // textureColor.b = 1.0 - textureColor.b;

    // uColor Filter
    textureColor.rgb *= 1.0;

    gl_FragColor = vec4(textureColor.r, textureColor.g, textureColor.b, 1);
    // gl_FragColor = vec4(uColor.r, uColor.g, uColor.b, 1.0);
}