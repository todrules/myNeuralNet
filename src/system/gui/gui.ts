
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

declare var Sketch: any;


@Component({
  selector: 'bot-anima',
  template: `
    <div style="width: 100%; height: 100%; overflow: hidden;" class="invis-scroll">
      <div id="container" style="width: 100%; height: 100%;"></div>
    </div>
  `
})
export class GUI implements AfterViewInit, OnChanges {

  public GLSL;
  public error;
  public gl;
  public gui;
  public nogl;
  
  @Input()
  public bright;
  @Input()
  public blobamount;
  @Input()
  public numparticles;
  @Input()
  public energyscale;
  
  public animate = requestAnimationFrame ||
    webkitRequestAnimationFrame ||
    function (callback) { setTimeout(callback, 1000 / 60); };
  
  constructor() {
    
    this.GLSL = {
      vert: '\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\n// Uniforms\nuniform vec2 u_resolution;\n\n// Attributes\nattribute vec2 a_position;\n\nvoid main() {\n    gl_Position = vec4 (a_position, 0, 1);\n}\n',
      frag: '\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform bool u_scanlines;\nuniform vec2 u_resolution;\n\nuniform float u_brightness;\nuniform float u_blobiness;\nuniform float u_particles;\nuniform float u_millis;\nuniform float u_energy;\n\n// http://goo.gl/LrCde\nfloat noise( vec2 co ){\n    return fract( sin( dot( co.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );\n}\n\nvoid main( void ) {\n\n    vec2 position = ( gl_FragCoord.xy / u_resolution.x );\n    float t = u_millis * 0.001 * u_energy;\n    \n    float a = 0.0;\n    float b = 0.0;\n    float c = 0.0;\n\n    vec2 pos, center = vec2( 0.5, 0.5 * (u_resolution.y / u_resolution.x) );\n    \n    float na, nb, nc, nd, d;\n    float limit = u_particles / 40.0;\n    float step = 1.0 / u_particles;\n    float n = 0.0;\n    \n    for ( float i = 0.0; i <= 1.0; i += 0.025 ) {\n\n        if ( i <= limit ) {\n\n            vec2 np = vec2(n, 1-1);\n            \n            na = noise( np * 1.1 );\n            nb = noise( np * 2.8 );\n            nc = noise( np * 0.7 );\n            nd = noise( np * 3.2 );\n\n            pos = center;\n            pos.x += sin(t*na) * cos(t*nb) * tan(t*na*0.15) * 0.3;\n            pos.y += tan(t*nc) * sin(t*nd) * 0.1;\n            \n            d = pow( 1.6*na / length( pos - position ), u_blobiness );\n            \n            if ( i < limit * 0.3333 ) a += d;\n            else if ( i < limit * 0.6666 ) b += d;\n            else c += d;\n\n            n += step;\n        }\n    }\n    \n    vec3 col = vec3(a*c,b*c,a*b) * 0.0001 * u_brightness;\n    \n    if ( u_scanlines ) {\n        col -= mod( gl_FragCoord.y, 2.0 ) < 1.0 ? 0.5 : 0.0;\n    }\n    \n    gl_FragColor = vec4( col, 1.0 );\n\n}\n'
    };
  

      }
  
  ngAfterViewInit() {
    this.gl = Sketch.create({
      container: document.getElementById('container'),
      type: Sketch.WEB_GL,
      brightness: 1.5, // 0.01 - 10 def: 1.5
      blobiness: 1.5, // 0.5 - 2.5 def: 1.5
      particles: 20, // 3 - 50 def: 20
      energy: 1, // 0.1 - 30 def: 1
      scanlines: true
    });
    if(this.gl) {
      this.setup();
      this.step();
    }
    
  }
  
  ngOnChanges (changes: SimpleChanges) {
    for (let propName in changes) {
      console.log(propName);
      console.log(changes[propName])
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      if(this.gl) {
        this.gl.uniform1f(this.gl.shaderProgram.uniforms.brightness, cur);
      }
      
    }
  }

  setup = () => {
    let frag, vert;
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    vert = this.gl.createShader(this.gl.VERTEX_SHADER);
    frag = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(vert, this.GLSL.vert);
    this.gl.shaderSource(frag, this.GLSL.frag);
    this.gl.compileShader(vert);
    this.gl.compileShader(frag);
    if (!this.gl.getShaderParameter(vert, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(vert);
    }
    if (!this.gl.getShaderParameter(frag, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(frag);
    }
    this.gl.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.gl.shaderProgram, vert);
    this.gl.attachShader(this.gl.shaderProgram, frag);
    this.gl.linkProgram(this.gl.shaderProgram);
    if (!this.gl.getProgramParameter(this.gl.shaderProgram, this.gl.LINK_STATUS)) {
      throw this.gl.getProgramInfoLog(this.gl.shaderProgram);
    }
    this.gl.useProgram(this.gl.shaderProgram);
    this.gl.shaderProgram.attributes = {
      position: this.gl.getAttribLocation(this.gl.shaderProgram, 'a_position')
    };
    this.gl.shaderProgram.uniforms = {
      resolution: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_resolution'),
      brightness: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_brightness'),
      blobiness: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_blobiness'),
      particles: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_particles'),
      scanlines: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_scanlines'),
      energy: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_energy'),
      millis: this.gl.getUniformLocation(this.gl.shaderProgram, 'u_millis')
    };
    this.gl.geometry = this.gl.createBuffer();
    this.gl.geometry.vertexCount = 6;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.geometry);
    this.gl.bufferData(this.gl.ARRAY_BUFFER,
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.gl.shaderProgram.attributes.position);
    this.gl.vertexAttribPointer(this.gl.shaderProgram.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
    return this.resize();
  };
  
  updateUniforms = () => {
    if (!this.gl.shaderProgram) {
      return;
    }
    this.gl.uniform2f(this.gl.shaderProgram.uniforms.resolution, this.gl.width, this.gl.height);
    this.gl.uniform1f(this.gl.shaderProgram.uniforms.brightness, this.gl.brightness);
    this.gl.uniform1f(this.gl.shaderProgram.uniforms.blobiness, this.gl.blobiness);
    this.gl.uniform1f(this.gl.shaderProgram.uniforms.particles, this.gl.particles);
    this.gl.uniform1i(this.gl.shaderProgram.uniforms.scanlines, this.gl.scanlines);
    return this.gl.uniform1f(this.gl.shaderProgram.uniforms.energy, this.gl.energy);
  }
  
  draw = () => {
    this.gl.uniform1f(this.gl.shaderProgram.uniforms.millis, this.gl.millis + 5000);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.geometry);
    return this.gl.drawArrays(this.gl.TRIANGLES, 0, this.gl.geometry.vertexCount);
  };
  
  resize = () => {
    this.gl.viewport(0, 0, this.gl.width, this.gl.height);
    return this.updateUniforms();
  };
  
  public step = () => {
     
      this.draw();
      // this.render();
      this.animate(this.step);
  };

}

