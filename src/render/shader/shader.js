import {domutil} from "../../util/dom.js";

function Shader(gl,type,glsl ){
        if(!domutil.isWebGLContext(gl)){
            throw new Error("need webgl context");
        }

        var SHADERTYPE=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER];
        if(!SHADERTYPE.includes(type)){
            throw new Error("SHADER TYPE no such type"+type+" only "+SHADERTYPE);
        }

        let shader = gl.createShader(type);
        gl.shaderSource(shader,glsl);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        return shader
    }


export {  Shader };
