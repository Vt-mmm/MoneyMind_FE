import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FinancialBackgroundProps {
  color?: string;
  intensity?: number;
}

const FinancialBackground = ({ 
  color = '#1cc88a',
  intensity = 1.0
}: FinancialBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#f9fafc', 0.035);
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color('#f9fafc'), 0.9);
    
    // Make sure the mount point exists before appending
    if (mountRef.current) {
      // Clear any previous renderers
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create a dynamic grid of financial data points
    const particleCount = 1000 * intensity;
    const particlesGeometry = new THREE.BufferGeometry();
    
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    const colorArray = new Float32Array(particleCount * 3);
    
    // Generate particles in grid-like formation to represent data
    const gridSize = Math.sqrt(particleCount);
    const cellSize = 20;
    
    for (let i = 0; i < particleCount; i++) {
      // Create a grid layout with some randomness
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      const idx = i * 3;
      posArray[idx] = (col - gridSize/2) * cellSize/gridSize + (Math.random() - 0.5) * 8;
      posArray[idx + 1] = (Math.random() - 0.5) * 10 - 5; // Mostly keep y values near the bottom
      posArray[idx + 2] = (row - gridSize/2) * cellSize/gridSize + (Math.random() - 0.5) * 8;
      
      // Randomized scale for each particle
      scaleArray[i] = Math.random() * 1.5 + 0.5;
      
      // Color gradient based on "financial health"
      // Use green, blue and purple for good, average, and excellent values
      const healthValue = Math.random();
      let particleColor = new THREE.Color();
      
      if (healthValue < 0.3) {
        // Lower values - green
        particleColor.set(color);
      } else if (healthValue < 0.7) {
        // Middle values - blue
        particleColor.set('#4e73df');
      } else {
        // Higher values - purple
        particleColor.set('#6f42c1');
      }
      
      colorArray[idx] = particleColor.r;
      colorArray[idx + 1] = particleColor.g;
      colorArray[idx + 2] = particleColor.b;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    // Shader material for data points
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.04 * renderer.getPixelRatio() }
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
          
          // Data points rising effect
          float movementFactor = fract(uTime * 0.05 + pos.x * 0.01 + pos.z * 0.01);
          pos.y += sin(movementFactor * 3.14 * 2.0) * 2.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation
          gl_PointSize = uSize * scale * (5.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a square point with soft edges for a digital look
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - step(0.4, distanceToCenter);
          
          // Apply the color
          gl_FragColor = vec4(vColor, strength * 0.8);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    // Create particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    particlesMesh.rotation.x = -0.5; // Tilt the plane to make it more visible
    scene.add(particlesMesh);
    
    // Create grid line 
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222);
    gridHelper.position.y = -8;
    scene.add(gridHelper);
    
    // Create growing bar charts
    const createBarChart = (position: THREE.Vector3, numBars: number, height: number, color: string) => {
      const group = new THREE.Group();
      group.position.copy(position);
      
      for (let i = 0; i < numBars; i++) {
        const barHeight = Math.random() * height;
        const barGeometry = new THREE.BoxGeometry(0.5, barHeight, 0.5);
        const barMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.7
        });
        
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.x = i - (numBars/2);
        bar.position.y = barHeight/2;
        
        group.add(bar);
      }
      
      return group;
    };
    
    // Add bar charts at different positions
    const barChart1 = createBarChart(new THREE.Vector3(-10, -8, -10), 8, 5, '#1cc88a');
    const barChart2 = createBarChart(new THREE.Vector3(10, -8, 10), 8, 3, '#4e73df');
    const barChart3 = createBarChart(new THREE.Vector3(-10, -8, 10), 8, 4, '#e74a3b');
    
    scene.add(barChart1, barChart2, barChart3);
    
    // Create floating financial line charts
    const createLineChart = (position: THREE.Vector3, length: number, color: string) => {
      const group = new THREE.Group();
      group.position.copy(position);
      
      const points = [];
      for (let i = 0; i < 20; i++) {
        const x = (i - 10) * (length/20);
        // Create a realistic stock-like chart with small variations
        const y = Math.sin(i * 0.3) * 0.8 + Math.sin(i * 0.1) * 0.5 + Math.random() * 0.3;
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: color });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      
      group.add(line);
      
      // Add dots at data points
      const dotGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const dotMaterial = new THREE.MeshBasicMaterial({ color: color });
      
      points.forEach(point => {
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        dot.position.copy(point);
        group.add(dot);
      });
      
      return group;
    };
    
    // Add floating line charts
    const lineChart1 = createLineChart(new THREE.Vector3(0, 5, -15), 10, '#1cc88a');
    const lineChart2 = createLineChart(new THREE.Vector3(-15, 3, 0), 8, '#4e73df');
    const lineChart3 = createLineChart(new THREE.Vector3(15, 7, 0), 12, '#e74a3b');
    
    scene.add(lineChart1, lineChart2, lineChart3);
    
    // Create floating rings (represent pie charts or doughnut charts)
    const createRing = (position: THREE.Vector3, radius: number, thickness: number, color: string) => {
      const geometry = new THREE.TorusGeometry(radius, thickness, 16, 100);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.position.copy(position);
      
      return ring;
    };
    
    // Add rings at different positions
    const ring1 = createRing(new THREE.Vector3(0, 0, -20), 3, 0.2, '#1cc88a');
    const ring2 = createRing(new THREE.Vector3(-20, 5, 5), 2, 0.2, '#4e73df');
    const ring3 = createRing(new THREE.Vector3(15, 10, 10), 4, 0.4, '#e74a3b');
    
    scene.add(ring1, ring2, ring3);

    // Create connecting lines between data elements
    const createConnectingLines = () => {
      const group = new THREE.Group();
      
      // Create connection lines between elements
      const connectionPoints = [
        new THREE.Vector3(-10, -5, -10), // barChart1
        new THREE.Vector3(10, -5, 10),   // barChart2
        new THREE.Vector3(0, 5, -15),    // lineChart1
        new THREE.Vector3(-15, 3, 0),    // lineChart2
        new THREE.Vector3(0, 0, -20),    // ring1
        new THREE.Vector3(-20, 5, 5)     // ring2
      ];
      
      for (let i = 0; i < connectionPoints.length; i++) {
        for (let j = i + 1; j < i + 3 && j < connectionPoints.length; j++) {
          const points = [
            connectionPoints[i],
            connectionPoints[j]
          ];
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x1cc88a,
            transparent: true,
            opacity: 0.2
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        }
      }
      
      return group;
    };
    
    const connectingLines = createConnectingLines();
    scene.add(connectingLines);
    
    // Create ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.set(0, 10, 25);
    camera.lookAt(0, 0, 0);
    
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
      (particlesMaterial.uniforms.uSize as { value: number }).value = 0.04 * renderer.getPixelRatio();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Update shader uniforms
      (particlesMaterial.uniforms.uTime as { value: number }).value = time;
      
      // Smooth mouse movement
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      
      // Rotate particle system
      particlesMesh.rotation.y = time * 0.05;
      
      // Animate bar charts
      barChart1.children.forEach((bar, i) => {
        if (bar instanceof THREE.Mesh) {
          const originalHeight = bar.geometry.parameters.height;
          const newHeight = originalHeight + Math.sin(time * 2 + i) * 0.3;
          bar.scale.y = newHeight / originalHeight;
          bar.position.y = newHeight / 2;
        }
      });
      
      barChart2.children.forEach((bar, i) => {
        if (bar instanceof THREE.Mesh) {
          const originalHeight = bar.geometry.parameters.height;
          const newHeight = originalHeight + Math.cos(time * 1.5 + i * 0.2) * 0.2;
          bar.scale.y = newHeight / originalHeight;
          bar.position.y = newHeight / 2;
        }
      });
      
      barChart3.children.forEach((bar, i) => {
        if (bar instanceof THREE.Mesh) {
          const originalHeight = bar.geometry.parameters.height;
          const newHeight = originalHeight + Math.sin(time * 1.8 + i * 0.5) * 0.25;
          bar.scale.y = newHeight / originalHeight;
          bar.position.y = newHeight / 2;
        }
      });
      
      // Animate line charts - slight floating
      lineChart1.position.y = 5 + Math.sin(time * 0.5) * 0.3;
      lineChart2.position.y = 3 + Math.cos(time * 0.7) * 0.2;
      lineChart3.position.y = 7 + Math.sin(time * 0.6) * 0.4;
      
      // Rotate rings
      ring1.rotation.x = time * 0.2;
      ring1.rotation.y = time * 0.3;
      
      ring2.rotation.x = time * 0.3;
      ring2.rotation.z = time * 0.2;
      
      ring3.rotation.y = time * 0.2;
      ring3.rotation.z = time * 0.4;
      
      // Move camera based on mouse position
      camera.position.x = mouseX * 5;
      camera.position.y = 10 + mouseY * 3;
      camera.lookAt(0, 0, 0);
      
      // Render the scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose geometries and materials
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      
      // Clean up the rest of the objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      
      renderer.dispose();
      
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [color, intensity]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: 'transparent',
        opacity: 0.7,
        pointerEvents: 'none'
      }}
    />
  );
};

export default FinancialBackground; 