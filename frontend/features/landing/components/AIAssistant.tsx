'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateAiResponse } from '../services/geminiService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Chào bạn! Tôi là Tutor Pro AI. Tôi có thể giúp bạn viết nhận xét học sinh, soạn giáo án hoặc gợi ý bài tập. Bạn cần giúp gì hôm nay?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateAiResponse(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', content: response || "Tôi không nhận được phản hồi." }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Có lỗi xảy ra khi kết nối với AI." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-sm">
            <div
                className={`w-full sm:w-[450px] h-[90vh] sm:h-[700px] glass rounded-t-[2rem] sm:rounded-[2rem] flex flex-col shadow-2xl border-white/20 transition-transform duration-500 ease-out transform translate-y-0`}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">✨</div>
                        <div>
                            <h3 className="font-bold text-white">Tutor Pro AI</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                Online & Ready
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#4a9eff] text-white rounded-tr-none' : 'glass border-white/10 text-white/90 rounded-tl-none'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="glass p-4 rounded-2xl rounded-tl-none flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Gợi ý tôi cách soạn giáo án Toán 10..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#4a9eff] transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="w-12 h-12 rounded-xl bg-[#4a9eff] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                        >
                            ➔
                        </button>
                    </div>
                    <p className="text-[10px] text-white/30 mt-3 text-center">Tutor Pro AI có thể đưa ra câu trả lời chưa hoàn toàn chính xác. Hãy kiểm tra lại thông tin quan trọng.</p>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
