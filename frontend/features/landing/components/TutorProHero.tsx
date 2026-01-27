'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Image from 'next/image';

export const TutorProHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
    const [, setIsReady] = useState(false);
    const [, setScrollProgress] = useState(0);

    const toggleCard = (index: number) => {
        setFlippedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const modules = [
        {
            id: 1,
            icon: '📊',
            name: 'Tổng Quan',
            color: '#4a9eff',
            description: 'Dashboard tổng quan giúp bạn nắm bắt toàn bộ hoạt động',
            features: ['Thống kê thu nhập', 'Lịch dạy hôm nay', 'Số học sinh active', 'Hiệu suất giảng dạy'],
            image: null,
            video: null
        },
        {
            id: 2,
            icon: '👨‍🎓',
            name: 'Học Sinh & PH',
            color: '#9d4edd',
            description: 'Quản lý hồ sơ học sinh và phụ huynh chi tiết',
            features: ['Hồ sơ học sinh đầy đủ', 'Liên hệ phụ huynh', 'Lịch sử học tập', 'Điểm số & đánh giá'],
            image: null,
            video: null
        },
        {
            id: 3,
            icon: '💰',
            name: 'Tài Chính',
            color: '#06ffa5',
            description: 'Theo dõi thu nhập và tạo hóa đơn tự động',
            features: ['Theo dõi thu nhập', 'Hóa đơn tự động', 'Báo cáo tài chính', 'Quản lý công nợ'],
            image: null,
            video: null
        },
        {
            id: 4,
            icon: '📅',
            name: 'Lịch Dạy',
            color: '#7b68ee',
            description: 'Quản lý lịch dạy thông minh với nhắc nhở',
            features: ['Lịch tuần/tháng', 'Nhắc nhở thông minh', 'Đồng bộ Google Calendar', 'Xử lý xung đột lịch'],
            image: null,
            video: null
        },
        {
            id: 5,
            icon: '📖',
            name: 'Bài Giảng',
            color: '#4a9eff',
            description: 'Thư viện bài giảng có tổ chức, dễ tái sử dụng',
            features: ['Thư viện tài liệu', 'Template bài giảng', 'Chia sẻ với học sinh', 'Phân loại theo môn'],
            image: null,
            video: null
        },
        {
            id: 6,
            icon: '📝',
            name: 'Khảo Thí',
            color: '#9d4edd',
            description: 'Tạo đề thi và phân tích kết quả học sinh',
            features: ['Tạo đề thi nhanh', 'Ngân hàng câu hỏi', 'Chấm điểm tự động', 'Phân tích kết quả'],
            image: null,
            video: null
        },
        {
            id: 7,
            icon: '📁',
            name: 'Tài Liệu',
            color: '#06ffa5',
            description: 'Lưu trữ và quản lý tài liệu chuyên nghiệp',
            features: ['Cloud storage', 'Phân quyền truy cập', 'Tìm kiếm nhanh', 'Version control'],
            image: null,
            video: null
        },
        {
            id: 8,
            icon: '🎥',
            name: 'Lớp Học',
            color: '#7b68ee',
            description: 'Tích hợp lớp học online với công cụ tương tác',
            features: ['Video conference', 'Whiteboard ảo', 'Screen sharing', 'Ghi hình lớp học'],
            image: null,
            video: null
        }
    ];

    const threeRefs = useRef({
        scene: null as THREE.Scene | null,
        camera: null as THREE.PerspectiveCamera | null,
        renderer: null as THREE.WebGLRenderer | null,
        particles: [] as THREE.Points[],
        supplies: [] as THREE.Mesh[],
        planets: [] as THREE.Mesh[],
        animationId: null as number | null,
        targetCameraPos: { x: 0, y: 50, z: 300 },
        smoothCameraPos: { x: 0, y: 50, z: 300 }
    });

    // Initialize Three.js Scene
    useEffect(() => {
        const initThree = () => {
            const { current: refs } = threeRefs;

            // Scene - Deep space blue-black
            refs.scene = new THREE.Scene();
            refs.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.0008);
            refs.scene.background = new THREE.Color(0x0a0e1a);

            // Camera
            refs.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                3000
            );
            refs.camera.position.set(0, 50, 300);
            refs.camera.lookAt(0, 0, 0);

            // Renderer
            if (!canvasRef.current) return;

            refs.renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: true
            });
            refs.renderer.setSize(window.innerWidth, window.innerHeight);
            refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            refs.renderer.toneMappingExposure = 1;

            // Lighting - Cool space tones
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            refs.scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0x4a9eff, 2.5, 1000); // Bright blue
            pointLight1.position.set(200, 200, 200);
            refs.scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x9d4edd, 2, 1000); // Purple
            pointLight2.position.set(-200, -100, 100);
            refs.scene.add(pointLight2);

            const pointLight3 = new THREE.PointLight(0x06ffa5, 1.5, 800); // Cyan accent
            pointLight3.position.set(0, 300, -200);
            refs.scene.add(pointLight3);

            // Create scene elements
            createKnowledgeParticles();
            createSchoolSupplies();
            createKnowledgePlanets();
            createConnectionLines();

            animate();
            setIsReady(true);
        };

        const createKnowledgeParticles = () => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            const particleCount = 3000;

            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);

            const colorPalette = [
                new THREE.Color(0x4a9eff), // Bright blue
                new THREE.Color(0x9d4edd), // Purple
                new THREE.Color(0x06ffa5), // Cyan
                new THREE.Color(0x7b68ee), // Medium slate blue
                new THREE.Color(0x00d4ff)  // Sky blue
            ];

            for (let i = 0; i < particleCount; i++) {
                // Spherical distribution
                const radius = 400 + Math.random() * 600;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);

                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = radius * Math.cos(phi);

                const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;

                sizes[i] = Math.random() * 3 + 1;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            // Gentle floating motion
            pos.y += sin(time + position.x * 0.01) * 10.0;
            pos.x += cos(time + position.y * 0.01) * 8.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
                fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity * 0.8);
          }
        `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const particles = new THREE.Points(geometry, material);
            refs.scene.add(particles);
            refs.particles.push(particles);
        };

        const createSchoolSupplies = () => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            const supplies: THREE.Mesh[] = [];

            // Create various school supplies
            const createBook = (color: number, emissive: number) => {
                const geometry = new THREE.BoxGeometry(8, 12, 2);
                const material = new THREE.MeshPhongMaterial({
                    color,
                    emissive,
                    emissiveIntensity: 0.5,
                    shininess: 120
                });
                return new THREE.Mesh(geometry, material);
            };

            const createPen = (color: number, emissive: number) => {
                const geometry = new THREE.CylinderGeometry(0.3, 0.3, 15, 8);
                const material = new THREE.MeshPhongMaterial({
                    color,
                    emissive,
                    emissiveIntensity: 0.6,
                    shininess: 100
                });
                return new THREE.Mesh(geometry, material);
            };

            const createEraser = (color: number, emissive: number) => {
                const geometry = new THREE.BoxGeometry(4, 2, 6);
                const material = new THREE.MeshPhongMaterial({
                    color,
                    emissive,
                    emissiveIntensity: 0.5,
                    shininess: 80
                });
                return new THREE.Mesh(geometry, material);
            };

            const createRuler = (color: number, emissive: number) => {
                const geometry = new THREE.BoxGeometry(20, 0.5, 3);
                const material = new THREE.MeshPhongMaterial({
                    color,
                    emissive,
                    emissiveIntensity: 0.4,
                    shininess: 90
                });
                return new THREE.Mesh(geometry, material);
            };

            const createNotebook = (color: number, emissive: number) => {
                const geometry = new THREE.BoxGeometry(10, 14, 1);
                const material = new THREE.MeshPhongMaterial({
                    color,
                    emissive,
                    emissiveIntensity: 0.5,
                    shininess: 100
                });
                return new THREE.Mesh(geometry, material);
            };

            const supplyTypes = [
                { create: createBook, count: 5 },
                { create: createPen, count: 4 },
                { create: createEraser, count: 3 },
                { create: createRuler, count: 3 },
                { create: createNotebook, count: 5 }
            ];

            const colors = [
                { color: 0x4a9eff, emissive: 0x1a3a5f },
                { color: 0x9d4edd, emissive: 0x3d1a5d },
                { color: 0x06ffa5, emissive: 0x024030 },
                { color: 0x7b68ee, emissive: 0x2a1a4a },
                { color: 0x00d4ff, emissive: 0x00405f }
            ];

            let index = 0;
            supplyTypes.forEach(type => {
                for (let i = 0; i < type.count; i++) {
                    const colorSet = colors[index % colors.length];
                    const supply = type.create(colorSet.color, colorSet.emissive);

                    // Position in a spiral
                    const angle = (index / 20) * Math.PI * 4;
                    const radius = 150 + (index / 20) * 100;
                    supply.position.x = Math.cos(angle) * radius;
                    supply.position.y = Math.sin(index * 0.5) * 50;
                    supply.position.z = Math.sin(angle) * radius - 100;

                    // Random rotation
                    supply.rotation.x = Math.random() * Math.PI;
                    supply.rotation.y = Math.random() * Math.PI;
                    supply.rotation.z = Math.random() * Math.PI;

                    supply.userData = {
                        baseY: supply.position.y,
                        speed: 0.5 + Math.random() * 0.5,
                        rotationSpeed: (Math.random() - 0.5) * 0.02
                    };

                    refs.scene?.add(supply);
                    supplies.push(supply);
                    index++;
                }
            });

            refs.supplies = supplies;
        };

        const createKnowledgePlanets = () => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            // Main knowledge sphere - Space blue
            const mainGeometry = new THREE.SphereGeometry(60, 32, 32);
            const mainMaterial = new THREE.MeshPhongMaterial({
                color: 0x4a9eff,
                emissive: 0x1a3a6f,
                emissiveIntensity: 0.6,
                shininess: 120,
                transparent: true,
                opacity: 0.8
            });

            const mainPlanet = new THREE.Mesh(mainGeometry, mainMaterial);
            mainPlanet.position.set(0, 0, -200);
            refs.scene.add(mainPlanet);
            refs.planets.push(mainPlanet);

            // Orbiting mini spheres
            for (let i = 0; i < 5; i++) {
                const miniGeometry = new THREE.SphereGeometry(15, 16, 16);
                const miniMaterial = new THREE.MeshPhongMaterial({
                    color: [0x06ffa5, 0x9d4edd, 0x7b68ee, 0x00d4ff, 0x4a9eff][i],
                    emissive: [0x024030, 0x3d1a5d, 0x2a1a4a, 0x00405f, 0x1a3a6f][i],
                    emissiveIntensity: 0.7,
                    shininess: 100
                });

                const miniPlanet = new THREE.Mesh(miniGeometry, miniMaterial);
                miniPlanet.userData = {
                    orbitRadius: 120 + i * 20,
                    orbitSpeed: 0.3 + i * 0.1,
                    angle: (i / 5) * Math.PI * 2
                };

                refs.scene.add(miniPlanet);
                refs.planets.push(miniPlanet);
            }
        };

        const createConnectionLines = () => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            // Create connecting lines between elements
            const lineGeometry = new THREE.BufferGeometry();
            const linePositions = [];

            for (let i = 0; i < 50; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 100 + Math.random() * 200;

                linePositions.push(
                    Math.cos(angle) * radius,
                    (Math.random() - 0.5) * 100,
                    Math.sin(angle) * radius - 100
                );

                linePositions.push(
                    Math.cos(angle + 0.1) * (radius + 50),
                    (Math.random() - 0.5) * 100,
                    Math.sin(angle + 0.1) * (radius + 50) - 100
                );
            }

            lineGeometry.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(linePositions, 3)
            );

            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x4a9eff,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });

            const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
            refs.scene.add(lines);
        };

        const animate = () => {
            const { current: refs } = threeRefs;
            refs.animationId = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Animate particles
            refs.particles.forEach(particle => {
                if (particle.material instanceof THREE.ShaderMaterial) {
                    particle.material.uniforms.time.value = time;
                }
                particle.rotation.y = time * 0.05;
            });

            // Animate school supplies
            if (refs.supplies) {
                refs.supplies.forEach(supply => {
                    supply.position.y = supply.userData.baseY + Math.sin(time * supply.userData.speed) * 20;
                    supply.rotation.y += supply.userData.rotationSpeed;
                    supply.rotation.x += supply.userData.rotationSpeed * 0.5;
                });
            }

            // Animate planets
            refs.planets.forEach((planet, index) => {
                if (index === 0) {
                    // Main planet
                    planet.rotation.y = time * 0.1;
                } else {
                    // Orbiting planets
                    const data = planet.userData;
                    data.angle += data.orbitSpeed * 0.01;
                    planet.position.x = Math.cos(data.angle) * data.orbitRadius;
                    planet.position.y = Math.sin(data.angle * 2) * 30;
                    planet.position.z = Math.sin(data.angle) * data.orbitRadius - 200;
                    planet.rotation.y = time * 0.5;
                }
            });

            // Smooth camera movement
            const smoothing = 0.05;
            refs.smoothCameraPos.x += (refs.targetCameraPos.x - refs.smoothCameraPos.x) * smoothing;
            refs.smoothCameraPos.y += (refs.targetCameraPos.y - refs.smoothCameraPos.y) * smoothing;
            refs.smoothCameraPos.z += (refs.targetCameraPos.z - refs.smoothCameraPos.z) * smoothing;

            if (refs.camera) {
                refs.camera.position.x = refs.smoothCameraPos.x;
                refs.camera.position.y = refs.smoothCameraPos.y;
                refs.camera.position.z = refs.smoothCameraPos.z;
                refs.camera.lookAt(0, 0, -200);
            }

            if (refs.renderer && refs.scene && refs.camera) {
                refs.renderer.render(refs.scene, refs.camera);
            }
        };

        initThree();

        // Handle resize
        const handleResize = () => {
            const { current: refs } = threeRefs;
            if (refs.camera && refs.renderer) {
                refs.camera.aspect = window.innerWidth / window.innerHeight;
                refs.camera.updateProjectionMatrix();
                refs.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            const { current: refs } = threeRefs;
            if (refs.animationId) {
                cancelAnimationFrame(refs.animationId);
            }
            window.removeEventListener('resize', handleResize);

            // Cleanup
            refs.particles.forEach(p => {
                p.geometry.dispose();
                if (Array.isArray(p.material)) {
                    p.material.forEach(m => m.dispose());
                } else {
                    p.material.dispose();
                }
            });

            if (refs.supplies) {
                refs.supplies.forEach(s => {
                    s.geometry.dispose();
                    if (Array.isArray(s.material)) {
                        s.material.forEach(m => m.dispose());
                    } else {
                        s.material.dispose();
                    }
                });
            }

            refs.planets.forEach(p => {
                p.geometry.dispose();
                if (Array.isArray(p.material)) {
                    p.material.forEach(m => m.dispose());
                } else {
                    p.material.dispose();
                }
            });

            if (refs.renderer) {
                refs.renderer.dispose();
            }
        };
    }, []);

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const maxScroll = windowHeight * 2;
            const progress = Math.min(scrollY / maxScroll, 1);

            setScrollProgress(progress);

            const { current: refs } = threeRefs;

            // Camera positions for different sections
            if (progress < 0.33) {
                // Section 1: Overview
                refs.targetCameraPos = { x: 0, y: 50, z: 300 };
            } else if (progress < 0.66) {
                // Section 2: Closer look
                refs.targetCameraPos = { x: 100, y: 0, z: 150 };
            } else {
                // Section 3: Deep dive
                refs.targetCameraPos = { x: -50, y: -30, z: 50 };
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          background: #0a0e1a;
        }

        .tutor-hero-container {
          position: relative;
          width: 100%;
          min-height: 300vh;
          overflow: hidden;
        }

        .tutor-hero-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1;
        }

        .tutor-content-wrapper {
          position: relative;
          z-index: 10;
          pointer-events: none;
        }

        .tutor-hero-section {
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 2rem;
          text-align: center;
        }

        .tutor-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(0.875rem, 1.5vw, 1rem);
          font-weight: 600;
          letter-spacing: 0.3em;
          color: #4a9eff;
          margin-bottom: 2rem;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.2s;
        }

        .tutor-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3rem, 10vw, 7rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0;
          background: linear-gradient(135deg, #4a9eff 0%, #9d4edd 50%, #06ffa5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.4s;
        }

        .tutor-subtitle {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          margin-top: 2.5rem;
          max-width: 750px;
          line-height: 1.8;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.6s;
        }

        .tutor-cta-group {
          display: flex;
          gap: 1.5rem;
          margin-top: 3.5rem;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 0.8s;
          pointer-events: all;
        }

        .tutor-cta-button {
          padding: 1.125rem 3rem;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          display: inline-block;
        }

        .tutor-cta-primary {
          background: linear-gradient(135deg, #4a9eff, #9d4edd);
          color: white;
          box-shadow: 0 10px 40px rgba(74, 158, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .tutor-cta-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .tutor-cta-primary:hover::before {
          left: 100%;
        }

        .tutor-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 50px rgba(74, 158, 255, 0.5);
        }

        .tutor-cta-secondary {
          background: transparent;
          color: #4a9eff;
          border: 2px solid rgba(74, 158, 255, 0.4);
          backdrop-filter: blur(10px);
        }

        .tutor-cta-secondary:hover {
          background: rgba(74, 158, 255, 0.1);
          border-color: #4a9eff;
          transform: translateY(-2px);
        }

        .tutor-scroll-indicator {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: rgba(74, 158, 255, 0.6);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          opacity: 0;
          animation: fadeInUp 1s ease-out forwards, float 2s ease-in-out infinite;
          animation-delay: 1s, 2s;
        }

        .scroll-arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid currentColor;
          border-bottom: 2px solid currentColor;
          transform: rotate(45deg);
          animation: bounce 2s ease-in-out infinite;
        }

        .tutor-section-content {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          color: white;
        }

        .tutor-section-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
          background: linear-gradient(135deg, #4a9eff, #9d4edd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .tutor-section-content > p {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 1.25rem;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 1.5rem;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Module Cards with Flip Animation */
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
          margin-top: 5rem;
          perspective: 1000px;
        }

        .module-card {
          position: relative;
          height: 400px;
          cursor: pointer;
          pointer-events: all;
          --module-color: #4a9eff;
        }

        .module-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .module-card.flipped .module-card-inner {
          transform: rotateY(180deg);
        }

        .module-card-front,
        .module-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 16px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
        }

        .module-card-front {
          background: linear-gradient(135deg, 
            rgba(74, 158, 255, 0.05), 
            rgba(157, 78, 221, 0.03)
          );
          border: 2px solid rgba(74, 158, 255, 0.2);
          backdrop-filter: blur(10px);
          justify-content: center;
          align-items: center;
          text-align: center;
          transition: all 0.4s ease;
        }

        .module-card:hover .module-card-front {
          border-color: var(--module-color);
          box-shadow: 0 20px 60px rgba(74, 158, 255, 0.2);
          transform: translateY(-5px);
        }

        .module-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 10px 20px rgba(74, 158, 255, 0.3));
        }

        .module-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--module-color);
          margin-bottom: 1rem;
        }

        .module-description {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 2rem;
        }

        .module-click-hint {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.875rem;
          color: rgba(74, 158, 255, 0.6);
          font-style: italic;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        .module-card-back {
          background: linear-gradient(135deg, 
            rgba(74, 158, 255, 0.15), 
            rgba(157, 78, 221, 0.1)
          );
          border: 2px solid var(--module-color);
          backdrop-filter: blur(20px);
          transform: rotateY(180deg);
          overflow-y: auto;
        }

        .module-back-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(74, 158, 255, 0.3);
        }

        .module-icon-small {
          font-size: 2rem;
        }

        .module-back-header h4 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--module-color);
          margin: 0;
        }

        .module-features-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .module-feature-item {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(74, 158, 255, 0.05);
          border-radius: 8px;
          border-left: 3px solid var(--module-color);
          transition: all 0.3s ease;
        }

        .module-feature-item:hover {
          background: rgba(74, 158, 255, 0.1);
          transform: translateX(5px);
        }

        .feature-check {
          color: #06ffa5;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .module-media {
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(74, 158, 255, 0.3);
        }

        .module-media img,
        .module-media video {
          width: 100%;
          height: auto;
          display: block;
        }

        .module-back-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(74, 158, 255, 0.3);
        }

        .module-learn-more {
          width: 100%;
          padding: 0.875rem;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, var(--module-color), rgba(157, 78, 221, 0.8));
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .module-learn-more:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(74, 158, 255, 0.3);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: rotate(45deg) translateY(0);
          }
          50% {
            transform: rotate(45deg) translateY(10px);
          }
        }

        @media (max-width: 768px) {
          .tutor-cta-group {
            flex-direction: column;
            width: 100%;
          }

          .tutor-cta-button {
            width: 100%;
          }

          .modules-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .module-card {
            height: 380px;
          }

          .module-card-front,
          .module-card-back {
            padding: 2rem;
          }

          .module-icon {
            font-size: 3rem;
          }

          .module-name {
            font-size: 1.5rem;
          }
        }
      `}</style>

            <div ref={containerRef} className="tutor-hero-container">
                <canvas ref={canvasRef} className="tutor-hero-canvas" />

                <div className="tutor-content-wrapper">
                    {/* Hero Section */}
                    <section className="tutor-hero-section">
                        <div className="tutor-logo">TUTOR PRO</div>

                        <h1 className="tutor-title">
                            ELEVATE YOUR<br />
                            TEACHING PRACTICE
                        </h1>

                        <p className="tutor-subtitle">
                            Nền tảng quản lý và phát triển nghề nghiệp dành riêng cho gia sư chuyên nghiệp.
                            Tối ưu hóa thời gian, nâng cao chất lượng giảng dạy, và mở rộng cơ hội thu nhập.
                        </p>

                        <div className="tutor-cta-group">
                            <a href="/login" className="tutor-cta-button tutor-cta-primary">
                                Đăng ký gia sư
                            </a>
                            <button className="tutor-cta-button tutor-cta-secondary">
                                Xem demo
                            </button>
                        </div>

                        <div className="tutor-scroll-indicator">
                            <span>SCROLL</span>
                            <div className="scroll-arrow"></div>
                        </div>
                    </section>

                    {/* Section 2: Professional Management */}
                    <section className="tutor-section-content">
                        <h2>Quản Lý Chuyên Nghiệp</h2>
                        <p>
                            Tutor Pro cung cấp bộ công cụ toàn diện giúp bạn quản lý lịch dạy,
                            học sinh, tài liệu giảng dạy và thanh toán một cách hiệu quả nhất.
                        </p>
                        <p>
                            Tập trung vào việc giảng dạy chất lượng, để chúng tôi lo phần còn lại.
                        </p>
                    </section>

                    {/* Section 3: Module Cards */}
                    <section className="tutor-section-content">
                        <h2>Hệ Thống Quản Lý Toàn Diện</h2>
                        <p>
                            8 modules chính giúp gia sư quản lý mọi khía cạnh công việc một cách chuyên nghiệp
                        </p>

                        <div className="modules-grid">
                            {modules.map((module, index) => (
                                <div
                                    key={module.id}
                                    className={`module-card ${flippedCards[index] ? 'flipped' : ''}`}
                                    onClick={() => toggleCard(index)}
                                    style={{
                                        '--module-color': module.color
                                    } as React.CSSProperties}
                                >
                                    <div className="module-card-inner">
                                        {/* Front Side */}
                                        <div className="module-card-front">
                                            <div className="module-icon">{module.icon}</div>
                                            <h3 className="module-name">{module.name}</h3>
                                            <p className="module-description">{module.description}</p>
                                            <div className="module-click-hint">Click để xem chi tiết</div>
                                        </div>

                                        {/* Back Side */}
                                        <div className="module-card-back">
                                            <div className="module-back-header">
                                                <span className="module-icon-small">{module.icon}</span>
                                                <h4>{module.name}</h4>
                                            </div>

                                            <div className="module-features-list">
                                                {module.features.map((feature, idx) => (
                                                    <div key={idx} className="module-feature-item">
                                                        <span className="feature-check">✓</span>
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>

                                            {module.image && (
                                                <div className="module-media">
                                                    <Image
                                                        src={module.image}
                                                        alt={module.name}
                                                        width={400}
                                                        height={300}
                                                        style={{ width: '100%', height: 'auto' }}
                                                    />
                                                </div>
                                            )}

                                            {module.video && (
                                                <div className="module-media">
                                                    <video src={module.video} controls />
                                                </div>
                                            )}

                                            <div className="module-back-footer">
                                                <button className="module-learn-more">Tìm hiểu thêm →</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default TutorProHero;

