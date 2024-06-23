/*Mat4 functions used by other files.
launch matrixTests.html and check the console(f12) for test results*/


/*Multiply a matrix with a vector*/
export function multiplyMatrixVector(matrix, vector) {
    if (matrix.length !== 16 || vector.length !== 4) {
        console.error("Invalid matrix or vector dimensions.");
        return null;
    }

    let result = new Float32Array(4);

    for (var i = 0; i < 4; i++) {
        result[i] =
            matrix[i] * vector[0] +
            matrix[i + 4] * vector[1] +
            matrix[i + 8] * vector[2] +
            matrix[i + 12] * vector[3];
    }

    return result;
}

/*Multiply a matrix with another matrix*/
export function multiplyMatrices(matrix1, matrix2) {
    if (matrix1.length !== 16 || matrix2.length !== 16) {
        console.error("Invalid matrix dimensions.");
        return null;
    }

    let result = new Float32Array(16);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            result[i + j * 4] =
                matrix1[i] * matrix2[j * 4 + 0] +
                matrix1[i + 4] * matrix2[j * 4 + 1] +
                matrix1[i + 8] * matrix2[j * 4 + 2] +
                matrix1[i + 12] * matrix2[j * 4 + 3];
        }
    }

    return result;
}

/*Create an identity matrix*/
export function identity(dimension) {
    if (typeof(dimension) != "number") {
        console.error("Invalid datatype " + typeof(dimension) +". 'identity()' does only accept datatype number");
        return null;
    } else if (dimension < 0 || dimension%1 != 0){
        console.error("Invalid dimension "+dimension+". Dimension must be a natural number")
        return null;
    }

    let result = new Float32Array(dimension**2);

    for (var i = 0; i < dimension; i++) {
        for (var j = 0; j < dimension; j++) {
            if (i == j) {
                result[j * (dimension+1)] = 1;
            }
        }
    }

    return result;
}

export function clone(matrix) {
    const out = identity(4);
    out[0] = matrix[0];
    out[1] = matrix[1];
    out[2] = matrix[2];
    out[3] = matrix[3];
    out[4] = matrix[4];
    out[5] = matrix[5];
    out[6] = matrix[6];
    out[7] = matrix[7];
    out[8] = matrix[8];
    out[9] = matrix[9];
    out[10] = matrix[10];
    out[11] = matrix[11];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out
}

/*Create a translation matrix out of a matrix and a vector*/
export function translateMatrix(matrix, vector) {
    if (matrix.length !== 16 || vector.length !== 4) {
        console.error("Invalid matrix or vector dimensions.");
        return null;
    }
    const translationMatrix = identity(4);
    translationMatrix[12] = vector[0];
    translationMatrix[13] = vector[1];
    translationMatrix[14] = vector[2];
    return multiplyMatrices(translationMatrix, matrix);
}

