'use client';

import React, { useState } from 'react';
import Hero from './Hero';
import dynamic from 'next/dynamic';

import Footer from './Footer';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const FeatureShowcase = dynamic(() => import('./FeatureShowcase'), {
    ssr: true,
});

const AIAssistant = dynamic(() => import('./AIAssistant'), {
    ssr: false,
});

const LandingPageContent: React.FC = () => {
    const [isAiOpen, setIsAiOpen] = useState(false);

    return (
        <div className="relative min-h-screen text-white bg-[#050714]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-xl text-primary shadow-lg shadow-primary/20 border border-primary/20">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            Tutor <span className="text-primary">Pro</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                        <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
                        <button
                            onClick={() => setIsAiOpen(true)}
                            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <span className="text-lg">✨</span>
                            AI Assistant
                        </button>
                        <Link href="/login">
                            <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 cursor-pointer">
                                Dùng thử miễn phí
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                <Hero />

                {/* Unified Feature Showcase Section */}
                <FeatureShowcase />

                {/* Testimonials Simulation */}
                <section className="py-24 px-6 bg-[#0a101f]">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Được tin dùng bởi <span className="text-[#4a9eff]">500+ Gia sư</span></h2>
                        <div className="flex flex-wrap justify-center gap-12 mt-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                            <span className="text-2xl font-bold">VNU UNIVERSITY</span>
                            <span className="text-2xl font-bold">USTH EDU</span>
                            <span className="text-2xl font-bold">FTU GLOBAL</span>
                            <span className="text-2xl font-bold">NEU SMART</span>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent"></div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            Sẵn sàng để <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06ffa5] to-[#9d4edd]">nâng tầm sự nghiệp</span> dạy học?
                        </h2>
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                            Tham gia ngay cộng đồng Tutor Pro để giải phóng thời gian quản lý và tập trung hoàn toàn vào việc giảng dạy.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/login">
                                <button className="px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-opacity-90 transition-all cursor-pointer">
                                    Bắt đầu ngay
                                </button>
                            </Link>
                            <button className="px-12 py-5 rounded-2xl glass border-white/20 font-bold text-lg hover:bg-white/10 transition-all cursor-pointer">
                                Xem bảng giá
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Real Gemini AI Assistant */}
            <AIAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
    );
};

export default LandingPageContent;
