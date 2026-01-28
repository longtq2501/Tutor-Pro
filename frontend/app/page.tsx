
import { TutorProHero } from "@/features/landing/components/TutorProHero";
import Link from "next/link";

export default function LandingPage() {
  return (
    <TutorProHero
      titleSlot={
        <h1 className="relative z-10 font-display text-[2.5rem] leading-[0.9] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[7rem] font-bold text-white drop-shadow-2xl whitespace-nowrap">
          TUTOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a9eff] via-[#9d4edd] to-[#06ffa5]">PRO</span>
        </h1>
      }
      contentSlot={
        <>
          <h2 className="font-sans text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-white/90 tracking-wide mb-6 sm:mb-8 px-4">
            Nền Tảng Quản Lý Giáo Dục 4.0
          </h2>

          <p className="font-sans text-sm sm:text-base lg:text-lg text-white/70 max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            Giải pháp toàn diện dành cho gia sư chuyên nghiệp.
            Kết nối, quản lý và tối ưu hóa hiệu quả giảng dạy với công nghệ tiên tiến nhất.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 pointer-events-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-[#4a9eff] hover:bg-blue-600 rounded-full font-bold text-white text-sm sm:text-base shadow-[0_0_20px_rgba(74,158,255,0.4)] transition-transform hover:scale-105 min-h-[44px]">
                Đăng ký giảng dạy
              </button>
            </Link>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white text-sm sm:text-base hover:bg-white/10 transition-colors min-h-[44px]">
              Tìm hiểu thêm
            </button>
          </div>
        </>
      }
    />
  );
}