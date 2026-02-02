import { GoogleGenAI } from "@google/genai";

// Create AI response using the recommended SDK patterns for Gemini
export const generateAiResponse = async (prompt: string, context: string = "") => {
    // Always initialize with process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                // Move system instructions to the dedicated config field instead of prepending to prompt
                systemInstruction: `Bạn là trợ lý ảo của nền tảng Tutor Pro, giúp gia sư soạn nội dung chuyên nghiệp. ${context ? `Context: ${context}` : ""}`,
                temperature: 0.7,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        // Access .text property directly (not a method) as specified in guidelines
        return response.text || "Tôi không nhận được phản hồi.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Xin lỗi, hiện tại tôi gặp sự cố khi kết nối. Vui lòng thử lại sau!";
    }
};