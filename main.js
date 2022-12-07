const { Float16BufferAttribute } = require("three");

function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        // Face A       // Red
        -1, -1, -1,     1, 0, 0,    0, 0, -1,    // Index:  0    
         1, -1, -1,     1, 0, 0,    0, 0, -1,    // Index:  1
         1,  1, -1,     1, 0, 0,    0, 0, -1,    // Index:  2
        -1,  1, -1,     1, 0, 0,    0, 0, -1,    // Index:  3
        // Face B       // Yellow
        -1, -1,  1,     1, 1, 0,    0, 0, 1,    // Index:  4
         1, -1,  1,     1, 1, 0,    0, 0, 1,    // Index:  5
         1,  1,  1,     1, 1, 0,    0, 0, 1,    // Index:  6
        -1,  1,  1,     1, 1, 0,    0, 0, 1,    // Index:  7
        // Face C       // Green
        -1, -1, -1,     0, 1, 0,    -1, 0, 0,    // Index:  8
        -1,  1, -1,     0, 1, 0,    -1, 0, 0,   // Index:  9
        -1,  1,  1,     0, 1, 0,    -1, 0, 0,    // Index: 10
        -1, -1,  1,     0, 1, 0,    -1, 0, 0,    // Index: 11
        // Face D       // Blue
         1, -1, -1,     0, 0, 1,    1, 0, 0,    // Index: 12
         1,  1, -1,     0, 0, 1,    1, 0, 0,    // Index: 13
         1,  1,  1,     0, 0, 1,    1, 0, 0,    // Index: 14
         1, -1,  1,     0, 0, 1,    1, 0, 0,    // Index: 15
        // Face E       // Orange
        -1, -1, -1,     1, 0.5, 0,  0, -1, 0,  // Index: 16
        -1, -1,  1,     1, 0.5, 0,  0, -1, 0,  // Index: 17
         1, -1,  1,     1, 0.5, 0,  0, -1, 0,  // Index: 18
         1, -1, -1,     1, 0.5, 0,  0, -1, 0,  // Index: 19
        // Face F       // White
        -1,  1, -1,     1, 1, 1,    0, 1, 0,    // Index: 20
        -1,  1,  1,     1, 1, 1,    0, 1, 0,    // Index: 21
         1,  1,  1,     1, 1, 1,    0, 1, 0,    // Index: 22
         1,  1, -1,     1, 1, 1,    0, 1, 0     // Index: 23
    ];

    var indices = [
        0, 1, 2,     0, 2, 3,     // Face A
        4, 5, 6,     4, 6, 7,     // Face B
        8, 9, 10,    8, 10, 11,   // Face C
        12, 13, 14,  12, 14, 15,  // Face D
        16, 17, 18,  16, 18, 19,  // Face E
        20, 21, 22,  20, 22, 23   // Face F     
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Vertex shader
    var vertexShaderCode = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute vec3 aNormal;
    varying vec3 fragColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    void main(){
        fragColor = aColor;
        vNormal = aNormal;
        gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
        vPosition = (uModel * vec4(aPosition, 1.0)).xyz;
    }
    `;

    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); 

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 fragColor;
    uniform vec3 uLightConstant;      // merepresentasikan warna sumber cahaya
    uniform float uAmbientIntensity;    // merepresentasikan intensitas cahaya sekitar
    varying vec3 vNormal;
    varying vec3 vPosition;             // titik fragmen
    uniform vec3 uLightPosition;        // titik lokasi sumber cahaya
    uniform vec3 uViewerPosition;       // titik lokasi mata atau kamera pengamat
    uniform vec3 uLightDirection;       // vektor arah datang sumber cahaya
    uniform mat3 uNormalModel;
    void main() {
        vec3 ambient = uLightConstant * uAmbientIntensity;
        vec3 lightRay = vPosition - uLightPosition;
        vec3 normalizedLight = normalize(-uLightDirection);  // diffuse directional light
        //vec3 normalizedLight = normalize(-lightRay);            // diffuse point light
        vec3 normalizedNormal = normalize(uNormalModel * vNormal);
        float cosTheta = dot(normalizedNormal, normalizedLight);
        vec3 diffuse = vec3(0.0, 0.0, 0.0);
        if (cosTheta > 0.0) {
            float diffuseIntensity = cosTheta;
            diffuse = uLightConstant * diffuseIntensity;
        }
        vec3 normalizedReflector = normalize(reflect(lightRay, normalizedNormal));
        vec3 normalizedViewer = normalize(uViewerPosition - vPosition);
        float cosPhi = dot(normalizedReflector, normalizedViewer);
        vec3 specular = vec3(0.0, 0.0, 0.0);
        if (cosPhi > 0.0) {
            float shininessConstant = 100.0;    // batas minimum spesifikasi spekular untuk materi logam
            float specularIntensity = pow(cosPhi, shininessConstant);
            specular = uLightConstant * specularIntensity;
        }
        vec3 phong = ambient + diffuse + specular;
        gl_FragColor = vec4(phong * fragColor, 1.0);
    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject); 

    var shaderProgram = gl.createProgram(); // wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Variabel lokal
    var theta = 0.0;
    var horizontal = 0.0;
    var vertical = 0.0;
    var horizontalPoints = 0.0;
    var verticalPoints = 0.0;
    var sumbuZ = 0.0;
    var sumbuZPoints = 0.0;

    // Variabel pointer ke GLSL
    var uModel = gl.getUniformLocation(shaderProgram, "uModel");
    // View
    // var cameraX = 0.0;
    // var cameraZ = 5.0;
    var camera = [0.0, 0.0, 5.0];
    var uView = gl.getUniformLocation(shaderProgram, "uView");
    var view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        camera,                    // the location of the eye or the camera
        [camera[0], 0.0, -10],        // the point where the camera look at
        [0.0, 1.0, 0.0]
    );
    // Projection
    var uProjection = gl.getUniformLocation(shaderProgram, "uProjection");
    var perspective = glMatrix.mat4.create();
    glMatrix.mat4.perspective(perspective, Math.PI/3, 1.0, 0.5, 10.0);

    // mengajari GPU bagaimana cara mengoleksi nilai posisi dari ARRAY_BUFFER
    // untuk setiap vertex yang sedang diproses
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    var aNormal = gl.getAttribLocation(shaderProgram, "aNormal");
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 9 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aNormal);

    // untuk pencahayaan dan pembayangan
    var uLightConstant = gl.getUniformLocation(shaderProgram, "uLightConstant");
    var uAmbientIntensity = gl.getUniformLocation(shaderProgram, "uAmbientIntensity");
    gl.uniform3fv(uLightConstant, [1.0, 0.5, 1.0]);     // warna sumber cahaya : orange
    gl.uniform1f(uAmbientIntensity, 0.358);               // intensitas cahaya : 0.058 + 0.300
    var uLightPosition= gl.getUniformLocation(shaderProgram, "uLightPosition");
    gl.uniform3fv(uLightPosition, [2.0, 0.0, 0.0]);
    var uNormalModel = gl.getUniformLocation(shaderProgram, "uNormalModel");
    var uViewerPosition = gl.getUniformLocation(shaderProgram, "uViewerPosition");
    gl.uniform3fv(uViewerPosition, camera);
    
    // grafik ai nteraktif
    var freeze = false;
    function onMouseClick(event){
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick, false);

    function onKeyUp(event){
        if (event.keyCode == 32) freeze = false;
        if (event.keyCode == 87) vertical = 0.0;
        if (event.keyCode == 83) vertical = 0.0;
        if (event.keyCode == 76) horizontal = 0.0;
        if (event.keyCode == 74) horizontal = 0.0;
        if (event.keyCode == 73) sumbuZ = 0.0;
        if (event.keyCode == 75) sumbuZ = 0.0;
    }
    document.addEventListener("keyup", onKeyUp, false);

    function onKeyDown(event){
        if (event.keyCode == 32) freeze = true;
        if (event.keyCode == 87) vertical = -0.01;
        if (event.keyCode == 83) vertical = 0.01;
        if (event.keyCode == 76) horizontal = 0.01;
        if (event.keyCode == 74) horizontal = -0.01;
        if (event.keyCode == 73) sumbuZ = 0.01;
        if (event.keyCode == 75) sumbuZ = -0.01;
        if (event.keyCode == 37) camera[0] -= 0.1;
        else if (event.keyCode == 39) camera[0] += 0.1;
        if (event.keyCode == 38) camera[1] -= 0.1;
        else if (event.keyCode == 40) camera[1] += 0.1;
        gl.uniform3fv(uViewerPosition, camera);
        glMatrix.mat4.lookAt(view, camera, [camera[0], camera[1], -10.0], [0.0, 1.0, 0.0]);
    }
    document.addEventListener("keydown", onKeyDown, false);

    function render(){
        gl.enable(gl.DEPTH_TEST);
        // gl.clearColor(0.75, 0.75, 0.8, 1.0); // Merah, Hijau, Biru, Transparansi
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // hitam
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (!freeze) {
            theta += 0.01;
        }
        horizontalPoints += horizontal;
        verticalPoints -= vertical;
        sumbuZPoints -= sumbuZ;
        var model = glMatrix.mat4.create(); // Membuat matriks identitas
        glMatrix.mat4.translate(
            model, model, [horizontalPoints, verticalPoints, sumbuZPoints]
        );
        glMatrix.mat4.rotateX(
            model, model, theta
        );
        glMatrix.mat4.rotateY(
            model, model, theta
        );
        glMatrix.mat4.rotateZ(
            model, model, theta
        );
        gl.uniformMatrix4fv(uModel, false, model);
        // gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, perspective);
        var normalModel = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(normalModel, model);
        gl.uniformMatrix3fv(uNormalModel, false, normalModel);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(render);
    }
    // setInterval(render, 1000/60)
    // render()
    requestAnimationFrame(render);
}