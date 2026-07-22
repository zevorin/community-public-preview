// Adapted for this static page from React Bits' Threads WebGL background.
(() => {
  const canvas = document.querySelector(".tutorial-threads-bg");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power"
  });
  if (!gl) {
    canvas.hidden = true;
    return;
  }

  const vertexSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform vec3 uColor;
    uniform float uAmplitude;
    uniform float uDistance;
    uniform vec2 uMouse;

    const int u_line_count = 40;
    const float u_line_width = 7.0;
    const float u_line_blur = 10.0;

    float Perlin2D(vec2 P) {
      vec2 Pi = floor(P);
      vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
      vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
      Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
      Pt += vec2(26.0, 161.0).xyxy;
      Pt *= Pt;
      Pt = Pt.xzxz * Pt.yyww;
      vec4 hash_x = fract(Pt * (1.0 / 951.135664));
      vec4 hash_y = fract(Pt * (1.0 / 642.949883));
      vec4 grad_x = hash_x - 0.49999;
      vec4 grad_y = hash_y - 0.49999;
      vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
      grad_results *= 1.4142135623730950;
      vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
        * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
      vec4 blend2 = vec4(blend, vec2(1.0 - blend));
      return dot(grad_results, blend2.zxzx * blend2.wwyy);
    }

    float pixel(float count, vec2 resolution) {
      return (1.0 / max(resolution.x, resolution.y)) * count;
    }

    float lineFn(vec2 st, float width, float perc, vec2 mouse, float time, float amplitude, float distance) {
      float split_point = 0.1 + (perc * 0.4);
      float amplitude_normal = smoothstep(split_point, 0.7, st.x);
      float finalAmplitude = amplitude_normal * 0.5 * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);
      float time_scaled = time / 10.0 + (mouse.x - 0.5);
      float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;
      float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
      );
      float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;
      float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
      );
      float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
      );
      return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
      );
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      float line_strength = 1.0;
      for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
          uv,
          u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
          p,
          uMouse,
          iTime,
          uAmplitude,
          uDistance
        ));
      }
      float colorVal = 1.0 - line_strength;
      gl_FragColor = vec4(uColor * colorVal, colorVal);
    }
  `;

  const createShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    canvas.hidden = true;
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.hidden = true;
    gl.deleteProgram(program);
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  gl.useProgram(program);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time: gl.getUniformLocation(program, "iTime"),
    resolution: gl.getUniformLocation(program, "iResolution"),
    color: gl.getUniformLocation(program, "uColor"),
    amplitude: gl.getUniformLocation(program, "uAmplitude"),
    distance: gl.getUniformLocation(program, "uDistance"),
    mouse: gl.getUniformLocation(program, "uMouse")
  };

  const amplitude = Number.parseFloat(canvas.dataset.amplitude) || 4;
  const distance = Number.parseFloat(canvas.dataset.distance) || 1;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const maxRenderDimension = 1600;
  let frame = 0;
  let isVisible = !document.hidden;

  const resize = () => {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
    const longestSide = Math.max(width, height) * baseDpr;
    const dpr = longestSide > maxRenderDimension
      ? (baseDpr * maxRenderDimension) / longestSide
      : baseDpr;
    const nextWidth = Math.max(1, Math.round(width * dpr));
    const nextHeight = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      gl.viewport(0, 0, nextWidth, nextHeight);
    }
  };

  const render = (time = 0) => {
    resize();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(uniforms.time, time * 0.001);
    gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, canvas.width / canvas.height);
    gl.uniform3f(uniforms.color, 244 / 255, 201 / 255, 93 / 255);
    gl.uniform1f(uniforms.amplitude, amplitude);
    gl.uniform1f(uniforms.distance, distance);
    gl.uniform2f(uniforms.mouse, 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const animate = (time) => {
    if (isVisible) render(time);
    frame = window.requestAnimationFrame(animate);
  };

  const handleVisibility = () => {
    isVisible = !document.hidden;
  };

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("resize", resize, { passive: true });

  if (reduceMotion) {
    render(0);
  } else {
    frame = window.requestAnimationFrame(animate);
  }

  window.addEventListener("pagehide", () => {
    if (frame) window.cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("resize", resize);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  }, { once: true });
})();