/*Invert a given matrix*/
export function invMatrix(matrix) {
    let invMat = new Float32Array(16)
    let result = new Float32Array(16)
    if (matrix.length != 16) {
        console.error("Invalid matrix dimensions")
        return null
    }

    invMat[0] = matrix[5]  * matrix[10] * matrix[15] - 
             matrix[5]  * matrix[11] * matrix[14] - 
             matrix[9]  * matrix[6]  * matrix[15] + 
             matrix[9]  * matrix[7]  * matrix[14] +
             matrix[13] * matrix[6]  * matrix[11] - 
             matrix[13] * matrix[7]  * matrix[10];

    invMat[4] = -matrix[4]  * matrix[10] * matrix[15] + 
              matrix[4]  * matrix[11] * matrix[14] + 
              matrix[8]  * matrix[6]  * matrix[15] - 
              matrix[8]  * matrix[7]  * matrix[14] - 
              matrix[12] * matrix[6]  * matrix[11] + 
              matrix[12] * matrix[7]  * matrix[10];

    invMat[8] = matrix[4]  * matrix[9] * matrix[15] - 
             matrix[4]  * matrix[11] * matrix[13] - 
             matrix[8]  * matrix[5] * matrix[15] + 
             matrix[8]  * matrix[7] * matrix[13] + 
             matrix[12] * matrix[5] * matrix[11] - 
             matrix[12] * matrix[7] * matrix[9];

    invMat[12] = -matrix[4]  * matrix[9] * matrix[14] + 
               matrix[4]  * matrix[10] * matrix[13] +
               matrix[8]  * matrix[5] * matrix[14] - 
               matrix[8]  * matrix[6] * matrix[13] - 
               matrix[12] * matrix[5] * matrix[10] + 
               matrix[12] * matrix[6] * matrix[9];

    invMat[1] = -matrix[1]  * matrix[10] * matrix[15] + 
              matrix[1]  * matrix[11] * matrix[14] + 
              matrix[9]  * matrix[2] * matrix[15] - 
              matrix[9]  * matrix[3] * matrix[14] - 
              matrix[13] * matrix[2] * matrix[11] + 
              matrix[13] * matrix[3] * matrix[10];

    invMat[5] = matrix[0]  * matrix[10] * matrix[15] - 
             matrix[0]  * matrix[11] * matrix[14] - 
             matrix[8]  * matrix[2] * matrix[15] + 
             matrix[8]  * matrix[3] * matrix[14] + 
             matrix[12] * matrix[2] * matrix[11] - 
             matrix[12] * matrix[3] * matrix[10];

    invMat[9] = -matrix[0]  * matrix[9] * matrix[15] + 
              matrix[0]  * matrix[11] * matrix[13] + 
              matrix[8]  * matrix[1] * matrix[15] - 
              matrix[8]  * matrix[3] * matrix[13] - 
              matrix[12] * matrix[1] * matrix[11] + 
              matrix[12] * matrix[3] * matrix[9];

    invMat[13] = matrix[0]  * matrix[9] * matrix[14] - 
              matrix[0]  * matrix[10] * matrix[13] - 
              matrix[8]  * matrix[1] * matrix[14] + 
              matrix[8]  * matrix[2] * matrix[13] + 
              matrix[12] * matrix[1] * matrix[10] - 
              matrix[12] * matrix[2] * matrix[9];

    invMat[2] = matrix[1]  * matrix[6] * matrix[15] - 
             matrix[1]  * matrix[7] * matrix[14] - 
             matrix[5]  * matrix[2] * matrix[15] + 
             matrix[5]  * matrix[3] * matrix[14] + 
             matrix[13] * matrix[2] * matrix[7] - 
             matrix[13] * matrix[3] * matrix[6];

    invMat[6] = -matrix[0]  * matrix[6] * matrix[15] + 
              matrix[0]  * matrix[7] * matrix[14] + 
              matrix[4]  * matrix[2] * matrix[15] - 
              matrix[4]  * matrix[3] * matrix[14] - 
              matrix[12] * matrix[2] * matrix[7] + 
              matrix[12] * matrix[3] * matrix[6];

    invMat[10] = matrix[0]  * matrix[5] * matrix[15] - 
              matrix[0]  * matrix[7] * matrix[13] - 
              matrix[4]  * matrix[1] * matrix[15] + 
              matrix[4]  * matrix[3] * matrix[13] + 
              matrix[12] * matrix[1] * matrix[7] - 
              matrix[12] * matrix[3] * matrix[5];

    invMat[14] = -matrix[0]  * matrix[5] * matrix[14] + 
               matrix[0]  * matrix[6] * matrix[13] + 
               matrix[4]  * matrix[1] * matrix[14] - 
               matrix[4]  * matrix[2] * matrix[13] - 
               matrix[12] * matrix[1] * matrix[6] + 
               matrix[12] * matrix[2] * matrix[5];

    invMat[3] = -matrix[1] * matrix[6] * matrix[11] + 
              matrix[1] * matrix[7] * matrix[10] + 
              matrix[5] * matrix[2] * matrix[11] - 
              matrix[5] * matrix[3] * matrix[10] - 
              matrix[9] * matrix[2] * matrix[7] + 
              matrix[9] * matrix[3] * matrix[6];

    invMat[7] = matrix[0] * matrix[6] * matrix[11] - 
             matrix[0] * matrix[7] * matrix[10] - 
             matrix[4] * matrix[2] * matrix[11] + 
             matrix[4] * matrix[3] * matrix[10] + 
             matrix[8] * matrix[2] * matrix[7] - 
             matrix[8] * matrix[3] * matrix[6];

    invMat[11] = -matrix[0] * matrix[5] * matrix[11] + 
               matrix[0] * matrix[7] * matrix[9] + 
               matrix[4] * matrix[1] * matrix[11] - 
               matrix[4] * matrix[3] * matrix[9] - 
               matrix[8] * matrix[1] * matrix[7] + 
               matrix[8] * matrix[3] * matrix[5];

    invMat[15] = matrix[0] * matrix[5] * matrix[10] - 
              matrix[0] * matrix[6] * matrix[9] - 
              matrix[4] * matrix[1] * matrix[10] + 
              matrix[4] * matrix[2] * matrix[9] + 
              matrix[8] * matrix[1] * matrix[6] - 
              matrix[8] * matrix[2] * matrix[5];

    let det = matrix[0] * invMat[0] + matrix[1] * invMat[4] + matrix[2] * invMat[8] + matrix[3] * invMat[12];

    if (det == 0)
        return null;

    det = 1.0 / det;

    for (var i = 0; i < 16; i++){
        result[i] = invMat[i] * det;
        if (result[i] == -0){
            result[i] = 0;
        }
    }


    return result;
}

