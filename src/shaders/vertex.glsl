uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 rotationMatrix;
uniform float uFrequency;
uniform float uTime;
uniform float uOscillationFrequency;
uniform float uAmplitude;
uniform float uRotationX;
uniform float uRotationZ;
uniform float uGo;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;
attribute float aCurvature;
attribute float aSkew;

varying float vRandom;
varying float vElevation;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevationX = 0.0;
    float elevationY = 0.0;
    float elevationZ = 0.0;

    // elevationX += sin(modelPosition.x * uFrequency + uTime * uOscillationFrequency) * 0.1 * uAmplitude;
    // elevationY += sin(modelPosition.y * uFrequency + uTime * uOscillationFrequency) * 0.1 * uAmplitude;
    // elevationZ += sin(modelPosition.z * uFrequency + uTime * uOscillationFrequency) * 0.1 * uAmplitude;
    // elevation += aRandom;

    // modelPosition.z += elevationY;
    // modelPosition.z += elevationX;
    // modelPosition.y += elevationY;
    // modelPosition.x += elevationX;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
    vUv = uv;
}