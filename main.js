function main(){
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    //vertex shader
    var vertexShaderCode =
     "void main() {" +
     "}";
     var vertexShaderObject = gl.createShader(gl.VERTEX_SHEDER);
     gl.shaderSource(vertexShaderObject, vertexShaderCode);
     gl.compileShader(vertexShaderObject);  //sampai sini sudah menjadi .o


    //fragment shader
    var fragmentShaderCode = `
    void main() {

    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHEDER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);  //sampai sini sudah menjadi .o

    var shaderProgram = gl.createProgram();  // wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.clearColor(1.0,    0.65,   0.0,   1.0);
    //             merah  hijau  biru   Transparansi
    gl.clear(gl.COLOR_BUFFER_BIT);
}