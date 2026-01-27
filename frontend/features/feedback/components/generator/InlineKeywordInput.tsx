"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interface for InlineKeywordInput component props.
 */
interface InlineKeywordInputProps {
    /** Current typed input value */
    value: string;
    /** Callback for when the input value changes */
    onChange: (val: string) => void;
    /** List of automatic keyword suggestions */
    suggestions: string[];
    /** List of currently selected/added tag keywords */
    selected: string[];
    /** Callback to toggle a suggested keyword */
    onToggle: (kw: string) => void;
    /** Callback to add a new custom keyword tag */
    onAdd: (kw: string) => void;
    /** Callback to remove a keyword tag */
    onRemove: (kw: string) => void;
}

/**
 * An inline keyword entry component that supports both tagging and manual typing.
 * Tutors can type special context and press Enter (or Blur) to commit as a tag.
 */
export function InlineKeywordInput({
    value,
    onChange,
    suggestions,
    selected,
    onToggle,
    onAdd,
    onRemove,
}: InlineKeywordInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (value.trim()) {
                onAdd(value);
                onChange("");
            }
        }
    };

    const handleBlur = () => {
        if (value.trim()) {
            onAdd(value);
            onChange("");
        }
    };

    return (
        <div className="space-y-3">
            {/* Input & Selected Tags */}
            <div className="flex flex-wrap gap-2 p-3 bg-background/50 border border-border/50 rounded-2xl min-h-[48px] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                {selected.map((kw) => (
                    <Badge
                        key={kw}
                        variant="secondary"
                        className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-lg bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 group transition-colors"
                    >
                        <span className="text-[11px] font-bold">{kw}</span>
                        <button
                            type="button"
                            onClick={() => onRemove(kw)}
                            className="p-0.5 hover:bg-primary/20 rounded-md transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}

                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={selected.length === 0 ? "Nhập từ khóa và ấn Enter..." : ""}
                    className="flex-1 bg-transparent border-0 outline-none p-0 text-sm placeholder:text-muted-foreground/60 min-w-[120px]"
                />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mr-1 mt-1.5 flex items-center gap-1">
                        <Hash className="w-3 h-3" /> Gợi ý:
                    </span>
                    {suggestions.map((kw) => {
                        const isSelected = selected.includes(kw);
                        return (
                            <button
                                key={kw}
                                type="button"
                                onClick={() => onToggle(kw)}
                                className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all border",
                                    isSelected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted/30 text-muted-foreground border-border/40 hover:bg-muted/50 hover:border-border"
                                )}
                            >
                                {kw}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
