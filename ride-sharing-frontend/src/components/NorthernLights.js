import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const NorthernLights = () => {
  const mountRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
  
    // Northern Lights Shader
    const geometry = new THREE.PlaneGeometry(20, 10, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec3 color = vec3(0.1 + 0.5 * cos(time + vUv.y * 10.0), 0.3, 0.6);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
    });
  
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.position.z = -5;
  
    camera.position.z = 10;
  
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
  
    animate();
  
    // Cleanup on unmount
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement); // Safe to remove if ref is valid
      }
    };
  }, []);  

  return <div ref={mountRef} style={{ position: "absolute", zIndex: -1 }} />;
};

export default NorthernLights;
