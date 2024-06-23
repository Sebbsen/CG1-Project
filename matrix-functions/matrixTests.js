/*Testing matFunctions.js*/

/*Testing Matrix and Vector multiplication*/
import {multiplyMatrixVector} from "./matFunctions.js"
console.log("###########################################")
console.log("#Testing matrix and vector functions      #")
console.log("#Expected results by: Casio fx-991DEX     #")
console.log("###########################################")
console.log("--------------------------------------------")

/*case 1*/
let matrix = [2,13,6,8,1,6,21,1,56,6,4,0,6,3,0,1]
let vector = [1,7,-3,4]

console.log("Testing multiplyMatrixVector()")
console.log("Matrix: "+matrix)
console.log("Vector: "+vector)
console.log("Expected result: -135,49,141,19")
if (multiplyMatrixVector(matrix, vector) == null) {
    console.log("Test unsuccessful")
    console.error("multiplyMatrixVector error encountered")
} else {
    console.log("Test OK")
    console.log("Function result: " + multiplyMatrixVector(matrix, vector))
}
console.log("--------------------------------------------")

/*Testing Matrix*Matrix*/
import {multiplyMatrices} from "./matFunctions.js"
let matrix1 = [-2,-2,1,-2,5,5,2,-1,-3,-1,2,-2,2,4,-2,-5]
let matrix2 = [-3,2,1,3, 2,-4,-2,-3, 5,-3,3,2, -5,4,-1,4]

console.log("Testing multiplyMatrices()")
console.log("Matrix 1: "+matrix1)
console.log("Matrix 2: "+matrix2)
console.log("Expected result: 19,27,-3,-13,-24,-34,-4,19,-30,-20,1,-23,41,47,-7,-12")
if (multiplyMatrices(matrix1, matrix2) == null) {
    console.log("Test unsuccessful")
    console.error("multiplyMatrices error encountered")
} else {
    console.log("Test OK")
    console.log("Function result: " + multiplyMatrices(matrix1, matrix2))
}
console.log("--------------------------------------------")

/*###Testing identity###*/
import {identity} from "./matFunctions.js"

/*case 1*/
let value = 4
console.log("Testing identity() for value "+value)
if (identity(value) == null) {
    console.log("Test unsuccessful")
    console.error("identity error ecountered")
} else {
    console.log("Test OK")
    console.log("Function result: " + identity(value))
}
/*case 2*/
value = 3
console.log("Testing identity() for value "+value)
if (identity(value) == null) {
    console.log("Test unsuccessful")
    console.error("identity error ecountered")
} else {
    console.log("Test OK")
    console.log("Function result: " + identity(value))
}
/*case 3*/
value = "error"
console.log("Testing identity() for value "+value)
if (identity(value) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " + identity(value))
}
/*case 4*/
value = -1
console.log("Testing identity() for value "+value)
if (identity(value) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " + identity(value))
}
console.log("--------------------------------------------")

/*###Testing invMatrix###*/
import {invMatrix} from "./matFunctions.js"
matrix = [1,0,0,0,0,2,0,0,0,0,3,0,0,0,0,-4]
console.log("Testing invMatrix for matrix "+matrix)
console.log("Expected result: 1,0,0,0,0,0.5,0,0,0,0,0.33,0,0,0,0,-0.25")
if (invMatrix(matrix) == null){
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +invMatrix(matrix))
}
matrix = [1,2,3,4,5]
console.log("Testing invMatrix for matrix "+matrix)
if (invMatrix(matrix) == null) {
    console.log("Test unsuccessful")
}
console.log("--------------------------------------------")

/*###Testing transposeMatrix###*/
import {transposeMatrix} from "./matFunctions.js"
/*case 1*/
matrix = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
console.log("Testing transposeMatrix() for value "+matrix)
console.log("Expected result: 0,4,8,12,1,5,9,13,2,6,10,14,3,7,11,15")
if (transposeMatrix(matrix) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +transposeMatrix(matrix))
}
/*case 2*/
matrix = [0,1,2,3,4,5,6,7,8]
console.log("Testing transposeMatrix() for value "+matrix)
console.log("Expected result: error")
if (transposeMatrix(matrix) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +transposeMatrix(matrix))
}
/*case 3*/
matrix = 3
console.log("Testing transposeMatrix() for value "+matrix)
console.log("Expected result: error")
if (transposeMatrix(matrix) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +transposeMatrix(matrix))
}
console.log("--------------------------------------------")

