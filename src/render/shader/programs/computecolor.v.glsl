attribute vec3 position;
varying vec4 vColor;

uniform mat4  mpv;
void main(void) {

    gl_Position = mpv * vec4(position, 1.0);
    gl_PointSize = 1.0;
    vColor = color;
}

