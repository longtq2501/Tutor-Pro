"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Shuffle, Sparkles } from "lucide-react";

interface GeneratorActionsProps {
    onGenerate: () => void;
    isGenerating: boolean;
    disabled: boolean;
}

export function GeneratorActions({ onGenerate, isGenerating, disabled }: GeneratorActionsProps) {
    return (
        <div className="flex gap-2">
            <Button
                type="button"
                className="flex-1 group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-lg shadow-purple-500/25 h-10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={onGenerate}
                disabled={disabled || isGenerating}
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-300 group-hover:rotate-12 transition-transform" />
                )}
                <span className="relative">✨ Gợi ý ý tưởng</span>
            </Button>
            <Button
                type="button"
                size="icon"
                variant="outline"
                title="Shuffle"
                onClick={onGenerate}
                disabled={disabled || isGenerating}
                className="w-10 h-10 rounded-2xl border-border/40 bg-background/50 backdrop-blur-sm hover:bg-background/80 hover:border-primary/30 transition-all"
            >
                <Shuffle className={cn("w-4 h-4 text-muted-foreground", isGenerating && "animate-spin")} />
            </Button>
        </div>
    );
}