/*Transpose a matrix*/
export function transposeMatrix(matrix) {
    if (matrix.length == 16){
        let result = new Float32Array(16)
        result[0] = matrix[0]
        result[1] = matrix[4]
        result[2] = matrix[8]
        result[3] = matrix[12]
        result[4] = matrix[1]
        result[5] = matrix[5]
        result[6] = matrix[9]
        result[7] = matrix[13]
        result[8] = matrix[2]
        result[9] = matrix[6]
        result[10] = matrix[10]
        result[11] = matrix[14]
        result[12] = matrix[3]
        result[13] = matrix[7]
        result[14] = matrix[11]
        result[15] = matrix[15]
        return result;
    } else if (Array.isArray(matrix) == false) {
        console.error("Invalid datatype. "+matrix+" is not an array")
        return null
    } else {
        console.error("Invalid dimension")
    }
    
}

/*Rotation matrix X Axis*/
export function rotateX(matrix, angle) {
    if (matrix.length !== 16) {
        console.error("Invalid matrix dimension.");
        return null;
    } else if (typeof(angle) != "number") {
        console.error("Invalid datatype for angle "+typeof(angle)+". 'Angle' must be of datatype 'number'.")
        return null;
    } else if (Array.isArray(matrix) == false) {
        console.error("Invalid datatype rotateX() expected an array, but was given "+typeof(matrix))
    }
    const rotateMat = identity(4)
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    rotateMat[5] = c
    rotateMat[6] = s
    rotateMat[9] = -s
    rotateMat[10] = c
    return multiplyMatrices(matrix, rotateMat)
}

/*Rotation matrix Y Axis*/
export function rotateY(matrix, angle) {
    if (matrix.length !== 16) {
        console.error("Invalid matrix dimension.");
        return null;
    } else if (typeof(angle) != "number") {
        console.error("Invalid datatype for angle "+typeof(angle)+". 'Angle' must be of datatype 'number'.")
        return null;
    } else if (Array.isArray(matrix) == false) {
        console.error("Invalid datatype rotateY() expected an array, but was given "+typeof(matrix))
    }
    const rotateMat = identity(4)
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    rotateMat[0] = c
    rotateMat[2] = -s
    rotateMat[8] = s
    rotateMat[10] = c
    return multiplyMatrices(matrix, rotateMat)
}

/*Rotation matrix Z Axis*/
export function rotateZ(matrix, angle) {
    if (matrix.length !== 16) {
        console.error("Invalid matrix dimension.");
        return null;
    } else if (typeof(angle) != "number") {
        console.error("Invalid datatype for angle "+typeof(angle)+". 'Angle' must be of datatype 'number'.")
        return null;
    } else if (Array.isArray(matrix) == false) {
        console.error("Invalid datatype rotateZ(...) expected an array, but was given "+typeof(matrix))
    }
    const rotateMat = identity(4)
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    rotateMat[0] = c
    rotateMat[1] = s
    rotateMat[4] = -s
    rotateMat[5] = c
    return multiplyMatrices(matrix, rotateMat)
}

