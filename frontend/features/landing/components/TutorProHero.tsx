'use client';

import { ProceduralGroundBackground } from '@/components/ui/procedural-ground-background';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
// Interface definitions
interface FeatureDetail {
  title: string;
  intro: string;
  painPoint: string;
  solution: string;
  type: 'tutor' | 'student' | 'system';
  icon: string;
}

interface Module {
  id: number;
  icon: string;
  name: string;
  color: string;
  description: string;
  size: 'large' | 'normal';
  role: 'Tutor' | 'Student';
  features: string[];
  featureDetails: FeatureDetail[];
}

interface MagneticBentoCardProps {
  module: Module;
  onClick: (e: React.MouseEvent) => void;
}

// Magnetic Card Component for Bento Grid
const MagneticBentoCard: React.FC<MagneticBentoCardProps> = ({ module, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice) return;

    const div = cardRef.current;
    const rect = div.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const pullX = (x - centerX) / 8;
    const pullY = (y - centerY) / 8;

    setPosition({ x: pullX, y: pullY });
    setOpacity(1);

    div.style.setProperty('--mouse-x', `${x}px`);
    div.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setPosition({ x: 0, y: 0 });
      setOpacity(0);
    }
  };

  const isLarge = module.size === 'large';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl lg:rounded-3xl border border-white/10 bg-[#0a101f]/30 backdrop-blur-md overflow-hidden transition-all duration-500 hover:z-20 hover:border-white/30 min-h-[140px] ${isLarge ? 'md:col-span-2' : 'col-span-1'
        }`}
      style={{
        transform: isTouchDevice ? 'none' : `translate(${position.x}px, ${position.y}px)`,
        boxShadow: opacity > 0 ? `0 20px 40px -10px ${module.color}30` : 'none'
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${module.color}15, transparent 40%)`,
        }}
      />

      <div className={`relative h-full p-4 sm:p-5 md:p-6 lg:p-8 flex ${isLarge ? 'flex-row items-center gap-4 sm:gap-6 lg:gap-8' : 'flex-col justify-between gap-3 sm:gap-4'}`}>

        <div
          className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-xl lg:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-white/5 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500"
          style={{
            color: module.color,
            animationDelay: `${module.id * 0.5}s`,
            transform: isTouchDevice ? 'none' : `translate(${position.x * 0.5}px, ${position.y * 0.5}px)`
          }}
        >
          {module.icon}
        </div>

        <div className="flex-1 transition-transform duration-300" style={{ transform: isTouchDevice ? 'none' : `translate(${position.x * 0.2}px, ${position.y * 0.2}px)` }}>
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-white/10 ${module.role === 'Tutor' ? 'bg-blue-500/10 text-blue-300' : 'bg-green-500/10 text-green-300'
              }`}>
              {module.role}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 text-sm sm:text-base">↗</span>
          </div>

          <h3 className="font-display text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1.5 sm:mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-colors leading-tight">
            {module.name}
          </h3>

          <p className="font-sans text-xs sm:text-sm text-white/60 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {module.description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface TutorProHeroProps {
  titleSlot: React.ReactNode;
  contentSlot: React.ReactNode;
}

export const TutorProHero = ({ titleSlot, contentSlot }: TutorProHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation States: 'intro' | 'transition' | 'main'
  const [animPhase, setAnimPhase] = useState<'intro' | 'transition' | 'main'>('intro');

  // Derived state to stabilize dependencies
  const isIntro = animPhase === 'intro';

  // Handle Intro Sequence
  useEffect(() => {
    // Force scroll to top on mount/reload and disable browser scroll restoration to ensure intro visibility
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 0s: Intro starts (Title is centered, everything else hidden)
    document.body.style.overflow = 'hidden';

    // 2.5s: Start Transition (Open up layout, title scales down)
    const transitionTimer = setTimeout(() => {
      setAnimPhase('transition');
    }, 2500);

    // 4.0s: Transition done, unlock scroll
    const mainTimer = setTimeout(() => {
      setAnimPhase('main');
      document.body.style.overflow = 'auto';
    }, 4000);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(mainTimer);
      document.body.style.overflow = 'auto';
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const openModuleDetail = (module: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveModule(module);
    setCurrentSlide(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModuleDetail = () => {
    setActiveModule(null);
    document.body.style.overflow = 'auto';
  };

  const nextSlide = () => {
    if (!activeModule) return;
    setCurrentSlide((prev) => (prev + 1) % activeModule.featureDetails.length);
  };

  const prevSlide = () => {
    if (!activeModule) return;
    setCurrentSlide((prev) => (prev - 1 + activeModule.featureDetails.length) % activeModule.featureDetails.length);
  };

  // --- DATA POPULATION ---
  const modules: Module[] = [
    {
      id: 1,
      icon: '👨‍🎓',
      name: 'Quản Lý Học Sinh',
      color: '#4a9eff',
      size: 'large',
      role: 'Tutor',
      description: 'Hồ sơ số hóa 360°, lộ trình cá nhân và kiểm soát công nợ tự động.',
      features: ['Hồ sơ chi tiết', 'Lộ trình linh hoạt', 'Cảnh báo công nợ'],
      featureDetails: [
        {
          title: "Hồ Sơ Học Sinh 360°",
          intro: "Lưu trữ toàn bộ thông tin cá nhân, liên hệ phụ huynh và trạng thái học tập.",
          painPoint: "Gia sư thường thất lạc thông tin quan trọng hoặc nhầm lẫn giữa các học sinh.",
          solution: "Quản lý tập trung, tìm kiếm tức thì, đảm bảo dữ liệu luôn nhất quán.",
          type: 'tutor',
          icon: '📇'
        },
        {
          title: "Thiết Lập Lộ Trình & Học Phí",
          intro: "Cấu hình mức phí theo giờ và lịch học cố định cho từng học sinh.",
          painPoint: "Dễ gây sai sót và thiếu chuyên nghiệp khi báo giá nhầm.",
          solution: "Cá nhân hóa tài chính, đảm bảo tính minh bạch.",
          type: 'tutor',
          icon: '🎯'
        },
        {
          title: "Theo Dõi Công Nợ",
          intro: "Hệ thống cảnh báo đỏ và hiển thị số tiền nợ ngay trên danh sách.",
          painPoint: "Thường xuyên quên đòi nợ dẫn đến thất thoát doanh thu.",
          solution: "Kiểm soát dòng tiền chặt chẽ, nhắc nợ đúng lúc.",
          type: 'system',
          icon: '💸'
        }
      ]
    },
    {
      id: 2,
      icon: '📅',
      name: 'Lịch Dạy Thông Minh',
      color: '#7b68ee',
      size: 'large',
      role: 'Tutor',
      description: 'Lên lịch tự động, kéo thả linh hoạt và đồng bộ thời gian thực.',
      features: ['Lịch đa chế độ', 'Auto-Generate', 'Kéo thả Drag-Drop'],
      featureDetails: [
        {
          title: "Lịch Dạy Đa Chế Độ",
          intro: "Giao diện lịch trực quan (Tháng/Tuần/Ngày) hiển thị các buổi dạy.",
          painPoint: "Khó nhìn ra các khoảng trống để nhận thêm lớp hoặc dễ bị trùng lịch.",
          solution: "Tối ưu hóa hiệu suất làm việc, tránh chồng chéo lịch trình.",
          type: 'tutor',
          icon: '🗓️'
        },
        {
          title: "Tự Động Tạo Lịch",
          intro: "1 click tự động sinh ra lịch dạy cho cả tháng.",
          painPoint: "Tốn 30-60 phút mỗi tháng cho công việc nhập liệu lặp lại.",
          solution: "Giải phóng sức lao động để gia sư tập trung vào chuyên môn.",
          type: 'system',
          icon: '🤖'
        },
        {
          title: "Kéo Thả Linh Hoạt",
          intro: "Thay đổi ngày giờ buổi dạy bằng cách kéo thả.",
          painPoint: "Nhiều bước rườm rà khi cần đổi lịch.",
          solution: "Trải nghiệm mượt mà, thích ứng tức thì với thay đổi.",
          type: 'tutor',
          icon: '👆'
        }
      ]
    },
    {
      id: 3,
      icon: '💰',
      name: 'Tài Chính',
      color: '#06ffa5',
      size: 'normal',
      role: 'Tutor',
      description: 'Minh bạch doanh thu, hóa đơn PDF & QR Code.',
      features: ['Dashboard tài chính', 'Hóa đơn PDF', 'VietQR tích hợp'],
      featureDetails: [
        {
          title: "Dashboard Tài Chính",
          intro: "Biểu đồ doanh thu, thống kê số buổi dạy và tổng nợ hàng tháng.",
          painPoint: "Khó lập kế hoạch tài chính cá nhân do không nắm rõ thu nhập.",
          solution: "Quản trị doanh thu chuyên nghiệp.",
          type: 'tutor',
          icon: '📊'
        },
        {
          title: "Hóa Đơn PDF & QR",
          intro: "Tự động xuất hóa đơn kèm mã VietQR thanh toán nhanh.",
          painPoint: "Nhắn tin thu phí thiếu chuyên nghiệp, dễ sai sót khi chuyển khoản.",
          solution: "Thanh toán 1 chạm, tạo ấn tượng chuyên nghiệp.",
          type: 'system',
          icon: '🧾'
        }
      ]
    },
    {
      id: 4,
      icon: '✨',
      name: 'Trợ Lý AI',
      color: '#ff0055',
      size: 'normal',
      role: 'Tutor',
      description: 'Tự động soạn thảo nhận xét chuyên nghiệp.',
      features: ['Auto soạn thảo', 'Tinh chỉnh văn phong', 'Cá nhân hóa'],
      featureDetails: [
        {
          title: "AI Soạn Thảo Nhận Xét",
          intro: "Tạo nhận xét chi tiết từ từ khóa, nâng cao chất lượng giao tiếp.",
          painPoint: "Gia sư mệt mỏi thường viết nhận xét qua loa.",
          solution: "Duy trì sự chuyên nghiệp, gia tăng sự gắn kết với phụ huynh.",
          type: 'system',
          icon: '🧠'
        },
        {
          title: "Tinh Chỉnh Văn Phong",
          intro: "Tùy chọn giọng văn (Trang trọng, Gần gũi) phù hợp từng phụ huynh.",
          painPoint: "Nhận xét cứng nhắc gây cảm giác xa cách.",
          solution: "Tạo dựng mối quan hệ tốt đẹp thông qua ngôn từ tinh tế.",
          type: 'tutor',
          icon: '✍️'
        }
      ]
    },
    {
      id: 5,
      icon: '📁',
      name: 'Kho Tài Liệu',
      color: '#00d4ff',
      size: 'normal',
      role: 'Tutor',
      description: 'Lưu trữ thông minh, xem trước không cần tải.',
      features: ['Danh mục thông minh', 'Xem trước PDF', 'Bảo mật tài nguyên'],
      featureDetails: [
        {
          title: "Quản Lý Tài Liệu",
          intro: "Phân loại theo chủ đề, tìm kiếm nhanh chóng.",
          painPoint: "Tài liệu rải rác, mất thời gian tìm kiếm.",
          solution: "Hệ thống học liệu bài bản, dễ dàng tái sử dụng.",
          type: 'tutor',
          icon: '📂'
        },
        {
          title: "Xem Trước & Bảo Mật",
          intro: "Xem PDF trực tiếp không cần tải về.",
          painPoint: "Tải file gây đầy bộ nhớ và khó quản lý phiên bản.",
          solution: "Truy cập nhanh chóng, bảo mật tài nguyên.",
          type: 'system',
          icon: '🔒'
        }
      ]
    },
    {
      id: 6,
      icon: '📝',
      name: 'Khảo Thí',
      color: '#ffaa00',
      size: 'normal',
      role: 'Tutor',
      description: 'Ngân hàng đề thi, làm bài & chấm điểm online.',
      features: ['Ngân hàng câu hỏi', 'Bài tập Online', 'Chấm điểm trực tiếp'],
      featureDetails: [
        {
          title: "Ngân Hàng Câu Hỏi",
          intro: "Tạo và quản lý bài tập trắc nghiệm/tự luận.",
          painPoint: "Gửi file ảnh/word lộn xộn, khó theo dõi tiến độ.",
          solution: "Chuyển đổi số quy trình đánh giá năng lực.",
          type: 'tutor',
          icon: '📋'
        },
        {
          title: "Chấm Điểm Online",
          intro: "Chấm điểm và nhận xét trực tiếp trên bài làm.",
          painPoint: "Học sinh khó hiểu lỗi sai khi chỉ nhận xét qua tin nhắn.",
          solution: "Tương tác trực quan, nâng cao hiệu quả sư phạm.",
          type: 'tutor',
          icon: '💯'
        }
      ]
    },
    {
      id: 7,
      icon: '🚀',
      name: 'Dashboard Học Sinh',
      color: '#d4ff00',
      size: 'large',
      role: 'Student',
      description: 'Không gian học tập cá nhân, theo dõi tiến độ, lịch học và nhiệm vụ.',
      features: ['Tổng quan tiến độ', 'Lịch cá nhân', 'Nhiệm vụ cần làm'],
      featureDetails: [
        {
          title: "Dashboard Cá Nhân",
          intro: "Hiển thị tiến độ, điểm số và nhiệm vụ cần làm.",
          painPoint: "Học sinh thụ động do không nắm rõ lộ trình.",
          solution: "Kích thích tinh thần tự học và làm chủ lộ trình.",
          type: 'student',
          icon: '📈'
        },
        {
          title: "Lịch Học Cá Nhân",
          intro: "Nhắc nhở lịch học và bài tập.",
          painPoint: "Thường xuyên quên lịch hoặc bài tập về nhà.",
          solution: "Rèn luyện tính kỷ luật và chủ động.",
          type: 'student',
          icon: '⏰'
        }
      ]
    },
    {
      id: 8,
      icon: '🎓',
      name: 'Bài Tập & Thư Viện',
      color: '#9d4edd',
      size: 'large',
      role: 'Student',
      description: 'Thư viện bài giảng riêng biệt và trải nghiệm làm bài tương tác cao.',
      features: ['Thư viện gán riêng', 'Video Player Pro', 'Lịch sử học tập'],
      featureDetails: [
        {
          title: "Thư Viện Cá Nhân",
          intro: "Bài giảng video và tài liệu được gán riêng.",
          painPoint: "Lạc hướng trong kho tài liệu chung khổng lồ.",
          solution: "Học đúng trọng tâm, cá nhân hóa trải nghiệm.",
          type: 'student',
          icon: '📚'
        },
        {
          title: "Làm Bài Tương Tác",
          intro: "Trải nghiệm làm bài tập hiện đại trên mọi thiết bị.",
          painPoint: "Làm bài trên giấy nhàm chán.",
          solution: "Công nghệ hóa việc học, tạo hứng thú.",
          type: 'student',
          icon: '💻'
        }
      ]
    }
  ];

  const threeRefs = useRef({
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    eduObjects: [] as THREE.Group[],
    animationId: null as number | null,
    targetCameraPos: { x: 0, y: 0, z: 120 },
  });

  // Initialize Three.js Scene
  useEffect(() => {
    // Initialize ThreeJS immediately on mount to avoid heavy work during transitions
    // We keep it independent of animPhase

    const isMobile = window.innerWidth < 768;
    const objectCount = isMobile ? 12 : 22;

    const initThree = () => {
      const { current: refs } = threeRefs;

      refs.scene = new THREE.Scene();
      const fov = isMobile ? 80 : 70;
      refs.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 2000);
      refs.camera.position.set(0, 0, 120);

      if (!canvasRef.current) return;
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      refs.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(50, 50, 50);
      refs.scene.add(dirLight);

      const blueLight = new THREE.PointLight(0x4a9eff, 2, 200);
      blueLight.position.set(-50, 20, 50);
      refs.scene.add(blueLight);

      const purpleLight = new THREE.PointLight(0x9d4edd, 2, 200);
      purpleLight.position.set(50, -20, 50);
      refs.scene.add(purpleLight);

      createEducationObjects(objectCount);
      animate();
    };

    const createEducationObjects = (count: number) => {
      const { scene, eduObjects } = threeRefs.current;
      if (!scene) return;

      const materials = {
        glass: new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0.1,
          roughness: 0,
          transmission: 0.8,
          transparent: true,
          opacity: 0.5,
        }),
        solidBlue: new THREE.MeshPhongMaterial({ color: 0x4a9eff, shininess: 60 }),
        solidPurple: new THREE.MeshPhongMaterial({ color: 0x9d4edd, shininess: 60 }),
        solidWhite: new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 60 }),
      };

      const createBook = () => {
        const group = new THREE.Group();
        const cover = new THREE.Mesh(new THREE.BoxGeometry(10, 14, 2), materials.solidBlue);
        const pages = new THREE.Mesh(new THREE.BoxGeometry(9.6, 13.6, 1.8), materials.solidWhite);
        pages.position.set(0.2, 0, 0);
        group.add(cover, pages);
        return group;
      };

      const createAtom = () => {
        const group = new THREE.Group();
        const core = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), materials.solidPurple);
        const ringGeo = new THREE.TorusGeometry(7, 0.2, 8, 32);
        const ring1 = new THREE.Mesh(ringGeo, materials.glass);
        const ring2 = new THREE.Mesh(ringGeo, materials.glass);
        ring1.rotation.x = Math.PI / 2;
        ring2.rotation.x = Math.PI / 2;
        ring2.rotation.y = Math.PI / 2.5;
        group.add(core, ring1, ring2);
        return group;
      };

      const createPen = () => {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 12, 12), materials.solidBlue);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2, 12), materials.solidWhite);
        tip.position.y = 7;
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 12), materials.solidPurple);
        cap.position.y = -5;
        group.add(body, tip, cap);
        return group;
      };

      const itemsPerType = Math.ceil(count / 3);
      const items = [
        { create: createBook, count: itemsPerType },
        { create: createAtom, count: itemsPerType },
        { create: createPen, count: itemsPerType },
      ];

      items.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          const obj = item.create();
          obj.position.set(
            (Math.random() - 0.5) * 350,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
          );
          obj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
          obj.userData = {
            rotX: (Math.random() - 0.5) * 0.005,
            rotY: (Math.random() - 0.5) * 0.005,
            floatY: Math.random() * 0.02,
            initialY: obj.position.y,
            offset: Math.random() * Math.PI * 2
          };
          scene.add(obj);
          eduObjects.push(obj);
        }
      });
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.eduObjects.forEach(obj => {
        obj.rotation.x += obj.userData.rotX;
        obj.rotation.y += obj.userData.rotY;
        obj.position.y = obj.userData.initialY + Math.sin(time + obj.userData.offset) * 5;
      });

      if (refs.camera) {
        refs.camera.position.x += (refs.targetCameraPos.x - refs.camera.position.x) * 0.05;
        refs.camera.position.y += (refs.targetCameraPos.y - refs.camera.position.y) * 0.05;
        refs.camera.position.z += (refs.targetCameraPos.z - refs.camera.position.z) * 0.05;
        refs.camera.lookAt(0, 0, 0);
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

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
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      refs.renderer?.dispose();
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const { current: refs } = threeRefs;
      if (scrollY < windowHeight * 0.5) {
        refs.targetCameraPos = { x: 0, y: 0, z: 120 };
      } else {
        refs.targetCameraPos = { x: 0, y: 0, z: 140 };
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-transparent overflow-x-hidden min-h-screen">

      {/* 1. Procedural WebGL Background (z-index: 0) */}
      <div className={`transition-opacity duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${animPhase === 'intro' ? 'opacity-0' : 'opacity-100'}`}>
        <ProceduralGroundBackground />
      </div>

      {/* 2. Transparent Three.js Canvas for Floating Objects (z-index: 0) */}
      <canvas
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-screen z-0 pointer-events-none transition-opacity duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${animPhase === 'intro' ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* HERO SECTION WRAPPER - SINGLE SOURCE OF TRUTH FOR TITLE */}
      {/* 
         Logic: 
         - In 'intro': Container is z-50. Orb is hidden. Text is Big. Sparkles on. Bottom content hidden.
           Result: Text is centered in viewport.
         - In 'transition': Orb grows. Text scales down. Bottom content grows. Sparkles off.
           Result: Text is pushed by Orb and Bottom Content to its final position naturally.
         - In 'main': Normal static layout.
      */}
      <section
        className={`relative min-h-screen flex flex-col items-center justify-center px-4 text-center pt-safe pb-safe transition-[transform,opacity,padding] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${animPhase === 'intro' ? 'z-50' : 'z-10'}`}
      >

        {/* LOGO ORB */}
        <div className={`transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] rounded-full bg-gradient-to-tr from-primary to-secondary blur-[30px] sm:blur-[50px] animate-pulse
            ${animPhase === 'intro' ? 'w-0 h-0 mb-0 opacity-0 overflow-hidden' : 'w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mb-6 sm:mb-8 opacity-40'}
        `}></div>

        {/* TITLE CONTAINER (Cleaned) */}
        <div className={`relative transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-20 flex flex-col items-center
             ${animPhase === 'intro' ? 'scale-[1.5] sm:scale-[2.0]' : 'scale-100'}
        `}>
          {/* LOADING RING - Only visible in Intro (2.5s duration matches setTimeout) */}
          {animPhase === 'intro' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              {/* Responsive SVG sizing: 150vw on mobile (to cover width), fixed pixels on desktop */}
              <svg className="w-[140vw] h-[140vw] sm:w-[600px] sm:h-[600px] animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#4a9eff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#06ffa5', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                {/* Circle circumference = 2 * PI * 48 ≈ 301.6 */}
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#grad1)" strokeWidth="0.5"
                  strokeDasharray="302"
                  strokeDashoffset="302"
                  strokeLinecap="round"
                  className="animate-[drawRing_2.5s_linear_forwards]"
                />
              </svg>
              {/* Secondary inner ring for more 'tech' feel */}
              <svg className="absolute w-[120vw] h-[120vw] sm:w-[500px] sm:h-[500px] animate-[spin_15s_linear_infinite_reverse] opacity-50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#9d4edd" strokeWidth="0.2" strokeDasharray="10 10" />
              </svg>
            </div>
          )}

          {/* The One and Only Title */}
          {titleSlot}
        </div>

        {/* SUBTITLE & BUTTONS */}
        <div className={`transition-[max-height,opacity,transform,margin] duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col items-center origin-top
             ${animPhase === 'intro' ? 'max-h-0 opacity-0 overflow-hidden translate-y-10' : 'max-h-[500px] opacity-100 translate-y-0 mt-6 sm:mt-8'}
        `}>
          {contentSlot}
        </div>

        {/* SCROLL HINT */}
        <div className={`absolute bottom-4 sm:bottom-8 animate-bounce transition-opacity duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${animPhase === 'main' ? 'opacity-50' : 'opacity-0'}`}>
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>

      </section>

      {/* BENTO GRID SECTION (Fade in only after main phase to prevent scroll glitch during intro) */}
      <div className={`transition-opacity duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${animPhase === 'main' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <section className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 w-full max-w-[1400px] 2xl:max-w-[1800px] mx-auto min-h-screen flex flex-col items-center">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 relative z-20 pointer-events-none">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Tính Năng <span className="text-primary">Nổi Bật</span>
            </h2>
            <p className="font-sans text-white/60 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Khám phá hệ sinh thái giáo dục toàn diện với giao diện Bento hiện đại.
            </p>
          </div>

          {/* Bento Grid - Responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full pointer-events-auto">
            {modules.map((module) => (
              <MagneticBentoCard
                key={module.id}
                module={module}
                onClick={(e) => openModuleDetail(module, e)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* DETAILED MODAL OVERLAY */}
      {activeModule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto p-0 sm:p-4 md:p-6 lg:p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#050714]/90 backdrop-blur-lg transition-opacity duration-300"
            onClick={closeModuleDetail}
          ></div>

          {/* Modal Container - Fully Responsive */}
          <div
            className="relative w-full h-full sm:h-[95vh] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl sm:rounded-[1.5rem] lg:rounded-[2rem] bg-[#0f111a] border-0 sm:border border-white/10 shadow-2xl overflow-hidden animate-flip-in flex flex-col md:flex-row"
            style={{
              boxShadow: `0 0 50px ${activeModule.color}10`,
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            {/* LEFT: 3D Visual & Icon */}
            <div className="w-full md:w-5/12 h-[20vh] min-h-[160px] sm:h-[25vh] md:h-full relative bg-gradient-to-br from-[#0a0c15] to-black flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(${activeModule.color} 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>

              {/* Glowing Orb */}
              <div className="absolute w-[200px] sm:w-[250px] lg:w-[300px] h-[200px] sm:h-[250px] lg:h-[300px] rounded-full blur-[60px] lg:blur-[80px] opacity-30 animate-pulse" style={{ backgroundColor: activeModule.color }}></div>

              {/* Rotating Icon */}
              <div className="relative z-10 w-full aspect-square flex items-center justify-center">
                {activeModule.featureDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className={`absolute transition-all duration-700 ease-out transform ${idx === currentSlide
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-50 rotate-12'
                      }`}
                  >
                    <div className="text-[5rem] sm:text-[6rem] md:text-[7rem] lg:text-[8rem] xl:text-[10rem] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                      {detail.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Role & Module Name Label */}
              <div className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-20">
                <div className="text-white/30 font-display text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1">{activeModule.role} MODULE</div>
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">{activeModule.name}</h3>
              </div>
            </div>

            {/* RIGHT: Content Area */}
            <div className="w-full md:w-7/12 flex-1 bg-[#0f111a] flex flex-col border-t md:border-t-0 md:border-l border-white/5 overflow-hidden">
              {/* Header - Minimal Utility Bar */}
              <div className="px-6 py-4 sm:px-10 sm:py-6 lg:px-14 flex justify-between items-center flex-shrink-0">
                <div className="flex gap-1.5 sm:gap-2">
                  {activeModule.featureDetails.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 sm:w-10 bg-[#4a9eff]' : 'w-2 sm:w-3 bg-white/10'}`}
                    ></div>
                  ))}
                </div>
                <button
                  onClick={closeModuleDetail}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Scrollable Content with breathing room */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-8 sm:px-10 sm:pb-12 lg:px-14 lg:pb-16 pt-0">
                {activeModule.featureDetails.map((detail, idx) => (
                  idx === currentSlide && (
                    <div key={idx} className="animate-[slideUpFade_0.5s_ease-out_forwards]">
                      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 sm:mb-6 lg:mb-8 leading-tight">
                        {detail.title}
                      </h2>

                      <p className="text-base sm:text-lg lg:text-xl text-white/70 font-sans leading-relaxed mb-8 sm:mb-10 lg:mb-12">
                        {detail.intro}
                      </p>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        {/* Pain Point Card */}
                        <div className="p-3.5 sm:p-4 lg:p-5 rounded-lg lg:rounded-xl bg-red-500/5 border border-red-500/20">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-red-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Ngữ cảnh bất lợi
                          </div>
                          <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                            {detail.painPoint}
                          </p>
                        </div>

                        {/* Solution Card */}
                        <div className="p-3.5 sm:p-4 lg:p-5 rounded-lg lg:rounded-xl bg-green-500/5 border border-green-500/20">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-green-400 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Giải quyết bài toán
                          </div>
                          <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                            {detail.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Footer Navigation */}
              <div className="px-6 py-4 sm:px-10 sm:py-6 lg:px-14 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-stretch sm:items-center bg-[#0f111a] flex-shrink-0">
                <button
                  onClick={prevSlide}
                  className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:py-2 rounded-lg text-sm sm:text-base text-white/60 hover:text-white hover:bg-white/5 transition-all min-h-[44px] sm:min-h-0"
                >
                  ← Trước
                </button>
                <button
                  onClick={nextSlide}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm sm:text-base font-bold hover:scale-105 transition-transform min-h-[44px] sm:min-h-0"
                >
                  Tiếp theo →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles and Animations */}
      <style>{`
        html {
          scrollbar-gutter: stable;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
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

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes flip-in {
          from {
            opacity: 0;
            transform: scale(0.9) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotateX(0deg);
          }
        }

        /* NEW ANIMATIONS FOR INTRO */
        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes lineExpandMain {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 75%;
            opacity: 1;
          }
        }

        @keyframes drawRing {
          0% {
            stroke-dashoffset: 302;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes lineExpandSecondary {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 25%;
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-flip-in {
          animation: flip-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Safe area support */
        .pt-safe {
          padding-top: env(safe-area-inset-top);
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};