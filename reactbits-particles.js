import { Renderer, Camera, Geometry, Program, Mesh } from "./vendor/ogl-1.0.11.mjs";

// Static-site adaptation of React Bits Particles:
// https://reactbits.dev/backgrounds/particles
// The official OGL geometry, shaders, and motion model are preserved while the
// React lifecycle wrapper is replaced with an explicit create/destroy API.

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex) => {
  const normalized = hex.replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((character) => character + character).join("")
    : normalized;
  const value = Number.parseInt(expanded.slice(0, 6), 16);

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255
  ];
};

const vertexShader = `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  uniform float uMinPointSize;
  uniform float uMaxPointSize;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    float distanceScale = max(length(mvPos.xyz), 1.0);
    float randomScale = 1.0 + uSizeRandomness * (random.x - 0.5);
    float pointSize = (uBaseSize * randomScale) / distanceScale;
    gl_PointSize = clamp(pointSize, uMinPointSize, uMaxPointSize);

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if (uAlphaParticles < 0.5) {
      if (d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export function createReactBitsParticles(container, options = {}) {
  if (!container) {
    throw new Error("React Bits Particles requires a container element.");
  }

  const {
    particleCount = 200,
    particleSpread = 10,
    speed = 0.1,
    particleColors = defaultColors,
    moveParticlesOnHover = false,
    particleHoverFactor = 1,
    alphaParticles = false,
    particleBaseSize = 100,
    sizeRandomness = 1,
    minParticleSize = 1.2,
    maxParticleSize = 5.2,
    cameraDistance = 20,
    disableRotation = false,
    horizontalScale = 1,
    pixelRatio = 1
  } = options;

  const renderer = new Renderer({
    dpr: pixelRatio,
    depth: false,
    alpha: true
  });
  const gl = renderer.gl;
  const camera = new Camera(gl, { fov: 15 });
  const mouse = { x: 0, y: 0 };
  const palette = particleColors.length > 0 ? particleColors : defaultColors;

  camera.position.set(0, 0, cameraDistance);
  gl.clearColor(0, 0, 0, 0);
  gl.canvas.dataset.reactbitsParticles = "";
  gl.canvas.dataset.particleCount = String(particleCount);
  gl.canvas.dataset.pointSizeRange = `${minParticleSize}-${maxParticleSize}`;
  container.appendChild(gl.canvas);

  const positions = new Float32Array(particleCount * 3);
  const randoms = new Float32Array(particleCount * 4);
  const colors = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    let x;
    let y;
    let z;
    let length;

    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      length = x * x + y * y + z * z;
    } while (length > 1 || length === 0);

    const radius = Math.cbrt(Math.random());
    const color = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);

    positions.set([x * radius, y * radius, z * radius], index * 3);
    randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], index * 4);
    colors.set(color, index * 3);
  }

  const geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    random: { size: 4, data: randoms },
    color: { size: 3, data: colors }
  });

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSpread: { value: particleSpread },
      uBaseSize: { value: particleBaseSize * pixelRatio },
      uSizeRandomness: { value: sizeRandomness },
      uMinPointSize: { value: minParticleSize * pixelRatio },
      uMaxPointSize: { value: maxParticleSize * pixelRatio },
      uAlphaParticles: { value: alphaParticles ? 1 : 0 }
    },
    transparent: true,
    depthTest: false
  });

  const particles = new Mesh(gl, {
    mode: gl.POINTS,
    geometry,
    program
  });

  let animationFrameId = 0;
  let lastTime = performance.now();
  let elapsed = 0;
  let active = false;

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    renderer.setSize(width, height);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    particles.scale.x = Math.max(1, (width / height) * horizontalScale);
    container.dataset.particleCoverage = particles.scale.x.toFixed(2);
  };

  const handleMouseMove = (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const render = (time) => {
    if (!active) return;

    animationFrameId = requestAnimationFrame(render);

    const delta = time - lastTime;
    lastTime = time;
    elapsed += delta * speed;
    program.uniforms.uTime.value = elapsed * 0.001;

    if (moveParticlesOnHover) {
      particles.position.x = -mouse.x * particleHoverFactor;
      particles.position.y = -mouse.y * particleHoverFactor;
    } else {
      particles.position.x = 0;
      particles.position.y = 0;
    }

    if (!disableRotation) {
      particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
      particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
      particles.rotation.z += 0.01 * speed;
    }

    renderer.render({ scene: particles, camera });
  };

  const start = () => {
    if (active) return;
    active = true;
    lastTime = performance.now();
    resize();
    animationFrameId = requestAnimationFrame(render);
  };

  const stop = () => {
    if (!active) return;
    active = false;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  };

  const destroy = () => {
    stop();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    if (moveParticlesOnHover) {
      container.removeEventListener("mousemove", handleMouseMove);
    }

    if (gl.canvas.parentNode === container) {
      container.removeChild(gl.canvas);
    }

    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  window.addEventListener("resize", resize, false);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  if (moveParticlesOnHover) {
    container.addEventListener("mousemove", handleMouseMove);
  }

  start();

  return {
    canvas: gl.canvas,
    destroy,
    start,
    stop,
    uniforms: program.uniforms
  };
}
