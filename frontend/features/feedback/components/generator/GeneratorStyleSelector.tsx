"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Clock, AlignLeft, Sparkles, Smile, Briefcase } from "lucide-react";

/**
 * Interface for GeneratorStyleSelector component props.
 */
interface StyleSelectorProps {
    /** Current selected tone (e.g., FRIENDLY, PROFESSIONAL) */
    tone: string;
    /** Current selected length (e.g., SHORT, MEDIUM, LONG) */
    length: string;
    /** Callback for when tone is changed */
    onToneChange: (tone: string) => void;
    /** Callback for when length is changed */
    onLengthChange: (length: string) => void;
}

/**
 * A selector component for toggling AI generation style parameters (Tone and Length).
 */
export function GeneratorStyleSelector({
    tone,
    length,
    onToneChange,
    onLengthChange,
}: StyleSelectorProps) {
    const tones = [
        { id: "FRIENDLY", label: "Thân thiện", icon: Smile },
        { id: "PROFESSIONAL", label: "Chuyên nghiệp", icon: Briefcase },
    ];

    const lengths = [
        { id: "SHORT", label: "Ngắn", icon: Clock },
        { id: "MEDIUM", label: "Vừa", icon: AlignLeft },
        { id: "LONG", label: "Dài", icon: MessageSquare },
    ];

    return (
        <div className="flex flex-wrap items-center gap-4 py-2 border-b border-border/40 mb-3">
            {/* Tone Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-xl border border-border/50">
                {tones.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => onToneChange(t.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                            tone === t.id
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Length Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-xl border border-border/50">
                {lengths.map((l) => (
                    <button
                        key={l.id}
                        type="button"
                        onClick={() => onLengthChange(l.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all",
                            length === l.id
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <l.icon className="w-3.5 h-3.5" />
                        {l.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
