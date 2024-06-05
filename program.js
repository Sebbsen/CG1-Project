/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {RequestInfo} vertexPath 
 * @param {RequestInfo} fragmentPath 
 */
export async function createProgram(gl, vertexPath, fragmentPath) {
    // --------------------------------------------------------------------------------------------

    // create vertex shader program
    let vertexTextResponse = await fetch(vertexPath);
    let vertexText = await vertexTextResponse.text();
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertexShader, vertexText);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader", gl.getShaderInfoLog(vertexShader));
    }

    // create fragment shader program
    let fragmentTextResponse = await fetch(fragmentPath);
    let fragmentText = await fragmentTextResponse.text();
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(fragmentShader, fragmentText);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling fragment shader", gl.getShaderInfoLog(fragmentShader));
    }

    // create program
    let program = gl.createProgram();
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking shader programs", gl.getProgramInfoLog(program));
    }

    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("Error validating program", gl.getProgramInfoLog(program));
    }
    
    return program
}