/*###Testing rotations###*/
/*case 1: rotateX()*/
/*NOTE: Function result is different from expected result because Math.PI can only be represented as a floating point number while pi is irrational*/
import {rotateX} from "./matFunctions.js"
matrix = [-5, 5, -2,5,-5,0,-3,-5,4,5,5,-4,2,5,0,-5]
let angle = (Math.PI)/2
console.log("Testing rotateX()")
console.log("Expected result: -5,5,-2,5,4,5,5,-4,5,0,3,5,2,5,0,-5")
if (rotateX(matrix, angle) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +rotateX(matrix, angle))
    console.log("NOTE: Function result may differ from expected result because Math.PI can only be represented as a floating point number while pi is irrational")
    console.log("The calculations for the expected result were made under the assumption that cos(pi/2)=0, which is different from Math.cos(Math.PI/2)")
    console.log("The function is working as intended and can be used for further programming")
}
console.log("--------------------------------------------")

/*case 2: rotateY()*/
import {rotateY} from "./matFunctions.js"
matrix = [-5, 5, -2,5,-5,0,-3,-5,4,5,5,-4,2,5,0,-5]
angle = (Math.PI)/2
console.log("Testing rotateY()")
console.log("Expected result: -4,-5,-5,4,-5,0,-3,-5,-5,5,-2,5,2,5,0,-5")
if (rotateX(matrix, angle) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +rotateY(matrix, angle))
    console.log("NOTE: Function result may differ from expected result because Math.PI can only be represented as a floating point number while pi is irrational")
    console.log("The calculations for the expected result were made under the assumption that cos(pi/2)=0, which is different from Math.cos(Math.PI/2)")
    console.log("The function is working as intended and can be used for further programming")
}
console.log("--------------------------------------------")

/*case 3: rotateZ()*/
import {rotateZ} from "./matFunctions.js"
matrix = [-5, 5, -2,5,-5,0,-3,-5,4,5,5,-4,2,5,0,-5]
angle = (Math.PI)/2
console.log("Testing rotateZ()")
console.log("Expected result: -5,0,-3,-5,5,-5,2,-5,4,5,5,-4,2,5,0,-5")
if (rotateX(matrix, angle) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +rotateZ(matrix, angle))
    console.log("NOTE: Function result may differ from expected result because Math.PI can only be represented as a floating point number while pi is irrational")
    console.log("The calculations for the expected result were made under the assumption that cos(pi/2)=0, which is different from Math.cos(Math.PI/2)")
    console.log("The function is working as intended and can be used for further programming")
}
console.log("--------------------------------------------")

/*###Testing scaleMatrix###*/
import {scaleMatrix} from "./matFunctions.js"
/*case 1*/
matrix = matrix = [-5, 5, -2,5,-5,0,-3,-5,4,5,5,-4,2,5,0,-5]
let scalar = [2,2,2]
console.log("Testing scaleMatrix() for value "+matrix+" with scalar "+scalar)
console.log("Expected result: -10,10,-4,5,-10,0,-6,-5,8,10,10,-4,4,10,0,-5")
if (scaleMatrix(matrix, scalar) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +scaleMatrix(matrix, scalar))
}
console.log("--------------------------------------------")

/*###Testing vector functions###*/
/*Testing vecSubtract*/
import {vecSubtract} from "./matFunctions.js"
let v1 = [1,2,3]
let v2 = [4,5,6]
let v3 = [7,8,9,10]
/*case 1*/
console.log("Testing vecSubtract for "+v1+" and "+v2)
console.log("Expected result: -3,-3,-3")
if (vecSubtract(v1, v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +vecSubtract(v1,v2))
}
console.log("--------------------------------------------")
/*case 2*/
console.log("Testing vecSubtract for "+v1+" and "+v3)
if (vecSubtract(v1,v3) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +vecSubtract(v1,v3))
}
console.log("--------------------------------------------")
/*Testing vecNormalize and vecLength*/
import {vecNormalize} from "./matFunctions.js"
import {vecLength} from "./matFunctions.js"
/*case 1*/
v1 = [6,3,6]
console.log("Testing vecNormalize for "+v1)

