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

// export class Program {
// 	constructor(vertexShaderPath, fragmentShaderPath) {
// 		this.vertexShader;
// 		this.fragmentShader;
// 		this.program;

// 		this.createProgram(vertexShaderPath, fragmentShaderPath);
// 	}

// 	async createVertexShader(vertexShaderPath) {
// 		let vertexTextResponse = await fetch(vertexShaderPath);
// 		let vertexText = await vertexTextResponse.text();
// 		let vertexShader = gl.createShader(gl.VERTEX_SHADER);

// 		gl.shaderSource(vertexShader, vertexText);
// 		gl.compileShader(vertexShader);

// 		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
// 			console.error(
// 				"Error compiling vertex shader",
// 				gl.getShaderInfoLog(vertexShader)
// 			);
// 		}

// 		this.vertexShader = vertexShader;
// 	}

// 	async createFragmentShader(fragmentShaderPath) {
// 		let fragmentTextResponse = await fetch(fragmentShaderPath);
// 		let fragmentText = await fragmentTextResponse.text();
// 		let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

// 		gl.shaderSource(fragmentShader, fragmentText);
// 		gl.compileShader(fragmentShader);

// 		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
// 			console.error(
// 				"Error compiling fragment shader",
// 				gl.getShaderInfoLog(fragmentShader)
// 			);
// 		}

// 		this.fragmentShader = fragmentShader;
// 	}

// 	async createProgram(vertexShaderPath, fragmentShaderPath) {
//         await this.createVertexShader(vertexShaderPath);
// 		await this.createFragmentShader(fragmentShaderPath);

// 		let program = gl.createProgram();
// 		gl.attachShader(program, this.vertexShader);
// 		gl.attachShader(program, this.fragmentShader);
// 		gl.linkProgram(program);

// 		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
// 			console.error(
// 				"Error linking shader programs",
// 				gl.getProgramInfoLog(program)
// 			);
// 		}

// 		gl.validateProgram(program);
// 		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
// 			console.error(
// 				"Error validating program",
// 				gl.getProgramInfoLog(program)
// 			);
// 		}

// 		this.program = program;
// 	}
// }