/*Scale matrix*/
export function scaleMatrix(matrix, scalar) {
    if (matrix.length !== 16) {
        console.error("Invalid matrix dimension.");
        return null;
    } else if (Array.isArray(matrix) == false) {
        console.error("Invalid datatype scaleMatrix(...) expected an array, but was given "+typeof(matrix))
    }
    let scaleMat = identity(4);
        scaleMat[0] = scalar[0];
        scaleMat[5] = scalar[1];
        scaleMat[10] = scalar[2];
        return multiplyMatrices(scaleMat, matrix);
}

/*subtract vectors*/
export function vecSubtract(v1, v2) {
    if (v1.length != v2.length) {
        console.error("Vectors must be of equal length")
        return null
    }
    let result = new Float32Array(3);
    result[0] = v1[0] - v2[0];
    result[1] = v1[1] - v2[1];
    result[2] = v1[2] - v2[2];
    return result;
}

/*Normalize vector*/
export function vecNormalize(v) {
    if (v.constructor == Float32Array) {
        let result = new Float32Array(3)
        let vLength = ((v[0]) ** 2 + (v[1]) ** 2 + (v[2]) ** 2) ** (1 / 2)
        result[0] = v[0] / vLength
        result[1] = v[1] / vLength
        result[2] = v[2] / vLength
        return result
    } else {
        console.error("vecNormalize was given incorrect data type")
        return null
    }
    
}

/*length of a vector*/
export function vecLength(v) {
    if (ArrayBuffer.isView(v) == false) {
        console.error("vecLength expected an array, but was given "+typeof(v))
    }
    return (v[0] ** 2 + v[1] ** 2 + v[2] ** 2) ** (1 / 2)
    
}

/*Multiply vector and scalar*/
export function vecMultiply(vector, factor) {
    if (vector.constructor == !Float32Array) {
        console.error("vecMultiply expected an array, but was given "+typeof(v))
        return null
    } else if (typeof(factor) != "number")  {
        console.error("Invalid datatype for factor, expected 'number' but was given "+typeof(factor))
        return null
    }
    let result = new Float32Array(3)
    for (var i=0; i < vector.length; i++){
        result[i] = vector[i] * factor
    }
    return result
}

/*Scalar product of 2 vectors*/
export function vecScalar(v1, v2) {
    if (v1.constructor == !Float32Array || v2.constructor == !Float32Array) {
        console.error("Invalid datatype, vecScalar expected two arrays but was given "+typeof(v1)+" and "+typeof(v2))
        return null
    } else if (v1.length != v2.length){
        console.error("Vectors are not of equal dimensions")
        return null
    }
    let sum = 0
    for (var i=0; i<v1.length; i++) {
        sum += v1[i] * v2[i]
    }
    return sum
}

/*Cross product of 2 vectors of dim=3*/
export function vectorCross(v1, v2) {
    if (v1.length != v2.length){
        console.error("Vectors are not of equal dimensions")
        return null
    } else if (v1.constructor == !Float32Array || v2.constructor == !Float32Array) {
        console.error("Invalid datatype, vectorCross expected two arrays but was given "+typeof(v1)+" and "+typeof(v2))
        return null
    }
    let result = new Float32Array(3)
    result[0] = v1[1] * v2[2] - v1[2] * v2[1];
    result[1] = v1[2] * v2[0] - v1[0] * v2[2];
    result[2] = v1[0] * v2[1] - v1[1] * v2[0];
    return result;
}

/*Create lookAt Matrix*/
export function lookAt(out, eye, look, up) {
    let n = vecNormalize(vecSubtract(eye, look))
    let u = vecNormalize(vectorCross(up, n));
    let v = vecNormalize(vectorCross(n, u));
    let lookAtMatrix = identity(4);
    out[0] = u[0];
    out[1] = v[0];
    out[2] = n[0];
    out[3] = 0;

    out[4] = u[1];
    out[5] = v[1];
    out[6] = n[1];
    out[7] = 0;

    out[8] = u[2];
    out[9] = v[2];
    out[10] = n[2];
    out[11] = 0;

    out[12] = vecScalar(vecMultiply(u, -1), eye);
    out[13] = vecScalar(vecMultiply(v, -1), eye);
    out[14] = vecScalar(vecMultiply(n, -1), eye);
    out[15] = 1;
    return out;
}