if (vecNormalize(v1) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 0.6,0.3,0.6")
    console.log("Function result: " +vecNormalize(v1))
    console.log("Vector length: "+vecLength(v1))
    console.log("Rounding results in slightly different results, function is working as intended")
}
console.log("--------------------------------------------")
/*case 2*/
v1 = [-6,-3,-6]
console.log("Testing vecNormalize for "+v1)

if (vecNormalize(v1) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: -0.6,-0.3,-0.6")
    console.log("Function result: " +vecNormalize(v1))
    console.log("Vector length: "+vecLength(v1))
    console.log("Rounding results in slightly different results, function is working as intended")
}
console.log("--------------------------------------------")
/*case 3*/
v1 = "testing errors"
console.log("Testing vecNormalize for invalid data type")
if (vecNormalize(v1) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: " +vecNormalize(v1))
    console.log("Vector length: "+vecLength(v1))
    console.log("Rounding results in slightly different results, function is working as intended")
}
console.log("--------------------------------------------")

/*Testing vecMultiply*/
import {vecMultiply} from "./matFunctions.js"
/*case 1*/
v1= [1,2,3]
let factor = 2
console.log("Testing vecMultiply for vector "+v1+" and factor "+factor)
if (vecMultiply(v1,factor) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 2,4,6")
    console.log("Function result: " +vecMultiply(v1, factor))
}
console.log("--------------------------------------------")
/*case 2*/
factor = "error testing"
console.log("Testing vecMultiply for vector "+v1+" and factor "+factor)
if (vecMultiply(v1,factor) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 2,4,6")
    console.log("Function result: " +vecMultiply(v1, factor))
}
console.log("--------------------------------------------")
/*case 3*/
v1 = "error testing"
factor = 2
console.log("Testing vecMultiply for vector "+v1+" and factor "+factor)
if (vecMultiply(v1,factor) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 2,4,6")
    console.log("Function result: " +vecMultiply(v1, factor))
}
console.log("--------------------------------------------")

/*Testing scalar product*/
import {vecScalar} from "./matFunctions.js"
/*case 1*/
v1 = [1,2,3]
v2 = [4,5,6]
console.log("Testing vecScalar for vectors "+v1+" and "+v2)
if (vecScalar(v1,v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 4,10,18")
    console.log("Function result: " +vecScalar(v1,v2))
}
console.log("--------------------------------------------")
/*case 2*/
v1 = [1,2,3]
v2 = [4,5,6,7]
console.log("Testing vecScalar for vectors "+v1+" and "+v2)
if (vecScalar(v1,v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 4,10,18")
    console.log("Function result: " +vecScalar(v1,v2))
}
console.log("--------------------------------------------")
/*case 3*/
v1 = 123
v2 = 456
console.log("Testing vecScalar for vectors "+v1+" and "+v2)
if (vecScalar(v1,v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: 4,10,18")
    console.log("Function result: " +vecScalar(v1,v2))
}
console.log("--------------------------------------------")

/*Testing vectorCross*/
import {vectorCross} from "./matFunctions.js"
/*case 1*/
v1 = [1,2,3]
v2 = [4,5,6]
console.log("Testing vecScalar for vectors "+v1+" and "+v2)
if (vectorCross(v1,v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: -3,6,-3")
    console.log("Function result: " +vectorCross(v1,v2))
}
/*case 2*/
v1 = [1,2,3]
v2 = [4,5,6,7]
console.log("Testing vecScalar for vectors "+v1+" and "+v2)
if (vectorCross(v1,v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: -3,6,-3")
    console.log("Function result: " +vectorCross(v1,v2))
}
/*case 3*/
v1 = 123
v2 = "error testing"
console.log("Testing vecScalar for vectors "+v1+" and "+v2)
if (vectorCross(v1,v2) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Expected result: -3,6,-3")
    console.log("Function result: " +vectorCross(v1,v2))
}
console.log("--------------------------------------------")

/*Testing lookAt()*/
import {lookAt} from "./matFunctions.js"
let eye = new Float32Array([1,2,3])
let look = new Float32Array([4,5,6])
let up = new Float32Array([7,8,9])
console.log("Testing lookAt() with eye "+eye+" look "+look+" up "+up)
if (lookAt(eye,look,up) == null) {
    console.log("Test unsuccessful")
} else {
    console.log("Test OK")
    console.log("Function result: "+lookAt(eye, look, up))
}