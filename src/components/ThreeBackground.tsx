import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import images from 'assets';

interface ThreeBackgroundProps {
  color?: string;
  particleCount?: number;
}

interface Orb {
  mesh: THREE.Mesh;
  initialPosition: THREE.Vector3;
  speed: number;
  amplitude: number;
}

interface FinancialSymbol {
  mesh: THREE.Object3D;
  rotationSpeed: THREE.Vector3;
  floatSpeed: number;
  initialY: number;
}

const ThreeBackground = ({ 
  color = '#16ab65',
  particleCount = 3000 
}: ThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#f0fdf4', 0.05);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color('#f0fdf4'), 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    if (mountRef.current) {
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create 3D text for MoneyMind
    const createTextMesh = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'bold 48px Arial';
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('MoneyMind', canvas.width / 2, canvas.height / 2);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const geometry = new THREE.PlaneGeometry(4, 1);
      const textMesh = new THREE.Mesh(geometry, material);
      return textMesh;
    };

    // Create multiple text instances
    const textCount = 4;
    const textGroup = new THREE.Group();
    for (let i = 0; i < textCount; i++) {
      const text = createTextMesh();
      const angle = (i / textCount) * Math.PI * 2;
      const radius = 10;
      text.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );
      text.rotation.y = angle;
      textGroup.add(text);
    }
    scene.add(textGroup);

    // Create coin geometry
    const createCoinMesh = (radius: number, position: THREE.Vector3) => {
      const coinGeometry = new THREE.TorusGeometry(radius, radius * 0.2, 16, 32);
      const coinMaterial = new THREE.MeshStandardMaterial({
        color: '#FFD700',
        metalness: 0.8,
        roughness: 0.3,
        emissive: '#FFD700',
        emissiveIntensity: 0.2,
      });
      
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.position.copy(position);
      
      // Add $ symbol to the coin
      const detailGeometry = new THREE.BoxGeometry(radius * 0.1, radius * 1.5, radius * 0.1);
      const detailMaterial = new THREE.MeshStandardMaterial({ 
        color: '#FFD700',
        emissive: '#FFFFFF',
        emissiveIntensity: 0.5,
      });
      
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.z = radius * 0.25;
      coin.add(detail);
      
      return coin;
    };

    // Create multiple coins
    const coinCount = 6;
    const coinGroup = new THREE.Group();
    for (let i = 0; i < coinCount; i++) {
      const angle = (i / coinCount) * Math.PI * 2;
      const radius = 8 + Math.random() * 2;
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * radius
      );
      
      const coin = createCoinMesh(0.4 + Math.random() * 0.2, position);
      coinGroup.add(coin);
    }
    scene.add(coinGroup);

    // Create main particles system
    const mainParticlesGeometry = new THREE.BufferGeometry();
    
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    const colorArray = new Float32Array(particleCount * 3);
    
    // Multiple particle systems with different distributions
    // 1. Central sphere formation
    const coreParticleCount = Math.floor(particleCount * 0.4);
    for (let i = 0; i < coreParticleCount; i++) {
      // Create a sphere distribution
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const idx = i * 3;
      posArray[idx] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[idx + 2] = radius * Math.cos(phi);
      
      // Randomized scale for each particle
      scaleArray[i] = Math.random() * 1.5 + 0.5;
      
      // Color gradient from main color to a brighter version
      const primaryColorObj = new THREE.Color(color);
      const brightness = 0.7 + Math.random() * 0.5; // 0.7 to 1.2
      colorArray[idx] = primaryColorObj.r * brightness;
      colorArray[idx + 1] = primaryColorObj.g * brightness;
      colorArray[idx + 2] = primaryColorObj.b * brightness;
    }
    
    // 2. Spiral formation
    const spiralParticleCount = Math.floor(particleCount * 0.4);
    for (let i = 0; i < spiralParticleCount; i++) {
      const idx = (i + coreParticleCount) * 3;
      
      // Create spiral distribution
      const angle = i * 0.01 * Math.PI;
      const radius = 3 + (i / spiralParticleCount) * 5;
      posArray[idx] = Math.sin(angle) * radius;
      posArray[idx + 1] = Math.cos(angle) * radius / 2; // Flatten the y dimension
      posArray[idx + 2] = (Math.cos(angle * 2) * radius) / 3;
      
      // Random scale variation
      scaleArray[i + coreParticleCount] = Math.random() * 0.8 + 0.2;
      
      // Color variation - slight gradient
      const primaryColorObj = new THREE.Color(color);
      const secondaryColorObj = new THREE.Color('#ffffff');
      const mixRatio = i / spiralParticleCount * 0.5;
      const mixedColor = new THREE.Color().lerpColors(primaryColorObj, secondaryColorObj, mixRatio);
      
      colorArray[idx] = mixedColor.r;
      colorArray[idx + 1] = mixedColor.g;
      colorArray[idx + 2] = mixedColor.b;
    }
    
    // 3. Random distant particles
    const randomParticleCount = particleCount - coreParticleCount - spiralParticleCount;
    for (let i = 0; i < randomParticleCount; i++) {
      const idx = (i + coreParticleCount + spiralParticleCount) * 3;
      
      // Random distant positions
      const distance = 10 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[idx] = distance * Math.sin(phi) * Math.cos(theta);
      posArray[idx + 1] = distance * Math.sin(phi) * Math.sin(theta) * 0.7; // Flatten vertically
      posArray[idx + 2] = distance * Math.cos(phi);
      
      // Smaller scale for distant particles
      scaleArray[i + coreParticleCount + spiralParticleCount] = Math.random() * 0.4 + 0.1;
      
      // Dimmer color for distant particles
      const primaryColorObj = new THREE.Color(color);
      const dimFactor = 0.3 + Math.random() * 0.3;
      colorArray[idx] = primaryColorObj.r * dimFactor;
      colorArray[idx + 1] = primaryColorObj.g * dimFactor;
      colorArray[idx + 2] = primaryColorObj.b * dimFactor;
    }
    
    mainParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    mainParticlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    mainParticlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Shader material for more advanced effects
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.03 * renderer.getPixelRatio() }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Animated position
          vec3 pos = position;
          float angle = uTime * 0.2;
          
          // Apply subtle wave movement
          pos.x += sin(pos.z * 0.5 + uTime) * 0.1;
          pos.y += cos(pos.x * 0.5 + uTime) * 0.1;
          
          // Apply rotation
          float x = pos.x * cos(angle) - pos.z * sin(angle);
          float z = pos.x * sin(angle) + pos.z * cos(angle);
          pos.x = x;
          pos.z = z;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation
          gl_PointSize = uSize * scale * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a circular point with soft edges
          float distance = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - smoothstep(0.0, 0.5, distance);
          
          // Apply the color
          gl_FragColor = vec4(vColor, strength);
          
          // Add a glowing core
          if(distance < 0.25) {
            gl_FragColor.rgb += vec3(0.1, 0.1, 0.1) * (1.0 - distance * 4.0);
          }
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    // Create particle system
    const particlesMesh = new THREE.Points(mainParticlesGeometry, particlesMaterial);
    particlesMesh.rotation.x = 0.2;
    scene.add(particlesMesh);
    
    // Add floating light orbs
    const orbsCount = 3;
    const orbs: Orb[] = [];
    const orbGroup = new THREE.Group();
    
    for (let i = 0; i < orbsCount; i++) {
      // Create a small sphere geometry
      const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      
      // Create a glowing material
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(1.2),
        transparent: true,
        opacity: 0.7
      });
      
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      
      // Position orbs in interesting places
      const distance = 3 + Math.random() * 4;
      const angle = (i / orbsCount) * Math.PI * 2;
      orb.position.set(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 2,
        Math.sin(angle) * distance
      );
      
      // Add light to each orb
      const orbLight = new THREE.PointLight(
        new THREE.Color(color).multiplyScalar(1.5), 
        2, 
        3
      );
      orbLight.intensity = 0.5 + Math.random() * 0.5;
      orb.add(orbLight);
      
      orbGroup.add(orb);
      orbs.push({
        mesh: orb,
        initialPosition: orb.position.clone(),
        speed: 0.2 + Math.random() * 0.3,
        amplitude: 0.3 + Math.random() * 0.2
      });
    }
    
    scene.add(orbGroup);
    
    // ---------- ADD FINANCIAL SYMBOLS ----------
    const financialSymbols: FinancialSymbol[] = [];
    const symbolsGroup = new THREE.Group();
    
    // Function to create torus (coin shape)
    const createCoin = (radius: number, position: THREE.Vector3) => {
      const coinGeometry = new THREE.TorusGeometry(radius, radius * 0.2, 16, 32);
      const coinMaterial = new THREE.MeshStandardMaterial({
        color: '#FFD700', // Gold color
        metalness: 0.8,
        roughness: 0.3,
        emissive: '#FFD700',
        emissiveIntensity: 0.2,
      });
      
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.position.copy(position);
      
      // Add details to the coin ($ symbol)
      const detailGeometry = new THREE.BoxGeometry(radius * 0.1, radius * 1.5, radius * 0.1);
      const detailMaterial = new THREE.MeshStandardMaterial({ 
        color: '#FFD700',
        emissive: '#FFFFFF',
        emissiveIntensity: 0.5,
      });
      
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.z = radius * 0.25;
      coin.add(detail);
      
      // Add a vertical line for the dollar symbol
      const vertLine = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 0.1, radius * 1.5, radius * 0.1),
        detailMaterial
      );
      vertLine.position.z = radius * 0.25;
      coin.add(vertLine);
      
      return coin;
    };
    
    // Function to create chart
    const createChart = (size: number, position: THREE.Vector3) => {
      const chartGroup = new THREE.Group();
      chartGroup.position.copy(position);
      
      // Chart base
      const baseGeometry = new THREE.BoxGeometry(size, size * 0.1, size * 0.1);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
      });
      
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      chartGroup.add(base);
      
      // Chart vertical axis
      const axisGeometry = new THREE.BoxGeometry(size * 0.1, size, size * 0.1);
      const axis = new THREE.Mesh(axisGeometry, baseMaterial);
      axis.position.x = -size * 0.45;
      axis.position.y = size * 0.45;
      chartGroup.add(axis);
      
      // Chart bars
      const barCount = 5;
      const barWidth = (size * 0.8) / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const height = size * (0.2 + Math.random() * 0.8);
        const barGeometry = new THREE.BoxGeometry(barWidth * 0.8, height, size * 0.15);
        
        // Alternate colors for bars
        const barMaterial = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? color : '#FFD700',
          emissive: i % 2 === 0 ? color : '#FFD700',
          emissiveIntensity: 0.3,
        });
        
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.x = -size * 0.4 + (i + 0.5) * barWidth;
        bar.position.y = height * 0.5;
        chartGroup.add(bar);
      }
      
      // Chart line
      const linePoints = [];
      for (let i = 0; i < barCount + 1; i++) {
        const x = -size * 0.45 + i * barWidth;
        const y = size * (0.1 + Math.random() * 0.9);
        linePoints.push(new THREE.Vector3(x, y, size * 0.2));
      }
      
      const lineCurve = new THREE.CatmullRomCurve3(linePoints);
      const lineGeometry = new THREE.TubeGeometry(lineCurve, 20, size * 0.03, 8, false);
      const lineMaterial = new THREE.MeshBasicMaterial({
        color: '#FFFFFF',
      });
      
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      chartGroup.add(line);
      
      return chartGroup;
    };
    
    // Function to create dollar symbol
    const createDollarSymbol = (size: number, position: THREE.Vector3) => {
      const dollarGroup = new THREE.Group();
      dollarGroup.position.copy(position);
      
      // S shape
      const curvePoints = [];
      const radius = size * 0.5;
      
      // Top curve
      for (let i = 0; i <= 10; i++) {
        const angle = (Math.PI * i) / 10;
        curvePoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius * 0.8,
            Math.sin(angle) * radius * 0.5 + radius * 0.5,
            0
          )
        );
      }
      
      // Bottom curve (inverted)
      for (let i = 0; i <= 10; i++) {
        const angle = Math.PI + (Math.PI * i) / 10;
        curvePoints.push(
          new THREE.Vector3(
            Math.cos(angle) * radius * 0.8,
            Math.sin(angle) * radius * 0.5 - radius * 0.5,
            0
          )
        );
      }
      
      const curve = new THREE.CatmullRomCurve3(curvePoints);
      curve.closed = false;
      
      const sCurveGeometry = new THREE.TubeGeometry(curve, 64, size * 0.1, 8, false);
      const dollarMaterial = new THREE.MeshStandardMaterial({
        color: '#2E8B57', // Sea green (dollar color)
        metalness: 0.5,
        roughness: 0.2,
        emissive: '#2E8B57',
        emissiveIntensity: 0.3,
      });
      
      const sCurve = new THREE.Mesh(sCurveGeometry, dollarMaterial);
      dollarGroup.add(sCurve);
      
      // Vertical line
      const lineGeometry = new THREE.CylinderGeometry(
        size * 0.1,
        size * 0.1,
        size * 1.5,
        16
      );
      const line = new THREE.Mesh(lineGeometry, dollarMaterial);
      dollarGroup.add(line);
      
      return dollarGroup;
    };
    
    // Place financial symbols around the scene
    const symbolCount = 5;
    const radius = 8;
    
    for (let i = 0; i < symbolCount; i++) {
      const angle = (i / symbolCount) * Math.PI * 2;
      const distance = radius * (0.7 + Math.random() * 0.5);
      
      // Calculate random position
      const position = new THREE.Vector3(
        Math.cos(angle) * distance * (0.8 + Math.random() * 0.4),
        (Math.random() - 0.5) * 8,
        Math.sin(angle) * distance * (0.8 + Math.random() * 0.4)
      );
      
      let symbolMesh: THREE.Mesh | THREE.Group;
      const symbolType = Math.floor(Math.random() * 3);
      
      // Choose a random financial symbol type
      switch (symbolType) {
        case 0:
          symbolMesh = createCoin(0.5 + Math.random() * 0.3, position);
          break;
        case 1:
          symbolMesh = createChart(1 + Math.random() * 0.5, position);
          break;
        case 2:
        default:
          symbolMesh = createDollarSymbol(0.6 + Math.random() * 0.3, position);
          break;
      }
      
      symbolsGroup.add(symbolMesh);
      
      // Add to financial symbols array for animation
      financialSymbols.push({
        mesh: symbolMesh,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        floatSpeed: 0.2 + Math.random() * 0.3,
        initialY: position.y
      });
    }
    
    scene.add(symbolsGroup);
    
    // Create central light source
    const centralLight = new THREE.PointLight(
      new THREE.Color(color), 
      1.5, 
      10
    );
    centralLight.position.set(0, 0, 0);
    scene.add(centralLight);
    
    // Create an ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Add directional light to better see the financial symbols
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add background glow sphere
    const glowGeometry = new THREE.SphereGeometry(5, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uTime;
        varying vec3 vPosition;
        
        void main() {
          float intensity = 0.15 - length(vPosition) * 0.03;
          intensity = max(0.0, intensity);
          
          // Add wave effect
          intensity += sin(vPosition.x * 5.0 + uTime) * sin(vPosition.y * 5.0 + uTime) * 0.01;
          
          gl_FragColor = vec4(uColor, intensity);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere);
    
    // Add project logo
    const createProjectLogo = () => {
      const loader = new THREE.TextureLoader();
      const texture = loader.load(images.logo.logo_moneymind_no_bg);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const geometry = new THREE.PlaneGeometry(3, 3); // Adjust size as needed
      const logoMesh = new THREE.Mesh(geometry, material);
      
      // Position the logo slightly above center
      logoMesh.position.set(0, 2, 0);
      logoMesh.rotation.x = -Math.PI / 6; // Tilt slightly
      
      return logoMesh;
    };

    const logoMesh = createProjectLogo();
    scene.add(logoMesh);
    
    // Animation and interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      (particlesMaterial.uniforms.uSize as { value: number }).value = 0.03 * renderer.getPixelRatio();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Position camera
    camera.position.z = 6;
    
    // Animation loop
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Update shader uniforms
      (particlesMaterial.uniforms.uTime as { value: number }).value = time;
      if (glowMaterial.uniforms.uTime) {
        (glowMaterial.uniforms.uTime as { value: number }).value = time;
      }
      
      // Smooth mouse movement
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Rotate particle system
      particlesMesh.rotation.y = time * 0.1;
      particlesMesh.rotation.z = time * 0.05;
      
      // Make particles react to mouse
      particlesMesh.rotation.x = 0.2 + mouseY * 0.1;
      particlesMesh.rotation.y += mouseX * 0.01;
      
      // Animate orbs
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        const position = orb.mesh.position;
        const initialPosition = orb.initialPosition;
        
        // Circular motion with floating up and down
        position.x = initialPosition.x + Math.sin(time * orb.speed) * orb.amplitude;
        position.y = initialPosition.y + Math.cos(time * orb.speed * 1.5) * orb.amplitude * 0.5;
        position.z = initialPosition.z + Math.cos(time * orb.speed) * orb.amplitude;
        
        // Orb size pulsing
        const scale = 1 + Math.sin(time * 2 + i) * 0.1;
        orb.mesh.scale.set(scale, scale, scale);
        
        // Light intensity pulsing
        if (orb.mesh.children[0] instanceof THREE.PointLight) {
          orb.mesh.children[0].intensity = 0.5 + Math.sin(time * 3 + i * 0.5) * 0.2;
        }
      }
      
      // Animate financial symbols
      for (let i = 0; i < financialSymbols.length; i++) {
        const symbol = financialSymbols[i];
        
        // Rotate symbol
        symbol.mesh.rotation.x += symbol.rotationSpeed.x;
        symbol.mesh.rotation.y += symbol.rotationSpeed.y;
        symbol.mesh.rotation.z += symbol.rotationSpeed.z;
        
        // Float up and down
        symbol.mesh.position.y = symbol.initialY + Math.sin(time * symbol.floatSpeed) * 0.5;
        
        // Subtle scaling effect
        const scale = 1 + Math.sin(time * 1.5 + i) * 0.05;
        symbol.mesh.scale.set(scale, scale, scale);
      }
      
      // Rotate symbol group slowly
      symbolsGroup.rotation.y = time * 0.05;
      
      // Rotate orb group slowly
      orbGroup.rotation.y = time * 0.1;
      
      // Breathe effect for central light
      centralLight.intensity = 1.2 + Math.sin(time) * 0.3;
      
      // Move camera slightly with mouse
      camera.position.x = mouseX * 0.3;
      camera.position.y = mouseY * 0.3;
      camera.lookAt(0, 0, 0);
      
      // Animate text
      textGroup.rotation.y += 0.001;
      textGroup.children.forEach((child: THREE.Object3D, i: number) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = Math.sin(time + i) * 0.5;
        }
      });
      
      // Animate coins
      coinGroup.rotation.y += 0.002;
      coinGroup.children.forEach((child: THREE.Object3D, i: number) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y += 0.02;
          child.position.y = Math.sin(time * 0.5 + i) * 0.3;
        }
      });
      
      // Animate logo
      if (logoMesh) {
        logoMesh.rotation.y = Math.sin(time * 0.5) * 0.1;
        logoMesh.position.y = 2 + Math.sin(time) * 0.2;
        const scale = 1 + Math.sin(time * 0.8) * 0.05;
        logoMesh.scale.set(scale, scale, scale);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose geometries and materials
      mainParticlesGeometry.dispose();
      particlesMaterial.dispose();
      
      // Remove orbs and their lights
      for (const orb of orbs) {
        if (orb.mesh.children[0] instanceof THREE.Light) {
          orb.mesh.remove(orb.mesh.children[0]);
        }
        if (orb.mesh.geometry) orb.mesh.geometry.dispose();
        if (orb.mesh.material) {
          if (Array.isArray(orb.mesh.material)) {
            orb.mesh.material.forEach((material: THREE.Material) => material.dispose());
          } else {
            orb.mesh.material.dispose();
          }
        }
      }
      
      // Clean up financial symbols
      for (const symbol of financialSymbols) {
        if (symbol.mesh) {
          symbol.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat: THREE.Material) => mat.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }
      }
      
      // Remove from scene and dispose
      scene.remove(particlesMesh);
      scene.remove(orbGroup);
      scene.remove(symbolsGroup);
      scene.remove(centralLight);
      scene.remove(ambientLight);
      scene.remove(directionalLight);
      scene.remove(glowSphere);
      
      glowGeometry.dispose();
      glowMaterial.dispose();
      
      renderer.dispose();
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Clean up text
      textGroup.children.forEach((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      scene.remove(textGroup);
      
      // Clean up coins
      coinGroup.children.forEach((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      scene.remove(coinGroup);
      
      // Clean up logo
      if (logoMesh.geometry) logoMesh.geometry.dispose();
      if (logoMesh.material) {
        if (Array.isArray(logoMesh.material)) {
          logoMesh.material.forEach(material => material.dispose());
        } else {
          logoMesh.material.dispose();
        }
      }
      scene.remove(logoMesh);
    };
  }, [color, particleCount]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: 'transparent'
      }}
    />
  );
};

export default ThreeBackground;