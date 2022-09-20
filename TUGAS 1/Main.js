function main() {
    var kanvas = document.getElementById("kanvas");
    // var gl = kanvas.getContext("2d");
    var gl = kanvas.getContext("webgl");
    // kalo kita mau gambar di 3d, alat gambarnya webgl
    // gl = grafics library
  
    //   mendifinisikan shaders
    // shaders itu ada macem2.
    // shaders -> sebuah source code yg akan di-run oleh gpu
  
    // var vertices = [x1, y1, x2, y2, x3, y3];
    var vertices = [

      //Huruf O

      -0.80, 0.35,
      -0.87, 0.25,
      -0.54, 0.35,
      -0.47, 0.25,
      
      -0.54, 0.15,
      -0.47, -0.25,
      -0.54, -0.35,

      -0.47, -0.25,
      -0.80, -0.35,
      -0.80, -0.25,

      -0.80, -0.35,
      -0.87, -0.25,

      -0.80, 0.25,
      -0.87, 0.25,

      // Huruf H
        -0.35 , 0.35, //A 
        -0.35 , -0.35, // B
        -0.45 , -0.35, // C
        -0.45 , -0.35, // C
        -0.45, 0.35, // D
        -0.35 , 0.35, // A

        -0.2 , 0.05, //E 
        -0.2 , -0.05, //F
        -0.35 , -0.05, //G
        -0.35 , -0.05, //G
        -0.35 , 0.05, //H
        -0.2 , 0.05, //E

        -0.1, 0.35, //I
        -0.1, -0.35, //J
        -0.2, -0.35, //K
        -0.2, -0.35, //K
        -0.2, 0.35, //L
        -0.1, 0.35, //I

        //number 5 
          0.45, 0.35,
         0.1, 0.35,
         0.1, 0.05,
          0.45, 0.05,
          0.45, -0.35,
         0.1, -0.35,

         //Nomor 8
         0.8, 0.35,
         0.5, 0.35,
         0.5, 0.05,
         0.8, 0.05,
         0.8, -0.35,
         0.5, -0.35,
         0.5, 0.05,
         0.8, 0.05,
         0.8, 0.35,
      ];
  
    // buffer itu kayak pointernya. lokasi yg di gpu nya disimpan di buffer (?, cmiiw)
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
    // vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition;
    void main(){ 
      float x = aPosition.x;
      float y = aPosition.y;
      gl_PointSize = 10.0;
      //kita pake vec4 karena 4 dimensi (?)
      gl_Position = vec4(x, y, 0.0, 1.0);
      // gl_Position = vec4(aPosition.x, aPosition.y, 0.0, 1.0); //variasi
      // gl_Position = vec4(aPosition.xy, 0.0, 1.0); //variasi
    }`;
  
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject); //sampai sini udah jadi .o
  
    // itu gaya nulisnya doang yg beda y
    // fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    //klo kita mau make float, kita harus pake precision
      void main(){ 
        float r = 0.930;
        float g = 0.960;
        float b = 0.0576;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
      `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject); //sampai sini jadi .o
  
    var shaderProgram = gl.createProgram(); // wadah dari excecutable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram); //kita siap untuk menggambar (scr analogi)
  
    // kita ngajarin GPU gimana caranya mengoleksi
    // nilai posisi dari ARRAY_BUFFERuntuk setiap verteks yang sedang diproses
    gl.clearColor(0.790, 0.0790, 0.446, 1.0); //(merah, hijau, biru, transparansi)
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    //parameter stride (1 strade tu bisa mencakup banyak elemen. skrg datanya cuman 1, jd kita pake 0. g ngerti y? gpp)
    gl.enableVertexAttribArray(aPosition);
  
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    //gl.drawArrays(gl.POINTS, 0, 3); //(first -> dari index brp kita mau nulis datanya. count -> kita mau gambar/render brp kali)
    
    gl.drawArrays(gl.TRIANGLE_STRIP , 0, 14); //O
  
    
    gl.drawArrays(gl.TRIANGLES, 14, 6); //H
    gl.drawArrays(gl.TRIANGLES, 20, 6);
    gl.drawArrays(gl.TRIANGLES, 26, 6);

    gl.drawArrays(gl.LINE_STRIP, 32, 6); //5

    gl.drawArrays(gl.LINE_STRIP, 38, 9); // 8
    gl.drawArrays(gl.LINE_STRIP, 47, 2); // 8

  }